/**
 * Golf Caddy API Middleware
 *
 * This module provides essential middleware for rate limiting, security,
 * and monitoring for the Golf Caddy API.
 */

import fastifyPlugin from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { RateLimitError } from './errors.js';

// Rate limiting configuration
export interface RateLimitConfig {
  max: number;
  timeWindow: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: FastifyRequest) => string;
  errorMessage?: string;
}

// Default rate limit configurations for different endpoints
export const RATE_LIMIT_CONFIGS = {
  // General API endpoints
  default: {
    max: 100,
    timeWindow: '15 minutes',
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },

  // Authentication endpoints (more restrictive)
  auth: {
    max: 5,
    timeWindow: '1 minute',
    skipSuccessfulRequests: true,
    skipFailedRequests: false,
    errorMessage: 'Too many authentication attempts. Please try again later.',
  },

  // Course search (moderate limits)
  courseSearch: {
    max: 50,
    timeWindow: '1 minute',
    skipSuccessfulRequests: false,
    skipFailedRequests: true,
  },

  // Shot creation (higher limits for active play)
  shots: {
    max: 200,
    timeWindow: '1 minute',
    skipSuccessfulRequests: false,
    skipFailedRequests: true,
  },

  // Statistics endpoints (cached, so lower limits)
  statistics: {
    max: 30,
    timeWindow: '1 minute',
    skipSuccessfulRequests: false,
    skipFailedRequests: true,
  },
} as const;

// Request ID generator for tracing
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Rate limiting middleware
export const rateLimitMiddleware = fastifyPlugin(async function (
  fastify: FastifyInstance,
  options: { config?: RateLimitConfig } = {}
) {
  const config = options.config || RATE_LIMIT_CONFIGS.default;

  await fastify.register(rateLimit, {
    max: config.max,
    timeWindow: config.timeWindow,
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise IP address
      const authHeader = req.headers.authorization;
      if (authHeader) {
        try {
          // Simple base64 decode to get user info from JWT payload
          const payload = authHeader.split('.')[1];
          if (payload) {
            const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
            return `user:${decoded.userId || decoded.sub}`;
          }
        } catch (error) {
          // Fall through to IP-based limiting
        }
      }

      return `ip:${req.ip}`;
    },
    errorResponseBuilder: (_request, context) => {
      const errorMessage =
        'errorMessage' in config
          ? config.errorMessage
          : `Rate limit exceeded: ${context.max} requests per ${context.after}`;
      const error = new RateLimitError(errorMessage, {
        limit: context.max,
        window: context.after,
        remaining: 0,
        resetTime: new Date(Date.now() + context.ttl),
      });

      return {
        error: true,
        message: error.message,
        code: error.code,
        statusCode: 429,
        retryAfter: context.ttl,
      };
    },
  });
});

// Security middleware
export const securityMiddleware = fastifyPlugin(async function (fastify: FastifyInstance) {
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for API
  });
});

// Request logging and monitoring middleware
export const loggingMiddleware = fastifyPlugin(async function (fastify: FastifyInstance) {
  // Add request ID to all requests
  fastify.addHook('onRequest', async (request, reply) => {
    const requestId = generateRequestId();
    request.headers['x-request-id'] = requestId;
    reply.header('x-request-id', requestId);
  });

  // Add custom performance metrics
  fastify.addHook('onRequest', async (request) => {
    (request as any).startTime = process.hrtime.bigint();
  });

  fastify.addHook('onResponse', async (request, reply) => {
    const startTime = (request as any).startTime;
    if (startTime) {
      const duration = Number(process.hrtime.bigint() - startTime) / 1000000; // Convert to milliseconds
      reply.header('x-response-time', `${duration.toFixed(2)}ms`);

      // Log slow requests
      if (duration > 1000) {
        // Log requests slower than 1 second
        console.warn('Slow request detected:', {
          method: request.method,
          url: request.url,
          duration: `${duration.toFixed(2)}ms`,
          statusCode: reply.statusCode,
        });
      }
    }
  });
});

// Enhanced health check middleware
export const monitoringMiddleware = fastifyPlugin(async function (fastify: FastifyInstance) {
  // Basic health metrics
  let requestCount = 0;
  let errorCount = 0;
  const startTime = Date.now();

  // Track request metrics
  fastify.addHook('onRequest', async () => {
    requestCount++;
  });

  fastify.addHook('onError', async () => {
    errorCount++;
  });

  // Enhanced health check endpoint
  fastify.get('/health', async () => {
    const uptime = Date.now() - startTime;
    const memoryUsage = process.memoryUsage();

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime / 1000)}s`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      metrics: {
        requests: {
          total: requestCount,
          errors: errorCount,
          errorRate: requestCount > 0 ? (errorCount / requestCount) * 100 : 0,
        },
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        },
        system: {
          uptime: `${Math.floor(process.uptime())}s`,
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
        },
      },
    };

    return healthData;
  });

  // Readiness check (for Kubernetes)
  fastify.get('/ready', async () => {
    return { status: 'ready', timestamp: new Date().toISOString() };
  });

  // Liveness check (for Kubernetes)
  fastify.get('/live', async () => {
    return { status: 'alive', timestamp: new Date().toISOString() };
  });
});

// Error handling middleware
export const errorHandlingMiddleware = fastifyPlugin(async function (fastify: FastifyInstance) {
  // Global error handler
  fastify.setErrorHandler(async (error, request, reply) => {
    // Log the error with context
    console.error('Golf Caddy API Error:', {
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
      },
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
      },
      requestId: request.headers['x-request-id'],
      timestamp: new Date().toISOString(),
    });

    // Return structured error response
    const statusCode = error.statusCode || 500;

    reply.code(statusCode).send({
      success: false,
      error: {
        message: error.message || 'Internal server error',
        code: error.code || 'INTERNAL_ERROR',
        statusCode,
        timestamp: new Date().toISOString(),
        requestId: request.headers['x-request-id'],
      },
    });
  });
});

// Combine essential middleware into a single plugin for easy registration
export const golfCaddyMiddleware = fastifyPlugin(async function (fastify: FastifyInstance) {
  // Register middleware in order
  await fastify.register(securityMiddleware);
  await fastify.register(loggingMiddleware);
  await fastify.register(monitoringMiddleware);
  await fastify.register(errorHandlingMiddleware);

  // Register rate limiting with default config
  await fastify.register(rateLimitMiddleware);
});

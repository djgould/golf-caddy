import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import type { TRPCError } from '@trpc/server';
import { serverConfig, isDevelopment } from './config';
import { createContext } from './trpc';
import { appRouter } from './router';
import { prisma } from '@repo/db';
import { golfCaddyMiddleware, RATE_LIMIT_CONFIGS } from './middleware.js';

// Create Fastify instance with enhanced logging
const server = Fastify({
  logger: isDevelopment
    ? {
        level: serverConfig.logging.level,
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            colorize: true,
          },
        },
      }
    : {
        level: serverConfig.logging.level,
      },
});

// Decorate the Fastify instance with Prisma for middleware access
server.decorate('prisma', prisma);

// Register comprehensive middleware (security, logging, monitoring, error handling, rate limiting)
await server.register(golfCaddyMiddleware);

// Register CORS plugin
await server.register(cors, {
  origin: serverConfig.cors.origin,
  credentials: serverConfig.cors.credentials,
});

// Register tRPC plugin
await server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
    onError: (opts: { path: string | undefined; error: TRPCError }) => {
      const { path, error } = opts;
      server.log.error(
        {
          path,
          error: {
            message: error.message,
            code: error.code,
            cause: error.cause,
            stack: error.stack,
          },
        },
        'tRPC Error'
      );

      // Log to external monitoring service in production
      if (!isDevelopment) {
        // In production, send to Sentry, DataDog, etc.
        console.error('Production tRPC Error:', {
          path,
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    },
  },
});

// API documentation endpoint (simple schema export for now)
server.get('/api/schema', async () => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Golf Caddy API',
      version: '1.0.0',
      description: 'tRPC-based API for Golf Caddy application',
    },
    servers: [
      {
        url: `http://${serverConfig.host}:${serverConfig.port}`,
        description: 'Development server',
      },
    ],
    paths: {
      '/trpc/*': {
        post: {
          summary: 'tRPC endpoint',
          description: 'All tRPC procedures are accessed through this endpoint',
          responses: {
            '200': {
              description: 'Success',
            },
            '400': {
              description: 'Bad Request - Invalid input',
            },
            '401': {
              description: 'Unauthorized - Authentication required',
            },
            '429': {
              description: 'Too Many Requests - Rate limit exceeded',
            },
            '500': {
              description: 'Internal Server Error',
            },
          },
        },
      },
    },
  };
});

// Graceful shutdown handling
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    server.log.info(`Received ${signal}, shutting down gracefully`);
    try {
      await server.close();
      await prisma.$disconnect();
      process.exit(0);
    } catch (error) {
      server.log.error(error, 'Error during shutdown');
      process.exit(1);
    }
  });
});

// Enhanced startup function with better error handling
async function start() {
  try {
    // Verify database connection before starting
    await prisma.$connect();
    server.log.info('Database connected successfully');

    await server.listen({
      port: serverConfig.port,
      host: serverConfig.host,
    });

    server.log.info(
      `🚀 Golf Caddy API Server running on http://${serverConfig.host}:${serverConfig.port}`
    );
    server.log.info(`📡 tRPC endpoint: http://${serverConfig.host}:${serverConfig.port}/trpc`);
    server.log.info(`❤️  Health check: http://${serverConfig.host}:${serverConfig.port}/health`);
    server.log.info(`📊 Readiness check: http://${serverConfig.host}:${serverConfig.port}/ready`);
    server.log.info(`📈 API schema: http://${serverConfig.host}:${serverConfig.port}/api/schema`);
    server.log.info(`🛡️  Security headers enabled`);
    server.log.info(
      `⚡ Rate limiting: ${RATE_LIMIT_CONFIGS.default.max} requests per ${RATE_LIMIT_CONFIGS.default.timeWindow}`
    );
  } catch (error) {
    server.log.error(error, 'Failed to start server');
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Start the server
start();

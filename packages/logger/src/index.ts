// @repo/logger - Structured logging utility for Golf Caddy
import winston from 'winston';
import type { Logger as WinstonLogger } from 'winston';

export const LoggerVersion = '0.0.0';

// Log levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

// Log context interface
export interface LogContext {
  userId?: string;
  sessionId?: string;
  feature?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

// Logger configuration options
export interface LoggerOptions {
  level?: LogLevel;
  service?: string;
  environment?: string;
  consoleOutput?: boolean;
}

// Create base logger format
const createFormat = (service: string, environment: string) => {
  return winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    winston.format.json(),
    winston.format.printf((info) => {
      const { timestamp, level, message, metadata } = info;
      const baseLog = {
        timestamp,
        level,
        service,
        environment,
        message,
        ...(metadata as Record<string, unknown>),
      };
      return JSON.stringify(baseLog);
    })
  );
};

// Create logger instance
export const createLogger = (options: LoggerOptions = {}): WinstonLogger => {
  const {
    level = LogLevel.INFO,
    service = 'golf-caddy',
    environment = process.env.NODE_ENV || 'development',
    consoleOutput = true,
  } = options;

  const transports: winston.transport[] = [];

  // Console transport for development
  if (consoleOutput && environment === 'development') {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      })
    );
  }

  // File transport for production (if not React Native)
  if (environment === 'production' && typeof process !== 'undefined' && process.versions?.node) {
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
      })
    );
  }

  return winston.createLogger({
    level,
    format: createFormat(service, environment),
    transports,
  });
};

// Default logger instance
export const logger = createLogger();

// Helper functions for structured logging
export const logError = (error: Error, context?: LogContext): void => {
  logger.error(error.message, {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    ...context,
  });
};

export const logInfo = (message: string, context?: LogContext): void => {
  logger.info(message, context);
};

export const logWarning = (message: string, context?: LogContext): void => {
  logger.warn(message, context);
};

export const logDebug = (message: string, context?: LogContext): void => {
  logger.debug(message, context);
};

// Performance logging
export const logPerformance = (operation: string, duration: number, context?: LogContext): void => {
  logger.info(`Performance: ${operation}`, {
    performance: {
      operation,
      duration,
      unit: 'ms',
    },
    ...context,
  });
};

// Export types
export type { WinstonLogger as Logger };

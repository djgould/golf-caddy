/**
 * Golf Caddy API Error Handling System
 *
 * This module provides custom error classes, error codes, and utilities
 * for consistent error handling across the Golf Caddy API.
 */

import { TRPCError } from '@trpc/server';
import type { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';

// Golf Caddy specific error codes
export const GOLF_CADDY_ERROR_CODES = {
  // Authentication & Authorization
  INVALID_TOKEN: 'INVALID_TOKEN',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Course related errors
  COURSE_NOT_FOUND: 'COURSE_NOT_FOUND',
  COURSE_ACCESS_DENIED: 'COURSE_ACCESS_DENIED',
  INVALID_COURSE_DATA: 'INVALID_COURSE_DATA',

  // Round related errors
  ROUND_NOT_FOUND: 'ROUND_NOT_FOUND',
  ROUND_ACCESS_DENIED: 'ROUND_ACCESS_DENIED',
  ROUND_ALREADY_COMPLETED: 'ROUND_ALREADY_COMPLETED',
  ROUND_IN_PROGRESS: 'ROUND_IN_PROGRESS',
  INVALID_ROUND_DATA: 'INVALID_ROUND_DATA',

  // Shot related errors
  SHOT_NOT_FOUND: 'SHOT_NOT_FOUND',
  SHOT_ACCESS_DENIED: 'SHOT_ACCESS_DENIED',
  DUPLICATE_SHOT_NUMBER: 'DUPLICATE_SHOT_NUMBER',
  INVALID_SHOT_DATA: 'INVALID_SHOT_DATA',
  SHOT_SEQUENCE_ERROR: 'SHOT_SEQUENCE_ERROR',

  // Hole related errors
  HOLE_NOT_FOUND: 'HOLE_NOT_FOUND',
  INVALID_HOLE_NUMBER: 'INVALID_HOLE_NUMBER',

  // Validation errors
  INVALID_GPS_COORDINATES: 'INVALID_GPS_COORDINATES',
  INVALID_CLUB_SELECTION: 'INVALID_CLUB_SELECTION',
  INVALID_DISTANCE: 'INVALID_DISTANCE',
  INVALID_SHOT_RESULT: 'INVALID_SHOT_RESULT',

  // Rate limiting & abuse
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

  // Data integrity
  DATA_CONFLICT: 'DATA_CONFLICT',
  STALE_DATA: 'STALE_DATA',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // External services
  WEATHER_SERVICE_ERROR: 'WEATHER_SERVICE_ERROR',
  MAPPING_SERVICE_ERROR: 'MAPPING_SERVICE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
} as const;

export type GolfCaddyErrorCode =
  (typeof GOLF_CADDY_ERROR_CODES)[keyof typeof GOLF_CADDY_ERROR_CODES];

// Base error class for Golf Caddy API
export class GolfCaddyError extends Error {
  public readonly code: GolfCaddyErrorCode;
  public readonly httpStatus: number;
  public readonly context: Record<string, any> | undefined;
  public readonly timestamp: string;

  constructor(
    code: GolfCaddyErrorCode,
    message: string,
    httpStatus: number = 500,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'GolfCaddyError';
    this.code = code;
    this.httpStatus = httpStatus;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }

  toTRPCError(): TRPCError {
    const trpcCode = this.mapToTRPCCode();
    return new TRPCError({
      code: trpcCode,
      message: this.message,
      cause: {
        golfCaddyError: {
          code: this.code,
          httpStatus: this.httpStatus,
          timestamp: this.timestamp,
          ...(this.context && { context: this.context }),
        },
      },
    });
  }

  private mapToTRPCCode(): TRPC_ERROR_CODE_KEY {
    switch (this.httpStatus) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'UNPROCESSABLE_CONTENT';
      case 429:
        return 'TOO_MANY_REQUESTS';
      case 500:
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}

// Specific error classes for different domains
export class AuthenticationError extends GolfCaddyError {
  constructor(code: GolfCaddyErrorCode, message: string, context?: Record<string, any>) {
    super(code, message, 401, context);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends GolfCaddyError {
  constructor(code: GolfCaddyErrorCode, message: string, context?: Record<string, any>) {
    super(code, message, 403, context);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends GolfCaddyError {
  constructor(code: GolfCaddyErrorCode, message: string, context?: Record<string, any>) {
    super(code, message, 400, context);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends GolfCaddyError {
  constructor(code: GolfCaddyErrorCode, message: string, context?: Record<string, any>) {
    super(code, message, 404, context);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends GolfCaddyError {
  constructor(code: GolfCaddyErrorCode, message: string, context?: Record<string, any>) {
    super(code, message, 409, context);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends GolfCaddyError {
  constructor(message: string = 'Rate limit exceeded', context?: Record<string, any>) {
    super(GOLF_CADDY_ERROR_CODES.RATE_LIMIT_EXCEEDED, message, 429, context);
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends GolfCaddyError {
  constructor(code: GolfCaddyErrorCode, message: string, context?: Record<string, any>) {
    super(code, message, 502, context);
    this.name = 'ExternalServiceError';
  }
}

// Error factory functions for common scenarios
export const createAuthError = (message: string, context?: Record<string, any>) =>
  new AuthenticationError(GOLF_CADDY_ERROR_CODES.INVALID_TOKEN, message, context);

export const createCourseNotFoundError = (courseId: string) =>
  new NotFoundError(
    GOLF_CADDY_ERROR_CODES.COURSE_NOT_FOUND,
    `Course with ID "${courseId}" not found`,
    { courseId }
  );

export const createRoundNotFoundError = (roundId: string) =>
  new NotFoundError(
    GOLF_CADDY_ERROR_CODES.ROUND_NOT_FOUND,
    `Round with ID "${roundId}" not found`,
    { roundId }
  );

export const createShotNotFoundError = (shotId: string) =>
  new NotFoundError(GOLF_CADDY_ERROR_CODES.SHOT_NOT_FOUND, `Shot with ID "${shotId}" not found`, {
    shotId,
  });

export const createDuplicateShotError = (roundId: string, holeId: string, shotNumber: number) =>
  new ConflictError(
    GOLF_CADDY_ERROR_CODES.DUPLICATE_SHOT_NUMBER,
    `Shot number ${shotNumber} already exists for this hole`,
    { roundId, holeId, shotNumber }
  );

export const createInvalidGPSError = (lat: number, lng: number) =>
  new ValidationError(
    GOLF_CADDY_ERROR_CODES.INVALID_GPS_COORDINATES,
    `Invalid GPS coordinates: lat=${lat}, lng=${lng}`,
    { lat, lng }
  );

export const createAccessDeniedError = (resource: string, resourceId: string) =>
  new AuthorizationError(
    GOLF_CADDY_ERROR_CODES.ROUND_ACCESS_DENIED,
    `Access denied to ${resource} "${resourceId}"`,
    { resource, resourceId }
  );

// Error logging and monitoring utilities
export interface ErrorLogEntry {
  error: GolfCaddyError;
  userId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
}

export function logError(entry: ErrorLogEntry): void {
  // In production, this would send to a logging service like Datadog, Sentry, etc.
  console.error('Golf Caddy API Error:', {
    code: entry.error.code,
    message: entry.error.message,
    httpStatus: entry.error.httpStatus,
    context: entry.error.context,
    timestamp: entry.error.timestamp,
    userId: entry.userId,
    requestId: entry.requestId,
    endpoint: entry.endpoint,
    method: entry.method,
    userAgent: entry.userAgent,
    ip: entry.ip,
  });
}

// Error response formatter for consistent API responses
export function formatErrorResponse(error: GolfCaddyError) {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      httpStatus: error.httpStatus,
      timestamp: error.timestamp,
      ...(error.context && { context: error.context }),
    },
  };
}

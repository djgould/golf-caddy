/**
 * @repo/trpc/server - Server-side utilities and re-exports for tRPC
 *
 * This module provides server-side utilities and re-exports commonly used
 * tRPC server types and functions for use across the monorepo.
 */

// Re-export essential tRPC server types and utilities
export type { inferRouterInputs, inferRouterOutputs, AnyRouter } from '@trpc/server';

export { initTRPC, TRPCError } from '@trpc/server';

// Re-export Fastify adapter for server setup
export { fastifyTRPCPlugin, type FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';

// Golf Caddy specific server types and utilities
export interface GolfCaddyContext {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  prisma: any; // Will be typed properly by the database package
}

export interface AuthenticatedContext extends GolfCaddyContext {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

// Common server response patterns
export interface ServerSuccessResponse {
  success: true;
  message?: string;
  timestamp?: string;
}

export interface ServerErrorResponse {
  success: false;
  error: string;
  code?: string;
  timestamp?: string;
}

export type ServerResponse<T = any> = (T & ServerSuccessResponse) | ServerErrorResponse;

// Helper function to create standardized success responses
export function createSuccessResponse<T>(data: T, message?: string): T & ServerSuccessResponse {
  return {
    ...data,
    success: true,
    ...(message && { message }),
    timestamp: new Date().toISOString(),
  };
}

// Helper function to create standardized error responses
export function createErrorResponse(error: string, code?: string): ServerErrorResponse {
  return {
    success: false,
    error,
    ...(code && { code }),
    timestamp: new Date().toISOString(),
  };
}

// Standard procedure types for documentation
export interface PublicProcedure {
  type: 'public';
  requiresAuth: false;
}

export interface ProtectedProcedure {
  type: 'protected';
  requiresAuth: true;
}

// Server configuration types
export interface TRPCServerConfig {
  port: number;
  host: string;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  logging: {
    level: string;
  };
}

// Error handling utilities
export const TRPC_ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  TIMEOUT: 'TIMEOUT',
  CONFLICT: 'CONFLICT',
  PRECONDITION_FAILED: 'PRECONDITION_FAILED',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  UNPROCESSABLE_CONTENT: 'UNPROCESSABLE_CONTENT',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  CLIENT_CLOSED_REQUEST: 'CLIENT_CLOSED_REQUEST',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type TRPCErrorCode = (typeof TRPC_ERROR_CODES)[keyof typeof TRPC_ERROR_CODES];

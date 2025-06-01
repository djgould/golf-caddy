/**
 * @repo/trpc - Shared tRPC types and utilities for Golf Caddy
 *
 * This package provides type-safe API contracts between the server and clients.
 * It re-exports tRPC utilities and provides a foundation for type inference.
 */

// Re-export commonly used tRPC types and utilities
export type { TRPCError } from '@trpc/server';
export type { TRPCClientError, TRPCClientErrorLike } from '@trpc/client';
export type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

// Base types for the Golf Caddy API
export interface BaseApiResponse {
  success?: boolean;
  message?: string;
  timestamp?: string;
}

export interface PaginationInput {
  limit?: number;
  offset?: number;
}

export interface PaginationOutput {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Location-related types (used across multiple API endpoints)
export interface LocationPoint {
  lat: number;
  lng: number;
}

// Common error types for Golf Caddy API
export const API_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  COURSE_NOT_FOUND: 'COURSE_NOT_FOUND',
  ROUND_NOT_FOUND: 'ROUND_NOT_FOUND',
  SHOT_NOT_FOUND: 'SHOT_NOT_FOUND',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

// Golf-specific enums and constants
export const GOLF_CLUBS = [
  'driver',
  '3-wood',
  '5-wood',
  '7-wood',
  '1-hybrid',
  '2-hybrid',
  '3-hybrid',
  '4-hybrid',
  '5-hybrid',
  '1-iron',
  '2-iron',
  '3-iron',
  '4-iron',
  '5-iron',
  '6-iron',
  '7-iron',
  '8-iron',
  '9-iron',
  'pitching-wedge',
  'gap-wedge',
  'sand-wedge',
  'lob-wedge',
  'putter',
  'other',
] as const;

export type GolfClub = (typeof GOLF_CLUBS)[number];

export const SHOT_RESULTS = [
  'fairway',
  'rough',
  'bunker',
  'water',
  'trees',
  'green',
  'hole',
  'out-of-bounds',
] as const;

export type ShotResult = (typeof SHOT_RESULTS)[number];

export const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

export type WindDirection = (typeof WIND_DIRECTIONS)[number];

// Version for tracking compatibility
export const TRPCVersion = '1.0.0';

// Type augmentation placeholder - can be extended by apps that import this package
export interface AppRouterTypeMap {
  // This will be augmented by the API server or clients as needed
}

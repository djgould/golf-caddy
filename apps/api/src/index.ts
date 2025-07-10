/**
 * Golf Caddy API - Public Type Exports
 * 
 * This file exports the tRPC router types for use by client applications.
 * The actual server implementation is in server.ts.
 */

export { appRouter, type AppRouter } from './router.js';
export type { AuthUser, JwtPayload } from './auth.js';
/**
 * @repo/trpc/client - Client-side utilities for tRPC with React Query
 *
 * This module provides pre-configured tRPC client utilities for React applications.
 * It includes React Query integration and client setup helpers.
 */

import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

// Default configuration for the tRPC client
export interface TRPCClientConfig {
  url: string;
  headers?: Record<string, string>;
}

/**
 * Creates HTTP batch link with proper configuration for Golf Caddy API
 */
export function createGolfCaddyHTTPLink(config: TRPCClientConfig) {
  return httpBatchLink({
    url: config.url,
    ...(config.headers && { headers: config.headers }),
  });
}

/**
 * Default client configuration factory
 * Provides sensible defaults for different environments
 */
export function getDefaultClientConfig(baseUrl?: string): TRPCClientConfig {
  const defaultUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/trpc';

  return {
    url: defaultUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

/**
 * Creates client configuration with authentication headers
 */
export function createAuthenticatedClientConfig(
  config: TRPCClientConfig & { token: string }
): TRPCClientConfig {
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${config.token}`,
    },
  };
}

/**
 * React Query configuration optimized for golf data
 */
export const defaultQueryConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - golf data doesn't change frequently
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3,
    },
    mutations: {
      retry: 1,
    },
  },
};

/**
 * Custom hook for managing tRPC client configuration in React apps
 */
export function useTRPCClientConfig(token?: string): TRPCClientConfig {
  const config = getDefaultClientConfig();

  if (token) {
    return createAuthenticatedClientConfig({ ...config, token });
  }

  return config;
}

// Export React Query components for easy integration
export { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Export tRPC React for apps to use
export { createTRPCReact } from '@trpc/react-query';

// Export superjson for consistent serialization
export { default as superjson } from 'superjson';

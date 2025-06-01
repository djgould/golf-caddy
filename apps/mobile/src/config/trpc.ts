/**
 * Golf Caddy tRPC Client Configuration
 *
 * This module configures the tRPC client with authentication,
 * error handling, and React Query integration for the mobile app.
 */

import { createTRPCReact } from '@trpc/react-query';
import { createTRPCClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';

// Note: We'll need to create an AppRouter type export from the API
// For now, let's create a placeholder type that we'll replace once the API is properly typed
export type AppRouter = any; // TODO: Import from @repo/api once properly exported

// Environment configuration
const getApiUrl = () => {
  // Check for environment variables (development vs production)
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (apiUrl) {
    return apiUrl;
  }

  // Development default - use the debugger host IP
  if (__DEV__ && debuggerHost) {
    return `http://${debuggerHost}:3001`;
  }

  // Fallback for development
  return 'http://localhost:3001';
};

export const API_URL = getApiUrl();
export const TRPC_ENDPOINT = `${API_URL}/trpc`;

// Authentication token management
export class AuthTokenManager {
  private static readonly TOKEN_KEY =
    process.env.EXPO_PUBLIC_AUTH_TOKEN_KEY || '@golf_caddy_auth_token';

  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  static async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to set auth token:', error);
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  }
}

// Create the tRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

// Mobile-friendly timeout implementation
function createTimeoutSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  // Clear timeout if request completes normally
  controller.signal.addEventListener('abort', () => {
    clearTimeout(timeout);
  });

  return controller.signal;
}

// Create tRPC client configuration
export function createTRPCClientConfig() {
  const timeoutMs = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000', 10);

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: TRPC_ENDPOINT,
        transformer: superjson,
        headers: async () => {
          const token = await AuthTokenManager.getToken();
          return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          };
        },
        fetch: async (input, init) => {
          const url = typeof input === 'string' ? input : (input as Request).url;
          const timeoutSignal = createTimeoutSignal(timeoutMs);

          const response = await fetch(url, {
            ...init,
            signal: timeoutSignal,
          });

          // Handle authentication errors
          if (response.status === 401) {
            // Clear invalid token
            await AuthTokenManager.removeToken();
            // You might want to trigger a redirect to login here
            console.warn('Authentication failed - token cleared');
          }

          return response;
        },
      }),
    ],
  });
}

// Create React Query client with optimized settings for mobile
export function createQueryClient() {
  const staleTime = parseInt(process.env.EXPO_PUBLIC_CACHE_STALE_TIME || '300000', 10);
  const gcTime = parseInt(process.env.EXPO_PUBLIC_CACHE_GC_TIME || '600000', 10);
  const retryCount = parseInt(process.env.EXPO_PUBLIC_API_RETRY_COUNT || '2', 10);

  return new QueryClient({
    defaultOptions: {
      queries: {
        // Configurable stale time for mobile
        staleTime,
        gcTime,
        // Configurable retry count
        retry: retryCount,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Don't refetch on window focus for mobile
        refetchOnWindowFocus: false,
        // Don't refetch on reconnect unless data is stale
        refetchOnReconnect: 'always',
        // Refetch when app comes to foreground
        refetchOnMount: true,
      },
      mutations: {
        retry: 1, // Retry once for mutations
        retryDelay: 1000,
      },
    },
  });
}

// Type helpers for better TypeScript experience
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Specific type helpers for common operations (will be refined once AppRouter is properly typed)
export type CourseInput = any; // RouterInputs['course']['getCourses'];
export type CourseOutput = any; // RouterOutputs['course']['getCourses'];
export type RoundInput = any; // RouterInputs['round']['create'];
export type RoundOutput = any; // RouterOutputs['round']['getById'];
export type ShotInput = any; // RouterInputs['shot']['create'];
export type ShotOutput = any; // RouterOutputs['shot']['getById'];

// Error handling utilities
export function isTRPCError(
  error: unknown
): error is import('@trpc/client').TRPCClientError<AppRouter> {
  return error instanceof Error && 'data' in error;
}

export function getTRPCErrorMessage(error: unknown): string {
  if (isTRPCError(error)) {
    return error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

// Development utilities
export const isDevelopment = __DEV__;

export const TRPCConfig = {
  apiUrl: API_URL,
  endpoint: TRPC_ENDPOINT,
  isDevelopment,
  timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '30000', 10),
  retries: parseInt(process.env.EXPO_PUBLIC_API_RETRY_COUNT || '2', 10),
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
  appVersion: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  debugMode: process.env.EXPO_PUBLIC_DEBUG === 'true',
  staleTime: parseInt(process.env.EXPO_PUBLIC_CACHE_STALE_TIME || '300000', 10),
  gcTime: parseInt(process.env.EXPO_PUBLIC_CACHE_GC_TIME || '600000', 10),
} as const;

// Export for debugging in development
if (__DEV__) {
  console.log('🔧 tRPC Configuration:', TRPCConfig);
}

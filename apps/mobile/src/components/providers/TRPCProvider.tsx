/**
 * Golf Caddy tRPC Provider
 *
 * This component provides tRPC and React Query context to the entire app,
 * enabling type-safe API calls throughout the mobile application.
 */

import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  trpc,
  createTRPCClientConfig,
  createQueryClient,
  TRPCConfig,
  isDevelopment,
} from '../../config/trpc';

interface TRPCProviderProps {
  children: React.ReactNode;
}

export function TRPCProvider({ children }: TRPCProviderProps) {
  // Create stable instances that don't recreate on every render
  const [queryClient] = useState(() => createQueryClient());
  const [trpcClient] = useState(() => createTRPCClientConfig());

  // Log configuration in development
  useEffect(() => {
    if (isDevelopment) {
      console.log('🔌 tRPC Provider initialized with config:', TRPCConfig);
    }
  }, []);

  // For now, just provide the QueryClient and let components use the trpc client directly
  // This avoids the React Native rendering issues with tRPC's provider
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

/**
 * Export tRPC instance for use in components
 * This allows components to use trpc.course.getCourses.useQuery() etc.
 */
export { trpc };

/**
 * Export the client configuration function for manual usage
 */
export { createTRPCClientConfig };

/**
 * Export for easy access to auth token management
 */
export { AuthTokenManager } from '../../config/trpc';

export default TRPCProvider;

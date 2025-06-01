/**
 * Golf Caddy Shot API Hooks
 *
 * Custom hooks for shot-related operations using tRPC.
 * These hooks manage individual shot tracking, updates, and statistics.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTRPCClientConfig } from '../../config/trpc';

// Create a singleton tRPC client for use across hooks
let trpcClient: ReturnType<typeof createTRPCClientConfig> | null = null;

function getTRPCClient() {
  if (!trpcClient) {
    trpcClient = createTRPCClientConfig();
  }
  return trpcClient;
}

/**
 * Hook to fetch shots for a specific round
 */
export function useShots(filters: {
  roundId: string;
  holeId?: string;
  club?: string;
  result?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['shots', filters],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).shot.getShots.query(filters);
    },
    enabled: !!filters.roundId,
    staleTime: 30 * 1000, // 30 seconds - shots should be very fresh during active play
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a specific shot by ID
 */
export function useShot(shotId: string) {
  return useQuery({
    queryKey: ['shot', shotId],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).shot.getById.query({ id: shotId });
    },
    enabled: !!shotId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch shots for a specific hole in a round
 */
export function useShotsForHole(roundId: string, holeId: string) {
  return useQuery({
    queryKey: ['shots', 'hole', roundId, holeId],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).shot.getShots.query({ roundId, holeId });
    },
    enabled: !!(roundId && holeId),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch shot statistics
 */
export function useShotStats(filters?: {
  roundId?: string;
  club?: string;
  dateRange?: { start: Date; end: Date };
}) {
  return useQuery({
    queryKey: ['shots', 'stats', filters],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).shot.getStatistics.query(filters);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Mutation hook to create a single shot
 */
export function useCreateShot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shotData: any) => {
      const client = getTRPCClient();
      return (client as any).shot.create.mutate(shotData);
    },
    onSuccess: (newShot: any, variables: any) => {
      // Invalidate shots for the round
      queryClient.invalidateQueries({ queryKey: ['shots', { roundId: variables.roundId }] });

      // Invalidate round statistics (they may have changed)
      queryClient.invalidateQueries({ queryKey: ['round', variables.roundId, 'stats'] });

      // Set the new shot in cache
      queryClient.setQueryData(['shot', newShot.id], newShot);
    },
    onError: (error: any) => {
      console.error('Failed to create shot:', error);
    },
  });
}

/**
 * Mutation hook to create multiple shots at once (batch creation)
 */
export function useCreateBatchShots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchData: { shots: any[] }) => {
      const client = getTRPCClient();
      return (client as any).shot.createBatch.mutate(batchData);
    },
    onSuccess: (newShots: any[], variables: any) => {
      // Get roundId from first shot (assuming all shots are for same round)
      const roundId = variables.shots?.[0]?.roundId;

      if (roundId) {
        // Invalidate shots for the round
        queryClient.invalidateQueries({ queryKey: ['shots', { roundId }] });

        // Invalidate round statistics
        queryClient.invalidateQueries({ queryKey: ['round', roundId, 'stats'] });

        // Add new shots to cache
        newShots.forEach((shot: any) => {
          queryClient.setQueryData(['shot', shot.id], shot);
        });
      }
    },
    onError: (error: any) => {
      console.error('Failed to create batch shots:', error);
    },
  });
}

/**
 * Mutation hook to update a shot
 */
export function useUpdateShot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { id: string; data: any }) => {
      const client = getTRPCClient();
      return (client as any).shot.update.mutate(variables);
    },
    onSuccess: (updatedShot: any, variables: any) => {
      // Update the specific shot in cache
      queryClient.setQueryData(['shot', variables.id], updatedShot);

      // Invalidate shots for the round
      queryClient.invalidateQueries({ queryKey: ['shots', { roundId: updatedShot.roundId }] });

      // Invalidate statistics (they may have changed)
      queryClient.invalidateQueries({ queryKey: ['shots', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['round', updatedShot.roundId, 'stats'] });
    },
    onError: (error: any) => {
      console.error('Failed to update shot:', error);
    },
  });
}

/**
 * Mutation hook to delete a shot
 */
export function useDeleteShot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { id: string }) => {
      const client = getTRPCClient();
      return (client as any).shot.delete.mutate(variables);
    },
    onSuccess: (deletedShot: any, variables: any) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['shot', variables.id] });

      // Invalidate shots for the round
      queryClient.invalidateQueries({ queryKey: ['shots', { roundId: deletedShot.roundId }] });

      // Invalidate statistics
      queryClient.invalidateQueries({ queryKey: ['shots', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['round', deletedShot.roundId, 'stats'] });
    },
    onError: (error: any) => {
      console.error('Failed to delete shot:', error);
    },
  });
}

/**
 * Hook for optimistic shot updates during active play
 */
export function useOptimisticShotUpdate() {
  const queryClient = useQueryClient();

  const addShotOptimistically = (roundId: string, tempShot: any) => {
    // Add temporary shot to the shots list
    queryClient.setQueryData(['shots', { roundId }], (oldShots: any[]) =>
      oldShots ? [...oldShots, tempShot] : [tempShot]
    );
  };

  const updateShotOptimistically = (shotId: string, updates: any) => {
    // Update shot in cache
    queryClient.setQueryData(['shot', shotId], (oldShot: any) =>
      oldShot ? { ...oldShot, ...updates } : oldShot
    );
  };

  const revertOptimisticUpdate = (roundId: string) => {
    // Invalidate to revert to server state
    queryClient.invalidateQueries({ queryKey: ['shots', { roundId }] });
  };

  return {
    addShotOptimistically,
    updateShotOptimistically,
    revertOptimisticUpdate,
  };
}

/**
 * Hook to get the last shot for a specific hole (useful for continuing play)
 */
export function useLastShotForHole(roundId: string, holeId: string) {
  const { data: shots } = useShots({ roundId, holeId });

  const lastShot = shots && shots.length > 0 ? shots[shots.length - 1] : null;

  return {
    lastShot,
    shotCount: shots?.length || 0,
    isLoading: !shots,
  };
}

/**
 * Hook to calculate suggested next shot information
 */
export function useNextShotSuggestion(roundId: string, holeId: string) {
  const { lastShot, shotCount } = useLastShotForHole(roundId, holeId);

  const getNextShotNumber = () => shotCount + 1;

  const getStartLocation = () => {
    if (lastShot?.endLocation) {
      return lastShot.endLocation;
    }
    // If no previous shot, use tee location (would need hole data)
    return null;
  };

  return {
    nextShotNumber: getNextShotNumber(),
    startLocation: getStartLocation(),
    previousShot: lastShot,
  };
}

/**
 * Hook to prefetch shot data
 */
export function usePrefetchShots() {
  const queryClient = useQueryClient();

  return {
    prefetchShotsForRound: (roundId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['shots', { roundId }],
        queryFn: async () => {
          const client = getTRPCClient();
          return (client as any).shot.getShots.query({ roundId });
        },
      });
    },
    prefetchShotsForHole: (roundId: string, holeId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['shots', 'hole', roundId, holeId],
        queryFn: async () => {
          const client = getTRPCClient();
          return (client as any).shot.getShots.query({ roundId, holeId });
        },
      });
    },
    prefetchShotStats: () => {
      queryClient.prefetchQuery({
        queryKey: ['shots', 'stats'],
        queryFn: async () => {
          const client = getTRPCClient();
          return (client as any).shot.getStatistics.query();
        },
      });
    },
  };
}

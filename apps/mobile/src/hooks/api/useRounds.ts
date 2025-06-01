/**
 * Golf Caddy Round API Hooks
 *
 * Custom hooks for round-related operations using tRPC.
 * These hooks manage golf round creation, updates, and statistics.
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
 * Hook to fetch user's rounds with optional filtering
 */
export function useRounds(filters?: {
  courseId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['rounds', filters],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).round.getRounds.query(filters);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - rounds data should be relatively fresh
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a specific round by ID with all shots and statistics
 */
export function useRound(roundId: string) {
  return useQuery({
    queryKey: ['round', roundId],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).round.getById.query({ id: roundId });
    },
    enabled: !!roundId,
    staleTime: 1 * 60 * 1000, // 1 minute - round details should be fresh
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch round statistics
 */
export function useRoundStats(roundId: string) {
  return useQuery({
    queryKey: ['round', roundId, 'stats'],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).round.getStatistics.query({ roundId });
    },
    enabled: !!roundId,
    staleTime: 30 * 1000, // 30 seconds - stats should be very fresh
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to get recent rounds (last 10)
 */
export function useRecentRounds() {
  return useQuery({
    queryKey: ['rounds', 'recent'],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).round.getRounds.query({ limit: 10, offset: 0 });
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Mutation hook to create a new round
 */
export function useCreateRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roundData: any) => {
      const client = getTRPCClient();
      return (client as any).round.create.mutate(roundData);
    },
    onSuccess: (newRound: any) => {
      // Add new round to the cache
      queryClient.invalidateQueries({ queryKey: ['rounds'] });

      // Set the new round in cache
      queryClient.setQueryData(['round', newRound.id], newRound);
    },
    onError: (error: any) => {
      console.error('Failed to create round:', error);
    },
  });
}

/**
 * Mutation hook to update round details
 */
export function useUpdateRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { id: string; data: any }) => {
      const client = getTRPCClient();
      return (client as any).round.update.mutate(variables);
    },
    onSuccess: (updatedRound: any, variables: any) => {
      // Update the specific round in cache
      queryClient.setQueryData(['round', variables.id], updatedRound);

      // Invalidate rounds list and stats
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      queryClient.invalidateQueries({ queryKey: ['round', variables.id, 'stats'] });
    },
    onError: (error: any) => {
      console.error('Failed to update round:', error);
    },
  });
}

/**
 * Mutation hook to delete a round
 */
export function useDeleteRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { id: string }) => {
      const client = getTRPCClient();
      return (client as any).round.delete.mutate(variables);
    },
    onSuccess: (_deletedRound: any, variables: any) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['round', variables.id] });

      // Invalidate rounds list
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
    },
    onError: (error: any) => {
      console.error('Failed to delete round:', error);
    },
  });
}

/**
 * Hook to finish/end a round (updates end time and final score)
 */
export function useFinishRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { id: string; data: any }) => {
      const client = getTRPCClient();
      return (client as any).round.update.mutate(variables);
    },
    onSuccess: (finishedRound: any, variables: any) => {
      // Update round in cache
      queryClient.setQueryData(['round', variables.id], finishedRound);

      // Invalidate to refresh statistics
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      queryClient.invalidateQueries({ queryKey: ['round', variables.id, 'stats'] });
    },
    onError: (error: any) => {
      console.error('Failed to finish round:', error);
    },
  });
}

/**
 * Hook to get rounds for a specific course
 */
export function useRoundsForCourse(courseId: string) {
  return useQuery({
    queryKey: ['rounds', 'course', courseId],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).round.getRounds.query({ courseId });
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });
}

/**
 * Hook for optimistic updates during round play
 */
export function useOptimisticRoundUpdate() {
  const queryClient = useQueryClient();

  const updateRoundOptimistically = (roundId: string, updates: any) => {
    // Optimistically update the round in cache
    queryClient.setQueryData(['round', roundId], (oldData: any) =>
      oldData ? { ...oldData, ...updates } : oldData
    );
  };

  const revertOptimisticUpdate = (roundId: string) => {
    // Invalidate to revert to server state
    queryClient.invalidateQueries({ queryKey: ['round', roundId] });
  };

  return {
    updateRoundOptimistically,
    revertOptimisticUpdate,
  };
}

/**
 * Hook to prefetch related round data
 */
export function usePrefetchRound() {
  const queryClient = useQueryClient();

  return {
    prefetchRound: (roundId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['round', roundId],
        queryFn: async () => {
          const client = getTRPCClient();
          return (client as any).round.getById.query({ id: roundId });
        },
      });
    },
    prefetchRoundStats: (roundId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['round', roundId, 'stats'],
        queryFn: async () => {
          const client = getTRPCClient();
          return (client as any).round.getStatistics.query({ roundId });
        },
      });
    },
  };
}

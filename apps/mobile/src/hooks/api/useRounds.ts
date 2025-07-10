/**
 * Golf Caddy Round API Hooks
 *
 * Custom hooks for round-related operations using tRPC.
 * These hooks provide a clean interface for components to interact with round data.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createTRPCClientConfig, 
  type CreateRoundInput, 
  type UpdateRoundInput, 
  type RoundOutput, 
  type RoundsOutput 
} from '../../config/trpc';

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
  return useQuery<RoundsOutput>({
    queryKey: ['rounds', filters],
    queryFn: async () => {
      const client = getTRPCClient();
      return client.round.getRounds.query(filters || {});
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - rounds change frequently during play
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a specific round by ID
 */
export function useRoundById(roundId: string) {
  return useQuery<RoundOutput>({
    queryKey: ['round', roundId],
    queryFn: async () => {
      const client = getTRPCClient();
      return client.round.getById.query({ id: roundId });
    },
    enabled: !!roundId,
    staleTime: 2 * 60 * 1000, // 2 minutes - round data updates frequently
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });
}

/**
 * Hook to get round statistics
 */
export function useRoundStatistics(roundId: string) {
  return useQuery({
    queryKey: ['round', roundId, 'statistics'],
    queryFn: async () => {
      const client = getTRPCClient();
      return client.round.getStatistics.query({ id: roundId });
    },
    enabled: !!roundId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

/**
 * Mutation hook to create a new round
 */
export function useCreateRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roundData: CreateRoundInput) => {
      try {
        const client = getTRPCClient();
        console.log('🏌️ Creating round with data:', roundData);
        const result = await client.round.create.mutate(roundData);
        console.log('✅ Round created successfully:', result.id);
        return result;
      } catch (error) {
        console.error('❌ Failed to create round:', error);
        throw error;
      }
    },
    onSuccess: (newRound) => {
      // Add the new round to the rounds list cache
      queryClient.setQueryData(['rounds'], (oldData: RoundsOutput | undefined) => {
        if (!oldData) return { rounds: [newRound], pagination: { total: 1, limit: 20, offset: 0, hasMore: false } };
        return {
          ...oldData,
          rounds: [newRound, ...oldData.rounds],
          pagination: {
            ...oldData.pagination,
            total: oldData.pagination.total + 1,
          },
        };
      });
      
      // Cache the individual round
      queryClient.setQueryData(['round', newRound.id], newRound);
    },
    onError: (error) => {
      console.error('Failed to create round:', error);
    },
  });
}

/**
 * Mutation hook to update a round
 */
export function useUpdateRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: UpdateRoundInput) => {
      const client = getTRPCClient();
      return client.round.update.mutate(variables);
    },
    onSuccess: (updatedRound) => {
      // Update the individual round cache
      queryClient.setQueryData(['round', updatedRound.id], updatedRound);
      
      // Update the round in the rounds list
      queryClient.setQueryData(['rounds'], (oldData: RoundsOutput | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          rounds: oldData.rounds.map(round => 
            round.id === updatedRound.id ? updatedRound : round
          ),
        };
      });
      
      // Invalidate statistics if round was completed
      if (updatedRound.endTime) {
        queryClient.invalidateQueries({ 
          queryKey: ['round', updatedRound.id, 'statistics'] 
        });
      }
    },
    onError: (error) => {
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
    mutationFn: async (roundId: string) => {
      const client = getTRPCClient();
      return client.round.delete.mutate({ id: roundId });
    },
    onSuccess: (_, roundId) => {
      // Remove from rounds list
      queryClient.setQueryData(['rounds'], (oldData: RoundsOutput | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          rounds: oldData.rounds.filter(round => round.id !== roundId),
          pagination: {
            ...oldData.pagination,
            total: Math.max(0, oldData.pagination.total - 1),
          },
        };
      });
      
      // Remove individual round cache
      queryClient.removeQueries({ queryKey: ['round', roundId] });
    },
    onError: (error) => {
      console.error('Failed to delete round:', error);
    },
  });
}

/**
 * Hook to prefetch round data
 */
export function usePrefetchRound() {
  const queryClient = useQueryClient();

  return {
    prefetchRound: (roundId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['round', roundId],
        queryFn: async () => {
          const client = getTRPCClient();
          return client.round.getById.query({ id: roundId });
        },
      });
    },
  };
}
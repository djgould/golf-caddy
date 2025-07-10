/**
 * Golf Caddy Hole Score API Hooks
 *
 * Custom hooks for hole score operations using tRPC.
 * These hooks manage individual hole scoring within rounds.
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
 * Hook to fetch hole scores for a specific round
 */
export function useHoleScores(roundId: string) {
  return useQuery({
    queryKey: ['holeScores', 'round', roundId],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).holeScore.getByRound.query({ roundId });
    },
    enabled: !!roundId,
    staleTime: 30 * 1000, // 30 seconds - scores should be fresh during active play
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to get a specific hole score for a round and hole
 */
export function useHoleScore(roundId: string, holeId: string) {
  const { data: holeScores } = useHoleScores(roundId);
  
  const holeScore = holeScores?.find((score: any) => score.holeId === holeId);
  
  return {
    data: holeScore,
    isLoading: !holeScores,
    hasScore: !!holeScore,
  };
}

/**
 * Mutation hook to create or update a hole score (upsert)
 */
export function useUpsertHoleScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scoreData: {
      roundId: string;
      holeId: string;
      score: number;
      putts?: number;
      fairway?: boolean;
      gir?: boolean;
      notes?: string;
    }) => {
      const client = getTRPCClient();
      return (client as any).holeScore.upsert.mutate(scoreData);
    },
    onSuccess: (newScore: any, variables: any) => {
      // Invalidate hole scores for the round
      queryClient.invalidateQueries({ 
        queryKey: ['holeScores', 'round', variables.roundId] 
      });

      // Invalidate round data (total score may have changed)
      queryClient.invalidateQueries({ 
        queryKey: ['round', variables.roundId] 
      });

      // Set the new/updated score in cache
      queryClient.setQueryData(['holeScore', newScore.id], newScore);
    },
    onError: (error: any) => {
      console.error('Failed to save hole score:', error);
    },
  });
}

/**
 * Mutation hook to update an existing hole score
 */
export function useUpdateHoleScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      id: string;
      score?: number;
      putts?: number;
      fairway?: boolean;
      gir?: boolean;
      notes?: string;
    }) => {
      const client = getTRPCClient();
      return (client as any).holeScore.update.mutate(variables);
    },
    onSuccess: (updatedScore: any, variables: any) => {
      // Update the specific hole score in cache
      queryClient.setQueryData(['holeScore', variables.id], updatedScore);

      // Invalidate hole scores queries
      queryClient.invalidateQueries({ queryKey: ['holeScores'] });

      // Invalidate round data
      queryClient.invalidateQueries({ queryKey: ['round', updatedScore.roundId] });
    },
    onError: (error: any) => {
      console.error('Failed to update hole score:', error);
    },
  });
}

/**
 * Mutation hook to delete a hole score
 */
export function useDeleteHoleScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { id: string }) => {
      const client = getTRPCClient();
      return (client as any).holeScore.delete.mutate(variables);
    },
    onSuccess: (result: any, variables: any) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['holeScore', variables.id] });

      // Invalidate hole scores queries
      queryClient.invalidateQueries({ queryKey: ['holeScores'] });

      // Invalidate round data
      queryClient.invalidateQueries({ queryKey: ['round'] });
    },
    onError: (error: any) => {
      console.error('Failed to delete hole score:', error);
    },
  });
}

/**
 * Hook to calculate round statistics from hole scores
 */
export function useRoundScoreStats(roundId: string) {
  const { data: holeScores, isLoading } = useHoleScores(roundId);
  
  const stats = {
    totalScore: 0,
    holesCompleted: 0,
    totalPar: 0,
    scoreRelativeToPar: 0,
    averageScore: 0,
    birdiesOrBetter: 0,
    pars: 0,
    bogeys: 0,
    doubleBogeyOrWorse: 0,
  };

  if (holeScores && holeScores.length > 0) {
    stats.totalScore = holeScores.reduce((sum: number, hole: any) => sum + hole.score, 0);
    stats.holesCompleted = holeScores.length;
    stats.totalPar = holeScores.reduce((sum: number, hole: any) => sum + hole.hole.par, 0);
    stats.scoreRelativeToPar = stats.totalScore - stats.totalPar;
    stats.averageScore = stats.totalScore / stats.holesCompleted;

    // Count score types
    holeScores.forEach((hole: any) => {
      const scoreDiff = hole.score - hole.hole.par;
      if (scoreDiff <= -1) stats.birdiesOrBetter++;
      else if (scoreDiff === 0) stats.pars++;
      else if (scoreDiff === 1) stats.bogeys++;
      else stats.doubleBogeyOrWorse++;
    });
  }

  return {
    stats,
    isLoading,
    hasScores: holeScores && holeScores.length > 0,
  };
}

/**
 * Hook for quick score entry (commonly used scores)
 */
export function useQuickScore() {
  const upsertHoleScore = useUpsertHoleScore();

  const saveQuickScore = async (
    roundId: string,
    holeId: string,
    par: number,
    scoreDiff: number // -2 for eagle, -1 for birdie, 0 for par, etc.
  ) => {
    const score = par + scoreDiff;
    
    try {
      await upsertHoleScore.mutateAsync({
        roundId,
        holeId,
        score,
      });
    } catch (error) {
      console.error('Failed to save quick score:', error);
      throw error;
    }
  };

  return {
    saveQuickScore,
    isLoading: upsertHoleScore.isPending,
    error: upsertHoleScore.error,
  };
}

/**
 * Hook to prefetch hole score data
 */
export function usePrefetchHoleScores() {
  const queryClient = useQueryClient();

  return {
    prefetchHoleScoresForRound: (roundId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['holeScores', 'round', roundId],
        queryFn: async () => {
          const client = getTRPCClient();
          return (client as any).holeScore.getByRound.query({ roundId });
        },
      });
    },
  };
}
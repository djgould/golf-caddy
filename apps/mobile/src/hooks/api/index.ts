/**
 * Golf Caddy API Hooks Index
 *
 * Central export file for all tRPC API hooks.
 * Import from this file to access all API functionality.
 */

// Course-related hooks
export {
  useCourses,
  useCourse,
  useCoursesNearby,
  useCourseHoles,
  useCourseStats,
  useCreateCourse,
  useUpdateCourse,
  usePrefetchCourse,
} from './useCourses';

// Round-related hooks
export {
  useRounds,
  useRound,
  useRoundStats,
  useRecentRounds,
  useCreateRound,
  useUpdateRound,
  useDeleteRound,
  useFinishRound,
  useRoundsForCourse,
  useOptimisticRoundUpdate,
  usePrefetchRound,
} from './useRounds';

// Shot-related hooks
export {
  useShots,
  useShot,
  useShotsForHole,
  useShotStats,
  useCreateShot,
  useCreateBatchShots,
  useUpdateShot,
  useDeleteShot,
  useOptimisticShotUpdate,
  useLastShotForHole,
  useNextShotSuggestion,
  usePrefetchShots,
} from './useShots';

// Re-export tRPC configuration and utilities
export { AuthTokenManager, getTRPCErrorMessage, isTRPCError, TRPCConfig } from '../../config/trpc';

// Re-export error handling
export { TRPCErrorBoundary, useTRPCErrorHandler } from '../../components/errors/TRPCErrorBoundary';

// Re-export provider
export { TRPCProvider } from '../../components/providers/TRPCProvider';

/**
 * Common query options for different use cases
 */
export const QueryOptions = {
  // For data that changes frequently during active play
  realtime: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
  },

  // For data that changes occasionally
  dynamic: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 2 * 60 * 1000, // Auto-refetch every 2 minutes
  },

  // For data that rarely changes
  static: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: false, // No auto-refetch
  },

  // For one-time data fetches
  cache: {
    staleTime: Infinity, // Never stale
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },
} as const;

/**
 * Type helpers for API responses
 */
export type ApiResponse<T> = {
  data?: T;
  error?: Error;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => void;
};

/**
 * Common filters for API queries
 */
export interface CommonFilters {
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface LocationFilter {
  lat: number;
  lng: number;
  radiusKm?: number;
}

export interface CourseFilter extends CommonFilters {
  state?: string;
  city?: string;
  name?: string;
  nearLocation?: LocationFilter;
}

export interface RoundFilter extends CommonFilters {
  courseId?: string;
  status?: 'active' | 'completed' | 'abandoned';
}

export interface ShotFilter extends CommonFilters {
  roundId: string;
  holeId?: string;
  club?: string;
  result?: string;
}

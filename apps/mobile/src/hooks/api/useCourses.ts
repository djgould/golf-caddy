/**
 * Golf Caddy Course API Hooks
 *
 * Custom hooks for course-related operations using tRPC.
 * These hooks provide a clean interface for components to interact with course data.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTRPCClientConfig, type CourseSearchInput, type CourseSearchOutput, type CourseByIdOutput } from '../../config/trpc';

// Create a singleton tRPC client for use across hooks
let trpcClient: ReturnType<typeof createTRPCClientConfig> | null = null;

function getTRPCClient() {
  if (!trpcClient) {
    trpcClient = createTRPCClientConfig();
  }
  return trpcClient;
}

/**
 * Hook to fetch all courses with optional filtering
 */
export function useCourses(filters?: Partial<CourseSearchInput>) {
  return useQuery<CourseSearchOutput>({
    queryKey: ['courses', filters],
    queryFn: async () => {
      try {
        const client = getTRPCClient();
        console.log('🔍 Fetching courses with filters:', filters);
        const result = await client.course.search.query(filters || {});
        console.log('✅ Courses fetched successfully:', result.courses.length, 'courses');
        console.log('📋 Sample course ID:', result.courses[0]?.id);
        return result;
      } catch (error) {
        console.error('❌ Failed to fetch courses:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - courses don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a specific course by ID
 */
export function useCourse(courseId: string) {
  return useQuery<CourseByIdOutput>({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const client = getTRPCClient();
      return client.course.getById.query({ id: courseId });
    },
    enabled: !!courseId, // Only run if courseId is provided
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
}

/**
 * Hook to search courses by location
 */
export function useCoursesNearby(location: { lat: number; lng: number; radiusMiles?: number }) {
  return useQuery({
    queryKey: ['courses', 'nearby', location],
    queryFn: async () => {
      const client = getTRPCClient();
      return client.course.findNearby.query({
        lat: location.lat,
        lng: location.lng,
        radiusMiles: location.radiusMiles || 25, // Default 25 mile radius
      });
    },
    enabled: !!(location.lat && location.lng),
    staleTime: 5 * 60 * 1000, // 5 minutes - location-based queries refresh more often
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });
}

/**
 * Hook to get course holes (included in getById)
 */
export function useCourseHoles(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId, 'holes'],
    queryFn: async () => {
      const client = getTRPCClient();
      const course = await client.course.getById.query({ id: courseId });
      return course.holes;
    },
    enabled: !!courseId,
    staleTime: 30 * 60 * 1000, // 30 minutes - hole data rarely changes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
  });
}

/**
 * Hook to get course statistics (included in getById)
 */
export function useCourseStats(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId, 'stats'],
    queryFn: async () => {
      const client = getTRPCClient();
      const course = await client.course.getById.query({ id: courseId });
      return course.statistics;
    },
    enabled: !!courseId,
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
}

/**
 * Hook to get available states for filtering
 */
export function useCourseStates() {
  return useQuery({
    queryKey: ['course', 'states'],
    queryFn: async () => {
      const client = getTRPCClient();
      return client.course.getStates.query();
    },
    staleTime: 60 * 60 * 1000, // 1 hour - states don't change often
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
  });
}

/**
 * Hook to get cities for a specific state
 */
export function useCitiesForState(state: string) {
  return useQuery({
    queryKey: ['course', 'cities', state],
    queryFn: async () => {
      const client = getTRPCClient();
      return client.course.getCitiesByState.query({ state });
    },
    enabled: !!state && state.length === 2,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
}

/**
 * Hook to prefetch a course (useful for navigation optimization)
 */
export function usePrefetchCourse() {
  const queryClient = useQueryClient();

  return {
    prefetchCourse: (courseId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
          const client = getTRPCClient();
          return client.course.getById.query({ id: courseId });
        },
      });
    },
    prefetchCourseHoles: (courseId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['course', courseId, 'holes'],
        queryFn: async () => {
          const client = getTRPCClient();
          const course = await client.course.getById.query({ id: courseId });
          return course.holes;
        },
      });
    },
  };
}

/**
 * Golf Caddy Course API Hooks
 *
 * Custom hooks for course-related operations using tRPC.
 * These hooks provide a clean interface for components to interact with course data.
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
 * Hook to fetch all courses with optional filtering
 */
export function useCourses(filters?: { state?: string; city?: string; name?: string }) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).course.getCourses.query(filters);
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
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).course.getById.query({ id: courseId });
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
export function useCoursesNearby(location: { lat: number; lng: number; radiusKm?: number }) {
  return useQuery({
    queryKey: ['courses', 'nearby', location],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).course.getCourses.query({
        nearLocation: location,
        radiusKm: location.radiusKm || 50, // Default 50km radius
      });
    },
    enabled: !!(location.lat && location.lng),
    staleTime: 5 * 60 * 1000, // 5 minutes - location-based queries refresh more often
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });
}

/**
 * Hook to get course holes and layout
 */
export function useCourseHoles(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId, 'holes'],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).course.getHoles.query({ courseId });
    },
    enabled: !!courseId,
    staleTime: 30 * 60 * 1000, // 30 minutes - hole data rarely changes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
  });
}

/**
 * Hook to get course statistics and metadata
 */
export function useCourseStats(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId, 'stats'],
    queryFn: async () => {
      const client = getTRPCClient();
      return (client as any).course.getStatistics.query({ courseId });
    },
    enabled: !!courseId,
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
}

/**
 * Mutation hook to create a new course (admin/pro users)
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseData: any) => {
      const client = getTRPCClient();
      return (client as any).course.create.mutate(courseData);
    },
    onSuccess: () => {
      // Invalidate courses list to show new course
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error: any) => {
      console.error('Failed to create course:', error);
    },
  });
}

/**
 * Mutation hook to update course information
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { id: string; data: any }) => {
      const client = getTRPCClient();
      return (client as any).course.update.mutate(variables);
    },
    onSuccess: (updatedCourse: any, variables: any) => {
      // Update the specific course in cache
      queryClient.setQueryData(['course', variables.id], updatedCourse);
      // Invalidate course list to refresh
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error: any) => {
      console.error('Failed to update course:', error);
    },
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
          return (client as any).course.getById.query({ id: courseId });
        },
      });
    },
    prefetchCourseHoles: (courseId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['course', courseId, 'holes'],
        queryFn: async () => {
          const client = getTRPCClient();
          return (client as any).course.getHoles.query({ courseId });
        },
      });
    },
  };
}

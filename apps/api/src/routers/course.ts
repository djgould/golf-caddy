import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc.js';
import {
  findCoursesNearLocation,
  findNearestHoles,
  getDistanceBetweenCourses,
} from '@repo/db/spatial-helpers';

// Input validation schemas
const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const NearbyCoursesSchema = LocationSchema.extend({
  radiusMiles: z.number().min(0.1).max(100).default(25),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
});

const CourseSearchSchema = z.object({
  query: z.string().min(1).max(100).optional(),
  state: z.string().length(2).optional(),
  city: z.string().min(1).max(50).optional(),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
});

const CourseDistanceSchema = z.object({
  courseId1: z.string().min(1),
  courseId2: z.string().min(1),
});

// Type for spatial query results - exported for use in AppRouter type
export interface SpatialCourseResult {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  distance_miles: number;
}

export interface SpatialHoleResult {
  id: string;
  holeNumber: number;
  par: number;
  yardage: number | null;
  course_name: string;
  distance_meters: number;
}

export const courseRouter = router({
  // Find courses near a location using PostGIS spatial queries
  findNearby: publicProcedure.input(NearbyCoursesSchema).query(async ({ ctx, input }) => {
    const { lat, lng, radiusMiles, limit, offset } = input;

    try {
      // Use spatial helper function for finding nearby courses
      const rawCourses = await findCoursesNearLocation(ctx.prisma, lat, lng, radiusMiles);

      // Type assertion for the spatial query results
      const courses = rawCourses as SpatialCourseResult[];

      // Apply pagination manually since the spatial function doesn't support it
      const paginatedCourses = courses.slice(offset, offset + limit);

      return {
        courses: paginatedCourses,
        pagination: {
          total: courses.length,
          limit,
          offset,
          hasMore: offset + limit < courses.length,
        },
      };
    } catch (error) {
      console.error('Error finding nearby courses:', error);
      throw new Error('Failed to find nearby courses');
    }
  }),

  // Search courses by name, city, or state with text matching
  search: publicProcedure.input(CourseSearchSchema).query(async ({ ctx, input }) => {
    const { query, state, city, limit, offset } = input;

    try {
      const whereClause = {
        AND: [
          query
            ? {
                OR: [
                  { name: { contains: query, mode: 'insensitive' as const } },
                  { city: { contains: query, mode: 'insensitive' as const } },
                ],
              }
            : {},
          state ? { state: { equals: state, mode: 'insensitive' as const } } : {},
          city ? { city: { equals: city, mode: 'insensitive' as const } } : {},
        ].filter((condition) => Object.keys(condition).length > 0),
      };

      const [courses, total] = await Promise.all([
        ctx.prisma.course.findMany({
          where: whereClause.AND.length > 0 ? whereClause : {},
          include: {
            holes: {
              select: {
                id: true,
                holeNumber: true,
                par: true,
                yardage: true,
              },
              orderBy: { holeNumber: 'asc' },
            },
          },
          take: limit,
          skip: offset,
          orderBy: { name: 'asc' },
        }),
        ctx.prisma.course.count({
          where: whereClause.AND.length > 0 ? whereClause : {},
        }),
      ]);

      return {
        courses,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      };
    } catch (error) {
      console.error('Error searching courses:', error);
      throw new Error('Failed to search courses');
    }
  }),

  // Get detailed information about a specific course
  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        const course = await ctx.prisma.course.findUnique({
          where: { id: input.id },
          include: {
            holes: {
              select: {
                id: true,
                holeNumber: true,
                par: true,
                yardage: true,
                teeLocation: true,
                greenLocation: true,
              },
              orderBy: { holeNumber: 'asc' },
            },
          },
        });

        if (!course) {
          throw new Error('Course not found');
        }

        // Calculate course statistics
        const totalYardage = course.holes.reduce(
          (sum: number, hole) => sum + (hole.yardage || 0),
          0
        );
        const totalPar = course.holes.reduce((sum: number, hole) => sum + hole.par, 0);

        return {
          ...course,
          statistics: {
            totalHoles: course.holes.length,
            totalYardage,
            totalPar,
            averageYardage:
              course.holes.length > 0 ? Math.round(totalYardage / course.holes.length) : 0,
          },
        };
      } catch (error) {
        console.error('Error getting course by ID:', error);
        throw new Error('Failed to get course details');
      }
    }),

  // Find nearest holes to a location (useful for GPS location on course)
  findNearestHoles: protectedProcedure
    .input(
      LocationSchema.extend({
        limit: z.number().min(1).max(10).default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const { lat, lng, limit } = input;

      try {
        // Use spatial helper function for finding nearest holes
        const rawHoles = await findNearestHoles(ctx.prisma, lat, lng, limit);

        // Type assertion for the spatial query results
        const holes = rawHoles as SpatialHoleResult[];

        return {
          holes,
          location: { lat, lng },
        };
      } catch (error) {
        console.error('Error finding nearest holes:', error);
        throw new Error('Failed to find nearest holes');
      }
    }),

  // Calculate distance between two courses
  getDistance: publicProcedure.input(CourseDistanceSchema).query(async ({ ctx, input }) => {
    try {
      const distance = await getDistanceBetweenCourses(
        ctx.prisma,
        input.courseId1,
        input.courseId2
      );

      return {
        courseId1: input.courseId1,
        courseId2: input.courseId2,
        distanceMiles: Math.round(distance * 100) / 100, // Round to 2 decimal places
      };
    } catch (error) {
      console.error('Error calculating course distance:', error);
      throw new Error('Failed to calculate distance between courses');
    }
  }),

  // Get list of all states with courses (for filter dropdowns)
  getStates: publicProcedure.query(async ({ ctx }) => {
    try {
      const states = await ctx.prisma.course.findMany({
        select: { state: true },
        distinct: ['state'],
        orderBy: { state: 'asc' },
        where: {
          state: { not: null },
        },
      });

      return states.map((s) => s.state).filter(Boolean);
    } catch (error) {
      console.error('Error getting course states:', error);
      throw new Error('Failed to get course states');
    }
  }),

  // Get list of cities for a specific state (for cascading filter dropdowns)
  getCitiesByState: publicProcedure
    .input(z.object({ state: z.string().length(2) }))
    .query(async ({ ctx, input }) => {
      try {
        const cities = await ctx.prisma.course.findMany({
          select: { city: true },
          distinct: ['city'],
          where: {
            state: { equals: input.state, mode: 'insensitive' },
            city: { not: null },
          },
          orderBy: { city: 'asc' },
        });

        return cities.map((c) => c.city).filter(Boolean);
      } catch (error) {
        console.error('Error getting cities by state:', error);
        throw new Error('Failed to get cities for state');
      }
    }),
});

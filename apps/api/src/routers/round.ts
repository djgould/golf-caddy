import { z } from 'zod';
import { router, protectedProcedure } from '../trpc.js';
import { TRPCError } from '@trpc/server';

// Input validation schemas
const CreateRoundSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  startTime: z
    .date()
    .optional()
    .default(() => new Date()),
  weather: z.string().max(100).optional(),
  temperature: z.number().int().min(-50).max(150).optional(),
  windSpeed: z.number().int().min(0).max(100).optional(),
  windDirection: z.enum(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']).optional(),
});

const UpdateRoundSchema = z.object({
  id: z.string().uuid('Invalid round ID'),
  endTime: z.date().optional(),
  weather: z.string().max(100).optional(),
  temperature: z.number().int().min(-50).max(150).optional(),
  windSpeed: z.number().int().min(0).max(100).optional(),
  windDirection: z.enum(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']).optional(),
  score: z.number().int().min(18).max(200).optional(),
});

const GetRoundsSchema = z.object({
  courseId: z.string().uuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
});

const RoundStatsSchema = z.object({
  id: z.string().uuid('Invalid round ID'),
});

// Type exports for client consumption
export interface RoundWithCourse {
  id: string;
  userId: string;
  courseId: string;
  startTime: Date;
  endTime: Date | null;
  weather: string | null;
  temperature: number | null;
  windSpeed: number | null;
  windDirection: string | null;
  score: number | null;
  createdAt: Date;
  updatedAt: Date;
  course: {
    id: string;
    name: string;
    city: string | null;
    state: string | null;
  };
  _count: {
    shots: number;
  };
}

export interface RoundStatistics {
  totalShots: number;
  totalScore: number | null;
  parDifference: number | null;
  averageShots: number;
  holesPlayed: number;
  accuracy: {
    fairwaysHit: number;
    greensInRegulation: number;
    totalFairways: number;
    totalGreens: number;
  };
}

export const roundRouter = router({
  // Create a new golf round
  create: protectedProcedure.input(CreateRoundSchema).mutation(async ({ ctx, input }) => {
    try {
      // Verify course exists
      const course = await ctx.prisma.course.findUnique({
        where: { id: input.courseId },
        select: { id: true, name: true },
      });

      if (!course) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Course not found',
        });
      }

      // Filter out undefined values for Prisma
      const roundData = {
        userId: ctx.user.id,
        courseId: input.courseId,
        startTime: input.startTime,
        ...(input.weather !== undefined && { weather: input.weather }),
        ...(input.temperature !== undefined && { temperature: input.temperature }),
        ...(input.windSpeed !== undefined && { windSpeed: input.windSpeed }),
        ...(input.windDirection !== undefined && { windDirection: input.windDirection }),
      };

      // Create the round
      const round = await ctx.prisma.round.create({
        data: roundData,
        include: {
          course: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
            },
          },
          _count: {
            select: { shots: true },
          },
        },
      });

      return round;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error('Error creating round:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create round',
      });
    }
  }),

  // Get user's rounds with pagination and filtering
  getRounds: protectedProcedure.input(GetRoundsSchema).query(async ({ ctx, input }) => {
    const { courseId, startDate, endDate, limit, offset } = input;

    try {
      const whereClause = {
        userId: ctx.user.id,
        ...(courseId && { courseId }),
        ...(startDate && {
          startTime: {
            gte: startDate,
            ...(endDate && { lte: endDate }),
          },
        }),
      };

      const [rounds, total] = await Promise.all([
        ctx.prisma.round.findMany({
          where: whereClause,
          include: {
            course: {
              select: {
                id: true,
                name: true,
                city: true,
                state: true,
              },
            },
            _count: {
              select: { shots: true },
            },
          },
          orderBy: { startTime: 'desc' },
          take: limit,
          skip: offset,
        }),
        ctx.prisma.round.count({ where: whereClause }),
      ]);

      return {
        rounds: rounds as RoundWithCourse[],
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      };
    } catch (error) {
      console.error('Error getting rounds:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get rounds',
      });
    }
  }),

  // Get detailed round information with shots and statistics
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const round = await ctx.prisma.round.findUnique({
          where: {
            id: input.id,
            userId: ctx.user.id, // Ensure user can only access their own rounds
          },
          include: {
            course: {
              select: {
                id: true,
                name: true,
                city: true,
                state: true,
                rating: true,
                slope: true,
              },
            },
            shots: {
              include: {
                hole: {
                  select: {
                    id: true,
                    holeNumber: true,
                    par: true,
                    yardage: true,
                  },
                },
              },
              orderBy: [{ hole: { holeNumber: 'asc' } }, { shotNumber: 'asc' }],
            },
            _count: {
              select: { shots: true },
            },
          },
        });

        if (!round) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Round not found',
          });
        }

        return round;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error getting round by ID:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get round details',
        });
      }
    }),

  // Update round details
  update: protectedProcedure.input(UpdateRoundSchema).mutation(async ({ ctx, input }) => {
    const { id, ...inputData } = input;

    try {
      // Verify round exists and belongs to user
      const existingRound = await ctx.prisma.round.findUnique({
        where: { id, userId: ctx.user.id },
        select: { id: true },
      });

      if (!existingRound) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Round not found or access denied',
        });
      }

      // Filter out undefined values for Prisma
      const updateData = Object.fromEntries(
        Object.entries(inputData).filter(([_, value]) => value !== undefined)
      );

      // Update the round
      const updatedRound = await ctx.prisma.round.update({
        where: { id },
        data: updateData,
        include: {
          course: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
            },
          },
          _count: {
            select: { shots: true },
          },
        },
      });

      return updatedRound;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error('Error updating round:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update round',
      });
    }
  }),

  // Delete round and all associated shots
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify round exists and belongs to user
        const existingRound = await ctx.prisma.round.findUnique({
          where: { id: input.id, userId: ctx.user.id },
          select: { id: true },
        });

        if (!existingRound) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Round not found or access denied',
          });
        }

        // Delete round (shots will be cascade deleted)
        await ctx.prisma.round.delete({
          where: { id: input.id },
        });

        return { success: true, message: 'Round deleted successfully' };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error deleting round:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete round',
        });
      }
    }),

  // Get round statistics
  getStatistics: protectedProcedure.input(RoundStatsSchema).query(async ({ ctx, input }) => {
    try {
      const round = await ctx.prisma.round.findUnique({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        include: {
          shots: {
            include: {
              hole: {
                select: {
                  holeNumber: true,
                  par: true,
                },
              },
            },
          },
          course: {
            select: {
              holes: {
                select: {
                  holeNumber: true,
                  par: true,
                },
              },
            },
          },
        },
      });

      if (!round) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Round not found',
        });
      }

      // Calculate statistics
      const shotsByHole = round.shots.reduce(
        (acc, shot) => {
          const holeNumber = shot.hole.holeNumber;
          if (!acc[holeNumber]) {
            acc[holeNumber] = [];
          }
          acc[holeNumber].push(shot);
          return acc;
        },
        {} as Record<number, typeof round.shots>
      );

      const holesPlayed = Object.keys(shotsByHole).length;
      const totalShots = round.shots.length;
      const averageShots = holesPlayed > 0 ? totalShots / holesPlayed : 0;

      // Calculate par difference if score is recorded
      const totalPar = round.course.holes.reduce((sum, hole) => sum + hole.par, 0);
      const parDifference = round.score ? round.score - totalPar : null;

      // Calculate accuracy statistics
      const fairwaysHit = round.shots.filter(
        (shot) => shot.shotNumber === 1 && shot.result === 'fairway'
      ).length;

      const greensInRegulation = Object.values(shotsByHole).filter((holeShots) => {
        const hole = holeShots[0]?.hole;
        if (!hole) return false;

        const shotsToGreen = holeShots.findIndex((shot) => shot.result === 'green') + 1;
        const regulationShots = hole.par - 2; // GIR means on green in par-2 shots

        return shotsToGreen > 0 && shotsToGreen <= regulationShots;
      }).length;

      const totalFairways = round.shots.filter((shot) => shot.shotNumber === 1).length;
      const totalGreens = holesPlayed;

      const statistics: RoundStatistics = {
        totalShots,
        totalScore: round.score,
        parDifference,
        averageShots: Math.round(averageShots * 100) / 100,
        holesPlayed,
        accuracy: {
          fairwaysHit,
          greensInRegulation,
          totalFairways,
          totalGreens,
        },
      };

      return statistics;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error('Error calculating round statistics:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to calculate round statistics',
      });
    }
  }),
});

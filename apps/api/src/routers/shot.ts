import { z } from 'zod';
import { router, protectedProcedure } from '../trpc.js';
import { TRPCError } from '@trpc/server';

// Golf club validation - standard club types
const GolfClubSchema = z.enum([
  // Drivers & Woods
  'driver',
  '3-wood',
  '5-wood',
  '7-wood',
  // Hybrids
  '1-hybrid',
  '2-hybrid',
  '3-hybrid',
  '4-hybrid',
  '5-hybrid',
  // Irons
  '1-iron',
  '2-iron',
  '3-iron',
  '4-iron',
  '5-iron',
  '6-iron',
  '7-iron',
  '8-iron',
  '9-iron',
  // Wedges
  'pitching-wedge',
  'gap-wedge',
  'sand-wedge',
  'lob-wedge',
  // Putter
  'putter',
  // Other
  'other',
]);

// Shot result validation
const ShotResultSchema = z.enum([
  'fairway',
  'rough',
  'bunker',
  'water',
  'trees',
  'green',
  'hole',
  'out-of-bounds',
]);

// Location validation
const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

// Input validation schemas
const CreateShotSchema = z.object({
  roundId: z.string().min(1, 'Round ID is required'),
  holeId: z.string().min(1, 'Hole ID is required'),
  shotNumber: z.number().int().min(1).max(20),
  club: GolfClubSchema,
  distance: z.number().min(0).max(500).optional(),
  startLocation: LocationSchema,
  endLocation: LocationSchema.optional(),
  result: ShotResultSchema.optional(),
  notes: z.string().max(500).optional(),
});

const CreateBatchShotsSchema = z.object({
  roundId: z.string().min(1, 'Round ID is required'),
  shots: z
    .array(CreateShotSchema.omit({ roundId: true }))
    .min(1)
    .max(50),
});

const UpdateShotSchema = z.object({
  id: z.string().min(1, 'Shot ID is required'),
  club: GolfClubSchema.optional(),
  distance: z.number().min(0).max(500).optional(),
  startLocation: LocationSchema.optional(),
  endLocation: LocationSchema.optional(),
  result: ShotResultSchema.optional(),
  notes: z.string().max(500).optional(),
});

const GetShotsSchema = z.object({
  roundId: z.string().min(1).optional(),
  holeId: z.string().min(1).optional(),
  club: GolfClubSchema.optional(),
  result: ShotResultSchema.optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

const ShotStatsSchema = z.object({
  roundId: z.string().min(1).optional(),
  holeId: z.string().min(1).optional(),
  club: GolfClubSchema.optional(),
});

// Type exports for client consumption
export interface ShotWithHole {
  id: string;
  roundId: string;
  userId: string;
  holeId: string;
  shotNumber: number;
  club: string;
  distance: number | null;
  startLocation: any; // JSON PostGIS Point
  endLocation: any | null; // JSON PostGIS Point
  result: string | null;
  notes: string | null;
  createdAt: Date;
  hole: {
    id: string;
    holeNumber: number;
    par: number;
    yardage: number;
  };
  round: {
    id: string;
    startTime: Date;
    course: {
      name: string;
    };
  };
}

export interface ShotStatistics {
  totalShots: number;
  averageDistance: number;
  accuracy: {
    fairwaysHit: number;
    greensInRegulation: number;
    total: number;
  };
  clubStats: Record<
    string,
    {
      count: number;
      averageDistance: number;
      accuracy: number;
    }
  >;
  resultBreakdown: Record<string, number>;
}

export const shotRouter = router({
  // Create a new shot
  create: protectedProcedure.input(CreateShotSchema).mutation(async ({ ctx, input }) => {
    try {
      // Verify round exists and belongs to user
      const round = await ctx.prisma.round.findUnique({
        where: { id: input.roundId, userId: ctx.user.id },
        select: { id: true },
      });

      if (!round) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Round not found or access denied',
        });
      }

      // Verify hole exists
      const hole = await ctx.prisma.hole.findUnique({
        where: { id: input.holeId },
        select: { id: true },
      });

      if (!hole) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Hole not found',
        });
      }

      // Check if shot number already exists for this hole in this round
      const existingShot = await ctx.prisma.shot.findFirst({
        where: {
          roundId: input.roundId,
          holeId: input.holeId,
          shotNumber: input.shotNumber,
        },
      });

      if (existingShot) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Shot number already exists for this hole',
        });
      }

      // Filter out undefined values for Prisma
      const shotData = {
        roundId: input.roundId,
        userId: ctx.user.id,
        holeId: input.holeId,
        shotNumber: input.shotNumber,
        club: input.club,
        startLocation: input.startLocation,
        ...(input.distance !== undefined && { distance: input.distance }),
        ...(input.endLocation !== undefined && { endLocation: input.endLocation }),
        ...(input.result !== undefined && { result: input.result }),
        ...(input.notes !== undefined && { notes: input.notes }),
      };

      // Create the shot
      const shot = await ctx.prisma.shot.create({
        data: shotData,
        include: {
          hole: {
            select: {
              id: true,
              holeNumber: true,
              par: true,
              yardage: true,
            },
          },
          round: {
            select: {
              id: true,
              startTime: true,
              course: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return shot;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error('Error creating shot:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create shot',
      });
    }
  }),

  // Create multiple shots in a batch for efficiency
  createBatch: protectedProcedure.input(CreateBatchShotsSchema).mutation(async ({ ctx, input }) => {
    try {
      // Verify round exists and belongs to user
      const round = await ctx.prisma.round.findUnique({
        where: { id: input.roundId, userId: ctx.user.id },
        select: { id: true },
      });

      if (!round) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Round not found or access denied',
        });
      }

      // Verify all holes exist
      const holeIds = input.shots.map((shot) => shot.holeId);
      const holes = await ctx.prisma.hole.findMany({
        where: { id: { in: holeIds } },
        select: { id: true },
      });

      if (holes.length !== new Set(holeIds).size) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'One or more holes not found',
        });
      }

      // Check for duplicate shot numbers
      const shotKeys = input.shots.map((shot) => `${shot.holeId}-${shot.shotNumber}`);
      if (new Set(shotKeys).size !== shotKeys.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Duplicate shot numbers found for the same hole',
        });
      }

      // Prepare shot data for batch creation
      const shotsData = input.shots.map((shot) => ({
        roundId: input.roundId,
        userId: ctx.user.id,
        holeId: shot.holeId,
        shotNumber: shot.shotNumber,
        club: shot.club,
        startLocation: shot.startLocation,
        ...(shot.distance !== undefined && { distance: shot.distance }),
        ...(shot.endLocation !== undefined && { endLocation: shot.endLocation }),
        ...(shot.result !== undefined && { result: shot.result }),
        ...(shot.notes !== undefined && { notes: shot.notes }),
      }));

      // Create shots in transaction
      const createdShots = await ctx.prisma.$transaction(async (tx) => {
        return tx.shot.createMany({
          data: shotsData,
        });
      });

      return {
        success: true,
        count: createdShots.count,
        message: `Successfully created ${createdShots.count} shots`,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error('Error creating batch shots:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create shots',
      });
    }
  }),

  // Get shots with filtering and pagination
  getShots: protectedProcedure.input(GetShotsSchema).query(async ({ ctx, input }) => {
    const { roundId, holeId, club, result, limit, offset } = input;

    try {
      const whereClause = {
        userId: ctx.user.id,
        ...(roundId && { roundId }),
        ...(holeId && { holeId }),
        ...(club && { club }),
        ...(result && { result }),
      };

      const [shots, total] = await Promise.all([
        ctx.prisma.shot.findMany({
          where: whereClause,
          include: {
            hole: {
              select: {
                id: true,
                holeNumber: true,
                par: true,
                yardage: true,
              },
            },
            round: {
              select: {
                id: true,
                startTime: true,
                course: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: [
            { round: { startTime: 'desc' } },
            { hole: { holeNumber: 'asc' } },
            { shotNumber: 'asc' },
          ],
          take: limit,
          skip: offset,
        }),
        ctx.prisma.shot.count({ where: whereClause }),
      ]);

      return {
        shots: shots as ShotWithHole[],
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      };
    } catch (error) {
      console.error('Error getting shots:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get shots',
      });
    }
  }),

  // Get shot by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        const shot = await ctx.prisma.shot.findUnique({
          where: {
            id: input.id,
            userId: ctx.user.id, // Ensure user can only access their own shots
          },
          include: {
            hole: {
              select: {
                id: true,
                holeNumber: true,
                par: true,
                yardage: true,
              },
            },
            round: {
              select: {
                id: true,
                startTime: true,
                course: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });

        if (!shot) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Shot not found',
          });
        }

        return shot;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error getting shot by ID:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get shot details',
        });
      }
    }),

  // Update shot details
  update: protectedProcedure.input(UpdateShotSchema).mutation(async ({ ctx, input }) => {
    const { id, ...inputData } = input;

    try {
      // Verify shot exists and belongs to user
      const existingShot = await ctx.prisma.shot.findUnique({
        where: { id, userId: ctx.user.id },
        select: { id: true },
      });

      if (!existingShot) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Shot not found or access denied',
        });
      }

      // Filter out undefined values for Prisma
      const updateData = Object.fromEntries(
        Object.entries(inputData).filter(([_, value]) => value !== undefined)
      );

      // Update the shot
      const updatedShot = await ctx.prisma.shot.update({
        where: { id },
        data: updateData,
        include: {
          hole: {
            select: {
              id: true,
              holeNumber: true,
              par: true,
              yardage: true,
            },
          },
          round: {
            select: {
              id: true,
              startTime: true,
              course: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return updatedShot;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error('Error updating shot:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update shot',
      });
    }
  }),

  // Delete shot
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify shot exists and belongs to user
        const existingShot = await ctx.prisma.shot.findUnique({
          where: { id: input.id, userId: ctx.user.id },
          select: { id: true },
        });

        if (!existingShot) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Shot not found or access denied',
          });
        }

        // Delete the shot
        await ctx.prisma.shot.delete({
          where: { id: input.id },
        });

        return { success: true, message: 'Shot deleted successfully' };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error deleting shot:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete shot',
        });
      }
    }),

  // Get shot statistics
  getStatistics: protectedProcedure.input(ShotStatsSchema).query(async ({ ctx, input }) => {
    const { roundId, holeId, club } = input;

    try {
      const whereClause = {
        userId: ctx.user.id,
        ...(roundId && { roundId }),
        ...(holeId && { holeId }),
        ...(club && { club }),
      };

      const shots = await ctx.prisma.shot.findMany({
        where: whereClause,
        select: {
          club: true,
          distance: true,
          result: true,
          shotNumber: true,
          hole: {
            select: {
              par: true,
            },
          },
        },
      });

      const totalShots = shots.length;
      const shotsWithDistance = shots.filter((shot) => shot.distance !== null);
      const averageDistance =
        shotsWithDistance.length > 0
          ? Math.round(
              shotsWithDistance.reduce((sum, shot) => sum + (shot.distance || 0), 0) /
                shotsWithDistance.length
            )
          : 0;

      // Calculate accuracy
      const teeShots = shots.filter((shot) => shot.shotNumber === 1);
      const fairwaysHit = teeShots.filter((shot) => shot.result === 'fairway').length;
      const greensInRegulation = shots.filter((shot) => {
        const regulationShots = shot.hole?.par ? shot.hole.par - 2 : 0;
        return shot.shotNumber <= regulationShots && shot.result === 'green';
      }).length;

      // Club statistics
      const clubStats: Record<
        string,
        { count: number; averageDistance: number; accuracy: number }
      > = {};
      shots.forEach((shot) => {
        if (!clubStats[shot.club]) {
          clubStats[shot.club] = { count: 0, averageDistance: 0, accuracy: 0 };
        }
        clubStats[shot.club]!.count++;
      });

      Object.keys(clubStats).forEach((clubType) => {
        const clubShots = shots.filter((shot) => shot.club === clubType);
        const clubShotsWithDistance = clubShots.filter((shot) => shot.distance !== null);

        clubStats[clubType]!.averageDistance =
          clubShotsWithDistance.length > 0
            ? Math.round(
                clubShotsWithDistance.reduce((sum, shot) => sum + (shot.distance || 0), 0) /
                  clubShotsWithDistance.length
              )
            : 0;

        const successfulShots = clubShots.filter(
          (shot) => shot.result && ['fairway', 'green', 'hole'].includes(shot.result)
        ).length;
        clubStats[clubType]!.accuracy =
          clubShots.length > 0 ? Math.round((successfulShots / clubShots.length) * 100) : 0;
      });

      // Result breakdown
      const resultBreakdown: Record<string, number> = {};
      shots.forEach((shot) => {
        if (shot.result) {
          resultBreakdown[shot.result] = (resultBreakdown[shot.result] || 0) + 1;
        }
      });

      const statistics: ShotStatistics = {
        totalShots,
        averageDistance,
        accuracy: {
          fairwaysHit,
          greensInRegulation,
          total: totalShots,
        },
        clubStats,
        resultBreakdown,
      };

      return statistics;
    } catch (error) {
      console.error('Error calculating shot statistics:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to calculate shot statistics',
      });
    }
  }),
});

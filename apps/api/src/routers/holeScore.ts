import { z } from 'zod';
import { router, protectedProcedure } from '../trpc.js';
import { TRPCError } from '@trpc/server';
import { HoleScoreUncheckedCreateInputSchema, HoleScoreUncheckedUpdateInputSchema } from '@repo/db';

// Input validation schemas using generated Zod schemas
const CreateHoleScoreSchema = z.intersection(
  z.object({
    roundId: z.string().min(1, 'Round ID is required'),
    holeId: z.string().min(1, 'Hole ID is required'),
    score: z.number().int().min(1).max(15), // Add reasonable score range validation
  }),
  HoleScoreUncheckedCreateInputSchema
);

const UpdateHoleScoreSchemaInput = z.intersection(
  z.object({
    id: z.string().min(1, 'Hole score ID is required'),
  }),
  HoleScoreUncheckedUpdateInputSchema
);

const GetHoleScoresSchema = z.object({
  roundId: z.string().min(1, 'Round ID is required'),
});

// Type exports for client consumption
export interface HoleScoreWithHole {
  id: string;
  roundId: string;
  holeId: string;
  userId: string;
  score: number;
  putts: number | null;
  fairway: boolean | null;
  gir: boolean | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  hole: {
    id: string;
    holeNumber: number;
    par: number;
    yardage: number;
  };
}

export const holeScoreRouter = router({
  // Create or update a hole score (upsert)
  upsert: protectedProcedure.input(CreateHoleScoreSchema).mutation(async ({ ctx, input }) => {
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
        select: { id: true, holeNumber: true, par: true },
      });

      if (!hole) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Hole not found',
        });
      }

      // Filter out undefined values for Prisma
      const scoreData = {
        roundId: input.roundId,
        holeId: input.holeId,
        userId: ctx.user.id,
        score: input.score,
        ...(input.putts !== undefined && { putts: input.putts }),
        ...(input.fairway !== undefined && { fairway: input.fairway }),
        ...(input.gir !== undefined && { gir: input.gir }),
        ...(input.notes !== undefined && { notes: input.notes }),
      };

      // Upsert the hole score (create if doesn't exist, update if it does)
      const holeScore = await ctx.prisma.holeScore.upsert({
        where: {
          roundId_holeId: {
            roundId: input.roundId,
            holeId: input.holeId,
          },
        },
        create: scoreData,
        update: scoreData,
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
      });

      // After updating hole score, recalculate total round score
      await updateRoundTotalScore(ctx, input.roundId);

      return holeScore;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error('Error upserting hole score:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to save hole score',
      });
    }
  }),

  // Get all hole scores for a round
  getByRound: protectedProcedure.input(GetHoleScoresSchema).query(async ({ ctx, input }) => {
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

      const holeScores = await ctx.prisma.holeScore.findMany({
        where: {
          roundId: input.roundId,
          userId: ctx.user.id,
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
        },
        orderBy: {
          hole: { holeNumber: 'asc' },
        },
      });

      return holeScores as HoleScoreWithHole[];
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error('Error getting hole scores:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get hole scores',
      });
    }
  }),

  // Update an existing hole score
  update: protectedProcedure.input(UpdateHoleScoreSchemaInput).mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;

    try {
      // Verify hole score exists and belongs to user
      const existingScore = await ctx.prisma.holeScore.findUnique({
        where: { id, userId: ctx.user.id },
        select: { id: true, roundId: true },
      });

      if (!existingScore) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Hole score not found or access denied',
        });
      }

      // Filter out undefined values for Prisma
      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );

      // Update the hole score
      const updatedScore = await ctx.prisma.holeScore.update({
        where: { id },
        data: filteredUpdateData,
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
      });

      // Recalculate total round score
      await updateRoundTotalScore(ctx, existingScore.roundId);

      return updatedScore;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error('Error updating hole score:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update hole score',
      });
    }
  }),

  // Delete a hole score
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify hole score exists and belongs to user
        const existingScore = await ctx.prisma.holeScore.findUnique({
          where: { id: input.id, userId: ctx.user.id },
          select: { id: true, roundId: true },
        });

        if (!existingScore) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Hole score not found or access denied',
          });
        }

        // Delete the hole score
        await ctx.prisma.holeScore.delete({
          where: { id: input.id },
        });

        // Recalculate total round score
        await updateRoundTotalScore(ctx, existingScore.roundId);

        return { success: true, message: 'Hole score deleted successfully' };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error deleting hole score:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete hole score',
        });
      }
    }),
});

// Helper function to recalculate and update the total round score
async function updateRoundTotalScore(ctx: any, roundId: string) {
  try {
    // Get all hole scores for this round
    const holeScores = await ctx.prisma.holeScore.findMany({
      where: { roundId },
      select: { score: true },
    });

    // Calculate total score
    const totalScore = holeScores.length > 0 
      ? holeScores.reduce((sum: number, hole: { score: number }) => sum + hole.score, 0)
      : null;

    // Update the round with the new total score
    await ctx.prisma.round.update({
      where: { id: roundId },
      data: { score: totalScore },
    });
  } catch (error) {
    console.error('Error updating round total score:', error);
    // Don't throw here as this is a helper function
  }
}
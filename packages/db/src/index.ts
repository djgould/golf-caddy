// @repo/db - Database client and schema for Golf Caddy
import { PrismaClient } from '@prisma/client';
import type { User, Course, Round, Shot } from '@prisma/client';

export const DBVersion = '0.0.0';

// Create a singleton instance of PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Export all Prisma types
export * from '@prisma/client';
export type { Prisma } from '@prisma/client';

// Export specific model types for convenience
export type { User, Course, Hole, Round, Shot } from '@prisma/client';

// Export utility types
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateCourseInput = Omit<Course, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateRoundInput = Omit<Round, 'id' | 'createdAt' | 'updatedAt' | 'score'>;
export type CreateShotInput = Omit<Shot, 'id' | 'createdAt'>;

// Export spatial query helpers
export * from './spatial-helpers';

// Export generated Zod schemas (avoiding conflicts with Prisma types)
export {
  RoundUpdateInputSchema,
  RoundUncheckedUpdateInputSchema,
  RoundCreateInputSchema,
  RoundUncheckedCreateInputSchema,
  HoleScoreCreateInputSchema,
  HoleScoreUncheckedCreateInputSchema,
  HoleScoreUpdateInputSchema,
  HoleScoreUncheckedUpdateInputSchema,
  UserCreateInputSchema,
  CourseCreateInputSchema,
  ShotCreateInputSchema,
  ShotUpdateInputSchema,
} from './generated/zod';

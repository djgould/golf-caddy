import { initTRPC, TRPCError } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { prisma } from '@repo/db';
import { extractTokenFromHeader, authenticateUser, type AuthUser } from './auth';

// Enhanced context type with user authentication
export interface Context {
  prisma: typeof prisma;
  req: CreateFastifyContextOptions['req'];
  res: CreateFastifyContextOptions['res'];
  user: AuthUser | null;
}

// Create enhanced context function for tRPC
export async function createContext({ req, res }: CreateFastifyContextOptions): Promise<Context> {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  let user: AuthUser | null = null;

  // If token exists, try to authenticate user
  if (token) {
    try {
      user = await authenticateUser(token);
    } catch (error) {
      // For public endpoints, we don't throw here - just set user to null
      // Protected procedures will handle the authentication requirement
      user = null;
    }
  }

  return {
    prisma,
    req,
    res,
    user,
  };
}

// Initialize tRPC with enhanced context and transformer
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

// Create router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Enhanced auth middleware with proper error handling
const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message:
        'Authentication required. Please provide a valid JWT token in the Authorization header.',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Now guaranteed to be non-null
    },
  });
});

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(authMiddleware);

// Middleware for database connection health check
const dbHealthMiddleware = t.middleware(async ({ ctx, next }) => {
  try {
    // Quick database health check
    await ctx.prisma.$queryRaw`SELECT 1`;
    return next();
  } catch (error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database connection error',
      cause: error,
    });
  }
});

// Procedure with database health check
export const dbProcedure = t.procedure.use(dbHealthMiddleware);
export const protectedDbProcedure = t.procedure.use(dbHealthMiddleware).use(authMiddleware);

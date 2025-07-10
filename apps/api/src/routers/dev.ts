import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { generateJWT } from '../auth.js';
import { serverConfig } from '../config.js';

// Only enable in development
const isDev = serverConfig.nodeEnv === 'development';

export const devRouter = router({
  // Create a development user and return a JWT token
  createDevUser: publicProcedure
    .input(z.object({
      email: z.string().email().default('dev@golfcaddy.com'),
      name: z.string().default('Development User'),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!isDev) {
        throw new Error('Development endpoints only available in development mode');
      }

      try {
        // Check if dev user already exists
        let user = await ctx.prisma.user.findUnique({
          where: { email: input.email },
        });

        // Create dev user if it doesn't exist
        if (!user) {
          user = await ctx.prisma.user.create({
            data: {
              email: input.email,
              name: input.name,
              // Add any other required fields
            },
          });
          console.log('🧪 Created development user:', user.email);
        } else {
          console.log('🧪 Using existing development user:', user.email);
        }

        // Generate JWT token
        const token = generateJWT({
          userId: user.id,
          email: user.email,
        });

        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          token,
        };
      } catch (error) {
        console.error('Failed to create dev user:', error);
        throw new Error('Failed to create development user');
      }
    }),

  // Health check for development
  ping: publicProcedure.query(() => {
    if (!isDev) {
      throw new Error('Development endpoints only available in development mode');
    }
    return { message: 'Development API is working', timestamp: new Date().toISOString() };
  }),
});
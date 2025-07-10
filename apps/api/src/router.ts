import { router, publicProcedure } from './trpc.js';
import { courseRouter } from './routers/course.js';
import { roundRouter } from './routers/round.js';
import { shotRouter } from './routers/shot.js';
import { holeScoreRouter } from './routers/holeScore.js';
import { devRouter } from './routers/dev.js';

// Main application router - expanded with course, round, and shot routers
export const appRouter = router({
  // Health check procedure
  health: router({
    check: publicProcedure.query(async () => {
      return { message: 'API is healthy', timestamp: new Date().toISOString() };
    }),
  }),

  // Course-related operations
  course: courseRouter,

  // Round-related operations (golf rounds)
  round: roundRouter,

  // Shot-related operations (individual shots)
  shot: shotRouter,

  // Hole score operations (scoring per hole)
  holeScore: holeScoreRouter,

  // Development utilities (only in development)
  dev: devRouter,
});

export type AppRouter = typeof appRouter;

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
# Install dependencies (run at root)
pnpm install

# Run development servers (API only, mobile requires separate command)
pnpm dev

# Mobile app development
cd apps/mobile && pnpm start

# Run tests
pnpm test

# Lint and typecheck
pnpm lint
pnpm typecheck

# Format code
pnpm format
```

### Mobile App Specific
```bash
cd apps/mobile
pnpm ios      # Run on iOS simulator
pnpm android  # Run on Android emulator
pnpm start    # Start Expo dev server
```

### API Specific
```bash
cd apps/api
pnpm dev    # Development with hot reload
pnpm build  # Build for production
pnpm start  # Run production server
```

### Database
```bash
cd packages/db
pnpm db:push    # Push schema changes to database
pnpm db:migrate # Run migrations
pnpm db:studio  # Open Prisma Studio
```

## Architecture Overview

This is a Turborepo monorepo with three main applications:

1. **Mobile App** (`apps/mobile`): Expo React Native app using:
   - Expo Router for file-based navigation
   - Mapbox for satellite views and GPS
   - tRPC client for type-safe API calls
   - Zustand for local state, TanStack Query for server state
   - NativeWind (Tailwind CSS) for styling

2. **API Server** (`apps/api`): Fastify + tRPC backend with:
   - Prisma ORM with PostgreSQL/PostGIS
   - Supabase for auth and database
   - JWT-based authentication
   - Type-safe procedures for courses, rounds, and shots

3. **Shared Packages** (`packages/*`):
   - `@repo/db`: Prisma schema and client
   - `@repo/trpc`: Shared tRPC types
   - `@repo/utils`: Business logic and shared utilities
   - `@repo/offline`: Offline sync logic
   - `@repo/ai`: AI integration (future)

## Key Implementation Details

### Mobile App Structure
- **Navigation**: File-based routing in `apps/mobile/app/`
  - `(tabs)/` contains main tab screens
  - `(auth)/` contains authentication screens
- **Components**: Located in `apps/mobile/components/`
  - `ui/` for reusable UI components
  - `golf/` for golf-specific components (ScoreCard, ShotTracker, etc.)
- **Services**: In `apps/mobile/src/services/`
  - `locationService.ts` handles GPS tracking
  - `offlineDownloadService.ts` manages offline course data

### API Structure
- **Routers**: Defined in `apps/api/src/routers/`
  - `course.ts`: Course data and search
  - `round.ts`: Round management
  - `shot.ts`: Shot tracking
- **Middleware**: Auth validation in `apps/api/src/middleware.ts`
- **Context**: User context passed to all procedures

### Database Schema
Key models in `packages/db/prisma/schema.prisma`:
- `User`: Auth profiles
- `Course`: Golf courses with GPS bounds
- `Hole`: Individual holes with tee/green positions
- `Round`: User rounds with scores
- `Shot`: Individual shots with GPS data and outcomes

### State Management
- **Server State**: TanStack Query with tRPC hooks
- **Local State**: Zustand stores in `apps/mobile/src/stores/`
- **Offline**: Custom sync logic for course data

## Environment Setup

Required environment variables:
- `MAPBOX_PUBLIC_TOKEN`: For map display
- `MAPBOX_SECRET_TOKEN`: For API operations
- `DATABASE_URL`: PostgreSQL connection string
- `SUPABASE_URL` and `SUPABASE_ANON_KEY`: For auth
- `JWT_SECRET`: For token signing

## Important Notes

1. **Mapbox Setup**: See `MAPBOX_SETUP.md` for detailed token configuration
2. **PostGIS Required**: Database must have PostGIS extension for GPS queries
3. **Offline Mode**: Courses can be downloaded for offline use via `OfflineDownloadButton`
4. **Type Safety**: All API calls are type-safe end-to-end via tRPC
5. **Performance**: Map interactions optimized for 60fps on mobile devices
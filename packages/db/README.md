# @repo/db - Golf Caddy Database

This package contains the Prisma schema, migrations, and database client for the Golf Caddy
application.

## Features

- **PostgreSQL with PostGIS** - Spatial data support for GPS tracking
- **Prisma ORM** - Type-safe database client
- **Row Level Security** - Multi-tenant data isolation
- **Seed Data** - Realistic golf course data including Pebble Beach

## Database Schema

### Models

- **User** - User profiles with handicap tracking
- **Course** - Golf courses with GPS location and boundaries
- **Hole** - Individual holes with tee/green positions
- **Round** - Golf rounds with weather conditions
- **Shot** - Shot tracking with GPS positions and club data

## Setup

### Prerequisites

1. Supabase project with PostGIS enabled
2. Database connection string in `.env`:
   ```
   DATABASE_URL="postgresql://..."
   ```

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

## Development

### Available Scripts

- `pnpm build` - Build the package
- `pnpm dev` - Watch mode for development
- `pnpm db:push` - Push schema changes (dev only)
- `pnpm db:migrate` - Run migrations
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed the database

### Row Level Security

The database includes RLS policies for data isolation:

1. **Development Mode** (current):

   - Permissive policies for development
   - See `prisma/migrations/setup-rls-dev.sql`

2. **Production Mode** (future):
   - User-based isolation using Supabase Auth
   - See `prisma/migrations/setup-rls.sql`

To apply RLS policies:

```sql
-- In Supabase SQL Editor
-- For development:
\i prisma/migrations/setup-rls-dev.sql

-- For production (when auth is ready):
\i prisma/migrations/setup-rls.sql
```

## Usage in Applications

```typescript
import { prisma, type User, type Course } from '@repo/db';

// Get all courses
const courses = await prisma.course.findMany({
  include: { holes: true },
});

// Create a new round
const round = await prisma.round.create({
  data: {
    userId: 'user-id',
    courseId: 'course-id',
    startTime: new Date(),
  },
});

// Track a shot with GPS
const shot = await prisma.shot.create({
  data: {
    roundId: round.id,
    userId: 'user-id',
    holeId: 'hole-id',
    shotNumber: 1,
    club: 'Driver',
    distance: 250,
    startLocation: {
      type: 'Point',
      coordinates: [-121.9508, 36.5686], // [lng, lat]
    },
    endLocation: {
      type: 'Point',
      coordinates: [-121.9485, 36.5675],
    },
    result: 'fairway',
  },
});
```

## Spatial Queries

PostGIS enables powerful spatial queries:

```typescript
// Find nearest courses to a location
const nearestCourses = (await prisma.$queryRaw`
  SELECT 
    name,
    ST_Distance(
      location::geography,
      ST_MakePoint($1, $2)::geography
    ) / 1609.34 as distance_miles
  FROM courses
  ORDER BY location <-> ST_MakePoint($1, $2)::geography
  LIMIT 10
`) as any;

// Check if a shot landed in a hazard (future feature)
const inHazard = (await prisma.$queryRaw`
  SELECT ST_Contains(
    hazard_polygon::geometry,
    ST_MakePoint($1, $2)::geometry
  ) as in_hazard
`) as any;
```

## Seed Data

The seed script includes:

- 3 sample users with varying handicaps
- Pebble Beach Golf Links with all 18 holes
- Accurate GPS coordinates for tees and greens
- Sample round with shot tracking data
- Torrey Pines South Course

Run `pnpm db:seed` to populate the database.

## Type Exports

The package exports all Prisma types and utility types:

```typescript
// Model types
export type { User, Course, Hole, Round, Shot } from '@prisma/client';

// Input types for creating records
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateCourseInput = Omit<Course, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateRoundInput = Omit<Round, 'id' | 'createdAt' | 'updatedAt' | 'score'>;
export type CreateShotInput = Omit<Shot, 'id' | 'createdAt'>;
```

## Future Enhancements

- [ ] Hazard polygons for water, bunkers, OB
- [ ] Elevation data for courses
- [ ] Shot shape curves (draw/fade)
- [ ] Green contour data
- [ ] Historical weather data integration

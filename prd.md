# Golf Companion App - Complete PRD & Technical Specification

## Table of Contents

1. [Introduction](#1-introduction)
2. [Target Audience](#2-target-audience)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [User Interface and Experience](#5-user-interface-and-experience)
6. [Technical Architecture](#6-technical-architecture)
7. [Implementation Roadmap](#7-implementation-roadmap)
8. [Data Models](#8-data-models)
9. [API Specification](#9-api-specification)
10. [Testing Strategy](#10-testing-strategy)

---

## 1. Introduction

### 1.1 Purpose

The **Golf Companion App** is a mobile application crafted to empower golfers with a simple,
intuitive tool to track their game and enhance their on-course performance. Inspired by apps like 18
Birdies but reimagined with a focus on simplicity, this app delivers **core functionality** without
the clutter of excessive features. Its mission is to solve a specific problem: helping golfers
navigate courses and plan shots efficiently, eliminating distractions and enabling them to focus on
enjoying and improving their game.

**Why It's Valuable:**  
Golfers often face challenges in quickly accessing reliable course information and planning shots
under time pressure. The Golf Companion App addresses this by offering precise yardages, clear
satellite imagery, and straightforward shot planning tools—all wrapped in a streamlined experience
that feels effortless and intuitive. By prioritizing simplicity and utility, it stands out in a
market where competing apps can overwhelm users with complexity.

### 1.2 Scope

**Included in This Version:**

- Satellite imagery of golf courses with tee and hole markers
- Real-time yardage calculations for shot planning
- Basic shot tracking (e.g., club used, shot outcome)
- Core navigation tools for course orientation
- Offline mode for downloaded courses
- AI-powered shot recommendations (basic)

**Excluded from This Version:**

- Social features (e.g., leaderboards, friend challenges)
- Advanced statistics or long-term performance analytics
- Hardware integrations (e.g., wearables, rangefinders)
- Monetization features (e.g., subscriptions, in-app purchases)
- Course booking or tee time management

This initial release focuses on delivering a minimum viable product (MVP) that nails the essentials,
with room to expand based on user feedback and market demand.

---

## 2. Target Audience

The Golf Companion App targets **recreational and amateur golfers** who play regularly but aren't
professionals. These users are characterized by:

- **Demographics**: Ages 25-55, mixed gender, moderate to high income (golf enthusiasts often invest
  in the sport)
- **Behaviors**: Play golf at least once a month, enjoy the game socially or competitively, and use
  smartphones frequently
- **Preferences**: Favor tools that are easy to use, reliable, and don't require steep learning
  curves or extra equipment

**Pain Points:**

- Struggling to gauge distances accurately without cumbersome tools
- Feeling overwhelmed by feature-heavy golf apps that dilute focus
- Needing a quick, dependable way to orient themselves on unfamiliar courses
- Poor connectivity on golf courses limiting app functionality

**Unique Needs Addressed:**

- A distraction-free interface that prioritizes critical information (e.g., yardages, hole
  locations)
- Offline functionality for use on remote courses with spotty connectivity
- A lightweight tool that fits seamlessly into their round without disrupting play
- Battery-efficient operation for 4+ hour rounds

---

## 3. Functional Requirements

### 3.1 Feature: Satellite Course View

- **Priority**: Must have
- **Description**: Displays a satellite image of the golf course, overlaid with markers for tee
  boxes and hole locations
- **User Benefit**: Offers a clear visual of the course layout, aiding navigation and strategic
  planning
- **Functionality**: Users can zoom in/out and pan across the map. Tee and hole markers are
  color-coded (e.g., blue for tees, red for holes)
- **Technical Implementation**: Mapbox SDK with vector tiles for smooth performance
- **Dependencies**: Requires mapping API (Mapbox), course data in database
- **Acceptance Criteria**:
  - Satellite view renders within 2 seconds on a 4G connection
  - Markers align within 1 meter of real-world positions
  - Smooth 60fps pan/zoom on modern devices

### 3.2 Feature: Yardage Calculation

- **Priority**: Must have
- **Description**: Calculates and displays distances from the user's location to the hole or any
  tapped point on the course
- **User Benefit**: Provides precise measurements for confident shot planning
- **Functionality**: Leverages GPS to pinpoint the user's position and computes yardages to selected
  targets in real time
- **Technical Implementation**: Expo Location API + PostGIS spatial queries
- **Dependencies**: GPS access, satellite course view, course geometry data
- **Acceptance Criteria**:
  - Yardages update within 1 second of selection
  - Accuracy is within ±1 yard
  - Works offline with cached course data

### 3.3 Feature: Shot Planning Tool

- **Priority**: Should have
- **Description**: Enables users to input club distances and visualize where shots might land on the
  course map
- **User Benefit**: Helps golfers plan shots tailored to their abilities, reducing guesswork
- **Functionality**: Users enter average distances for their clubs; the app overlays a projected
  shot arc on the satellite view
- **Technical Implementation**: Client-side calculations with visual overlay on Mapbox
- **Dependencies**: Satellite view, yardage calculation, user profile data
- **Acceptance Criteria**:
  - Shot projections display within 2 seconds of input
  - Users can tweak club selection with real-time updates to the arc
  - Visualizations account for elevation changes (future enhancement)

### 3.4 Feature: Simple Shot Tracking

- **Priority**: Should have
- **Description**: Allows users to log shots with minimal effort, recording the club used and shot
  outcome
- **User Benefit**: Offers a lightweight way to track a round for later reflection
- **Functionality**: Post-shot, users select from a dropdown (clubs) and buttons (outcomes: fairway,
  green, rough, hazard)
- **Technical Implementation**: Local storage with background sync via tRPC
- **Dependencies**: User authentication, offline queue system
- **Acceptance Criteria**:
  - Logging a shot takes ≤5 seconds
  - Data persists offline and syncs when connected
  - Users can view a round summary on demand

### 3.5 Feature: Offline Mode

- **Priority**: Must have
- **Description**: Permits users to download course data for use without an internet connection
- **User Benefit**: Ensures functionality on remote courses with poor signal
- **Functionality**: Users pre-select courses to download; data includes maps and key markers
- **Technical Implementation**: Mapbox offline regions + AsyncStorage for course data
- **Dependencies**: Local storage, map tile caching, background downloads
- **Acceptance Criteria**:
  - Offline mode works flawlessly post-download
  - Downloads complete within 30 seconds per course on WiFi
  - Offline data expires after 30 days (configurable)

### 3.6 Feature: AI-Powered Course Strategy

- **Priority**: Could have
- **Description**: Uses AI to recommend club choices and shot strategies based on course layout and
  user data
- **User Benefit**: Delivers personalized, smart insights to elevate gameplay
- **Functionality**: Analyzes shot history and hole specifics (e.g., hazards) to suggest optimal
  plays
- **Technical Implementation**: OpenAI API integration via tRPC endpoint
- **Dependencies**: Shot tracking data, AI service package, user preferences
- **Acceptance Criteria**:
  - Suggestions generate within 3 seconds
  - Recommendations reflect at least 5 prior rounds when available
  - Graceful fallback when offline

---

## 4. Non-Functional Requirements

### 4.1 Performance

- Satellite view loads in ≤2 seconds on 4G
- Yardage calculations complete in ≤1 second
- 60fps pan/zoom on devices from 2020+
- App launch to usable state in ≤3 seconds

### 4.2 Security

- User data encrypted with AES-256
- Secure token storage using Expo SecureStore
- Row-level security in Supabase
- No data shared without explicit consent

### 4.3 Usability

- 90% of first-time users complete onboarding unassisted
- Core features accessible within 2 taps
- Meets WCAG 2.1 accessibility guidelines
- Clear visual hierarchy with 16px+ fonts

### 4.4 Reliability

- 99.9% uptime for online features
- Offline mode operates without crashes
- Graceful degradation when features unavailable
- Automatic error reporting with Sentry

### 4.5 Scalability

- Supports 100,000 concurrent users
- Database queries optimized for <100ms response
- CDN distribution for map tiles
- Horizontal scaling ready architecture

### 4.6 Battery & Resource Usage

- ≤25% battery drain over 4-hour round
- Memory usage under 200MB
- Efficient GPS polling (1Hz in play, 0.1Hz idle)
- Background location updates only when tracking active

---

## 5. User Interface and Experience

### 5.1 Design Principles

- **Simplicity**: Clean layouts with only essential elements visible
- **Intuitiveness**: Large, tappable buttons (min 44px) and clear visual hierarchy
- **Aesthetic**: Green-and-white palette evoking golf courses, with modern, calming vibe
- **Accessibility**: High contrast mode, haptic feedback, voice-over support

### 5.2 Navigation Flow

```
Home Screen
├── Course Selection
│   ├── Nearby Courses (GPS-based)
│   ├── Search Courses
│   └── Downloaded Courses
├── Profile
│   ├── Club Distances
│   └── Preferences
└── Active Round
    ├── Satellite Map View
    ├── Shot Tracking
    └── Round Summary
```

### 5.3 Screen Descriptions

#### 5.3.1 Course Selection Screen

- **Purpose**: Lets users pick or download their course
- **Elements**:
  - Search bar (top, 80% width, 44px height)
  - List of nearby courses (GPS-based, card layout)
  - "Download" icon (cloud symbol, 30px)
  - Distance indicator for each course
- **Interactions**: Tap to select; long-press to download
- **Navigation**: Leads to Satellite Map Screen

#### 5.3.2 Satellite Map Screen

- **Purpose**: Core hub for viewing the course and planning shots
- **Elements**:
  - Satellite image (full-screen, Mapbox)
  - Tee (blue) and hole (red) markers
  - Current location indicator (pulsing blue dot)
  - Yardage display (top-right, 40px font)
  - "Plan Shot" button (bottom, green, 50px height)
  - Floating "Log Shot" button (bottom-right, 60px circle)
  - Hole info bar (top, shows par, yardage, hole number)
- **Interactions**:
  - Tap for yardages
  - Pinch to zoom
  - Swipe to activate shot planning
  - Long-press to set custom target
- **Navigation**: Links to Shot Logging Screen

#### 5.3.3 Shot Logging Screen

- **Purpose**: Quick shot entry during play
- **Elements**:
  - Club dropdown (full width, 50px height)
  - Outcome buttons (grid layout, 60px squares)
  - "Save" button (green, full width, 50px)
  - "Cancel" link (top-right)
- **Interactions**: Select options, tap "Save"
- **Navigation**: Returns to Satellite Map Screen

---

## 6. Technical Architecture

### 6.1 Technology Stack

| Layer                | Tool/Service             | Rationale                                        |
| -------------------- | ------------------------ | ------------------------------------------------ |
| **Monorepo**         | Turborepo + pnpm         | Zero-config caching, parallel builds, great DX   |
| **Mobile App**       | Expo (React Native)      | OTA updates, built-in APIs, AI-friendly patterns |
| **Maps**             | Mapbox SDK               | Offline maps, vector tiles, cost-effective       |
| **Backend API**      | tRPC + Fastify           | End-to-end type safety, perfect for AI tools     |
| **Database**         | Supabase (Postgres)      | Managed infrastructure, PostGIS support          |
| **ORM**              | Prisma                   | Type-safe queries, migration system              |
| **State Management** | TanStack Query + Zustand | Server state + local state separation            |
| **AI Integration**   | OpenAI SDK               | Shot recommendations, strategy suggestions       |
| **Authentication**   | Supabase Auth            | Managed auth with RLS                            |
| **File Storage**     | Supabase Storage         | Course assets, user data                         |
| **Deployment**       | Expo EAS + Vercel        | Automated builds and deployments                 |

### 6.2 Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐
│   Mobile App    │     │   Web Admin     │
│   (Expo RN)     │     │   (Next.js)     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────┴──────┐
              │  tRPC API   │
              │  (Fastify)  │
              └──────┬──────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────┴────┐ ┌────┴────┐ ┌───┴────┐
    │ Prisma  │ │Supabase │ │OpenAI  │
    │   ORM   │ │  Auth   │ │  API   │
    └────┬────┘ └─────────┘ └────────┘
         │
    ┌────┴────┐
    │Postgres │
    │   +     │
    │ PostGIS │
    └─────────┘
```

### 6.3 Monorepo Structure

```
golf-companion/
├── apps/
│   ├── mobile/          # Expo React Native app
│   ├── api/            # Fastify + tRPC server
│   └── web/            # Next.js admin (future)
├── packages/
│   ├── ui/             # Shared RN components
│   ├── utils/          # Business logic (yardage math, etc)
│   ├── db/             # Prisma client & schema
│   ├── trpc/           # Shared tRPC types & client
│   ├── ai/             # AI integration & prompts
│   └── offline/        # Offline sync logic
├── prisma/
│   └── schema.prisma   # Database schema
├── turbo.json          # Turborepo config
├── pnpm-workspace.yaml # Workspace config
└── .github/
    └── workflows/      # CI/CD pipelines
```

### 6.4 Key Design Decisions

1. **Offline-First Architecture**: All features work offline with background sync
2. **Type Safety**: End-to-end types from database to UI
3. **Modular Packages**: Clean separation of concerns
4. **Progressive Enhancement**: AI features enhance but don't gate core functionality
5. **Battery Optimization**: Smart GPS polling and efficient rendering

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Week 1)

- [ ] Set up monorepo with Turborepo
- [ ] Initialize Expo app with TypeScript
- [ ] Configure Mapbox with basic map view
- [ ] Set up Supabase project
- [ ] Create Prisma schema for courses/holes
- [ ] Implement basic tRPC server

### Phase 2: Core Features (Week 2)

- [ ] Course data model and seeding
- [ ] GPS location tracking
- [ ] Yardage calculation implementation
- [ ] Offline map regions
- [ ] Basic UI components in packages/ui

### Phase 3: Gameplay (Week 3)

- [ ] Shot tracking functionality
- [ ] Round management
- [ ] Shot planning visualization
- [ ] Local storage for offline data
- [ ] Sync queue implementation

### Phase 4: Polish & AI (Week 4)

- [ ] AI strategy recommendations
- [ ] Performance optimizations
- [ ] Error handling & recovery
- [ ] Analytics integration
- [ ] Beta testing setup

### Phase 5: Launch Prep (Week 5)

- [ ] App store assets
- [ ] Performance testing
- [ ] Security audit
- [ ] Documentation
- [ ] CI/CD finalization

---

## 8. Data Models

### 8.1 Prisma Schema

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  clubDistances Json?     // { driver: 250, "7-iron": 150, ... }
  rounds        Round[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Course {
  id          String    @id @default(cuid())
  name        String
  location    Json      // PostGIS Point
  bounds      Json      // PostGIS Polygon
  holes       Hole[]
  rounds      Round[]
  imageUrl    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([location])
}

model Hole {
  id            String    @id @default(cuid())
  courseId      String
  course        Course    @relation(fields: [courseId], references: [id])
  holeNumber    Int
  par           Int
  yardage       Int
  teeLocation   Json      // PostGIS Point
  greenLocation Json      // PostGIS Point
  hazards       Json[]    // Array of PostGIS geometries
  shots         Shot[]

  @@unique([courseId, holeNumber])
}

model Round {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  courseId  String
  course    Course    @relation(fields: [courseId], references: [id])
  shots     Shot[]
  startedAt DateTime  @default(now())
  endedAt   DateTime?
  score     Int?

  @@index([userId, startedAt])
}

model Shot {
  id        String    @id @default(cuid())
  roundId   String
  round     Round     @relation(fields: [roundId], references: [id])
  holeId    String
  hole      Hole      @relation(fields: [holeId], references: [id])
  club      String    // driver, 3-wood, 5-iron, etc.
  outcome   String    // fairway, green, rough, bunker, water
  distance  Float?
  location  Json?     // PostGIS Point
  createdAt DateTime  @default(now())
  synced    Boolean   @default(false)

  @@index([roundId, createdAt])
}
```

### 8.2 Type Definitions

```typescript
// packages/utils/types.ts

export type GolfClub =
  | 'driver'
  | '3-wood'
  | '5-wood'
  | '2-iron'
  | '3-iron'
  | '4-iron'
  | '5-iron'
  | '6-iron'
  | '7-iron'
  | '8-iron'
  | '9-iron'
  | 'pitching-wedge'
  | 'gap-wedge'
  | 'sand-wedge'
  | 'lob-wedge'
  | 'putter';

export type ShotOutcome = 'fairway' | 'green' | 'rough' | 'bunker' | 'water' | 'out-of-bounds';

export interface ClubDistances {
  [club: string]: number;
}

export interface Position {
  latitude: number;
  longitude: number;
}

export interface YardageResult {
  toHole: number;
  toFront: number;
  toBack: number;
  toTarget?: number;
}
```

---

## 9. API Specification

### 9.1 tRPC Router Structure

```typescript
// packages/trpc/server.ts

export const appRouter = router({
  // Course endpoints
  course: router({
    list: publicProcedure.query(({ ctx }) => ctx.prisma.course.findMany()),

    getById: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) =>
      ctx.prisma.course.findUnique({
        where: { id: input.id },
        include: { holes: true },
      })
    ),

    getNearby: publicProcedure
      .input(
        z.object({
          lat: z.number(),
          lng: z.number(),
          radiusKm: z.number().default(50),
        })
      )
      .query(async ({ ctx, input }) => {
        // PostGIS query for nearby courses
      }),

    downloadData: publicProcedure
      .input(z.object({ courseId: z.string() }))
      .query(async ({ ctx, input }) => {
        // Return course data optimized for offline storage
      }),
  }),

  // Round management
  round: router({
    start: protectedProcedure.input(z.object({ courseId: z.string() })).mutation(({ ctx, input }) =>
      ctx.prisma.round.create({
        data: {
          userId: ctx.user.id,
          courseId: input.courseId,
        },
      })
    ),

    addShot: protectedProcedure
      .input(
        z.object({
          roundId: z.string(),
          holeId: z.string(),
          club: z.string(),
          outcome: z.string(),
          location: z
            .object({
              latitude: z.number(),
              longitude: z.number(),
            })
            .optional(),
        })
      )
      .mutation(({ ctx, input }) => ctx.prisma.shot.create({ data: input })),
  }),

  // AI features
  ai: router({
    getShotRecommendation: protectedProcedure
      .input(
        z.object({
          holeId: z.string(),
          position: z.object({
            latitude: z.number(),
            longitude: z.number(),
          }),
          wind: z
            .object({
              speed: z.number(),
              direction: z.number(),
            })
            .optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        // Call OpenAI with course data and user history
      }),
  }),
});
```

### 9.2 Offline Sync Protocol

```typescript
// packages/offline/sync.ts

export class SyncManager {
  async syncShots() {
    const unsyncedShots = await getUnsyncedShots();

    for (const shot of unsyncedShots) {
      try {
        await trpc.round.addShot.mutate(shot);
        await markShotAsSynced(shot.id);
      } catch (error) {
        if (isNetworkError(error)) {
          break; // Stop trying, we're offline
        }
        // Log error for this specific shot
      }
    }
  }

  async downloadCourseForOffline(courseId: string) {
    // 1. Download course data
    const courseData = await trpc.course.downloadData.query({ courseId });

    // 2. Download map tiles
    await MapboxGL.offlineManager.createPack({
      name: courseId,
      bounds: courseData.bounds,
      minZoom: 14,
      maxZoom: 20,
    });

    // 3. Store in AsyncStorage
    await AsyncStorage.setItem(`course:${courseId}`, JSON.stringify(courseData));
  }
}
```

---

## 10. Testing Strategy

### 10.1 Unit Tests

```typescript
// packages/utils/__tests__/yardage.test.ts

describe('Yardage Calculations', () => {
  it('calculates distance between two points', () => {
    const from = { latitude: 37.7749, longitude: -122.4194 };
    const to = { latitude: 37.7751, longitude: -122.4196 };

    const distance = calculateDistance(from, to);

    expect(distance).toBeCloseTo(31.4, 1); // ~31.4 yards
  });

  it('handles elevation changes', () => {
    // Test yardage with elevation
  });
});
```

### 10.2 Integration Tests

```typescript
// apps/api/__tests__/course.test.ts

describe('Course API', () => {
  it('returns nearby courses', async () => {
    const result = await caller.course.getNearby({
      lat: 37.7749,
      lng: -122.4194,
      radiusKm: 10,
    });

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty('distance');
  });
});
```

### 10.3 E2E Tests (Detox)

```typescript
// apps/mobile/e2e/gameplay.test.ts

describe('Gameplay Flow', () => {
  it('tracks a shot', async () => {
    await element(by.id('course-select')).tap();
    await element(by.text('Pebble Beach')).tap();
    await element(by.id('start-round')).tap();

    // Verify map loads
    await expect(element(by.id('course-map'))).toBeVisible();

    // Log a shot
    await element(by.id('log-shot-fab')).tap();
    await element(by.id('club-select')).tap();
    await element(by.text('Driver')).tap();
    await element(by.text('Fairway')).tap();
    await element(by.id('save-shot')).tap();

    // Verify shot saved
    await expect(element(by.text('Shot saved'))).toBeVisible();
  });
});
```

### 10.4 Performance Testing

- App launch time < 3 seconds
- Map pan/zoom at 60fps
- Memory usage < 200MB during round
- Battery drain < 25% over 4 hours
- Offline sync completes < 30 seconds

---

## Appendix A: Development Setup

```bash
# Clone and install
git clone https://github.com/your-org/golf-companion
cd golf-companion
pnpm install

# Environment setup
cp .env.example .env
# Add your Supabase URL, Mapbox token, etc.

# Database setup
pnpm db:push
pnpm db:seed

# Start development
pnpm dev

# Run tests
pnpm test
pnpm test:e2e
```

## Appendix B: Deployment

```bash
# Build all packages
pnpm build

# Deploy API to Vercel
cd apps/api && vercel

# Build mobile app
cd apps/mobile && eas build

# Submit to stores
eas submit
```

## Appendix C: API Keys & Services

- **Mapbox**: For satellite imagery and offline maps
- **Supabase**: Database, auth, and storage
- **OpenAI**: AI-powered recommendations
- **Sentry**: Error tracking
- **Expo**: Build and update infrastructure
- **Vercel**: API hosting

---

This document serves as the single source of truth for the Golf Companion App development. It should
be updated as the project evolves and new requirements emerge.

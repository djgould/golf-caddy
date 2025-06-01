/**
 * Golf Caddy API Input Validation
 *
 * This module provides comprehensive Zod schemas for input validation
 * across all Golf Caddy API endpoints with enhanced error messages.
 */

import { z } from 'zod';

// Base validation schemas
export const LocationSchema = z.object({
  lat: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90 degrees')
    .max(90, 'Latitude must be between -90 and 90 degrees'),
  lng: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180 degrees')
    .max(180, 'Longitude must be between -180 and 180 degrees'),
});

export const PaginationSchema = z.object({
  limit: z
    .number()
    .int('Limit must be a whole number')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20),
  offset: z
    .number()
    .int('Offset must be a whole number')
    .min(0, 'Offset cannot be negative')
    .default(0),
});

export const UUIDSchema = z.string().uuid('Invalid UUID format');

export const DateRangeSchema = z
  .object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: 'End date must be after start date',
    }
  );

// Golf-specific validation schemas
export const GolfClubSchema = z.enum(
  [
    'driver',
    '3-wood',
    '5-wood',
    '7-wood',
    '1-hybrid',
    '2-hybrid',
    '3-hybrid',
    '4-hybrid',
    '5-hybrid',
    '1-iron',
    '2-iron',
    '3-iron',
    '4-iron',
    '5-iron',
    '6-iron',
    '7-iron',
    '8-iron',
    '9-iron',
    'pitching-wedge',
    'gap-wedge',
    'sand-wedge',
    'lob-wedge',
    'putter',
    'other',
  ],
  {
    errorMap: () => ({ message: 'Invalid golf club selection' }),
  }
);

export const ShotResultSchema = z.enum(
  ['fairway', 'rough', 'bunker', 'water', 'trees', 'green', 'hole', 'out-of-bounds'],
  {
    errorMap: () => ({ message: 'Invalid shot result' }),
  }
);

export const WindDirectionSchema = z.enum(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], {
  errorMap: () => ({ message: 'Invalid wind direction' }),
});

export const ScoreSchema = z
  .number()
  .int('Score must be a whole number')
  .min(18, 'Minimum score is 18')
  .max(200, 'Maximum score is 200');

export const TemperatureSchema = z
  .number()
  .int('Temperature must be a whole number')
  .min(-50, 'Temperature cannot be below -50°F')
  .max(150, 'Temperature cannot exceed 150°F');

export const WindSpeedSchema = z
  .number()
  .int('Wind speed must be a whole number')
  .min(0, 'Wind speed cannot be negative')
  .max(100, 'Wind speed cannot exceed 100 mph');

export const DistanceSchema = z
  .number()
  .min(0, 'Distance cannot be negative')
  .max(500, 'Distance cannot exceed 500 yards');

export const ShotNumberSchema = z
  .number()
  .int('Shot number must be a whole number')
  .min(1, 'Shot number must be at least 1')
  .max(20, 'Shot number cannot exceed 20');

export const HoleNumberSchema = z
  .number()
  .int('Hole number must be a whole number')
  .min(1, 'Hole number must be between 1 and 18')
  .max(18, 'Hole number must be between 1 and 18');

export const ParSchema = z
  .number()
  .int('Par must be a whole number')
  .min(3, 'Par must be between 3 and 6')
  .max(6, 'Par must be between 3 and 6');

export const YardageSchema = z
  .number()
  .int('Yardage must be a whole number')
  .min(50, 'Minimum hole yardage is 50 yards')
  .max(800, 'Maximum hole yardage is 800 yards');

// Course validation schemas
export const CourseSearchSchema = z
  .object({
    query: z
      .string()
      .min(1, 'Search query cannot be empty')
      .max(100, 'Search query cannot exceed 100 characters')
      .optional(),
    state: z.string().length(2, 'State must be a 2-letter code').optional(),
    city: z
      .string()
      .min(1, 'City name cannot be empty')
      .max(50, 'City name cannot exceed 50 characters')
      .optional(),
  })
  .merge(PaginationSchema);

export const NearbyCoursesSchema = LocationSchema.extend({
  radiusMiles: z
    .number()
    .min(0.1, 'Radius must be at least 0.1 miles')
    .max(100, 'Radius cannot exceed 100 miles')
    .default(25),
}).merge(PaginationSchema);

// Round validation schemas
export const CreateRoundSchema = z.object({
  courseId: UUIDSchema,
  startTime: z
    .date()
    .optional()
    .default(() => new Date()),
  weather: z.string().max(100, 'Weather description cannot exceed 100 characters').optional(),
  temperature: TemperatureSchema.optional(),
  windSpeed: WindSpeedSchema.optional(),
  windDirection: WindDirectionSchema.optional(),
});

export const UpdateRoundSchema = z.object({
  id: UUIDSchema,
  endTime: z.date().optional(),
  weather: z.string().max(100, 'Weather description cannot exceed 100 characters').optional(),
  temperature: TemperatureSchema.optional(),
  windSpeed: WindSpeedSchema.optional(),
  windDirection: WindDirectionSchema.optional(),
  score: ScoreSchema.optional(),
});

export const GetRoundsSchema = z
  .object({
    courseId: UUIDSchema.optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).default(0),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: 'End date must be after start date',
    }
  );

// Shot validation schemas
export const CreateShotSchema = z.object({
  roundId: UUIDSchema,
  holeId: UUIDSchema,
  shotNumber: ShotNumberSchema,
  club: GolfClubSchema,
  distance: DistanceSchema.optional(),
  startLocation: LocationSchema,
  endLocation: LocationSchema.optional(),
  result: ShotResultSchema.optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const CreateBatchShotsSchema = z.object({
  roundId: UUIDSchema,
  shots: z
    .array(CreateShotSchema.omit({ roundId: true }))
    .min(1, 'Must provide at least one shot')
    .max(50, 'Cannot create more than 50 shots at once'),
});

export const UpdateShotSchema = z.object({
  id: UUIDSchema,
  club: GolfClubSchema.optional(),
  distance: DistanceSchema.optional(),
  startLocation: LocationSchema.optional(),
  endLocation: LocationSchema.optional(),
  result: ShotResultSchema.optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const GetShotsSchema = z
  .object({
    roundId: UUIDSchema.optional(),
    holeId: UUIDSchema.optional(),
    club: GolfClubSchema.optional(),
    result: ShotResultSchema.optional(),
  })
  .merge(PaginationSchema);

// Statistics validation schemas
export const ShotStatsSchema = z.object({
  roundId: UUIDSchema.optional(),
  holeId: UUIDSchema.optional(),
  club: GolfClubSchema.optional(),
});

export const RoundStatsSchema = z.object({
  id: UUIDSchema,
});

// Validation error formatter
export function formatValidationError(error: z.ZodError) {
  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Input validation failed',
      details: error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
      timestamp: new Date().toISOString(),
    },
  };
}

// Validation middleware factory
export function createValidationMiddleware<T extends z.ZodType>(schema: T) {
  return (input: unknown) => {
    try {
      return schema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(JSON.stringify(formatValidationError(error)));
      }
      throw error;
    }
  };
}

// Pre-built validation functions for common operations
export const validateUUID = createValidationMiddleware(UUIDSchema);
export const validateLocation = createValidationMiddleware(LocationSchema);
export const validatePagination = createValidationMiddleware(PaginationSchema);
export const validateGolfClub = createValidationMiddleware(GolfClubSchema);
export const validateShotResult = createValidationMiddleware(ShotResultSchema);

// Schema registry for documentation generation
export const SCHEMA_REGISTRY = {
  // Base schemas
  Location: LocationSchema,
  Pagination: PaginationSchema,
  UUID: UUIDSchema,
  DateRange: DateRangeSchema,

  // Golf-specific schemas
  GolfClub: GolfClubSchema,
  ShotResult: ShotResultSchema,
  WindDirection: WindDirectionSchema,
  Score: ScoreSchema,
  Temperature: TemperatureSchema,
  WindSpeed: WindSpeedSchema,
  Distance: DistanceSchema,
  ShotNumber: ShotNumberSchema,
  HoleNumber: HoleNumberSchema,
  Par: ParSchema,
  Yardage: YardageSchema,

  // Course schemas
  CourseSearch: CourseSearchSchema,
  NearbyCourses: NearbyCoursesSchema,

  // Round schemas
  CreateRound: CreateRoundSchema,
  UpdateRound: UpdateRoundSchema,
  GetRounds: GetRoundsSchema,

  // Shot schemas
  CreateShot: CreateShotSchema,
  CreateBatchShots: CreateBatchShotsSchema,
  UpdateShot: UpdateShotSchema,
  GetShots: GetShotsSchema,

  // Statistics schemas
  ShotStats: ShotStatsSchema,
  RoundStats: RoundStatsSchema,
} as const;

export type SchemaName = keyof typeof SCHEMA_REGISTRY;

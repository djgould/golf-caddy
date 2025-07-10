import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','name','handicap','profileImage','createdAt','updatedAt']);

export const CourseScalarFieldEnumSchema = z.enum(['id','name','description','location','bounds','address','city','state','country','phone','website','rating','slope','createdAt','updatedAt']);

export const HoleScalarFieldEnumSchema = z.enum(['id','courseId','holeNumber','par','yardage','handicap','teeLocation','greenLocation','description']);

export const RoundScalarFieldEnumSchema = z.enum(['id','userId','courseId','startTime','endTime','weather','temperature','windSpeed','windDirection','score','createdAt','updatedAt']);

export const ShotScalarFieldEnumSchema = z.enum(['id','roundId','userId','holeId','shotNumber','club','distance','startLocation','endLocation','result','notes','createdAt']);

export const HoleScoreScalarFieldEnumSchema = z.enum(['id','roundId','holeId','userId','score','putts','fairway','gir','notes','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string(),
  name: z.string().nullish(),
  handicap: z.number().nullish(),
  profileImage: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// COURSE SCHEMA
/////////////////////////////////////////

export const CourseSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  description: z.string().nullish(),
  location: JsonValueSchema,
  bounds: JsonValueSchema.nullable(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  country: z.string().nullish(),
  phone: z.string().nullish(),
  website: z.string().nullish(),
  rating: z.number().nullish(),
  slope: z.number().int().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Course = z.infer<typeof CourseSchema>

/////////////////////////////////////////
// HOLE SCHEMA
/////////////////////////////////////////

export const HoleSchema = z.object({
  id: z.string().cuid(),
  courseId: z.string(),
  holeNumber: z.number().int(),
  par: z.number().int(),
  yardage: z.number().int(),
  handicap: z.number().int().nullish(),
  teeLocation: JsonValueSchema,
  greenLocation: JsonValueSchema,
  description: z.string().nullish(),
})

export type Hole = z.infer<typeof HoleSchema>

/////////////////////////////////////////
// ROUND SCHEMA
/////////////////////////////////////////

export const RoundSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  courseId: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().nullish(),
  weather: z.string().nullish(),
  temperature: z.number().int().nullish(),
  windSpeed: z.number().int().nullish(),
  windDirection: z.string().nullish(),
  score: z.number().int().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Round = z.infer<typeof RoundSchema>

/////////////////////////////////////////
// SHOT SCHEMA
/////////////////////////////////////////

export const ShotSchema = z.object({
  id: z.string().cuid(),
  roundId: z.string(),
  userId: z.string(),
  holeId: z.string(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().nullish(),
  startLocation: JsonValueSchema,
  endLocation: JsonValueSchema.nullable(),
  result: z.string().nullish(),
  notes: z.string().nullish(),
  createdAt: z.coerce.date(),
})

export type Shot = z.infer<typeof ShotSchema>

/////////////////////////////////////////
// HOLE SCORE SCHEMA
/////////////////////////////////////////

export const HoleScoreSchema = z.object({
  id: z.string().cuid(),
  roundId: z.string(),
  holeId: z.string(),
  userId: z.string(),
  score: z.number().int(),
  putts: z.number().int().nullish(),
  fairway: z.boolean().nullish(),
  gir: z.boolean().nullish(),
  notes: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type HoleScore = z.infer<typeof HoleScoreSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  rounds: z.union([z.boolean(),z.lazy(() => RoundFindManyArgsSchema)]).optional(),
  shots: z.union([z.boolean(),z.lazy(() => ShotFindManyArgsSchema)]).optional(),
  holeScores: z.union([z.boolean(),z.lazy(() => HoleScoreFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  rounds: z.boolean().optional(),
  shots: z.boolean().optional(),
  holeScores: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
  handicap: z.boolean().optional(),
  profileImage: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  rounds: z.union([z.boolean(),z.lazy(() => RoundFindManyArgsSchema)]).optional(),
  shots: z.union([z.boolean(),z.lazy(() => ShotFindManyArgsSchema)]).optional(),
  holeScores: z.union([z.boolean(),z.lazy(() => HoleScoreFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// COURSE
//------------------------------------------------------

export const CourseIncludeSchema: z.ZodType<Prisma.CourseInclude> = z.object({
  holes: z.union([z.boolean(),z.lazy(() => HoleFindManyArgsSchema)]).optional(),
  rounds: z.union([z.boolean(),z.lazy(() => RoundFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CourseCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CourseArgsSchema: z.ZodType<Prisma.CourseDefaultArgs> = z.object({
  select: z.lazy(() => CourseSelectSchema).optional(),
  include: z.lazy(() => CourseIncludeSchema).optional(),
}).strict();

export const CourseCountOutputTypeArgsSchema: z.ZodType<Prisma.CourseCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CourseCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CourseCountOutputTypeSelectSchema: z.ZodType<Prisma.CourseCountOutputTypeSelect> = z.object({
  holes: z.boolean().optional(),
  rounds: z.boolean().optional(),
}).strict();

export const CourseSelectSchema: z.ZodType<Prisma.CourseSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  location: z.boolean().optional(),
  bounds: z.boolean().optional(),
  address: z.boolean().optional(),
  city: z.boolean().optional(),
  state: z.boolean().optional(),
  country: z.boolean().optional(),
  phone: z.boolean().optional(),
  website: z.boolean().optional(),
  rating: z.boolean().optional(),
  slope: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  holes: z.union([z.boolean(),z.lazy(() => HoleFindManyArgsSchema)]).optional(),
  rounds: z.union([z.boolean(),z.lazy(() => RoundFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CourseCountOutputTypeArgsSchema)]).optional(),
}).strict()

// HOLE
//------------------------------------------------------

export const HoleIncludeSchema: z.ZodType<Prisma.HoleInclude> = z.object({
  course: z.union([z.boolean(),z.lazy(() => CourseArgsSchema)]).optional(),
  shots: z.union([z.boolean(),z.lazy(() => ShotFindManyArgsSchema)]).optional(),
  holeScores: z.union([z.boolean(),z.lazy(() => HoleScoreFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => HoleCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const HoleArgsSchema: z.ZodType<Prisma.HoleDefaultArgs> = z.object({
  select: z.lazy(() => HoleSelectSchema).optional(),
  include: z.lazy(() => HoleIncludeSchema).optional(),
}).strict();

export const HoleCountOutputTypeArgsSchema: z.ZodType<Prisma.HoleCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => HoleCountOutputTypeSelectSchema).nullish(),
}).strict();

export const HoleCountOutputTypeSelectSchema: z.ZodType<Prisma.HoleCountOutputTypeSelect> = z.object({
  shots: z.boolean().optional(),
  holeScores: z.boolean().optional(),
}).strict();

export const HoleSelectSchema: z.ZodType<Prisma.HoleSelect> = z.object({
  id: z.boolean().optional(),
  courseId: z.boolean().optional(),
  holeNumber: z.boolean().optional(),
  par: z.boolean().optional(),
  yardage: z.boolean().optional(),
  handicap: z.boolean().optional(),
  teeLocation: z.boolean().optional(),
  greenLocation: z.boolean().optional(),
  description: z.boolean().optional(),
  course: z.union([z.boolean(),z.lazy(() => CourseArgsSchema)]).optional(),
  shots: z.union([z.boolean(),z.lazy(() => ShotFindManyArgsSchema)]).optional(),
  holeScores: z.union([z.boolean(),z.lazy(() => HoleScoreFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => HoleCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ROUND
//------------------------------------------------------

export const RoundIncludeSchema: z.ZodType<Prisma.RoundInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  course: z.union([z.boolean(),z.lazy(() => CourseArgsSchema)]).optional(),
  shots: z.union([z.boolean(),z.lazy(() => ShotFindManyArgsSchema)]).optional(),
  holeScores: z.union([z.boolean(),z.lazy(() => HoleScoreFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoundCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const RoundArgsSchema: z.ZodType<Prisma.RoundDefaultArgs> = z.object({
  select: z.lazy(() => RoundSelectSchema).optional(),
  include: z.lazy(() => RoundIncludeSchema).optional(),
}).strict();

export const RoundCountOutputTypeArgsSchema: z.ZodType<Prisma.RoundCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => RoundCountOutputTypeSelectSchema).nullish(),
}).strict();

export const RoundCountOutputTypeSelectSchema: z.ZodType<Prisma.RoundCountOutputTypeSelect> = z.object({
  shots: z.boolean().optional(),
  holeScores: z.boolean().optional(),
}).strict();

export const RoundSelectSchema: z.ZodType<Prisma.RoundSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  courseId: z.boolean().optional(),
  startTime: z.boolean().optional(),
  endTime: z.boolean().optional(),
  weather: z.boolean().optional(),
  temperature: z.boolean().optional(),
  windSpeed: z.boolean().optional(),
  windDirection: z.boolean().optional(),
  score: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  course: z.union([z.boolean(),z.lazy(() => CourseArgsSchema)]).optional(),
  shots: z.union([z.boolean(),z.lazy(() => ShotFindManyArgsSchema)]).optional(),
  holeScores: z.union([z.boolean(),z.lazy(() => HoleScoreFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoundCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SHOT
//------------------------------------------------------

export const ShotIncludeSchema: z.ZodType<Prisma.ShotInclude> = z.object({
  round: z.union([z.boolean(),z.lazy(() => RoundArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  hole: z.union([z.boolean(),z.lazy(() => HoleArgsSchema)]).optional(),
}).strict()

export const ShotArgsSchema: z.ZodType<Prisma.ShotDefaultArgs> = z.object({
  select: z.lazy(() => ShotSelectSchema).optional(),
  include: z.lazy(() => ShotIncludeSchema).optional(),
}).strict();

export const ShotSelectSchema: z.ZodType<Prisma.ShotSelect> = z.object({
  id: z.boolean().optional(),
  roundId: z.boolean().optional(),
  userId: z.boolean().optional(),
  holeId: z.boolean().optional(),
  shotNumber: z.boolean().optional(),
  club: z.boolean().optional(),
  distance: z.boolean().optional(),
  startLocation: z.boolean().optional(),
  endLocation: z.boolean().optional(),
  result: z.boolean().optional(),
  notes: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  round: z.union([z.boolean(),z.lazy(() => RoundArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  hole: z.union([z.boolean(),z.lazy(() => HoleArgsSchema)]).optional(),
}).strict()

// HOLE SCORE
//------------------------------------------------------

export const HoleScoreIncludeSchema: z.ZodType<Prisma.HoleScoreInclude> = z.object({
  round: z.union([z.boolean(),z.lazy(() => RoundArgsSchema)]).optional(),
  hole: z.union([z.boolean(),z.lazy(() => HoleArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const HoleScoreArgsSchema: z.ZodType<Prisma.HoleScoreDefaultArgs> = z.object({
  select: z.lazy(() => HoleScoreSelectSchema).optional(),
  include: z.lazy(() => HoleScoreIncludeSchema).optional(),
}).strict();

export const HoleScoreSelectSchema: z.ZodType<Prisma.HoleScoreSelect> = z.object({
  id: z.boolean().optional(),
  roundId: z.boolean().optional(),
  holeId: z.boolean().optional(),
  userId: z.boolean().optional(),
  score: z.boolean().optional(),
  putts: z.boolean().optional(),
  fairway: z.boolean().optional(),
  gir: z.boolean().optional(),
  notes: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  round: z.union([z.boolean(),z.lazy(() => RoundArgsSchema)]).optional(),
  hole: z.union([z.boolean(),z.lazy(() => HoleArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  handicap: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  profileImage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  rounds: z.lazy(() => RoundListRelationFilterSchema).optional(),
  shots: z.lazy(() => ShotListRelationFilterSchema).optional(),
  holeScores: z.lazy(() => HoleScoreListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  handicap: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  profileImage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  rounds: z.lazy(() => RoundOrderByRelationAggregateInputSchema).optional(),
  shots: z.lazy(() => ShotOrderByRelationAggregateInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    email: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  handicap: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  profileImage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  rounds: z.lazy(() => RoundListRelationFilterSchema).optional(),
  shots: z.lazy(() => ShotListRelationFilterSchema).optional(),
  holeScores: z.lazy(() => HoleScoreListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  handicap: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  profileImage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  handicap: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  profileImage: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CourseWhereInputSchema: z.ZodType<Prisma.CourseWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CourseWhereInputSchema),z.lazy(() => CourseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CourseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CourseWhereInputSchema),z.lazy(() => CourseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  location: z.lazy(() => JsonFilterSchema).optional(),
  bounds: z.lazy(() => JsonNullableFilterSchema).optional(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  country: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  website: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  rating: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  slope: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  holes: z.lazy(() => HoleListRelationFilterSchema).optional(),
  rounds: z.lazy(() => RoundListRelationFilterSchema).optional()
}).strict();

export const CourseOrderByWithRelationInputSchema: z.ZodType<Prisma.CourseOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  bounds: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  website: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rating: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  slope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  holes: z.lazy(() => HoleOrderByRelationAggregateInputSchema).optional(),
  rounds: z.lazy(() => RoundOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CourseWhereUniqueInputSchema: z.ZodType<Prisma.CourseWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => CourseWhereInputSchema),z.lazy(() => CourseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CourseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CourseWhereInputSchema),z.lazy(() => CourseWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  location: z.lazy(() => JsonFilterSchema).optional(),
  bounds: z.lazy(() => JsonNullableFilterSchema).optional(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  country: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  website: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  rating: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  slope: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  holes: z.lazy(() => HoleListRelationFilterSchema).optional(),
  rounds: z.lazy(() => RoundListRelationFilterSchema).optional()
}).strict());

export const CourseOrderByWithAggregationInputSchema: z.ZodType<Prisma.CourseOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  bounds: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  website: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rating: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  slope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CourseCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CourseAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CourseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CourseMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CourseSumOrderByAggregateInputSchema).optional()
}).strict();

export const CourseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CourseScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CourseScalarWhereWithAggregatesInputSchema),z.lazy(() => CourseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CourseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CourseScalarWhereWithAggregatesInputSchema),z.lazy(() => CourseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  location: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  bounds: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  address: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  state: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  country: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  website: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  rating: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  slope: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const HoleWhereInputSchema: z.ZodType<Prisma.HoleWhereInput> = z.object({
  AND: z.union([ z.lazy(() => HoleWhereInputSchema),z.lazy(() => HoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => HoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HoleWhereInputSchema),z.lazy(() => HoleWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  courseId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  holeNumber: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  par: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  yardage: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  handicap: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  teeLocation: z.lazy(() => JsonFilterSchema).optional(),
  greenLocation: z.lazy(() => JsonFilterSchema).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  course: z.union([ z.lazy(() => CourseRelationFilterSchema),z.lazy(() => CourseWhereInputSchema) ]).optional(),
  shots: z.lazy(() => ShotListRelationFilterSchema).optional(),
  holeScores: z.lazy(() => HoleScoreListRelationFilterSchema).optional()
}).strict();

export const HoleOrderByWithRelationInputSchema: z.ZodType<Prisma.HoleOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  holeNumber: z.lazy(() => SortOrderSchema).optional(),
  par: z.lazy(() => SortOrderSchema).optional(),
  yardage: z.lazy(() => SortOrderSchema).optional(),
  handicap: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  teeLocation: z.lazy(() => SortOrderSchema).optional(),
  greenLocation: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  course: z.lazy(() => CourseOrderByWithRelationInputSchema).optional(),
  shots: z.lazy(() => ShotOrderByRelationAggregateInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreOrderByRelationAggregateInputSchema).optional()
}).strict();

export const HoleWhereUniqueInputSchema: z.ZodType<Prisma.HoleWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    courseId_holeNumber: z.lazy(() => HoleCourseIdHoleNumberCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    courseId_holeNumber: z.lazy(() => HoleCourseIdHoleNumberCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  courseId_holeNumber: z.lazy(() => HoleCourseIdHoleNumberCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => HoleWhereInputSchema),z.lazy(() => HoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => HoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HoleWhereInputSchema),z.lazy(() => HoleWhereInputSchema).array() ]).optional(),
  courseId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  holeNumber: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  par: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  yardage: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  handicap: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  teeLocation: z.lazy(() => JsonFilterSchema).optional(),
  greenLocation: z.lazy(() => JsonFilterSchema).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  course: z.union([ z.lazy(() => CourseRelationFilterSchema),z.lazy(() => CourseWhereInputSchema) ]).optional(),
  shots: z.lazy(() => ShotListRelationFilterSchema).optional(),
  holeScores: z.lazy(() => HoleScoreListRelationFilterSchema).optional()
}).strict());

export const HoleOrderByWithAggregationInputSchema: z.ZodType<Prisma.HoleOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  holeNumber: z.lazy(() => SortOrderSchema).optional(),
  par: z.lazy(() => SortOrderSchema).optional(),
  yardage: z.lazy(() => SortOrderSchema).optional(),
  handicap: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  teeLocation: z.lazy(() => SortOrderSchema).optional(),
  greenLocation: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => HoleCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => HoleAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => HoleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => HoleMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => HoleSumOrderByAggregateInputSchema).optional()
}).strict();

export const HoleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.HoleScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => HoleScalarWhereWithAggregatesInputSchema),z.lazy(() => HoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => HoleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HoleScalarWhereWithAggregatesInputSchema),z.lazy(() => HoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  courseId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  holeNumber: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  par: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  yardage: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  handicap: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  teeLocation: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  greenLocation: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const RoundWhereInputSchema: z.ZodType<Prisma.RoundWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RoundWhereInputSchema),z.lazy(() => RoundWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoundWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoundWhereInputSchema),z.lazy(() => RoundWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  courseId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  weather: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  temperature: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  windSpeed: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  windDirection: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  score: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  course: z.union([ z.lazy(() => CourseRelationFilterSchema),z.lazy(() => CourseWhereInputSchema) ]).optional(),
  shots: z.lazy(() => ShotListRelationFilterSchema).optional(),
  holeScores: z.lazy(() => HoleScoreListRelationFilterSchema).optional()
}).strict();

export const RoundOrderByWithRelationInputSchema: z.ZodType<Prisma.RoundOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  weather: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  temperature: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  windSpeed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  windDirection: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  score: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  course: z.lazy(() => CourseOrderByWithRelationInputSchema).optional(),
  shots: z.lazy(() => ShotOrderByRelationAggregateInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreOrderByRelationAggregateInputSchema).optional()
}).strict();

export const RoundWhereUniqueInputSchema: z.ZodType<Prisma.RoundWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => RoundWhereInputSchema),z.lazy(() => RoundWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoundWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoundWhereInputSchema),z.lazy(() => RoundWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  courseId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  weather: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  temperature: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  windSpeed: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  windDirection: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  score: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  course: z.union([ z.lazy(() => CourseRelationFilterSchema),z.lazy(() => CourseWhereInputSchema) ]).optional(),
  shots: z.lazy(() => ShotListRelationFilterSchema).optional(),
  holeScores: z.lazy(() => HoleScoreListRelationFilterSchema).optional()
}).strict());

export const RoundOrderByWithAggregationInputSchema: z.ZodType<Prisma.RoundOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  weather: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  temperature: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  windSpeed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  windDirection: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  score: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RoundCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RoundAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RoundMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RoundMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RoundSumOrderByAggregateInputSchema).optional()
}).strict();

export const RoundScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RoundScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RoundScalarWhereWithAggregatesInputSchema),z.lazy(() => RoundScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoundScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoundScalarWhereWithAggregatesInputSchema),z.lazy(() => RoundScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  courseId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  weather: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  temperature: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  windSpeed: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  windDirection: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  score: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ShotWhereInputSchema: z.ZodType<Prisma.ShotWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ShotWhereInputSchema),z.lazy(() => ShotWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShotWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShotWhereInputSchema),z.lazy(() => ShotWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roundId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  holeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  shotNumber: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  club: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  distance: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  startLocation: z.lazy(() => JsonFilterSchema).optional(),
  endLocation: z.lazy(() => JsonNullableFilterSchema).optional(),
  result: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  round: z.union([ z.lazy(() => RoundRelationFilterSchema),z.lazy(() => RoundWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  hole: z.union([ z.lazy(() => HoleRelationFilterSchema),z.lazy(() => HoleWhereInputSchema) ]).optional(),
}).strict();

export const ShotOrderByWithRelationInputSchema: z.ZodType<Prisma.ShotOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  holeId: z.lazy(() => SortOrderSchema).optional(),
  shotNumber: z.lazy(() => SortOrderSchema).optional(),
  club: z.lazy(() => SortOrderSchema).optional(),
  distance: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startLocation: z.lazy(() => SortOrderSchema).optional(),
  endLocation: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  round: z.lazy(() => RoundOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  hole: z.lazy(() => HoleOrderByWithRelationInputSchema).optional()
}).strict();

export const ShotWhereUniqueInputSchema: z.ZodType<Prisma.ShotWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => ShotWhereInputSchema),z.lazy(() => ShotWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShotWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShotWhereInputSchema),z.lazy(() => ShotWhereInputSchema).array() ]).optional(),
  roundId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  holeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  shotNumber: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  club: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  distance: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  startLocation: z.lazy(() => JsonFilterSchema).optional(),
  endLocation: z.lazy(() => JsonNullableFilterSchema).optional(),
  result: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  round: z.union([ z.lazy(() => RoundRelationFilterSchema),z.lazy(() => RoundWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  hole: z.union([ z.lazy(() => HoleRelationFilterSchema),z.lazy(() => HoleWhereInputSchema) ]).optional(),
}).strict());

export const ShotOrderByWithAggregationInputSchema: z.ZodType<Prisma.ShotOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  holeId: z.lazy(() => SortOrderSchema).optional(),
  shotNumber: z.lazy(() => SortOrderSchema).optional(),
  club: z.lazy(() => SortOrderSchema).optional(),
  distance: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startLocation: z.lazy(() => SortOrderSchema).optional(),
  endLocation: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ShotCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ShotAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ShotMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ShotMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ShotSumOrderByAggregateInputSchema).optional()
}).strict();

export const ShotScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ShotScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ShotScalarWhereWithAggregatesInputSchema),z.lazy(() => ShotScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShotScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShotScalarWhereWithAggregatesInputSchema),z.lazy(() => ShotScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  roundId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  holeId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  shotNumber: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  club: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  distance: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  startLocation: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  endLocation: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  result: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const HoleScoreWhereInputSchema: z.ZodType<Prisma.HoleScoreWhereInput> = z.object({
  AND: z.union([ z.lazy(() => HoleScoreWhereInputSchema),z.lazy(() => HoleScoreWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => HoleScoreWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HoleScoreWhereInputSchema),z.lazy(() => HoleScoreWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roundId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  holeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  putts: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  fairway: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  gir: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  round: z.union([ z.lazy(() => RoundRelationFilterSchema),z.lazy(() => RoundWhereInputSchema) ]).optional(),
  hole: z.union([ z.lazy(() => HoleRelationFilterSchema),z.lazy(() => HoleWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const HoleScoreOrderByWithRelationInputSchema: z.ZodType<Prisma.HoleScoreOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  holeId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  putts: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  fairway: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  gir: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  round: z.lazy(() => RoundOrderByWithRelationInputSchema).optional(),
  hole: z.lazy(() => HoleOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const HoleScoreWhereUniqueInputSchema: z.ZodType<Prisma.HoleScoreWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    roundId_holeId: z.lazy(() => HoleScoreRoundIdHoleIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    roundId_holeId: z.lazy(() => HoleScoreRoundIdHoleIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  roundId_holeId: z.lazy(() => HoleScoreRoundIdHoleIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => HoleScoreWhereInputSchema),z.lazy(() => HoleScoreWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => HoleScoreWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HoleScoreWhereInputSchema),z.lazy(() => HoleScoreWhereInputSchema).array() ]).optional(),
  roundId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  holeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  putts: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  fairway: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  gir: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  round: z.union([ z.lazy(() => RoundRelationFilterSchema),z.lazy(() => RoundWhereInputSchema) ]).optional(),
  hole: z.union([ z.lazy(() => HoleRelationFilterSchema),z.lazy(() => HoleWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const HoleScoreOrderByWithAggregationInputSchema: z.ZodType<Prisma.HoleScoreOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  holeId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  putts: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  fairway: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  gir: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => HoleScoreCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => HoleScoreAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => HoleScoreMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => HoleScoreMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => HoleScoreSumOrderByAggregateInputSchema).optional()
}).strict();

export const HoleScoreScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.HoleScoreScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => HoleScoreScalarWhereWithAggregatesInputSchema),z.lazy(() => HoleScoreScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => HoleScoreScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HoleScoreScalarWhereWithAggregatesInputSchema),z.lazy(() => HoleScoreScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  roundId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  holeId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  putts: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  fairway: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  gir: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  handicap: z.number().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  rounds: z.lazy(() => RoundCreateNestedManyWithoutUserInputSchema).optional(),
  shots: z.lazy(() => ShotCreateNestedManyWithoutUserInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  handicap: z.number().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  rounds: z.lazy(() => RoundUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  shots: z.lazy(() => ShotUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  handicap: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundUpdateManyWithoutUserNestedInputSchema).optional(),
  shots: z.lazy(() => ShotUpdateManyWithoutUserNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  handicap: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  shots: z.lazy(() => ShotUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  handicap: z.number().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  handicap: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  handicap: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CourseCreateInputSchema: z.ZodType<Prisma.CourseCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
  slope: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  holes: z.lazy(() => HoleCreateNestedManyWithoutCourseInputSchema).optional(),
  rounds: z.lazy(() => RoundCreateNestedManyWithoutCourseInputSchema).optional()
}).strict();

export const CourseUncheckedCreateInputSchema: z.ZodType<Prisma.CourseUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
  slope: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  holes: z.lazy(() => HoleUncheckedCreateNestedManyWithoutCourseInputSchema).optional(),
  rounds: z.lazy(() => RoundUncheckedCreateNestedManyWithoutCourseInputSchema).optional()
}).strict();

export const CourseUpdateInputSchema: z.ZodType<Prisma.CourseUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  slope: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  holes: z.lazy(() => HoleUpdateManyWithoutCourseNestedInputSchema).optional(),
  rounds: z.lazy(() => RoundUpdateManyWithoutCourseNestedInputSchema).optional()
}).strict();

export const CourseUncheckedUpdateInputSchema: z.ZodType<Prisma.CourseUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  slope: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  holes: z.lazy(() => HoleUncheckedUpdateManyWithoutCourseNestedInputSchema).optional(),
  rounds: z.lazy(() => RoundUncheckedUpdateManyWithoutCourseNestedInputSchema).optional()
}).strict();

export const CourseCreateManyInputSchema: z.ZodType<Prisma.CourseCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
  slope: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CourseUpdateManyMutationInputSchema: z.ZodType<Prisma.CourseUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  slope: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CourseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CourseUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  slope: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HoleCreateInputSchema: z.ZodType<Prisma.HoleCreateInput> = z.object({
  id: z.string().cuid().optional(),
  holeNumber: z.number().int(),
  par: z.number().int(),
  yardage: z.number().int(),
  handicap: z.number().int().optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  description: z.string().optional().nullable(),
  course: z.lazy(() => CourseCreateNestedOneWithoutHolesInputSchema),
  shots: z.lazy(() => ShotCreateNestedManyWithoutHoleInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreCreateNestedManyWithoutHoleInputSchema).optional()
}).strict();

export const HoleUncheckedCreateInputSchema: z.ZodType<Prisma.HoleUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  courseId: z.string(),
  holeNumber: z.number().int(),
  par: z.number().int(),
  yardage: z.number().int(),
  handicap: z.number().int().optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  description: z.string().optional().nullable(),
  shots: z.lazy(() => ShotUncheckedCreateNestedManyWithoutHoleInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedCreateNestedManyWithoutHoleInputSchema).optional()
}).strict();

export const HoleUpdateInputSchema: z.ZodType<Prisma.HoleUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  par: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  yardage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  handicap: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  course: z.lazy(() => CourseUpdateOneRequiredWithoutHolesNestedInputSchema).optional(),
  shots: z.lazy(() => ShotUpdateManyWithoutHoleNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUpdateManyWithoutHoleNestedInputSchema).optional()
}).strict();

export const HoleUncheckedUpdateInputSchema: z.ZodType<Prisma.HoleUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  par: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  yardage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  handicap: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shots: z.lazy(() => ShotUncheckedUpdateManyWithoutHoleNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedUpdateManyWithoutHoleNestedInputSchema).optional()
}).strict();

export const HoleCreateManyInputSchema: z.ZodType<Prisma.HoleCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  courseId: z.string(),
  holeNumber: z.number().int(),
  par: z.number().int(),
  yardage: z.number().int(),
  handicap: z.number().int().optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  description: z.string().optional().nullable()
}).strict();

export const HoleUpdateManyMutationInputSchema: z.ZodType<Prisma.HoleUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  par: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  yardage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  handicap: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const HoleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.HoleUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  par: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  yardage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  handicap: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RoundCreateInputSchema: z.ZodType<Prisma.RoundCreateInput> = z.object({
  id: z.string().cuid().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutRoundsInputSchema),
  course: z.lazy(() => CourseCreateNestedOneWithoutRoundsInputSchema),
  shots: z.lazy(() => ShotCreateNestedManyWithoutRoundInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundUncheckedCreateInputSchema: z.ZodType<Prisma.RoundUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  courseId: z.string(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  shots: z.lazy(() => ShotUncheckedCreateNestedManyWithoutRoundInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundUpdateInputSchema: z.ZodType<Prisma.RoundUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutRoundsNestedInputSchema).optional(),
  course: z.lazy(() => CourseUpdateOneRequiredWithoutRoundsNestedInputSchema).optional(),
  shots: z.lazy(() => ShotUpdateManyWithoutRoundNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const RoundUncheckedUpdateInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  shots: z.lazy(() => ShotUncheckedUpdateManyWithoutRoundNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const RoundCreateManyInputSchema: z.ZodType<Prisma.RoundCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  courseId: z.string(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RoundUpdateManyMutationInputSchema: z.ZodType<Prisma.RoundUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoundUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShotCreateInputSchema: z.ZodType<Prisma.ShotCreateInput> = z.object({
  id: z.string().cuid().optional(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  round: z.lazy(() => RoundCreateNestedOneWithoutShotsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutShotsInputSchema),
  hole: z.lazy(() => HoleCreateNestedOneWithoutShotsInputSchema)
}).strict();

export const ShotUncheckedCreateInputSchema: z.ZodType<Prisma.ShotUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  userId: z.string(),
  holeId: z.string(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ShotUpdateInputSchema: z.ZodType<Prisma.ShotUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  round: z.lazy(() => RoundUpdateOneRequiredWithoutShotsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutShotsNestedInputSchema).optional(),
  hole: z.lazy(() => HoleUpdateOneRequiredWithoutShotsNestedInputSchema).optional()
}).strict();

export const ShotUncheckedUpdateInputSchema: z.ZodType<Prisma.ShotUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShotCreateManyInputSchema: z.ZodType<Prisma.ShotCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  userId: z.string(),
  holeId: z.string(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ShotUpdateManyMutationInputSchema: z.ZodType<Prisma.ShotUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShotUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ShotUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HoleScoreCreateInputSchema: z.ZodType<Prisma.HoleScoreCreateInput> = z.object({
  id: z.string().cuid().optional(),
  score: z.number().int(),
  putts: z.number().int().optional().nullable(),
  fairway: z.boolean().optional().nullable(),
  gir: z.boolean().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  round: z.lazy(() => RoundCreateNestedOneWithoutHoleScoresInputSchema),
  hole: z.lazy(() => HoleCreateNestedOneWithoutHoleScoresInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutHoleScoresInputSchema)
}).strict();

export const HoleScoreUncheckedCreateInputSchema: z.ZodType<Prisma.HoleScoreUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  holeId: z.string(),
  userId: z.string(),
  score: z.number().int(),
  putts: z.number().int().optional().nullable(),
  fairway: z.boolean().optional().nullable(),
  gir: z.boolean().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const HoleScoreUpdateInputSchema: z.ZodType<Prisma.HoleScoreUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  round: z.lazy(() => RoundUpdateOneRequiredWithoutHoleScoresNestedInputSchema).optional(),
  hole: z.lazy(() => HoleUpdateOneRequiredWithoutHoleScoresNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutHoleScoresNestedInputSchema).optional()
}).strict();

export const HoleScoreUncheckedUpdateInputSchema: z.ZodType<Prisma.HoleScoreUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HoleScoreCreateManyInputSchema: z.ZodType<Prisma.HoleScoreCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  holeId: z.string(),
  userId: z.string(),
  score: z.number().int(),
  putts: z.number().int().optional().nullable(),
  fairway: z.boolean().optional().nullable(),
  gir: z.boolean().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const HoleScoreUpdateManyMutationInputSchema: z.ZodType<Prisma.HoleScoreUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HoleScoreUncheckedUpdateManyInputSchema: z.ZodType<Prisma.HoleScoreUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const RoundListRelationFilterSchema: z.ZodType<Prisma.RoundListRelationFilter> = z.object({
  every: z.lazy(() => RoundWhereInputSchema).optional(),
  some: z.lazy(() => RoundWhereInputSchema).optional(),
  none: z.lazy(() => RoundWhereInputSchema).optional()
}).strict();

export const ShotListRelationFilterSchema: z.ZodType<Prisma.ShotListRelationFilter> = z.object({
  every: z.lazy(() => ShotWhereInputSchema).optional(),
  some: z.lazy(() => ShotWhereInputSchema).optional(),
  none: z.lazy(() => ShotWhereInputSchema).optional()
}).strict();

export const HoleScoreListRelationFilterSchema: z.ZodType<Prisma.HoleScoreListRelationFilter> = z.object({
  every: z.lazy(() => HoleScoreWhereInputSchema).optional(),
  some: z.lazy(() => HoleScoreWhereInputSchema).optional(),
  none: z.lazy(() => HoleScoreWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const RoundOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RoundOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShotOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ShotOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HoleScoreOrderByRelationAggregateInputSchema: z.ZodType<Prisma.HoleScoreOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  handicap: z.lazy(() => SortOrderSchema).optional(),
  profileImage: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  handicap: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  handicap: z.lazy(() => SortOrderSchema).optional(),
  profileImage: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  handicap: z.lazy(() => SortOrderSchema).optional(),
  profileImage: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  handicap: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const HoleListRelationFilterSchema: z.ZodType<Prisma.HoleListRelationFilter> = z.object({
  every: z.lazy(() => HoleWhereInputSchema).optional(),
  some: z.lazy(() => HoleWhereInputSchema).optional(),
  none: z.lazy(() => HoleWhereInputSchema).optional()
}).strict();

export const HoleOrderByRelationAggregateInputSchema: z.ZodType<Prisma.HoleOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CourseCountOrderByAggregateInputSchema: z.ZodType<Prisma.CourseCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  bounds: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  slope: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CourseAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CourseAvgOrderByAggregateInput> = z.object({
  rating: z.lazy(() => SortOrderSchema).optional(),
  slope: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CourseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CourseMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  slope: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CourseMinOrderByAggregateInputSchema: z.ZodType<Prisma.CourseMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  slope: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CourseSumOrderByAggregateInputSchema: z.ZodType<Prisma.CourseSumOrderByAggregateInput> = z.object({
  rating: z.lazy(() => SortOrderSchema).optional(),
  slope: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const CourseRelationFilterSchema: z.ZodType<Prisma.CourseRelationFilter> = z.object({
  is: z.lazy(() => CourseWhereInputSchema).optional(),
  isNot: z.lazy(() => CourseWhereInputSchema).optional()
}).strict();

export const HoleCourseIdHoleNumberCompoundUniqueInputSchema: z.ZodType<Prisma.HoleCourseIdHoleNumberCompoundUniqueInput> = z.object({
  courseId: z.string(),
  holeNumber: z.number()
}).strict();

export const HoleCountOrderByAggregateInputSchema: z.ZodType<Prisma.HoleCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  holeNumber: z.lazy(() => SortOrderSchema).optional(),
  par: z.lazy(() => SortOrderSchema).optional(),
  yardage: z.lazy(() => SortOrderSchema).optional(),
  handicap: z.lazy(() => SortOrderSchema).optional(),
  teeLocation: z.lazy(() => SortOrderSchema).optional(),
  greenLocation: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HoleAvgOrderByAggregateInputSchema: z.ZodType<Prisma.HoleAvgOrderByAggregateInput> = z.object({
  holeNumber: z.lazy(() => SortOrderSchema).optional(),
  par: z.lazy(() => SortOrderSchema).optional(),
  yardage: z.lazy(() => SortOrderSchema).optional(),
  handicap: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HoleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.HoleMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  holeNumber: z.lazy(() => SortOrderSchema).optional(),
  par: z.lazy(() => SortOrderSchema).optional(),
  yardage: z.lazy(() => SortOrderSchema).optional(),
  handicap: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HoleMinOrderByAggregateInputSchema: z.ZodType<Prisma.HoleMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  holeNumber: z.lazy(() => SortOrderSchema).optional(),
  par: z.lazy(() => SortOrderSchema).optional(),
  yardage: z.lazy(() => SortOrderSchema).optional(),
  handicap: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HoleSumOrderByAggregateInputSchema: z.ZodType<Prisma.HoleSumOrderByAggregateInput> = z.object({
  holeNumber: z.lazy(() => SortOrderSchema).optional(),
  par: z.lazy(() => SortOrderSchema).optional(),
  yardage: z.lazy(() => SortOrderSchema).optional(),
  handicap: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const RoundCountOrderByAggregateInputSchema: z.ZodType<Prisma.RoundCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  weather: z.lazy(() => SortOrderSchema).optional(),
  temperature: z.lazy(() => SortOrderSchema).optional(),
  windSpeed: z.lazy(() => SortOrderSchema).optional(),
  windDirection: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoundAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RoundAvgOrderByAggregateInput> = z.object({
  temperature: z.lazy(() => SortOrderSchema).optional(),
  windSpeed: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoundMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RoundMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  weather: z.lazy(() => SortOrderSchema).optional(),
  temperature: z.lazy(() => SortOrderSchema).optional(),
  windSpeed: z.lazy(() => SortOrderSchema).optional(),
  windDirection: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoundMinOrderByAggregateInputSchema: z.ZodType<Prisma.RoundMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  courseId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  weather: z.lazy(() => SortOrderSchema).optional(),
  temperature: z.lazy(() => SortOrderSchema).optional(),
  windSpeed: z.lazy(() => SortOrderSchema).optional(),
  windDirection: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoundSumOrderByAggregateInputSchema: z.ZodType<Prisma.RoundSumOrderByAggregateInput> = z.object({
  temperature: z.lazy(() => SortOrderSchema).optional(),
  windSpeed: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const RoundRelationFilterSchema: z.ZodType<Prisma.RoundRelationFilter> = z.object({
  is: z.lazy(() => RoundWhereInputSchema).optional(),
  isNot: z.lazy(() => RoundWhereInputSchema).optional()
}).strict();

export const HoleRelationFilterSchema: z.ZodType<Prisma.HoleRelationFilter> = z.object({
  is: z.lazy(() => HoleWhereInputSchema).optional(),
  isNot: z.lazy(() => HoleWhereInputSchema).optional()
}).strict();

export const ShotCountOrderByAggregateInputSchema: z.ZodType<Prisma.ShotCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  holeId: z.lazy(() => SortOrderSchema).optional(),
  shotNumber: z.lazy(() => SortOrderSchema).optional(),
  club: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  startLocation: z.lazy(() => SortOrderSchema).optional(),
  endLocation: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShotAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ShotAvgOrderByAggregateInput> = z.object({
  shotNumber: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShotMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ShotMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  holeId: z.lazy(() => SortOrderSchema).optional(),
  shotNumber: z.lazy(() => SortOrderSchema).optional(),
  club: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShotMinOrderByAggregateInputSchema: z.ZodType<Prisma.ShotMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  holeId: z.lazy(() => SortOrderSchema).optional(),
  shotNumber: z.lazy(() => SortOrderSchema).optional(),
  club: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ShotSumOrderByAggregateInputSchema: z.ZodType<Prisma.ShotSumOrderByAggregateInput> = z.object({
  shotNumber: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolNullableFilterSchema: z.ZodType<Prisma.BoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const HoleScoreRoundIdHoleIdCompoundUniqueInputSchema: z.ZodType<Prisma.HoleScoreRoundIdHoleIdCompoundUniqueInput> = z.object({
  roundId: z.string(),
  holeId: z.string()
}).strict();

export const HoleScoreCountOrderByAggregateInputSchema: z.ZodType<Prisma.HoleScoreCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  holeId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  putts: z.lazy(() => SortOrderSchema).optional(),
  fairway: z.lazy(() => SortOrderSchema).optional(),
  gir: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HoleScoreAvgOrderByAggregateInputSchema: z.ZodType<Prisma.HoleScoreAvgOrderByAggregateInput> = z.object({
  score: z.lazy(() => SortOrderSchema).optional(),
  putts: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HoleScoreMaxOrderByAggregateInputSchema: z.ZodType<Prisma.HoleScoreMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  holeId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  putts: z.lazy(() => SortOrderSchema).optional(),
  fairway: z.lazy(() => SortOrderSchema).optional(),
  gir: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HoleScoreMinOrderByAggregateInputSchema: z.ZodType<Prisma.HoleScoreMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  roundId: z.lazy(() => SortOrderSchema).optional(),
  holeId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  putts: z.lazy(() => SortOrderSchema).optional(),
  fairway: z.lazy(() => SortOrderSchema).optional(),
  gir: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HoleScoreSumOrderByAggregateInputSchema: z.ZodType<Prisma.HoleScoreSumOrderByAggregateInput> = z.object({
  score: z.lazy(() => SortOrderSchema).optional(),
  putts: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.BoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const RoundCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.RoundCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutUserInputSchema),z.lazy(() => RoundCreateWithoutUserInputSchema).array(),z.lazy(() => RoundUncheckedCreateWithoutUserInputSchema),z.lazy(() => RoundUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundCreateOrConnectWithoutUserInputSchema),z.lazy(() => RoundCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShotCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ShotCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ShotCreateWithoutUserInputSchema),z.lazy(() => ShotCreateWithoutUserInputSchema).array(),z.lazy(() => ShotUncheckedCreateWithoutUserInputSchema),z.lazy(() => ShotUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShotCreateOrConnectWithoutUserInputSchema),z.lazy(() => ShotCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShotCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HoleScoreCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.HoleScoreCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutUserInputSchema),z.lazy(() => HoleScoreCreateWithoutUserInputSchema).array(),z.lazy(() => HoleScoreUncheckedCreateWithoutUserInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleScoreCreateOrConnectWithoutUserInputSchema),z.lazy(() => HoleScoreCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleScoreCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RoundUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.RoundUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutUserInputSchema),z.lazy(() => RoundCreateWithoutUserInputSchema).array(),z.lazy(() => RoundUncheckedCreateWithoutUserInputSchema),z.lazy(() => RoundUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundCreateOrConnectWithoutUserInputSchema),z.lazy(() => RoundCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShotUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ShotUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ShotCreateWithoutUserInputSchema),z.lazy(() => ShotCreateWithoutUserInputSchema).array(),z.lazy(() => ShotUncheckedCreateWithoutUserInputSchema),z.lazy(() => ShotUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShotCreateOrConnectWithoutUserInputSchema),z.lazy(() => ShotCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShotCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HoleScoreUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.HoleScoreUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutUserInputSchema),z.lazy(() => HoleScoreCreateWithoutUserInputSchema).array(),z.lazy(() => HoleScoreUncheckedCreateWithoutUserInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleScoreCreateOrConnectWithoutUserInputSchema),z.lazy(() => HoleScoreCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleScoreCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const RoundUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.RoundUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutUserInputSchema),z.lazy(() => RoundCreateWithoutUserInputSchema).array(),z.lazy(() => RoundUncheckedCreateWithoutUserInputSchema),z.lazy(() => RoundUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundCreateOrConnectWithoutUserInputSchema),z.lazy(() => RoundCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RoundUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RoundUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RoundUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RoundUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RoundUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => RoundUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RoundScalarWhereInputSchema),z.lazy(() => RoundScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShotUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ShotUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShotCreateWithoutUserInputSchema),z.lazy(() => ShotCreateWithoutUserInputSchema).array(),z.lazy(() => ShotUncheckedCreateWithoutUserInputSchema),z.lazy(() => ShotUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShotCreateOrConnectWithoutUserInputSchema),z.lazy(() => ShotCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShotUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ShotUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShotCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShotUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ShotUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShotUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ShotUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShotScalarWhereInputSchema),z.lazy(() => ShotScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HoleScoreUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.HoleScoreUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutUserInputSchema),z.lazy(() => HoleScoreCreateWithoutUserInputSchema).array(),z.lazy(() => HoleScoreUncheckedCreateWithoutUserInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleScoreCreateOrConnectWithoutUserInputSchema),z.lazy(() => HoleScoreCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => HoleScoreUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => HoleScoreUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleScoreCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => HoleScoreUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => HoleScoreUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => HoleScoreUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => HoleScoreUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => HoleScoreScalarWhereInputSchema),z.lazy(() => HoleScoreScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RoundUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutUserInputSchema),z.lazy(() => RoundCreateWithoutUserInputSchema).array(),z.lazy(() => RoundUncheckedCreateWithoutUserInputSchema),z.lazy(() => RoundUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundCreateOrConnectWithoutUserInputSchema),z.lazy(() => RoundCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RoundUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RoundUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RoundUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RoundUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RoundUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => RoundUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RoundScalarWhereInputSchema),z.lazy(() => RoundScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShotUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ShotUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShotCreateWithoutUserInputSchema),z.lazy(() => ShotCreateWithoutUserInputSchema).array(),z.lazy(() => ShotUncheckedCreateWithoutUserInputSchema),z.lazy(() => ShotUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShotCreateOrConnectWithoutUserInputSchema),z.lazy(() => ShotCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShotUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ShotUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShotCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShotUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ShotUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShotUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ShotUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShotScalarWhereInputSchema),z.lazy(() => ShotScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HoleScoreUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.HoleScoreUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutUserInputSchema),z.lazy(() => HoleScoreCreateWithoutUserInputSchema).array(),z.lazy(() => HoleScoreUncheckedCreateWithoutUserInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleScoreCreateOrConnectWithoutUserInputSchema),z.lazy(() => HoleScoreCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => HoleScoreUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => HoleScoreUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleScoreCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => HoleScoreUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => HoleScoreUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => HoleScoreUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => HoleScoreUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => HoleScoreScalarWhereInputSchema),z.lazy(() => HoleScoreScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HoleCreateNestedManyWithoutCourseInputSchema: z.ZodType<Prisma.HoleCreateNestedManyWithoutCourseInput> = z.object({
  create: z.union([ z.lazy(() => HoleCreateWithoutCourseInputSchema),z.lazy(() => HoleCreateWithoutCourseInputSchema).array(),z.lazy(() => HoleUncheckedCreateWithoutCourseInputSchema),z.lazy(() => HoleUncheckedCreateWithoutCourseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleCreateOrConnectWithoutCourseInputSchema),z.lazy(() => HoleCreateOrConnectWithoutCourseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleCreateManyCourseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => HoleWhereUniqueInputSchema),z.lazy(() => HoleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RoundCreateNestedManyWithoutCourseInputSchema: z.ZodType<Prisma.RoundCreateNestedManyWithoutCourseInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutCourseInputSchema),z.lazy(() => RoundCreateWithoutCourseInputSchema).array(),z.lazy(() => RoundUncheckedCreateWithoutCourseInputSchema),z.lazy(() => RoundUncheckedCreateWithoutCourseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundCreateOrConnectWithoutCourseInputSchema),z.lazy(() => RoundCreateOrConnectWithoutCourseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundCreateManyCourseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HoleUncheckedCreateNestedManyWithoutCourseInputSchema: z.ZodType<Prisma.HoleUncheckedCreateNestedManyWithoutCourseInput> = z.object({
  create: z.union([ z.lazy(() => HoleCreateWithoutCourseInputSchema),z.lazy(() => HoleCreateWithoutCourseInputSchema).array(),z.lazy(() => HoleUncheckedCreateWithoutCourseInputSchema),z.lazy(() => HoleUncheckedCreateWithoutCourseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleCreateOrConnectWithoutCourseInputSchema),z.lazy(() => HoleCreateOrConnectWithoutCourseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleCreateManyCourseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => HoleWhereUniqueInputSchema),z.lazy(() => HoleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RoundUncheckedCreateNestedManyWithoutCourseInputSchema: z.ZodType<Prisma.RoundUncheckedCreateNestedManyWithoutCourseInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutCourseInputSchema),z.lazy(() => RoundCreateWithoutCourseInputSchema).array(),z.lazy(() => RoundUncheckedCreateWithoutCourseInputSchema),z.lazy(() => RoundUncheckedCreateWithoutCourseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundCreateOrConnectWithoutCourseInputSchema),z.lazy(() => RoundCreateOrConnectWithoutCourseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundCreateManyCourseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const HoleUpdateManyWithoutCourseNestedInputSchema: z.ZodType<Prisma.HoleUpdateManyWithoutCourseNestedInput> = z.object({
  create: z.union([ z.lazy(() => HoleCreateWithoutCourseInputSchema),z.lazy(() => HoleCreateWithoutCourseInputSchema).array(),z.lazy(() => HoleUncheckedCreateWithoutCourseInputSchema),z.lazy(() => HoleUncheckedCreateWithoutCourseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleCreateOrConnectWithoutCourseInputSchema),z.lazy(() => HoleCreateOrConnectWithoutCourseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => HoleUpsertWithWhereUniqueWithoutCourseInputSchema),z.lazy(() => HoleUpsertWithWhereUniqueWithoutCourseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleCreateManyCourseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => HoleWhereUniqueInputSchema),z.lazy(() => HoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => HoleWhereUniqueInputSchema),z.lazy(() => HoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => HoleWhereUniqueInputSchema),z.lazy(() => HoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => HoleWhereUniqueInputSchema),z.lazy(() => HoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => HoleUpdateWithWhereUniqueWithoutCourseInputSchema),z.lazy(() => HoleUpdateWithWhereUniqueWithoutCourseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => HoleUpdateManyWithWhereWithoutCourseInputSchema),z.lazy(() => HoleUpdateManyWithWhereWithoutCourseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => HoleScalarWhereInputSchema),z.lazy(() => HoleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RoundUpdateManyWithoutCourseNestedInputSchema: z.ZodType<Prisma.RoundUpdateManyWithoutCourseNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutCourseInputSchema),z.lazy(() => RoundCreateWithoutCourseInputSchema).array(),z.lazy(() => RoundUncheckedCreateWithoutCourseInputSchema),z.lazy(() => RoundUncheckedCreateWithoutCourseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundCreateOrConnectWithoutCourseInputSchema),z.lazy(() => RoundCreateOrConnectWithoutCourseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RoundUpsertWithWhereUniqueWithoutCourseInputSchema),z.lazy(() => RoundUpsertWithWhereUniqueWithoutCourseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundCreateManyCourseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RoundUpdateWithWhereUniqueWithoutCourseInputSchema),z.lazy(() => RoundUpdateWithWhereUniqueWithoutCourseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RoundUpdateManyWithWhereWithoutCourseInputSchema),z.lazy(() => RoundUpdateManyWithWhereWithoutCourseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RoundScalarWhereInputSchema),z.lazy(() => RoundScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HoleUncheckedUpdateManyWithoutCourseNestedInputSchema: z.ZodType<Prisma.HoleUncheckedUpdateManyWithoutCourseNestedInput> = z.object({
  create: z.union([ z.lazy(() => HoleCreateWithoutCourseInputSchema),z.lazy(() => HoleCreateWithoutCourseInputSchema).array(),z.lazy(() => HoleUncheckedCreateWithoutCourseInputSchema),z.lazy(() => HoleUncheckedCreateWithoutCourseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleCreateOrConnectWithoutCourseInputSchema),z.lazy(() => HoleCreateOrConnectWithoutCourseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => HoleUpsertWithWhereUniqueWithoutCourseInputSchema),z.lazy(() => HoleUpsertWithWhereUniqueWithoutCourseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleCreateManyCourseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => HoleWhereUniqueInputSchema),z.lazy(() => HoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => HoleWhereUniqueInputSchema),z.lazy(() => HoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => HoleWhereUniqueInputSchema),z.lazy(() => HoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => HoleWhereUniqueInputSchema),z.lazy(() => HoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => HoleUpdateWithWhereUniqueWithoutCourseInputSchema),z.lazy(() => HoleUpdateWithWhereUniqueWithoutCourseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => HoleUpdateManyWithWhereWithoutCourseInputSchema),z.lazy(() => HoleUpdateManyWithWhereWithoutCourseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => HoleScalarWhereInputSchema),z.lazy(() => HoleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RoundUncheckedUpdateManyWithoutCourseNestedInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateManyWithoutCourseNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutCourseInputSchema),z.lazy(() => RoundCreateWithoutCourseInputSchema).array(),z.lazy(() => RoundUncheckedCreateWithoutCourseInputSchema),z.lazy(() => RoundUncheckedCreateWithoutCourseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RoundCreateOrConnectWithoutCourseInputSchema),z.lazy(() => RoundCreateOrConnectWithoutCourseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RoundUpsertWithWhereUniqueWithoutCourseInputSchema),z.lazy(() => RoundUpsertWithWhereUniqueWithoutCourseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RoundCreateManyCourseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RoundWhereUniqueInputSchema),z.lazy(() => RoundWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RoundUpdateWithWhereUniqueWithoutCourseInputSchema),z.lazy(() => RoundUpdateWithWhereUniqueWithoutCourseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RoundUpdateManyWithWhereWithoutCourseInputSchema),z.lazy(() => RoundUpdateManyWithWhereWithoutCourseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RoundScalarWhereInputSchema),z.lazy(() => RoundScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CourseCreateNestedOneWithoutHolesInputSchema: z.ZodType<Prisma.CourseCreateNestedOneWithoutHolesInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutHolesInputSchema),z.lazy(() => CourseUncheckedCreateWithoutHolesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CourseCreateOrConnectWithoutHolesInputSchema).optional(),
  connect: z.lazy(() => CourseWhereUniqueInputSchema).optional()
}).strict();

export const ShotCreateNestedManyWithoutHoleInputSchema: z.ZodType<Prisma.ShotCreateNestedManyWithoutHoleInput> = z.object({
  create: z.union([ z.lazy(() => ShotCreateWithoutHoleInputSchema),z.lazy(() => ShotCreateWithoutHoleInputSchema).array(),z.lazy(() => ShotUncheckedCreateWithoutHoleInputSchema),z.lazy(() => ShotUncheckedCreateWithoutHoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShotCreateOrConnectWithoutHoleInputSchema),z.lazy(() => ShotCreateOrConnectWithoutHoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShotCreateManyHoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HoleScoreCreateNestedManyWithoutHoleInputSchema: z.ZodType<Prisma.HoleScoreCreateNestedManyWithoutHoleInput> = z.object({
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutHoleInputSchema),z.lazy(() => HoleScoreCreateWithoutHoleInputSchema).array(),z.lazy(() => HoleScoreUncheckedCreateWithoutHoleInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutHoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleScoreCreateOrConnectWithoutHoleInputSchema),z.lazy(() => HoleScoreCreateOrConnectWithoutHoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleScoreCreateManyHoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShotUncheckedCreateNestedManyWithoutHoleInputSchema: z.ZodType<Prisma.ShotUncheckedCreateNestedManyWithoutHoleInput> = z.object({
  create: z.union([ z.lazy(() => ShotCreateWithoutHoleInputSchema),z.lazy(() => ShotCreateWithoutHoleInputSchema).array(),z.lazy(() => ShotUncheckedCreateWithoutHoleInputSchema),z.lazy(() => ShotUncheckedCreateWithoutHoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShotCreateOrConnectWithoutHoleInputSchema),z.lazy(() => ShotCreateOrConnectWithoutHoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShotCreateManyHoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HoleScoreUncheckedCreateNestedManyWithoutHoleInputSchema: z.ZodType<Prisma.HoleScoreUncheckedCreateNestedManyWithoutHoleInput> = z.object({
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutHoleInputSchema),z.lazy(() => HoleScoreCreateWithoutHoleInputSchema).array(),z.lazy(() => HoleScoreUncheckedCreateWithoutHoleInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutHoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleScoreCreateOrConnectWithoutHoleInputSchema),z.lazy(() => HoleScoreCreateOrConnectWithoutHoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleScoreCreateManyHoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const CourseUpdateOneRequiredWithoutHolesNestedInputSchema: z.ZodType<Prisma.CourseUpdateOneRequiredWithoutHolesNestedInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutHolesInputSchema),z.lazy(() => CourseUncheckedCreateWithoutHolesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CourseCreateOrConnectWithoutHolesInputSchema).optional(),
  upsert: z.lazy(() => CourseUpsertWithoutHolesInputSchema).optional(),
  connect: z.lazy(() => CourseWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CourseUpdateToOneWithWhereWithoutHolesInputSchema),z.lazy(() => CourseUpdateWithoutHolesInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutHolesInputSchema) ]).optional(),
}).strict();

export const ShotUpdateManyWithoutHoleNestedInputSchema: z.ZodType<Prisma.ShotUpdateManyWithoutHoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShotCreateWithoutHoleInputSchema),z.lazy(() => ShotCreateWithoutHoleInputSchema).array(),z.lazy(() => ShotUncheckedCreateWithoutHoleInputSchema),z.lazy(() => ShotUncheckedCreateWithoutHoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShotCreateOrConnectWithoutHoleInputSchema),z.lazy(() => ShotCreateOrConnectWithoutHoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShotUpsertWithWhereUniqueWithoutHoleInputSchema),z.lazy(() => ShotUpsertWithWhereUniqueWithoutHoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShotCreateManyHoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShotUpdateWithWhereUniqueWithoutHoleInputSchema),z.lazy(() => ShotUpdateWithWhereUniqueWithoutHoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShotUpdateManyWithWhereWithoutHoleInputSchema),z.lazy(() => ShotUpdateManyWithWhereWithoutHoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShotScalarWhereInputSchema),z.lazy(() => ShotScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HoleScoreUpdateManyWithoutHoleNestedInputSchema: z.ZodType<Prisma.HoleScoreUpdateManyWithoutHoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutHoleInputSchema),z.lazy(() => HoleScoreCreateWithoutHoleInputSchema).array(),z.lazy(() => HoleScoreUncheckedCreateWithoutHoleInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutHoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleScoreCreateOrConnectWithoutHoleInputSchema),z.lazy(() => HoleScoreCreateOrConnectWithoutHoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => HoleScoreUpsertWithWhereUniqueWithoutHoleInputSchema),z.lazy(() => HoleScoreUpsertWithWhereUniqueWithoutHoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleScoreCreateManyHoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => HoleScoreUpdateWithWhereUniqueWithoutHoleInputSchema),z.lazy(() => HoleScoreUpdateWithWhereUniqueWithoutHoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => HoleScoreUpdateManyWithWhereWithoutHoleInputSchema),z.lazy(() => HoleScoreUpdateManyWithWhereWithoutHoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => HoleScoreScalarWhereInputSchema),z.lazy(() => HoleScoreScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShotUncheckedUpdateManyWithoutHoleNestedInputSchema: z.ZodType<Prisma.ShotUncheckedUpdateManyWithoutHoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShotCreateWithoutHoleInputSchema),z.lazy(() => ShotCreateWithoutHoleInputSchema).array(),z.lazy(() => ShotUncheckedCreateWithoutHoleInputSchema),z.lazy(() => ShotUncheckedCreateWithoutHoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShotCreateOrConnectWithoutHoleInputSchema),z.lazy(() => ShotCreateOrConnectWithoutHoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShotUpsertWithWhereUniqueWithoutHoleInputSchema),z.lazy(() => ShotUpsertWithWhereUniqueWithoutHoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShotCreateManyHoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShotUpdateWithWhereUniqueWithoutHoleInputSchema),z.lazy(() => ShotUpdateWithWhereUniqueWithoutHoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShotUpdateManyWithWhereWithoutHoleInputSchema),z.lazy(() => ShotUpdateManyWithWhereWithoutHoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShotScalarWhereInputSchema),z.lazy(() => ShotScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HoleScoreUncheckedUpdateManyWithoutHoleNestedInputSchema: z.ZodType<Prisma.HoleScoreUncheckedUpdateManyWithoutHoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutHoleInputSchema),z.lazy(() => HoleScoreCreateWithoutHoleInputSchema).array(),z.lazy(() => HoleScoreUncheckedCreateWithoutHoleInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutHoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleScoreCreateOrConnectWithoutHoleInputSchema),z.lazy(() => HoleScoreCreateOrConnectWithoutHoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => HoleScoreUpsertWithWhereUniqueWithoutHoleInputSchema),z.lazy(() => HoleScoreUpsertWithWhereUniqueWithoutHoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleScoreCreateManyHoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => HoleScoreUpdateWithWhereUniqueWithoutHoleInputSchema),z.lazy(() => HoleScoreUpdateWithWhereUniqueWithoutHoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => HoleScoreUpdateManyWithWhereWithoutHoleInputSchema),z.lazy(() => HoleScoreUpdateManyWithWhereWithoutHoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => HoleScoreScalarWhereInputSchema),z.lazy(() => HoleScoreScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutRoundsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutRoundsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRoundsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoundsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRoundsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CourseCreateNestedOneWithoutRoundsInputSchema: z.ZodType<Prisma.CourseCreateNestedOneWithoutRoundsInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutRoundsInputSchema),z.lazy(() => CourseUncheckedCreateWithoutRoundsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CourseCreateOrConnectWithoutRoundsInputSchema).optional(),
  connect: z.lazy(() => CourseWhereUniqueInputSchema).optional()
}).strict();

export const ShotCreateNestedManyWithoutRoundInputSchema: z.ZodType<Prisma.ShotCreateNestedManyWithoutRoundInput> = z.object({
  create: z.union([ z.lazy(() => ShotCreateWithoutRoundInputSchema),z.lazy(() => ShotCreateWithoutRoundInputSchema).array(),z.lazy(() => ShotUncheckedCreateWithoutRoundInputSchema),z.lazy(() => ShotUncheckedCreateWithoutRoundInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShotCreateOrConnectWithoutRoundInputSchema),z.lazy(() => ShotCreateOrConnectWithoutRoundInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShotCreateManyRoundInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HoleScoreCreateNestedManyWithoutRoundInputSchema: z.ZodType<Prisma.HoleScoreCreateNestedManyWithoutRoundInput> = z.object({
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutRoundInputSchema),z.lazy(() => HoleScoreCreateWithoutRoundInputSchema).array(),z.lazy(() => HoleScoreUncheckedCreateWithoutRoundInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutRoundInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleScoreCreateOrConnectWithoutRoundInputSchema),z.lazy(() => HoleScoreCreateOrConnectWithoutRoundInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleScoreCreateManyRoundInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ShotUncheckedCreateNestedManyWithoutRoundInputSchema: z.ZodType<Prisma.ShotUncheckedCreateNestedManyWithoutRoundInput> = z.object({
  create: z.union([ z.lazy(() => ShotCreateWithoutRoundInputSchema),z.lazy(() => ShotCreateWithoutRoundInputSchema).array(),z.lazy(() => ShotUncheckedCreateWithoutRoundInputSchema),z.lazy(() => ShotUncheckedCreateWithoutRoundInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShotCreateOrConnectWithoutRoundInputSchema),z.lazy(() => ShotCreateOrConnectWithoutRoundInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShotCreateManyRoundInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HoleScoreUncheckedCreateNestedManyWithoutRoundInputSchema: z.ZodType<Prisma.HoleScoreUncheckedCreateNestedManyWithoutRoundInput> = z.object({
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutRoundInputSchema),z.lazy(() => HoleScoreCreateWithoutRoundInputSchema).array(),z.lazy(() => HoleScoreUncheckedCreateWithoutRoundInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutRoundInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleScoreCreateOrConnectWithoutRoundInputSchema),z.lazy(() => HoleScoreCreateOrConnectWithoutRoundInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleScoreCreateManyRoundInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const UserUpdateOneRequiredWithoutRoundsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutRoundsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRoundsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoundsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRoundsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutRoundsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutRoundsInputSchema),z.lazy(() => UserUpdateWithoutRoundsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRoundsInputSchema) ]).optional(),
}).strict();

export const CourseUpdateOneRequiredWithoutRoundsNestedInputSchema: z.ZodType<Prisma.CourseUpdateOneRequiredWithoutRoundsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CourseCreateWithoutRoundsInputSchema),z.lazy(() => CourseUncheckedCreateWithoutRoundsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CourseCreateOrConnectWithoutRoundsInputSchema).optional(),
  upsert: z.lazy(() => CourseUpsertWithoutRoundsInputSchema).optional(),
  connect: z.lazy(() => CourseWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CourseUpdateToOneWithWhereWithoutRoundsInputSchema),z.lazy(() => CourseUpdateWithoutRoundsInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutRoundsInputSchema) ]).optional(),
}).strict();

export const ShotUpdateManyWithoutRoundNestedInputSchema: z.ZodType<Prisma.ShotUpdateManyWithoutRoundNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShotCreateWithoutRoundInputSchema),z.lazy(() => ShotCreateWithoutRoundInputSchema).array(),z.lazy(() => ShotUncheckedCreateWithoutRoundInputSchema),z.lazy(() => ShotUncheckedCreateWithoutRoundInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShotCreateOrConnectWithoutRoundInputSchema),z.lazy(() => ShotCreateOrConnectWithoutRoundInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShotUpsertWithWhereUniqueWithoutRoundInputSchema),z.lazy(() => ShotUpsertWithWhereUniqueWithoutRoundInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShotCreateManyRoundInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShotUpdateWithWhereUniqueWithoutRoundInputSchema),z.lazy(() => ShotUpdateWithWhereUniqueWithoutRoundInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShotUpdateManyWithWhereWithoutRoundInputSchema),z.lazy(() => ShotUpdateManyWithWhereWithoutRoundInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShotScalarWhereInputSchema),z.lazy(() => ShotScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HoleScoreUpdateManyWithoutRoundNestedInputSchema: z.ZodType<Prisma.HoleScoreUpdateManyWithoutRoundNestedInput> = z.object({
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutRoundInputSchema),z.lazy(() => HoleScoreCreateWithoutRoundInputSchema).array(),z.lazy(() => HoleScoreUncheckedCreateWithoutRoundInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutRoundInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleScoreCreateOrConnectWithoutRoundInputSchema),z.lazy(() => HoleScoreCreateOrConnectWithoutRoundInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => HoleScoreUpsertWithWhereUniqueWithoutRoundInputSchema),z.lazy(() => HoleScoreUpsertWithWhereUniqueWithoutRoundInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleScoreCreateManyRoundInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => HoleScoreUpdateWithWhereUniqueWithoutRoundInputSchema),z.lazy(() => HoleScoreUpdateWithWhereUniqueWithoutRoundInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => HoleScoreUpdateManyWithWhereWithoutRoundInputSchema),z.lazy(() => HoleScoreUpdateManyWithWhereWithoutRoundInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => HoleScoreScalarWhereInputSchema),z.lazy(() => HoleScoreScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ShotUncheckedUpdateManyWithoutRoundNestedInputSchema: z.ZodType<Prisma.ShotUncheckedUpdateManyWithoutRoundNestedInput> = z.object({
  create: z.union([ z.lazy(() => ShotCreateWithoutRoundInputSchema),z.lazy(() => ShotCreateWithoutRoundInputSchema).array(),z.lazy(() => ShotUncheckedCreateWithoutRoundInputSchema),z.lazy(() => ShotUncheckedCreateWithoutRoundInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ShotCreateOrConnectWithoutRoundInputSchema),z.lazy(() => ShotCreateOrConnectWithoutRoundInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ShotUpsertWithWhereUniqueWithoutRoundInputSchema),z.lazy(() => ShotUpsertWithWhereUniqueWithoutRoundInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ShotCreateManyRoundInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ShotWhereUniqueInputSchema),z.lazy(() => ShotWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ShotUpdateWithWhereUniqueWithoutRoundInputSchema),z.lazy(() => ShotUpdateWithWhereUniqueWithoutRoundInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ShotUpdateManyWithWhereWithoutRoundInputSchema),z.lazy(() => ShotUpdateManyWithWhereWithoutRoundInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ShotScalarWhereInputSchema),z.lazy(() => ShotScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HoleScoreUncheckedUpdateManyWithoutRoundNestedInputSchema: z.ZodType<Prisma.HoleScoreUncheckedUpdateManyWithoutRoundNestedInput> = z.object({
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutRoundInputSchema),z.lazy(() => HoleScoreCreateWithoutRoundInputSchema).array(),z.lazy(() => HoleScoreUncheckedCreateWithoutRoundInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutRoundInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HoleScoreCreateOrConnectWithoutRoundInputSchema),z.lazy(() => HoleScoreCreateOrConnectWithoutRoundInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => HoleScoreUpsertWithWhereUniqueWithoutRoundInputSchema),z.lazy(() => HoleScoreUpsertWithWhereUniqueWithoutRoundInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HoleScoreCreateManyRoundInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => HoleScoreWhereUniqueInputSchema),z.lazy(() => HoleScoreWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => HoleScoreUpdateWithWhereUniqueWithoutRoundInputSchema),z.lazy(() => HoleScoreUpdateWithWhereUniqueWithoutRoundInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => HoleScoreUpdateManyWithWhereWithoutRoundInputSchema),z.lazy(() => HoleScoreUpdateManyWithWhereWithoutRoundInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => HoleScoreScalarWhereInputSchema),z.lazy(() => HoleScoreScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RoundCreateNestedOneWithoutShotsInputSchema: z.ZodType<Prisma.RoundCreateNestedOneWithoutShotsInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutShotsInputSchema),z.lazy(() => RoundUncheckedCreateWithoutShotsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoundCreateOrConnectWithoutShotsInputSchema).optional(),
  connect: z.lazy(() => RoundWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutShotsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutShotsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutShotsInputSchema),z.lazy(() => UserUncheckedCreateWithoutShotsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutShotsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const HoleCreateNestedOneWithoutShotsInputSchema: z.ZodType<Prisma.HoleCreateNestedOneWithoutShotsInput> = z.object({
  create: z.union([ z.lazy(() => HoleCreateWithoutShotsInputSchema),z.lazy(() => HoleUncheckedCreateWithoutShotsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HoleCreateOrConnectWithoutShotsInputSchema).optional(),
  connect: z.lazy(() => HoleWhereUniqueInputSchema).optional()
}).strict();

export const RoundUpdateOneRequiredWithoutShotsNestedInputSchema: z.ZodType<Prisma.RoundUpdateOneRequiredWithoutShotsNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutShotsInputSchema),z.lazy(() => RoundUncheckedCreateWithoutShotsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoundCreateOrConnectWithoutShotsInputSchema).optional(),
  upsert: z.lazy(() => RoundUpsertWithoutShotsInputSchema).optional(),
  connect: z.lazy(() => RoundWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RoundUpdateToOneWithWhereWithoutShotsInputSchema),z.lazy(() => RoundUpdateWithoutShotsInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutShotsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutShotsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutShotsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutShotsInputSchema),z.lazy(() => UserUncheckedCreateWithoutShotsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutShotsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutShotsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutShotsInputSchema),z.lazy(() => UserUpdateWithoutShotsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutShotsInputSchema) ]).optional(),
}).strict();

export const HoleUpdateOneRequiredWithoutShotsNestedInputSchema: z.ZodType<Prisma.HoleUpdateOneRequiredWithoutShotsNestedInput> = z.object({
  create: z.union([ z.lazy(() => HoleCreateWithoutShotsInputSchema),z.lazy(() => HoleUncheckedCreateWithoutShotsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HoleCreateOrConnectWithoutShotsInputSchema).optional(),
  upsert: z.lazy(() => HoleUpsertWithoutShotsInputSchema).optional(),
  connect: z.lazy(() => HoleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HoleUpdateToOneWithWhereWithoutShotsInputSchema),z.lazy(() => HoleUpdateWithoutShotsInputSchema),z.lazy(() => HoleUncheckedUpdateWithoutShotsInputSchema) ]).optional(),
}).strict();

export const RoundCreateNestedOneWithoutHoleScoresInputSchema: z.ZodType<Prisma.RoundCreateNestedOneWithoutHoleScoresInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutHoleScoresInputSchema),z.lazy(() => RoundUncheckedCreateWithoutHoleScoresInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoundCreateOrConnectWithoutHoleScoresInputSchema).optional(),
  connect: z.lazy(() => RoundWhereUniqueInputSchema).optional()
}).strict();

export const HoleCreateNestedOneWithoutHoleScoresInputSchema: z.ZodType<Prisma.HoleCreateNestedOneWithoutHoleScoresInput> = z.object({
  create: z.union([ z.lazy(() => HoleCreateWithoutHoleScoresInputSchema),z.lazy(() => HoleUncheckedCreateWithoutHoleScoresInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HoleCreateOrConnectWithoutHoleScoresInputSchema).optional(),
  connect: z.lazy(() => HoleWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutHoleScoresInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutHoleScoresInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutHoleScoresInputSchema),z.lazy(() => UserUncheckedCreateWithoutHoleScoresInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutHoleScoresInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const NullableBoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableBoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional().nullable()
}).strict();

export const RoundUpdateOneRequiredWithoutHoleScoresNestedInputSchema: z.ZodType<Prisma.RoundUpdateOneRequiredWithoutHoleScoresNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoundCreateWithoutHoleScoresInputSchema),z.lazy(() => RoundUncheckedCreateWithoutHoleScoresInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoundCreateOrConnectWithoutHoleScoresInputSchema).optional(),
  upsert: z.lazy(() => RoundUpsertWithoutHoleScoresInputSchema).optional(),
  connect: z.lazy(() => RoundWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RoundUpdateToOneWithWhereWithoutHoleScoresInputSchema),z.lazy(() => RoundUpdateWithoutHoleScoresInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutHoleScoresInputSchema) ]).optional(),
}).strict();

export const HoleUpdateOneRequiredWithoutHoleScoresNestedInputSchema: z.ZodType<Prisma.HoleUpdateOneRequiredWithoutHoleScoresNestedInput> = z.object({
  create: z.union([ z.lazy(() => HoleCreateWithoutHoleScoresInputSchema),z.lazy(() => HoleUncheckedCreateWithoutHoleScoresInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HoleCreateOrConnectWithoutHoleScoresInputSchema).optional(),
  upsert: z.lazy(() => HoleUpsertWithoutHoleScoresInputSchema).optional(),
  connect: z.lazy(() => HoleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HoleUpdateToOneWithWhereWithoutHoleScoresInputSchema),z.lazy(() => HoleUpdateWithoutHoleScoresInputSchema),z.lazy(() => HoleUncheckedUpdateWithoutHoleScoresInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutHoleScoresNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutHoleScoresNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutHoleScoresInputSchema),z.lazy(() => UserUncheckedCreateWithoutHoleScoresInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutHoleScoresInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutHoleScoresInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutHoleScoresInputSchema),z.lazy(() => UserUpdateWithoutHoleScoresInputSchema),z.lazy(() => UserUncheckedUpdateWithoutHoleScoresInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedBoolNullableFilterSchema: z.ZodType<Prisma.NestedBoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const RoundCreateWithoutUserInputSchema: z.ZodType<Prisma.RoundCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  course: z.lazy(() => CourseCreateNestedOneWithoutRoundsInputSchema),
  shots: z.lazy(() => ShotCreateNestedManyWithoutRoundInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.RoundUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  courseId: z.string(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  shots: z.lazy(() => ShotUncheckedCreateNestedManyWithoutRoundInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.RoundCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => RoundWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoundCreateWithoutUserInputSchema),z.lazy(() => RoundUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const RoundCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.RoundCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RoundCreateManyUserInputSchema),z.lazy(() => RoundCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ShotCreateWithoutUserInputSchema: z.ZodType<Prisma.ShotCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  round: z.lazy(() => RoundCreateNestedOneWithoutShotsInputSchema),
  hole: z.lazy(() => HoleCreateNestedOneWithoutShotsInputSchema)
}).strict();

export const ShotUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ShotUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  holeId: z.string(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ShotCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ShotCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ShotWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ShotCreateWithoutUserInputSchema),z.lazy(() => ShotUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ShotCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ShotCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ShotCreateManyUserInputSchema),z.lazy(() => ShotCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const HoleScoreCreateWithoutUserInputSchema: z.ZodType<Prisma.HoleScoreCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  score: z.number().int(),
  putts: z.number().int().optional().nullable(),
  fairway: z.boolean().optional().nullable(),
  gir: z.boolean().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  round: z.lazy(() => RoundCreateNestedOneWithoutHoleScoresInputSchema),
  hole: z.lazy(() => HoleCreateNestedOneWithoutHoleScoresInputSchema)
}).strict();

export const HoleScoreUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.HoleScoreUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  holeId: z.string(),
  score: z.number().int(),
  putts: z.number().int().optional().nullable(),
  fairway: z.boolean().optional().nullable(),
  gir: z.boolean().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const HoleScoreCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.HoleScoreCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => HoleScoreWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutUserInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const HoleScoreCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.HoleScoreCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => HoleScoreCreateManyUserInputSchema),z.lazy(() => HoleScoreCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const RoundUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.RoundUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => RoundWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RoundUpdateWithoutUserInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => RoundCreateWithoutUserInputSchema),z.lazy(() => RoundUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const RoundUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.RoundUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => RoundWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RoundUpdateWithoutUserInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const RoundUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.RoundUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => RoundScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RoundUpdateManyMutationInputSchema),z.lazy(() => RoundUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const RoundScalarWhereInputSchema: z.ZodType<Prisma.RoundScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RoundScalarWhereInputSchema),z.lazy(() => RoundScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoundScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoundScalarWhereInputSchema),z.lazy(() => RoundScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  courseId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  weather: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  temperature: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  windSpeed: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  windDirection: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  score: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ShotUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ShotUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ShotWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ShotUpdateWithoutUserInputSchema),z.lazy(() => ShotUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ShotCreateWithoutUserInputSchema),z.lazy(() => ShotUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ShotUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ShotUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ShotWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ShotUpdateWithoutUserInputSchema),z.lazy(() => ShotUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ShotUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ShotUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ShotScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ShotUpdateManyMutationInputSchema),z.lazy(() => ShotUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ShotScalarWhereInputSchema: z.ZodType<Prisma.ShotScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ShotScalarWhereInputSchema),z.lazy(() => ShotScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ShotScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ShotScalarWhereInputSchema),z.lazy(() => ShotScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roundId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  holeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  shotNumber: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  club: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  distance: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  startLocation: z.lazy(() => JsonFilterSchema).optional(),
  endLocation: z.lazy(() => JsonNullableFilterSchema).optional(),
  result: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const HoleScoreUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.HoleScoreUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => HoleScoreWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => HoleScoreUpdateWithoutUserInputSchema),z.lazy(() => HoleScoreUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutUserInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const HoleScoreUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.HoleScoreUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => HoleScoreWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => HoleScoreUpdateWithoutUserInputSchema),z.lazy(() => HoleScoreUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const HoleScoreUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.HoleScoreUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => HoleScoreScalarWhereInputSchema),
  data: z.union([ z.lazy(() => HoleScoreUpdateManyMutationInputSchema),z.lazy(() => HoleScoreUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const HoleScoreScalarWhereInputSchema: z.ZodType<Prisma.HoleScoreScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => HoleScoreScalarWhereInputSchema),z.lazy(() => HoleScoreScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => HoleScoreScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HoleScoreScalarWhereInputSchema),z.lazy(() => HoleScoreScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  roundId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  holeId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  putts: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  fairway: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  gir: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const HoleCreateWithoutCourseInputSchema: z.ZodType<Prisma.HoleCreateWithoutCourseInput> = z.object({
  id: z.string().cuid().optional(),
  holeNumber: z.number().int(),
  par: z.number().int(),
  yardage: z.number().int(),
  handicap: z.number().int().optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  description: z.string().optional().nullable(),
  shots: z.lazy(() => ShotCreateNestedManyWithoutHoleInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreCreateNestedManyWithoutHoleInputSchema).optional()
}).strict();

export const HoleUncheckedCreateWithoutCourseInputSchema: z.ZodType<Prisma.HoleUncheckedCreateWithoutCourseInput> = z.object({
  id: z.string().cuid().optional(),
  holeNumber: z.number().int(),
  par: z.number().int(),
  yardage: z.number().int(),
  handicap: z.number().int().optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  description: z.string().optional().nullable(),
  shots: z.lazy(() => ShotUncheckedCreateNestedManyWithoutHoleInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedCreateNestedManyWithoutHoleInputSchema).optional()
}).strict();

export const HoleCreateOrConnectWithoutCourseInputSchema: z.ZodType<Prisma.HoleCreateOrConnectWithoutCourseInput> = z.object({
  where: z.lazy(() => HoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HoleCreateWithoutCourseInputSchema),z.lazy(() => HoleUncheckedCreateWithoutCourseInputSchema) ]),
}).strict();

export const HoleCreateManyCourseInputEnvelopeSchema: z.ZodType<Prisma.HoleCreateManyCourseInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => HoleCreateManyCourseInputSchema),z.lazy(() => HoleCreateManyCourseInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const RoundCreateWithoutCourseInputSchema: z.ZodType<Prisma.RoundCreateWithoutCourseInput> = z.object({
  id: z.string().cuid().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutRoundsInputSchema),
  shots: z.lazy(() => ShotCreateNestedManyWithoutRoundInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundUncheckedCreateWithoutCourseInputSchema: z.ZodType<Prisma.RoundUncheckedCreateWithoutCourseInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  shots: z.lazy(() => ShotUncheckedCreateNestedManyWithoutRoundInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundCreateOrConnectWithoutCourseInputSchema: z.ZodType<Prisma.RoundCreateOrConnectWithoutCourseInput> = z.object({
  where: z.lazy(() => RoundWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoundCreateWithoutCourseInputSchema),z.lazy(() => RoundUncheckedCreateWithoutCourseInputSchema) ]),
}).strict();

export const RoundCreateManyCourseInputEnvelopeSchema: z.ZodType<Prisma.RoundCreateManyCourseInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RoundCreateManyCourseInputSchema),z.lazy(() => RoundCreateManyCourseInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const HoleUpsertWithWhereUniqueWithoutCourseInputSchema: z.ZodType<Prisma.HoleUpsertWithWhereUniqueWithoutCourseInput> = z.object({
  where: z.lazy(() => HoleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => HoleUpdateWithoutCourseInputSchema),z.lazy(() => HoleUncheckedUpdateWithoutCourseInputSchema) ]),
  create: z.union([ z.lazy(() => HoleCreateWithoutCourseInputSchema),z.lazy(() => HoleUncheckedCreateWithoutCourseInputSchema) ]),
}).strict();

export const HoleUpdateWithWhereUniqueWithoutCourseInputSchema: z.ZodType<Prisma.HoleUpdateWithWhereUniqueWithoutCourseInput> = z.object({
  where: z.lazy(() => HoleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => HoleUpdateWithoutCourseInputSchema),z.lazy(() => HoleUncheckedUpdateWithoutCourseInputSchema) ]),
}).strict();

export const HoleUpdateManyWithWhereWithoutCourseInputSchema: z.ZodType<Prisma.HoleUpdateManyWithWhereWithoutCourseInput> = z.object({
  where: z.lazy(() => HoleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => HoleUpdateManyMutationInputSchema),z.lazy(() => HoleUncheckedUpdateManyWithoutCourseInputSchema) ]),
}).strict();

export const HoleScalarWhereInputSchema: z.ZodType<Prisma.HoleScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => HoleScalarWhereInputSchema),z.lazy(() => HoleScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => HoleScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HoleScalarWhereInputSchema),z.lazy(() => HoleScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  courseId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  holeNumber: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  par: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  yardage: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  handicap: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  teeLocation: z.lazy(() => JsonFilterSchema).optional(),
  greenLocation: z.lazy(() => JsonFilterSchema).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const RoundUpsertWithWhereUniqueWithoutCourseInputSchema: z.ZodType<Prisma.RoundUpsertWithWhereUniqueWithoutCourseInput> = z.object({
  where: z.lazy(() => RoundWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RoundUpdateWithoutCourseInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutCourseInputSchema) ]),
  create: z.union([ z.lazy(() => RoundCreateWithoutCourseInputSchema),z.lazy(() => RoundUncheckedCreateWithoutCourseInputSchema) ]),
}).strict();

export const RoundUpdateWithWhereUniqueWithoutCourseInputSchema: z.ZodType<Prisma.RoundUpdateWithWhereUniqueWithoutCourseInput> = z.object({
  where: z.lazy(() => RoundWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RoundUpdateWithoutCourseInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutCourseInputSchema) ]),
}).strict();

export const RoundUpdateManyWithWhereWithoutCourseInputSchema: z.ZodType<Prisma.RoundUpdateManyWithWhereWithoutCourseInput> = z.object({
  where: z.lazy(() => RoundScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RoundUpdateManyMutationInputSchema),z.lazy(() => RoundUncheckedUpdateManyWithoutCourseInputSchema) ]),
}).strict();

export const CourseCreateWithoutHolesInputSchema: z.ZodType<Prisma.CourseCreateWithoutHolesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
  slope: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  rounds: z.lazy(() => RoundCreateNestedManyWithoutCourseInputSchema).optional()
}).strict();

export const CourseUncheckedCreateWithoutHolesInputSchema: z.ZodType<Prisma.CourseUncheckedCreateWithoutHolesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
  slope: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  rounds: z.lazy(() => RoundUncheckedCreateNestedManyWithoutCourseInputSchema).optional()
}).strict();

export const CourseCreateOrConnectWithoutHolesInputSchema: z.ZodType<Prisma.CourseCreateOrConnectWithoutHolesInput> = z.object({
  where: z.lazy(() => CourseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CourseCreateWithoutHolesInputSchema),z.lazy(() => CourseUncheckedCreateWithoutHolesInputSchema) ]),
}).strict();

export const ShotCreateWithoutHoleInputSchema: z.ZodType<Prisma.ShotCreateWithoutHoleInput> = z.object({
  id: z.string().cuid().optional(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  round: z.lazy(() => RoundCreateNestedOneWithoutShotsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutShotsInputSchema)
}).strict();

export const ShotUncheckedCreateWithoutHoleInputSchema: z.ZodType<Prisma.ShotUncheckedCreateWithoutHoleInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  userId: z.string(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ShotCreateOrConnectWithoutHoleInputSchema: z.ZodType<Prisma.ShotCreateOrConnectWithoutHoleInput> = z.object({
  where: z.lazy(() => ShotWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ShotCreateWithoutHoleInputSchema),z.lazy(() => ShotUncheckedCreateWithoutHoleInputSchema) ]),
}).strict();

export const ShotCreateManyHoleInputEnvelopeSchema: z.ZodType<Prisma.ShotCreateManyHoleInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ShotCreateManyHoleInputSchema),z.lazy(() => ShotCreateManyHoleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const HoleScoreCreateWithoutHoleInputSchema: z.ZodType<Prisma.HoleScoreCreateWithoutHoleInput> = z.object({
  id: z.string().cuid().optional(),
  score: z.number().int(),
  putts: z.number().int().optional().nullable(),
  fairway: z.boolean().optional().nullable(),
  gir: z.boolean().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  round: z.lazy(() => RoundCreateNestedOneWithoutHoleScoresInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutHoleScoresInputSchema)
}).strict();

export const HoleScoreUncheckedCreateWithoutHoleInputSchema: z.ZodType<Prisma.HoleScoreUncheckedCreateWithoutHoleInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  userId: z.string(),
  score: z.number().int(),
  putts: z.number().int().optional().nullable(),
  fairway: z.boolean().optional().nullable(),
  gir: z.boolean().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const HoleScoreCreateOrConnectWithoutHoleInputSchema: z.ZodType<Prisma.HoleScoreCreateOrConnectWithoutHoleInput> = z.object({
  where: z.lazy(() => HoleScoreWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutHoleInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutHoleInputSchema) ]),
}).strict();

export const HoleScoreCreateManyHoleInputEnvelopeSchema: z.ZodType<Prisma.HoleScoreCreateManyHoleInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => HoleScoreCreateManyHoleInputSchema),z.lazy(() => HoleScoreCreateManyHoleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CourseUpsertWithoutHolesInputSchema: z.ZodType<Prisma.CourseUpsertWithoutHolesInput> = z.object({
  update: z.union([ z.lazy(() => CourseUpdateWithoutHolesInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutHolesInputSchema) ]),
  create: z.union([ z.lazy(() => CourseCreateWithoutHolesInputSchema),z.lazy(() => CourseUncheckedCreateWithoutHolesInputSchema) ]),
  where: z.lazy(() => CourseWhereInputSchema).optional()
}).strict();

export const CourseUpdateToOneWithWhereWithoutHolesInputSchema: z.ZodType<Prisma.CourseUpdateToOneWithWhereWithoutHolesInput> = z.object({
  where: z.lazy(() => CourseWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CourseUpdateWithoutHolesInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutHolesInputSchema) ]),
}).strict();

export const CourseUpdateWithoutHolesInputSchema: z.ZodType<Prisma.CourseUpdateWithoutHolesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  slope: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundUpdateManyWithoutCourseNestedInputSchema).optional()
}).strict();

export const CourseUncheckedUpdateWithoutHolesInputSchema: z.ZodType<Prisma.CourseUncheckedUpdateWithoutHolesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  slope: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundUncheckedUpdateManyWithoutCourseNestedInputSchema).optional()
}).strict();

export const ShotUpsertWithWhereUniqueWithoutHoleInputSchema: z.ZodType<Prisma.ShotUpsertWithWhereUniqueWithoutHoleInput> = z.object({
  where: z.lazy(() => ShotWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ShotUpdateWithoutHoleInputSchema),z.lazy(() => ShotUncheckedUpdateWithoutHoleInputSchema) ]),
  create: z.union([ z.lazy(() => ShotCreateWithoutHoleInputSchema),z.lazy(() => ShotUncheckedCreateWithoutHoleInputSchema) ]),
}).strict();

export const ShotUpdateWithWhereUniqueWithoutHoleInputSchema: z.ZodType<Prisma.ShotUpdateWithWhereUniqueWithoutHoleInput> = z.object({
  where: z.lazy(() => ShotWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ShotUpdateWithoutHoleInputSchema),z.lazy(() => ShotUncheckedUpdateWithoutHoleInputSchema) ]),
}).strict();

export const ShotUpdateManyWithWhereWithoutHoleInputSchema: z.ZodType<Prisma.ShotUpdateManyWithWhereWithoutHoleInput> = z.object({
  where: z.lazy(() => ShotScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ShotUpdateManyMutationInputSchema),z.lazy(() => ShotUncheckedUpdateManyWithoutHoleInputSchema) ]),
}).strict();

export const HoleScoreUpsertWithWhereUniqueWithoutHoleInputSchema: z.ZodType<Prisma.HoleScoreUpsertWithWhereUniqueWithoutHoleInput> = z.object({
  where: z.lazy(() => HoleScoreWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => HoleScoreUpdateWithoutHoleInputSchema),z.lazy(() => HoleScoreUncheckedUpdateWithoutHoleInputSchema) ]),
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutHoleInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutHoleInputSchema) ]),
}).strict();

export const HoleScoreUpdateWithWhereUniqueWithoutHoleInputSchema: z.ZodType<Prisma.HoleScoreUpdateWithWhereUniqueWithoutHoleInput> = z.object({
  where: z.lazy(() => HoleScoreWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => HoleScoreUpdateWithoutHoleInputSchema),z.lazy(() => HoleScoreUncheckedUpdateWithoutHoleInputSchema) ]),
}).strict();

export const HoleScoreUpdateManyWithWhereWithoutHoleInputSchema: z.ZodType<Prisma.HoleScoreUpdateManyWithWhereWithoutHoleInput> = z.object({
  where: z.lazy(() => HoleScoreScalarWhereInputSchema),
  data: z.union([ z.lazy(() => HoleScoreUpdateManyMutationInputSchema),z.lazy(() => HoleScoreUncheckedUpdateManyWithoutHoleInputSchema) ]),
}).strict();

export const UserCreateWithoutRoundsInputSchema: z.ZodType<Prisma.UserCreateWithoutRoundsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  handicap: z.number().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  shots: z.lazy(() => ShotCreateNestedManyWithoutUserInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutRoundsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutRoundsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  handicap: z.number().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  shots: z.lazy(() => ShotUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutRoundsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutRoundsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutRoundsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoundsInputSchema) ]),
}).strict();

export const CourseCreateWithoutRoundsInputSchema: z.ZodType<Prisma.CourseCreateWithoutRoundsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
  slope: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  holes: z.lazy(() => HoleCreateNestedManyWithoutCourseInputSchema).optional()
}).strict();

export const CourseUncheckedCreateWithoutRoundsInputSchema: z.ZodType<Prisma.CourseUncheckedCreateWithoutRoundsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  rating: z.number().optional().nullable(),
  slope: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  holes: z.lazy(() => HoleUncheckedCreateNestedManyWithoutCourseInputSchema).optional()
}).strict();

export const CourseCreateOrConnectWithoutRoundsInputSchema: z.ZodType<Prisma.CourseCreateOrConnectWithoutRoundsInput> = z.object({
  where: z.lazy(() => CourseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CourseCreateWithoutRoundsInputSchema),z.lazy(() => CourseUncheckedCreateWithoutRoundsInputSchema) ]),
}).strict();

export const ShotCreateWithoutRoundInputSchema: z.ZodType<Prisma.ShotCreateWithoutRoundInput> = z.object({
  id: z.string().cuid().optional(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutShotsInputSchema),
  hole: z.lazy(() => HoleCreateNestedOneWithoutShotsInputSchema)
}).strict();

export const ShotUncheckedCreateWithoutRoundInputSchema: z.ZodType<Prisma.ShotUncheckedCreateWithoutRoundInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  holeId: z.string(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ShotCreateOrConnectWithoutRoundInputSchema: z.ZodType<Prisma.ShotCreateOrConnectWithoutRoundInput> = z.object({
  where: z.lazy(() => ShotWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ShotCreateWithoutRoundInputSchema),z.lazy(() => ShotUncheckedCreateWithoutRoundInputSchema) ]),
}).strict();

export const ShotCreateManyRoundInputEnvelopeSchema: z.ZodType<Prisma.ShotCreateManyRoundInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ShotCreateManyRoundInputSchema),z.lazy(() => ShotCreateManyRoundInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const HoleScoreCreateWithoutRoundInputSchema: z.ZodType<Prisma.HoleScoreCreateWithoutRoundInput> = z.object({
  id: z.string().cuid().optional(),
  score: z.number().int(),
  putts: z.number().int().optional().nullable(),
  fairway: z.boolean().optional().nullable(),
  gir: z.boolean().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  hole: z.lazy(() => HoleCreateNestedOneWithoutHoleScoresInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutHoleScoresInputSchema)
}).strict();

export const HoleScoreUncheckedCreateWithoutRoundInputSchema: z.ZodType<Prisma.HoleScoreUncheckedCreateWithoutRoundInput> = z.object({
  id: z.string().cuid().optional(),
  holeId: z.string(),
  userId: z.string(),
  score: z.number().int(),
  putts: z.number().int().optional().nullable(),
  fairway: z.boolean().optional().nullable(),
  gir: z.boolean().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const HoleScoreCreateOrConnectWithoutRoundInputSchema: z.ZodType<Prisma.HoleScoreCreateOrConnectWithoutRoundInput> = z.object({
  where: z.lazy(() => HoleScoreWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutRoundInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutRoundInputSchema) ]),
}).strict();

export const HoleScoreCreateManyRoundInputEnvelopeSchema: z.ZodType<Prisma.HoleScoreCreateManyRoundInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => HoleScoreCreateManyRoundInputSchema),z.lazy(() => HoleScoreCreateManyRoundInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutRoundsInputSchema: z.ZodType<Prisma.UserUpsertWithoutRoundsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutRoundsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRoundsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutRoundsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoundsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutRoundsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutRoundsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutRoundsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRoundsInputSchema) ]),
}).strict();

export const UserUpdateWithoutRoundsInputSchema: z.ZodType<Prisma.UserUpdateWithoutRoundsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  handicap: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  shots: z.lazy(() => ShotUpdateManyWithoutUserNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutRoundsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutRoundsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  handicap: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  shots: z.lazy(() => ShotUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const CourseUpsertWithoutRoundsInputSchema: z.ZodType<Prisma.CourseUpsertWithoutRoundsInput> = z.object({
  update: z.union([ z.lazy(() => CourseUpdateWithoutRoundsInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutRoundsInputSchema) ]),
  create: z.union([ z.lazy(() => CourseCreateWithoutRoundsInputSchema),z.lazy(() => CourseUncheckedCreateWithoutRoundsInputSchema) ]),
  where: z.lazy(() => CourseWhereInputSchema).optional()
}).strict();

export const CourseUpdateToOneWithWhereWithoutRoundsInputSchema: z.ZodType<Prisma.CourseUpdateToOneWithWhereWithoutRoundsInput> = z.object({
  where: z.lazy(() => CourseWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CourseUpdateWithoutRoundsInputSchema),z.lazy(() => CourseUncheckedUpdateWithoutRoundsInputSchema) ]),
}).strict();

export const CourseUpdateWithoutRoundsInputSchema: z.ZodType<Prisma.CourseUpdateWithoutRoundsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  slope: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  holes: z.lazy(() => HoleUpdateManyWithoutCourseNestedInputSchema).optional()
}).strict();

export const CourseUncheckedUpdateWithoutRoundsInputSchema: z.ZodType<Prisma.CourseUncheckedUpdateWithoutRoundsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  location: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  bounds: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rating: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  slope: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  holes: z.lazy(() => HoleUncheckedUpdateManyWithoutCourseNestedInputSchema).optional()
}).strict();

export const ShotUpsertWithWhereUniqueWithoutRoundInputSchema: z.ZodType<Prisma.ShotUpsertWithWhereUniqueWithoutRoundInput> = z.object({
  where: z.lazy(() => ShotWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ShotUpdateWithoutRoundInputSchema),z.lazy(() => ShotUncheckedUpdateWithoutRoundInputSchema) ]),
  create: z.union([ z.lazy(() => ShotCreateWithoutRoundInputSchema),z.lazy(() => ShotUncheckedCreateWithoutRoundInputSchema) ]),
}).strict();

export const ShotUpdateWithWhereUniqueWithoutRoundInputSchema: z.ZodType<Prisma.ShotUpdateWithWhereUniqueWithoutRoundInput> = z.object({
  where: z.lazy(() => ShotWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ShotUpdateWithoutRoundInputSchema),z.lazy(() => ShotUncheckedUpdateWithoutRoundInputSchema) ]),
}).strict();

export const ShotUpdateManyWithWhereWithoutRoundInputSchema: z.ZodType<Prisma.ShotUpdateManyWithWhereWithoutRoundInput> = z.object({
  where: z.lazy(() => ShotScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ShotUpdateManyMutationInputSchema),z.lazy(() => ShotUncheckedUpdateManyWithoutRoundInputSchema) ]),
}).strict();

export const HoleScoreUpsertWithWhereUniqueWithoutRoundInputSchema: z.ZodType<Prisma.HoleScoreUpsertWithWhereUniqueWithoutRoundInput> = z.object({
  where: z.lazy(() => HoleScoreWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => HoleScoreUpdateWithoutRoundInputSchema),z.lazy(() => HoleScoreUncheckedUpdateWithoutRoundInputSchema) ]),
  create: z.union([ z.lazy(() => HoleScoreCreateWithoutRoundInputSchema),z.lazy(() => HoleScoreUncheckedCreateWithoutRoundInputSchema) ]),
}).strict();

export const HoleScoreUpdateWithWhereUniqueWithoutRoundInputSchema: z.ZodType<Prisma.HoleScoreUpdateWithWhereUniqueWithoutRoundInput> = z.object({
  where: z.lazy(() => HoleScoreWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => HoleScoreUpdateWithoutRoundInputSchema),z.lazy(() => HoleScoreUncheckedUpdateWithoutRoundInputSchema) ]),
}).strict();

export const HoleScoreUpdateManyWithWhereWithoutRoundInputSchema: z.ZodType<Prisma.HoleScoreUpdateManyWithWhereWithoutRoundInput> = z.object({
  where: z.lazy(() => HoleScoreScalarWhereInputSchema),
  data: z.union([ z.lazy(() => HoleScoreUpdateManyMutationInputSchema),z.lazy(() => HoleScoreUncheckedUpdateManyWithoutRoundInputSchema) ]),
}).strict();

export const RoundCreateWithoutShotsInputSchema: z.ZodType<Prisma.RoundCreateWithoutShotsInput> = z.object({
  id: z.string().cuid().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutRoundsInputSchema),
  course: z.lazy(() => CourseCreateNestedOneWithoutRoundsInputSchema),
  holeScores: z.lazy(() => HoleScoreCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundUncheckedCreateWithoutShotsInputSchema: z.ZodType<Prisma.RoundUncheckedCreateWithoutShotsInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  courseId: z.string(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundCreateOrConnectWithoutShotsInputSchema: z.ZodType<Prisma.RoundCreateOrConnectWithoutShotsInput> = z.object({
  where: z.lazy(() => RoundWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoundCreateWithoutShotsInputSchema),z.lazy(() => RoundUncheckedCreateWithoutShotsInputSchema) ]),
}).strict();

export const UserCreateWithoutShotsInputSchema: z.ZodType<Prisma.UserCreateWithoutShotsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  handicap: z.number().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  rounds: z.lazy(() => RoundCreateNestedManyWithoutUserInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutShotsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutShotsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  handicap: z.number().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  rounds: z.lazy(() => RoundUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutShotsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutShotsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutShotsInputSchema),z.lazy(() => UserUncheckedCreateWithoutShotsInputSchema) ]),
}).strict();

export const HoleCreateWithoutShotsInputSchema: z.ZodType<Prisma.HoleCreateWithoutShotsInput> = z.object({
  id: z.string().cuid().optional(),
  holeNumber: z.number().int(),
  par: z.number().int(),
  yardage: z.number().int(),
  handicap: z.number().int().optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  description: z.string().optional().nullable(),
  course: z.lazy(() => CourseCreateNestedOneWithoutHolesInputSchema),
  holeScores: z.lazy(() => HoleScoreCreateNestedManyWithoutHoleInputSchema).optional()
}).strict();

export const HoleUncheckedCreateWithoutShotsInputSchema: z.ZodType<Prisma.HoleUncheckedCreateWithoutShotsInput> = z.object({
  id: z.string().cuid().optional(),
  courseId: z.string(),
  holeNumber: z.number().int(),
  par: z.number().int(),
  yardage: z.number().int(),
  handicap: z.number().int().optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  description: z.string().optional().nullable(),
  holeScores: z.lazy(() => HoleScoreUncheckedCreateNestedManyWithoutHoleInputSchema).optional()
}).strict();

export const HoleCreateOrConnectWithoutShotsInputSchema: z.ZodType<Prisma.HoleCreateOrConnectWithoutShotsInput> = z.object({
  where: z.lazy(() => HoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HoleCreateWithoutShotsInputSchema),z.lazy(() => HoleUncheckedCreateWithoutShotsInputSchema) ]),
}).strict();

export const RoundUpsertWithoutShotsInputSchema: z.ZodType<Prisma.RoundUpsertWithoutShotsInput> = z.object({
  update: z.union([ z.lazy(() => RoundUpdateWithoutShotsInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutShotsInputSchema) ]),
  create: z.union([ z.lazy(() => RoundCreateWithoutShotsInputSchema),z.lazy(() => RoundUncheckedCreateWithoutShotsInputSchema) ]),
  where: z.lazy(() => RoundWhereInputSchema).optional()
}).strict();

export const RoundUpdateToOneWithWhereWithoutShotsInputSchema: z.ZodType<Prisma.RoundUpdateToOneWithWhereWithoutShotsInput> = z.object({
  where: z.lazy(() => RoundWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RoundUpdateWithoutShotsInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutShotsInputSchema) ]),
}).strict();

export const RoundUpdateWithoutShotsInputSchema: z.ZodType<Prisma.RoundUpdateWithoutShotsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutRoundsNestedInputSchema).optional(),
  course: z.lazy(() => CourseUpdateOneRequiredWithoutRoundsNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const RoundUncheckedUpdateWithoutShotsInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateWithoutShotsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutShotsInputSchema: z.ZodType<Prisma.UserUpsertWithoutShotsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutShotsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutShotsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutShotsInputSchema),z.lazy(() => UserUncheckedCreateWithoutShotsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutShotsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutShotsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutShotsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutShotsInputSchema) ]),
}).strict();

export const UserUpdateWithoutShotsInputSchema: z.ZodType<Prisma.UserUpdateWithoutShotsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  handicap: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundUpdateManyWithoutUserNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutShotsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutShotsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  handicap: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const HoleUpsertWithoutShotsInputSchema: z.ZodType<Prisma.HoleUpsertWithoutShotsInput> = z.object({
  update: z.union([ z.lazy(() => HoleUpdateWithoutShotsInputSchema),z.lazy(() => HoleUncheckedUpdateWithoutShotsInputSchema) ]),
  create: z.union([ z.lazy(() => HoleCreateWithoutShotsInputSchema),z.lazy(() => HoleUncheckedCreateWithoutShotsInputSchema) ]),
  where: z.lazy(() => HoleWhereInputSchema).optional()
}).strict();

export const HoleUpdateToOneWithWhereWithoutShotsInputSchema: z.ZodType<Prisma.HoleUpdateToOneWithWhereWithoutShotsInput> = z.object({
  where: z.lazy(() => HoleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => HoleUpdateWithoutShotsInputSchema),z.lazy(() => HoleUncheckedUpdateWithoutShotsInputSchema) ]),
}).strict();

export const HoleUpdateWithoutShotsInputSchema: z.ZodType<Prisma.HoleUpdateWithoutShotsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  par: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  yardage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  handicap: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  course: z.lazy(() => CourseUpdateOneRequiredWithoutHolesNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUpdateManyWithoutHoleNestedInputSchema).optional()
}).strict();

export const HoleUncheckedUpdateWithoutShotsInputSchema: z.ZodType<Prisma.HoleUncheckedUpdateWithoutShotsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  par: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  yardage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  handicap: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holeScores: z.lazy(() => HoleScoreUncheckedUpdateManyWithoutHoleNestedInputSchema).optional()
}).strict();

export const RoundCreateWithoutHoleScoresInputSchema: z.ZodType<Prisma.RoundCreateWithoutHoleScoresInput> = z.object({
  id: z.string().cuid().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutRoundsInputSchema),
  course: z.lazy(() => CourseCreateNestedOneWithoutRoundsInputSchema),
  shots: z.lazy(() => ShotCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundUncheckedCreateWithoutHoleScoresInputSchema: z.ZodType<Prisma.RoundUncheckedCreateWithoutHoleScoresInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  courseId: z.string(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  shots: z.lazy(() => ShotUncheckedCreateNestedManyWithoutRoundInputSchema).optional()
}).strict();

export const RoundCreateOrConnectWithoutHoleScoresInputSchema: z.ZodType<Prisma.RoundCreateOrConnectWithoutHoleScoresInput> = z.object({
  where: z.lazy(() => RoundWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoundCreateWithoutHoleScoresInputSchema),z.lazy(() => RoundUncheckedCreateWithoutHoleScoresInputSchema) ]),
}).strict();

export const HoleCreateWithoutHoleScoresInputSchema: z.ZodType<Prisma.HoleCreateWithoutHoleScoresInput> = z.object({
  id: z.string().cuid().optional(),
  holeNumber: z.number().int(),
  par: z.number().int(),
  yardage: z.number().int(),
  handicap: z.number().int().optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  description: z.string().optional().nullable(),
  course: z.lazy(() => CourseCreateNestedOneWithoutHolesInputSchema),
  shots: z.lazy(() => ShotCreateNestedManyWithoutHoleInputSchema).optional()
}).strict();

export const HoleUncheckedCreateWithoutHoleScoresInputSchema: z.ZodType<Prisma.HoleUncheckedCreateWithoutHoleScoresInput> = z.object({
  id: z.string().cuid().optional(),
  courseId: z.string(),
  holeNumber: z.number().int(),
  par: z.number().int(),
  yardage: z.number().int(),
  handicap: z.number().int().optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  description: z.string().optional().nullable(),
  shots: z.lazy(() => ShotUncheckedCreateNestedManyWithoutHoleInputSchema).optional()
}).strict();

export const HoleCreateOrConnectWithoutHoleScoresInputSchema: z.ZodType<Prisma.HoleCreateOrConnectWithoutHoleScoresInput> = z.object({
  where: z.lazy(() => HoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HoleCreateWithoutHoleScoresInputSchema),z.lazy(() => HoleUncheckedCreateWithoutHoleScoresInputSchema) ]),
}).strict();

export const UserCreateWithoutHoleScoresInputSchema: z.ZodType<Prisma.UserCreateWithoutHoleScoresInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  handicap: z.number().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  rounds: z.lazy(() => RoundCreateNestedManyWithoutUserInputSchema).optional(),
  shots: z.lazy(() => ShotCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutHoleScoresInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutHoleScoresInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  handicap: z.number().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  rounds: z.lazy(() => RoundUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  shots: z.lazy(() => ShotUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutHoleScoresInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutHoleScoresInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutHoleScoresInputSchema),z.lazy(() => UserUncheckedCreateWithoutHoleScoresInputSchema) ]),
}).strict();

export const RoundUpsertWithoutHoleScoresInputSchema: z.ZodType<Prisma.RoundUpsertWithoutHoleScoresInput> = z.object({
  update: z.union([ z.lazy(() => RoundUpdateWithoutHoleScoresInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutHoleScoresInputSchema) ]),
  create: z.union([ z.lazy(() => RoundCreateWithoutHoleScoresInputSchema),z.lazy(() => RoundUncheckedCreateWithoutHoleScoresInputSchema) ]),
  where: z.lazy(() => RoundWhereInputSchema).optional()
}).strict();

export const RoundUpdateToOneWithWhereWithoutHoleScoresInputSchema: z.ZodType<Prisma.RoundUpdateToOneWithWhereWithoutHoleScoresInput> = z.object({
  where: z.lazy(() => RoundWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RoundUpdateWithoutHoleScoresInputSchema),z.lazy(() => RoundUncheckedUpdateWithoutHoleScoresInputSchema) ]),
}).strict();

export const RoundUpdateWithoutHoleScoresInputSchema: z.ZodType<Prisma.RoundUpdateWithoutHoleScoresInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutRoundsNestedInputSchema).optional(),
  course: z.lazy(() => CourseUpdateOneRequiredWithoutRoundsNestedInputSchema).optional(),
  shots: z.lazy(() => ShotUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const RoundUncheckedUpdateWithoutHoleScoresInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateWithoutHoleScoresInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  shots: z.lazy(() => ShotUncheckedUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const HoleUpsertWithoutHoleScoresInputSchema: z.ZodType<Prisma.HoleUpsertWithoutHoleScoresInput> = z.object({
  update: z.union([ z.lazy(() => HoleUpdateWithoutHoleScoresInputSchema),z.lazy(() => HoleUncheckedUpdateWithoutHoleScoresInputSchema) ]),
  create: z.union([ z.lazy(() => HoleCreateWithoutHoleScoresInputSchema),z.lazy(() => HoleUncheckedCreateWithoutHoleScoresInputSchema) ]),
  where: z.lazy(() => HoleWhereInputSchema).optional()
}).strict();

export const HoleUpdateToOneWithWhereWithoutHoleScoresInputSchema: z.ZodType<Prisma.HoleUpdateToOneWithWhereWithoutHoleScoresInput> = z.object({
  where: z.lazy(() => HoleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => HoleUpdateWithoutHoleScoresInputSchema),z.lazy(() => HoleUncheckedUpdateWithoutHoleScoresInputSchema) ]),
}).strict();

export const HoleUpdateWithoutHoleScoresInputSchema: z.ZodType<Prisma.HoleUpdateWithoutHoleScoresInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  par: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  yardage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  handicap: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  course: z.lazy(() => CourseUpdateOneRequiredWithoutHolesNestedInputSchema).optional(),
  shots: z.lazy(() => ShotUpdateManyWithoutHoleNestedInputSchema).optional()
}).strict();

export const HoleUncheckedUpdateWithoutHoleScoresInputSchema: z.ZodType<Prisma.HoleUncheckedUpdateWithoutHoleScoresInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  par: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  yardage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  handicap: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shots: z.lazy(() => ShotUncheckedUpdateManyWithoutHoleNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutHoleScoresInputSchema: z.ZodType<Prisma.UserUpsertWithoutHoleScoresInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutHoleScoresInputSchema),z.lazy(() => UserUncheckedUpdateWithoutHoleScoresInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutHoleScoresInputSchema),z.lazy(() => UserUncheckedCreateWithoutHoleScoresInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutHoleScoresInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutHoleScoresInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutHoleScoresInputSchema),z.lazy(() => UserUncheckedUpdateWithoutHoleScoresInputSchema) ]),
}).strict();

export const UserUpdateWithoutHoleScoresInputSchema: z.ZodType<Prisma.UserUpdateWithoutHoleScoresInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  handicap: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundUpdateManyWithoutUserNestedInputSchema).optional(),
  shots: z.lazy(() => ShotUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutHoleScoresInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutHoleScoresInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  handicap: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileImage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  rounds: z.lazy(() => RoundUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  shots: z.lazy(() => ShotUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const RoundCreateManyUserInputSchema: z.ZodType<Prisma.RoundCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  courseId: z.string(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ShotCreateManyUserInputSchema: z.ZodType<Prisma.ShotCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  holeId: z.string(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const HoleScoreCreateManyUserInputSchema: z.ZodType<Prisma.HoleScoreCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  holeId: z.string(),
  score: z.number().int(),
  putts: z.number().int().optional().nullable(),
  fairway: z.boolean().optional().nullable(),
  gir: z.boolean().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RoundUpdateWithoutUserInputSchema: z.ZodType<Prisma.RoundUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  course: z.lazy(() => CourseUpdateOneRequiredWithoutRoundsNestedInputSchema).optional(),
  shots: z.lazy(() => ShotUpdateManyWithoutRoundNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const RoundUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  shots: z.lazy(() => ShotUncheckedUpdateManyWithoutRoundNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const RoundUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  courseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShotUpdateWithoutUserInputSchema: z.ZodType<Prisma.ShotUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  round: z.lazy(() => RoundUpdateOneRequiredWithoutShotsNestedInputSchema).optional(),
  hole: z.lazy(() => HoleUpdateOneRequiredWithoutShotsNestedInputSchema).optional()
}).strict();

export const ShotUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ShotUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShotUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ShotUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HoleScoreUpdateWithoutUserInputSchema: z.ZodType<Prisma.HoleScoreUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  round: z.lazy(() => RoundUpdateOneRequiredWithoutHoleScoresNestedInputSchema).optional(),
  hole: z.lazy(() => HoleUpdateOneRequiredWithoutHoleScoresNestedInputSchema).optional()
}).strict();

export const HoleScoreUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.HoleScoreUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HoleScoreUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.HoleScoreUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HoleCreateManyCourseInputSchema: z.ZodType<Prisma.HoleCreateManyCourseInput> = z.object({
  id: z.string().cuid().optional(),
  holeNumber: z.number().int(),
  par: z.number().int(),
  yardage: z.number().int(),
  handicap: z.number().int().optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  description: z.string().optional().nullable()
}).strict();

export const RoundCreateManyCourseInputSchema: z.ZodType<Prisma.RoundCreateManyCourseInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional().nullable(),
  weather: z.string().optional().nullable(),
  temperature: z.number().int().optional().nullable(),
  windSpeed: z.number().int().optional().nullable(),
  windDirection: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const HoleUpdateWithoutCourseInputSchema: z.ZodType<Prisma.HoleUpdateWithoutCourseInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  par: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  yardage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  handicap: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shots: z.lazy(() => ShotUpdateManyWithoutHoleNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUpdateManyWithoutHoleNestedInputSchema).optional()
}).strict();

export const HoleUncheckedUpdateWithoutCourseInputSchema: z.ZodType<Prisma.HoleUncheckedUpdateWithoutCourseInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  par: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  yardage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  handicap: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shots: z.lazy(() => ShotUncheckedUpdateManyWithoutHoleNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedUpdateManyWithoutHoleNestedInputSchema).optional()
}).strict();

export const HoleUncheckedUpdateManyWithoutCourseInputSchema: z.ZodType<Prisma.HoleUncheckedUpdateManyWithoutCourseInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  par: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  yardage: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  handicap: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  teeLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  greenLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const RoundUpdateWithoutCourseInputSchema: z.ZodType<Prisma.RoundUpdateWithoutCourseInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutRoundsNestedInputSchema).optional(),
  shots: z.lazy(() => ShotUpdateManyWithoutRoundNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const RoundUncheckedUpdateWithoutCourseInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateWithoutCourseInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  shots: z.lazy(() => ShotUncheckedUpdateManyWithoutRoundNestedInputSchema).optional(),
  holeScores: z.lazy(() => HoleScoreUncheckedUpdateManyWithoutRoundNestedInputSchema).optional()
}).strict();

export const RoundUncheckedUpdateManyWithoutCourseInputSchema: z.ZodType<Prisma.RoundUncheckedUpdateManyWithoutCourseInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  weather: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  temperature: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windSpeed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  windDirection: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShotCreateManyHoleInputSchema: z.ZodType<Prisma.ShotCreateManyHoleInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  userId: z.string(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const HoleScoreCreateManyHoleInputSchema: z.ZodType<Prisma.HoleScoreCreateManyHoleInput> = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string(),
  userId: z.string(),
  score: z.number().int(),
  putts: z.number().int().optional().nullable(),
  fairway: z.boolean().optional().nullable(),
  gir: z.boolean().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ShotUpdateWithoutHoleInputSchema: z.ZodType<Prisma.ShotUpdateWithoutHoleInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  round: z.lazy(() => RoundUpdateOneRequiredWithoutShotsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutShotsNestedInputSchema).optional()
}).strict();

export const ShotUncheckedUpdateWithoutHoleInputSchema: z.ZodType<Prisma.ShotUncheckedUpdateWithoutHoleInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShotUncheckedUpdateManyWithoutHoleInputSchema: z.ZodType<Prisma.ShotUncheckedUpdateManyWithoutHoleInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HoleScoreUpdateWithoutHoleInputSchema: z.ZodType<Prisma.HoleScoreUpdateWithoutHoleInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  round: z.lazy(() => RoundUpdateOneRequiredWithoutHoleScoresNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutHoleScoresNestedInputSchema).optional()
}).strict();

export const HoleScoreUncheckedUpdateWithoutHoleInputSchema: z.ZodType<Prisma.HoleScoreUncheckedUpdateWithoutHoleInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HoleScoreUncheckedUpdateManyWithoutHoleInputSchema: z.ZodType<Prisma.HoleScoreUncheckedUpdateManyWithoutHoleInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roundId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShotCreateManyRoundInputSchema: z.ZodType<Prisma.ShotCreateManyRoundInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  holeId: z.string(),
  shotNumber: z.number().int(),
  club: z.string(),
  distance: z.number().optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const HoleScoreCreateManyRoundInputSchema: z.ZodType<Prisma.HoleScoreCreateManyRoundInput> = z.object({
  id: z.string().cuid().optional(),
  holeId: z.string(),
  userId: z.string(),
  score: z.number().int(),
  putts: z.number().int().optional().nullable(),
  fairway: z.boolean().optional().nullable(),
  gir: z.boolean().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ShotUpdateWithoutRoundInputSchema: z.ZodType<Prisma.ShotUpdateWithoutRoundInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutShotsNestedInputSchema).optional(),
  hole: z.lazy(() => HoleUpdateOneRequiredWithoutShotsNestedInputSchema).optional()
}).strict();

export const ShotUncheckedUpdateWithoutRoundInputSchema: z.ZodType<Prisma.ShotUncheckedUpdateWithoutRoundInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ShotUncheckedUpdateManyWithoutRoundInputSchema: z.ZodType<Prisma.ShotUncheckedUpdateManyWithoutRoundInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  shotNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  club: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLocation: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  endLocation: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HoleScoreUpdateWithoutRoundInputSchema: z.ZodType<Prisma.HoleScoreUpdateWithoutRoundInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  hole: z.lazy(() => HoleUpdateOneRequiredWithoutHoleScoresNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutHoleScoresNestedInputSchema).optional()
}).strict();

export const HoleScoreUncheckedUpdateWithoutRoundInputSchema: z.ZodType<Prisma.HoleScoreUncheckedUpdateWithoutRoundInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HoleScoreUncheckedUpdateManyWithoutRoundInputSchema: z.ZodType<Prisma.HoleScoreUncheckedUpdateManyWithoutRoundInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  holeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  putts: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fairway: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gir: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const CourseFindFirstArgsSchema: z.ZodType<Prisma.CourseFindFirstArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereInputSchema.optional(),
  orderBy: z.union([ CourseOrderByWithRelationInputSchema.array(),CourseOrderByWithRelationInputSchema ]).optional(),
  cursor: CourseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CourseScalarFieldEnumSchema,CourseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CourseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CourseFindFirstOrThrowArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereInputSchema.optional(),
  orderBy: z.union([ CourseOrderByWithRelationInputSchema.array(),CourseOrderByWithRelationInputSchema ]).optional(),
  cursor: CourseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CourseScalarFieldEnumSchema,CourseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CourseFindManyArgsSchema: z.ZodType<Prisma.CourseFindManyArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereInputSchema.optional(),
  orderBy: z.union([ CourseOrderByWithRelationInputSchema.array(),CourseOrderByWithRelationInputSchema ]).optional(),
  cursor: CourseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CourseScalarFieldEnumSchema,CourseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CourseAggregateArgsSchema: z.ZodType<Prisma.CourseAggregateArgs> = z.object({
  where: CourseWhereInputSchema.optional(),
  orderBy: z.union([ CourseOrderByWithRelationInputSchema.array(),CourseOrderByWithRelationInputSchema ]).optional(),
  cursor: CourseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CourseGroupByArgsSchema: z.ZodType<Prisma.CourseGroupByArgs> = z.object({
  where: CourseWhereInputSchema.optional(),
  orderBy: z.union([ CourseOrderByWithAggregationInputSchema.array(),CourseOrderByWithAggregationInputSchema ]).optional(),
  by: CourseScalarFieldEnumSchema.array(),
  having: CourseScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CourseFindUniqueArgsSchema: z.ZodType<Prisma.CourseFindUniqueArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereUniqueInputSchema,
}).strict() ;

export const CourseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CourseFindUniqueOrThrowArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereUniqueInputSchema,
}).strict() ;

export const HoleFindFirstArgsSchema: z.ZodType<Prisma.HoleFindFirstArgs> = z.object({
  select: HoleSelectSchema.optional(),
  include: HoleIncludeSchema.optional(),
  where: HoleWhereInputSchema.optional(),
  orderBy: z.union([ HoleOrderByWithRelationInputSchema.array(),HoleOrderByWithRelationInputSchema ]).optional(),
  cursor: HoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ HoleScalarFieldEnumSchema,HoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const HoleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.HoleFindFirstOrThrowArgs> = z.object({
  select: HoleSelectSchema.optional(),
  include: HoleIncludeSchema.optional(),
  where: HoleWhereInputSchema.optional(),
  orderBy: z.union([ HoleOrderByWithRelationInputSchema.array(),HoleOrderByWithRelationInputSchema ]).optional(),
  cursor: HoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ HoleScalarFieldEnumSchema,HoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const HoleFindManyArgsSchema: z.ZodType<Prisma.HoleFindManyArgs> = z.object({
  select: HoleSelectSchema.optional(),
  include: HoleIncludeSchema.optional(),
  where: HoleWhereInputSchema.optional(),
  orderBy: z.union([ HoleOrderByWithRelationInputSchema.array(),HoleOrderByWithRelationInputSchema ]).optional(),
  cursor: HoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ HoleScalarFieldEnumSchema,HoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const HoleAggregateArgsSchema: z.ZodType<Prisma.HoleAggregateArgs> = z.object({
  where: HoleWhereInputSchema.optional(),
  orderBy: z.union([ HoleOrderByWithRelationInputSchema.array(),HoleOrderByWithRelationInputSchema ]).optional(),
  cursor: HoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const HoleGroupByArgsSchema: z.ZodType<Prisma.HoleGroupByArgs> = z.object({
  where: HoleWhereInputSchema.optional(),
  orderBy: z.union([ HoleOrderByWithAggregationInputSchema.array(),HoleOrderByWithAggregationInputSchema ]).optional(),
  by: HoleScalarFieldEnumSchema.array(),
  having: HoleScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const HoleFindUniqueArgsSchema: z.ZodType<Prisma.HoleFindUniqueArgs> = z.object({
  select: HoleSelectSchema.optional(),
  include: HoleIncludeSchema.optional(),
  where: HoleWhereUniqueInputSchema,
}).strict() ;

export const HoleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.HoleFindUniqueOrThrowArgs> = z.object({
  select: HoleSelectSchema.optional(),
  include: HoleIncludeSchema.optional(),
  where: HoleWhereUniqueInputSchema,
}).strict() ;

export const RoundFindFirstArgsSchema: z.ZodType<Prisma.RoundFindFirstArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereInputSchema.optional(),
  orderBy: z.union([ RoundOrderByWithRelationInputSchema.array(),RoundOrderByWithRelationInputSchema ]).optional(),
  cursor: RoundWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoundScalarFieldEnumSchema,RoundScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoundFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RoundFindFirstOrThrowArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereInputSchema.optional(),
  orderBy: z.union([ RoundOrderByWithRelationInputSchema.array(),RoundOrderByWithRelationInputSchema ]).optional(),
  cursor: RoundWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoundScalarFieldEnumSchema,RoundScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoundFindManyArgsSchema: z.ZodType<Prisma.RoundFindManyArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereInputSchema.optional(),
  orderBy: z.union([ RoundOrderByWithRelationInputSchema.array(),RoundOrderByWithRelationInputSchema ]).optional(),
  cursor: RoundWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoundScalarFieldEnumSchema,RoundScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoundAggregateArgsSchema: z.ZodType<Prisma.RoundAggregateArgs> = z.object({
  where: RoundWhereInputSchema.optional(),
  orderBy: z.union([ RoundOrderByWithRelationInputSchema.array(),RoundOrderByWithRelationInputSchema ]).optional(),
  cursor: RoundWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RoundGroupByArgsSchema: z.ZodType<Prisma.RoundGroupByArgs> = z.object({
  where: RoundWhereInputSchema.optional(),
  orderBy: z.union([ RoundOrderByWithAggregationInputSchema.array(),RoundOrderByWithAggregationInputSchema ]).optional(),
  by: RoundScalarFieldEnumSchema.array(),
  having: RoundScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RoundFindUniqueArgsSchema: z.ZodType<Prisma.RoundFindUniqueArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereUniqueInputSchema,
}).strict() ;

export const RoundFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RoundFindUniqueOrThrowArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereUniqueInputSchema,
}).strict() ;

export const ShotFindFirstArgsSchema: z.ZodType<Prisma.ShotFindFirstArgs> = z.object({
  select: ShotSelectSchema.optional(),
  include: ShotIncludeSchema.optional(),
  where: ShotWhereInputSchema.optional(),
  orderBy: z.union([ ShotOrderByWithRelationInputSchema.array(),ShotOrderByWithRelationInputSchema ]).optional(),
  cursor: ShotWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShotScalarFieldEnumSchema,ShotScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShotFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ShotFindFirstOrThrowArgs> = z.object({
  select: ShotSelectSchema.optional(),
  include: ShotIncludeSchema.optional(),
  where: ShotWhereInputSchema.optional(),
  orderBy: z.union([ ShotOrderByWithRelationInputSchema.array(),ShotOrderByWithRelationInputSchema ]).optional(),
  cursor: ShotWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShotScalarFieldEnumSchema,ShotScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShotFindManyArgsSchema: z.ZodType<Prisma.ShotFindManyArgs> = z.object({
  select: ShotSelectSchema.optional(),
  include: ShotIncludeSchema.optional(),
  where: ShotWhereInputSchema.optional(),
  orderBy: z.union([ ShotOrderByWithRelationInputSchema.array(),ShotOrderByWithRelationInputSchema ]).optional(),
  cursor: ShotWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ShotScalarFieldEnumSchema,ShotScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ShotAggregateArgsSchema: z.ZodType<Prisma.ShotAggregateArgs> = z.object({
  where: ShotWhereInputSchema.optional(),
  orderBy: z.union([ ShotOrderByWithRelationInputSchema.array(),ShotOrderByWithRelationInputSchema ]).optional(),
  cursor: ShotWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ShotGroupByArgsSchema: z.ZodType<Prisma.ShotGroupByArgs> = z.object({
  where: ShotWhereInputSchema.optional(),
  orderBy: z.union([ ShotOrderByWithAggregationInputSchema.array(),ShotOrderByWithAggregationInputSchema ]).optional(),
  by: ShotScalarFieldEnumSchema.array(),
  having: ShotScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ShotFindUniqueArgsSchema: z.ZodType<Prisma.ShotFindUniqueArgs> = z.object({
  select: ShotSelectSchema.optional(),
  include: ShotIncludeSchema.optional(),
  where: ShotWhereUniqueInputSchema,
}).strict() ;

export const ShotFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ShotFindUniqueOrThrowArgs> = z.object({
  select: ShotSelectSchema.optional(),
  include: ShotIncludeSchema.optional(),
  where: ShotWhereUniqueInputSchema,
}).strict() ;

export const HoleScoreFindFirstArgsSchema: z.ZodType<Prisma.HoleScoreFindFirstArgs> = z.object({
  select: HoleScoreSelectSchema.optional(),
  include: HoleScoreIncludeSchema.optional(),
  where: HoleScoreWhereInputSchema.optional(),
  orderBy: z.union([ HoleScoreOrderByWithRelationInputSchema.array(),HoleScoreOrderByWithRelationInputSchema ]).optional(),
  cursor: HoleScoreWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ HoleScoreScalarFieldEnumSchema,HoleScoreScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const HoleScoreFindFirstOrThrowArgsSchema: z.ZodType<Prisma.HoleScoreFindFirstOrThrowArgs> = z.object({
  select: HoleScoreSelectSchema.optional(),
  include: HoleScoreIncludeSchema.optional(),
  where: HoleScoreWhereInputSchema.optional(),
  orderBy: z.union([ HoleScoreOrderByWithRelationInputSchema.array(),HoleScoreOrderByWithRelationInputSchema ]).optional(),
  cursor: HoleScoreWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ HoleScoreScalarFieldEnumSchema,HoleScoreScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const HoleScoreFindManyArgsSchema: z.ZodType<Prisma.HoleScoreFindManyArgs> = z.object({
  select: HoleScoreSelectSchema.optional(),
  include: HoleScoreIncludeSchema.optional(),
  where: HoleScoreWhereInputSchema.optional(),
  orderBy: z.union([ HoleScoreOrderByWithRelationInputSchema.array(),HoleScoreOrderByWithRelationInputSchema ]).optional(),
  cursor: HoleScoreWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ HoleScoreScalarFieldEnumSchema,HoleScoreScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const HoleScoreAggregateArgsSchema: z.ZodType<Prisma.HoleScoreAggregateArgs> = z.object({
  where: HoleScoreWhereInputSchema.optional(),
  orderBy: z.union([ HoleScoreOrderByWithRelationInputSchema.array(),HoleScoreOrderByWithRelationInputSchema ]).optional(),
  cursor: HoleScoreWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const HoleScoreGroupByArgsSchema: z.ZodType<Prisma.HoleScoreGroupByArgs> = z.object({
  where: HoleScoreWhereInputSchema.optional(),
  orderBy: z.union([ HoleScoreOrderByWithAggregationInputSchema.array(),HoleScoreOrderByWithAggregationInputSchema ]).optional(),
  by: HoleScoreScalarFieldEnumSchema.array(),
  having: HoleScoreScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const HoleScoreFindUniqueArgsSchema: z.ZodType<Prisma.HoleScoreFindUniqueArgs> = z.object({
  select: HoleScoreSelectSchema.optional(),
  include: HoleScoreIncludeSchema.optional(),
  where: HoleScoreWhereUniqueInputSchema,
}).strict() ;

export const HoleScoreFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.HoleScoreFindUniqueOrThrowArgs> = z.object({
  select: HoleScoreSelectSchema.optional(),
  include: HoleScoreIncludeSchema.optional(),
  where: HoleScoreWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const CourseCreateArgsSchema: z.ZodType<Prisma.CourseCreateArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  data: z.union([ CourseCreateInputSchema,CourseUncheckedCreateInputSchema ]),
}).strict() ;

export const CourseUpsertArgsSchema: z.ZodType<Prisma.CourseUpsertArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereUniqueInputSchema,
  create: z.union([ CourseCreateInputSchema,CourseUncheckedCreateInputSchema ]),
  update: z.union([ CourseUpdateInputSchema,CourseUncheckedUpdateInputSchema ]),
}).strict() ;

export const CourseCreateManyArgsSchema: z.ZodType<Prisma.CourseCreateManyArgs> = z.object({
  data: z.union([ CourseCreateManyInputSchema,CourseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CourseCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CourseCreateManyAndReturnArgs> = z.object({
  data: z.union([ CourseCreateManyInputSchema,CourseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CourseDeleteArgsSchema: z.ZodType<Prisma.CourseDeleteArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  where: CourseWhereUniqueInputSchema,
}).strict() ;

export const CourseUpdateArgsSchema: z.ZodType<Prisma.CourseUpdateArgs> = z.object({
  select: CourseSelectSchema.optional(),
  include: CourseIncludeSchema.optional(),
  data: z.union([ CourseUpdateInputSchema,CourseUncheckedUpdateInputSchema ]),
  where: CourseWhereUniqueInputSchema,
}).strict() ;

export const CourseUpdateManyArgsSchema: z.ZodType<Prisma.CourseUpdateManyArgs> = z.object({
  data: z.union([ CourseUpdateManyMutationInputSchema,CourseUncheckedUpdateManyInputSchema ]),
  where: CourseWhereInputSchema.optional(),
}).strict() ;

export const CourseDeleteManyArgsSchema: z.ZodType<Prisma.CourseDeleteManyArgs> = z.object({
  where: CourseWhereInputSchema.optional(),
}).strict() ;

export const HoleCreateArgsSchema: z.ZodType<Prisma.HoleCreateArgs> = z.object({
  select: HoleSelectSchema.optional(),
  include: HoleIncludeSchema.optional(),
  data: z.union([ HoleCreateInputSchema,HoleUncheckedCreateInputSchema ]),
}).strict() ;

export const HoleUpsertArgsSchema: z.ZodType<Prisma.HoleUpsertArgs> = z.object({
  select: HoleSelectSchema.optional(),
  include: HoleIncludeSchema.optional(),
  where: HoleWhereUniqueInputSchema,
  create: z.union([ HoleCreateInputSchema,HoleUncheckedCreateInputSchema ]),
  update: z.union([ HoleUpdateInputSchema,HoleUncheckedUpdateInputSchema ]),
}).strict() ;

export const HoleCreateManyArgsSchema: z.ZodType<Prisma.HoleCreateManyArgs> = z.object({
  data: z.union([ HoleCreateManyInputSchema,HoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const HoleCreateManyAndReturnArgsSchema: z.ZodType<Prisma.HoleCreateManyAndReturnArgs> = z.object({
  data: z.union([ HoleCreateManyInputSchema,HoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const HoleDeleteArgsSchema: z.ZodType<Prisma.HoleDeleteArgs> = z.object({
  select: HoleSelectSchema.optional(),
  include: HoleIncludeSchema.optional(),
  where: HoleWhereUniqueInputSchema,
}).strict() ;

export const HoleUpdateArgsSchema: z.ZodType<Prisma.HoleUpdateArgs> = z.object({
  select: HoleSelectSchema.optional(),
  include: HoleIncludeSchema.optional(),
  data: z.union([ HoleUpdateInputSchema,HoleUncheckedUpdateInputSchema ]),
  where: HoleWhereUniqueInputSchema,
}).strict() ;

export const HoleUpdateManyArgsSchema: z.ZodType<Prisma.HoleUpdateManyArgs> = z.object({
  data: z.union([ HoleUpdateManyMutationInputSchema,HoleUncheckedUpdateManyInputSchema ]),
  where: HoleWhereInputSchema.optional(),
}).strict() ;

export const HoleDeleteManyArgsSchema: z.ZodType<Prisma.HoleDeleteManyArgs> = z.object({
  where: HoleWhereInputSchema.optional(),
}).strict() ;

export const RoundCreateArgsSchema: z.ZodType<Prisma.RoundCreateArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  data: z.union([ RoundCreateInputSchema,RoundUncheckedCreateInputSchema ]),
}).strict() ;

export const RoundUpsertArgsSchema: z.ZodType<Prisma.RoundUpsertArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereUniqueInputSchema,
  create: z.union([ RoundCreateInputSchema,RoundUncheckedCreateInputSchema ]),
  update: z.union([ RoundUpdateInputSchema,RoundUncheckedUpdateInputSchema ]),
}).strict() ;

export const RoundCreateManyArgsSchema: z.ZodType<Prisma.RoundCreateManyArgs> = z.object({
  data: z.union([ RoundCreateManyInputSchema,RoundCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RoundCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RoundCreateManyAndReturnArgs> = z.object({
  data: z.union([ RoundCreateManyInputSchema,RoundCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RoundDeleteArgsSchema: z.ZodType<Prisma.RoundDeleteArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  where: RoundWhereUniqueInputSchema,
}).strict() ;

export const RoundUpdateArgsSchema: z.ZodType<Prisma.RoundUpdateArgs> = z.object({
  select: RoundSelectSchema.optional(),
  include: RoundIncludeSchema.optional(),
  data: z.union([ RoundUpdateInputSchema,RoundUncheckedUpdateInputSchema ]),
  where: RoundWhereUniqueInputSchema,
}).strict() ;

export const RoundUpdateManyArgsSchema: z.ZodType<Prisma.RoundUpdateManyArgs> = z.object({
  data: z.union([ RoundUpdateManyMutationInputSchema,RoundUncheckedUpdateManyInputSchema ]),
  where: RoundWhereInputSchema.optional(),
}).strict() ;

export const RoundDeleteManyArgsSchema: z.ZodType<Prisma.RoundDeleteManyArgs> = z.object({
  where: RoundWhereInputSchema.optional(),
}).strict() ;

export const ShotCreateArgsSchema: z.ZodType<Prisma.ShotCreateArgs> = z.object({
  select: ShotSelectSchema.optional(),
  include: ShotIncludeSchema.optional(),
  data: z.union([ ShotCreateInputSchema,ShotUncheckedCreateInputSchema ]),
}).strict() ;

export const ShotUpsertArgsSchema: z.ZodType<Prisma.ShotUpsertArgs> = z.object({
  select: ShotSelectSchema.optional(),
  include: ShotIncludeSchema.optional(),
  where: ShotWhereUniqueInputSchema,
  create: z.union([ ShotCreateInputSchema,ShotUncheckedCreateInputSchema ]),
  update: z.union([ ShotUpdateInputSchema,ShotUncheckedUpdateInputSchema ]),
}).strict() ;

export const ShotCreateManyArgsSchema: z.ZodType<Prisma.ShotCreateManyArgs> = z.object({
  data: z.union([ ShotCreateManyInputSchema,ShotCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ShotCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ShotCreateManyAndReturnArgs> = z.object({
  data: z.union([ ShotCreateManyInputSchema,ShotCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ShotDeleteArgsSchema: z.ZodType<Prisma.ShotDeleteArgs> = z.object({
  select: ShotSelectSchema.optional(),
  include: ShotIncludeSchema.optional(),
  where: ShotWhereUniqueInputSchema,
}).strict() ;

export const ShotUpdateArgsSchema: z.ZodType<Prisma.ShotUpdateArgs> = z.object({
  select: ShotSelectSchema.optional(),
  include: ShotIncludeSchema.optional(),
  data: z.union([ ShotUpdateInputSchema,ShotUncheckedUpdateInputSchema ]),
  where: ShotWhereUniqueInputSchema,
}).strict() ;

export const ShotUpdateManyArgsSchema: z.ZodType<Prisma.ShotUpdateManyArgs> = z.object({
  data: z.union([ ShotUpdateManyMutationInputSchema,ShotUncheckedUpdateManyInputSchema ]),
  where: ShotWhereInputSchema.optional(),
}).strict() ;

export const ShotDeleteManyArgsSchema: z.ZodType<Prisma.ShotDeleteManyArgs> = z.object({
  where: ShotWhereInputSchema.optional(),
}).strict() ;

export const HoleScoreCreateArgsSchema: z.ZodType<Prisma.HoleScoreCreateArgs> = z.object({
  select: HoleScoreSelectSchema.optional(),
  include: HoleScoreIncludeSchema.optional(),
  data: z.union([ HoleScoreCreateInputSchema,HoleScoreUncheckedCreateInputSchema ]),
}).strict() ;

export const HoleScoreUpsertArgsSchema: z.ZodType<Prisma.HoleScoreUpsertArgs> = z.object({
  select: HoleScoreSelectSchema.optional(),
  include: HoleScoreIncludeSchema.optional(),
  where: HoleScoreWhereUniqueInputSchema,
  create: z.union([ HoleScoreCreateInputSchema,HoleScoreUncheckedCreateInputSchema ]),
  update: z.union([ HoleScoreUpdateInputSchema,HoleScoreUncheckedUpdateInputSchema ]),
}).strict() ;

export const HoleScoreCreateManyArgsSchema: z.ZodType<Prisma.HoleScoreCreateManyArgs> = z.object({
  data: z.union([ HoleScoreCreateManyInputSchema,HoleScoreCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const HoleScoreCreateManyAndReturnArgsSchema: z.ZodType<Prisma.HoleScoreCreateManyAndReturnArgs> = z.object({
  data: z.union([ HoleScoreCreateManyInputSchema,HoleScoreCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const HoleScoreDeleteArgsSchema: z.ZodType<Prisma.HoleScoreDeleteArgs> = z.object({
  select: HoleScoreSelectSchema.optional(),
  include: HoleScoreIncludeSchema.optional(),
  where: HoleScoreWhereUniqueInputSchema,
}).strict() ;

export const HoleScoreUpdateArgsSchema: z.ZodType<Prisma.HoleScoreUpdateArgs> = z.object({
  select: HoleScoreSelectSchema.optional(),
  include: HoleScoreIncludeSchema.optional(),
  data: z.union([ HoleScoreUpdateInputSchema,HoleScoreUncheckedUpdateInputSchema ]),
  where: HoleScoreWhereUniqueInputSchema,
}).strict() ;

export const HoleScoreUpdateManyArgsSchema: z.ZodType<Prisma.HoleScoreUpdateManyArgs> = z.object({
  data: z.union([ HoleScoreUpdateManyMutationInputSchema,HoleScoreUncheckedUpdateManyInputSchema ]),
  where: HoleScoreWhereInputSchema.optional(),
}).strict() ;

export const HoleScoreDeleteManyArgsSchema: z.ZodType<Prisma.HoleScoreDeleteManyArgs> = z.object({
  where: HoleScoreWhereInputSchema.optional(),
}).strict() ;
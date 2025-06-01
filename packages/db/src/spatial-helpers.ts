import type { PrismaClient } from '@prisma/client';

/**
 * Convert JSON point to PostGIS geography
 * @param jsonField The JSON field containing point data
 * @returns PostGIS geography expression
 */
export function jsonToGeography(jsonField: string): string {
  return `ST_GeomFromGeoJSON(${jsonField})::geography`;
}

/**
 * Create a PostGIS point from longitude and latitude
 * @param lng Longitude
 * @param lat Latitude
 * @returns PostGIS point expression
 */
export function makePoint(lng: number, lat: number): string {
  return `ST_MakePoint(${lng}, ${lat})::geography`;
}

/**
 * Calculate distance between two courses
 * @param prisma PrismaClient instance
 * @param courseId1 First course ID
 * @param courseId2 Second course ID
 * @returns Distance in miles
 */
export async function getDistanceBetweenCourses(
  prisma: PrismaClient,
  courseId1: string,
  courseId2: string
): Promise<number> {
  const result = (await prisma.$queryRaw`
    SELECT 
      ST_Distance(
        ST_GeomFromGeoJSON(c1.location)::geography,
        ST_GeomFromGeoJSON(c2.location)::geography
      ) / 1609.34 as distance_miles
    FROM courses c1, courses c2
    WHERE c1.id = ${courseId1} AND c2.id = ${courseId2}
  `) as any[];

  return result[0]?.distance_miles || 0;
}

/**
 * Find courses within a radius of a point
 * @param prisma PrismaClient instance
 * @param lat Latitude
 * @param lng Longitude
 * @param radiusMiles Radius in miles
 * @returns Array of courses with distances
 */
export async function findCoursesNearLocation(
  prisma: PrismaClient,
  lat: number,
  lng: number,
  radiusMiles: number
) {
  const radiusMeters = radiusMiles * 1609.34;

  return await prisma.$queryRaw`
    SELECT 
      id,
      name,
      city,
      state,
      ST_Distance(
        ST_GeomFromGeoJSON(location)::geography,
        ST_MakePoint(${lng}, ${lat})::geography
      ) / 1609.34 as distance_miles
    FROM courses
    WHERE ST_DWithin(
      ST_GeomFromGeoJSON(location)::geography,
      ST_MakePoint(${lng}, ${lat})::geography,
      ${radiusMeters}
    )
    ORDER BY distance_miles
  `;
}

/**
 * Calculate shot distance from start to end location
 * @param prisma PrismaClient instance
 * @param shotId Shot ID
 * @returns Distance in yards
 */
export async function calculateShotDistance(prisma: PrismaClient, shotId: string): Promise<number> {
  const result = (await prisma.$queryRaw`
    SELECT 
      ST_Distance(
        ST_GeomFromGeoJSON("startLocation")::geography,
        ST_GeomFromGeoJSON("endLocation")::geography
      ) / 0.9144 as distance_yards
    FROM shots
    WHERE id = ${shotId} AND "endLocation" IS NOT NULL
  `) as any[];

  return result[0]?.distance_yards || 0;
}

/**
 * Get bearing (azimuth) from tee to green
 * @param prisma PrismaClient instance
 * @param holeId Hole ID
 * @returns Bearing in degrees (0-360)
 */
export async function getHoleBearing(prisma: PrismaClient, holeId: string): Promise<number> {
  const result = (await prisma.$queryRaw`
    SELECT 
      degrees(
        ST_Azimuth(
          ST_GeomFromGeoJSON("teeLocation")::geography,
          ST_GeomFromGeoJSON("greenLocation")::geography
        )
      ) as bearing_degrees
    FROM holes
    WHERE id = ${holeId}
  `) as any[];

  return result[0]?.bearing_degrees || 0;
}

/**
 * Check if a point is within course bounds
 * @param prisma PrismaClient instance
 * @param courseId Course ID
 * @param lat Latitude
 * @param lng Longitude
 * @returns Boolean indicating if point is within bounds
 */
export async function isPointInCourseBounds(
  prisma: PrismaClient,
  courseId: string,
  lat: number,
  lng: number
): Promise<boolean> {
  const result = (await prisma.$queryRaw`
    SELECT 
      ST_Contains(
        ST_GeomFromGeoJSON(bounds)::geometry,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geometry
      ) as is_within_bounds
    FROM courses
    WHERE id = ${courseId} AND bounds IS NOT NULL
  `) as any[];

  return result[0]?.is_within_bounds || false;
}

/**
 * Find nearest holes to a location
 * @param prisma PrismaClient instance
 * @param lat Latitude
 * @param lng Longitude
 * @param limit Number of holes to return
 * @returns Array of nearest holes with distances
 */
export async function findNearestHoles(
  prisma: PrismaClient,
  lat: number,
  lng: number,
  limit: number = 5
) {
  return await prisma.$queryRaw`
    SELECT 
      h.id,
      h."holeNumber",
      h.par,
      h.yardage,
      c.name as course_name,
      ST_Distance(
        ST_GeomFromGeoJSON(h."teeLocation")::geography,
        ST_MakePoint(${lng}, ${lat})::geography
      ) as distance_meters
    FROM holes h
    JOIN courses c ON h."courseId" = c.id
    ORDER BY ST_GeomFromGeoJSON(h."teeLocation")::geography <-> ST_MakePoint(${lng}, ${lat})::geography
    LIMIT ${limit}
  `;
}

/**
 * Calculate total distance walked in a round
 * @param prisma PrismaClient instance
 * @param roundId Round ID
 * @returns Total distance in miles
 */
export async function calculateRoundWalkingDistance(
  prisma: PrismaClient,
  roundId: string
): Promise<number> {
  const result = (await prisma.$queryRaw`
    WITH shot_sequence AS (
      SELECT 
        "startLocation",
        "endLocation",
        ROW_NUMBER() OVER (ORDER BY "createdAt") as seq
      FROM shots
      WHERE "roundId" = ${roundId} AND "endLocation" IS NOT NULL
    ),
    distances AS (
      SELECT 
        CASE 
          WHEN seq = 1 THEN 0
          ELSE ST_Distance(
            ST_GeomFromGeoJSON(lag("endLocation") OVER (ORDER BY seq))::geography,
            ST_GeomFromGeoJSON("startLocation")::geography
          )
        END +
        ST_Distance(
          ST_GeomFromGeoJSON("startLocation")::geography,
          ST_GeomFromGeoJSON("endLocation")::geography
        ) as distance_meters
      FROM shot_sequence
    )
    SELECT SUM(distance_meters) / 1609.34 as total_miles
    FROM distances
  `) as any[];

  return result[0]?.total_miles || 0;
}

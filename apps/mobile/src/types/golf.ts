// Golf course data types that match our Prisma schema

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: [number, number][][]; // Array of coordinate rings
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  location: GeoJSONPoint;
  bounds?: GeoJSONPolygon;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  website?: string;
  rating?: number;
  slope?: number;
}

export interface Hole {
  id: string;
  courseId: string;
  holeNumber: number;
  par: number;
  yardage: number;
  handicap?: number;
  teeLocation: GeoJSONPoint;
  greenLocation: GeoJSONPoint;
  description?: string;
}

export interface CourseWithHoles extends Course {
  holes: Hole[];
}

// Helper types for map markers
export interface HoleMarkerData {
  holeNumber: number;
  par: number;
  yardage: number;
  teeCoordinates: [number, number];
  greenCoordinates: [number, number];
}

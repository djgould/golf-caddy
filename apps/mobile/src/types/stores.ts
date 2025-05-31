export type DistanceUnit = 'yards' | 'meters';

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

export interface ClubDistances {
  [club: string]: number;
}

export interface UserPreferences {
  // Display preferences
  distanceUnit: DistanceUnit;

  // Club distances in selected units
  clubDistances: ClubDistances;

  // App preferences
  autoTrackLocation: boolean;
  highAccuracyGPS: boolean;

  // User profile
  name?: string;
  email?: string;
  handicap?: number;
}

export interface AppState {
  // UI state
  isLoading: boolean;
  isOffline: boolean;

  // Navigation state
  currentCourseId?: string;
  currentHoleNumber?: number;

  // Location state
  hasLocationPermission: boolean;
  isTrackingLocation: boolean;

  // Round state (will be expanded when tRPC is integrated)
  activeRoundId?: string;

  // Error state
  lastError?: {
    message: string;
    timestamp: Date;
  };
}

export interface Position {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface LocationState {
  currentPosition: Position | null;
  lastKnownPosition: Position | null;
  isTracking: boolean;
  permissionStatus: 'granted' | 'denied' | 'undetermined';
  error: string | null;
}

// Default club distances in yards
export const DEFAULT_CLUB_DISTANCES: ClubDistances = {
  driver: 250,
  '3-wood': 225,
  '5-wood': 210,
  '2-iron': 210,
  '3-iron': 200,
  '4-iron': 190,
  '5-iron': 180,
  '6-iron': 170,
  '7-iron': 160,
  '8-iron': 150,
  '9-iron': 140,
  'pitching-wedge': 130,
  'gap-wedge': 115,
  'sand-wedge': 100,
  'lob-wedge': 85,
  putter: 0,
};

import MapboxGL from '@rnmapbox/maps';

// Get the Mapbox token from environment variables
const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.warn('Mapbox token not found. Please set EXPO_PUBLIC_MAPBOX_TOKEN in your .env file');
}

// Configure Mapbox
MapboxGL.setAccessToken(MAPBOX_TOKEN || '');
MapboxGL.setTelemetryEnabled(false);

// Note: setConnected is no longer needed in newer versions of @rnmapbox/maps
// The library handles connectivity automatically

export default MapboxGL;

// Export common style URLs
export const MapStyles = {
  Satellite: MapboxGL.StyleURL.Satellite,
  SatelliteStreet: MapboxGL.StyleURL.SatelliteStreet,
  Outdoors: MapboxGL.StyleURL.Outdoors,
  Light: MapboxGL.StyleURL.Light,
  Dark: MapboxGL.StyleURL.Dark,
} as const;

// Export common camera settings for golf courses
export const DEFAULT_CAMERA_SETTINGS = {
  zoomLevel: 16,
  pitch: 0,
  animationDuration: 1000,
  animationMode: 'flyTo' as const,
};

// Golf course specific zoom levels
export const ZOOM_LEVELS = {
  OVERVIEW: 15, // See entire course
  HOLE_VIEW: 17, // Focus on single hole
  SHOT_VIEW: 18, // Focus on shot area
  DETAIL_VIEW: 19, // Maximum detail
} as const;

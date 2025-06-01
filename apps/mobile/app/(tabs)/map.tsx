import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Box, Text, VStack, HStack, Button, Spinner } from '@gluestack-ui/themed';
import MapboxGL, { MapStyles, DEFAULT_CAMERA_SETTINGS, ZOOM_LEVELS } from '../../src/config/mapbox';
import { requestLocationPermission, checkLocationPermission } from '../../src/utils/permissions';
import { useUserPreferencesStore } from '../../src/stores';

// Mock course data until we integrate with the database
const PEBBLE_BEACH_COURSE = {
  id: '1',
  name: 'Pebble Beach Golf Links',
  location: {
    coordinates: [-121.9508, 36.5686],
  },
  bounds: [
    [-121.955, 36.565],
    [-121.946, 36.572],
  ],
};

export default function MapScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentZoom, setCurrentZoom] = useState<number>(ZOOM_LEVELS.OVERVIEW);
  const { distanceUnit } = useUserPreferencesStore();

  const cameraRef = useRef<MapboxGL.Camera>(null);
  const mapRef = useRef<MapboxGL.MapView>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const hasLocationPermission = await checkLocationPermission();
      setHasPermission(hasLocationPermission);

      if (!hasLocationPermission) {
        const granted = await requestLocationPermission();
        setHasPermission(granted);

        if (!granted) {
          Alert.alert(
            'Location Permission Required',
            'Please enable location services to use the golf map features.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Permission check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(currentZoom + 1, ZOOM_LEVELS.DETAIL_VIEW);
    setCurrentZoom(newZoom);
    cameraRef.current?.setCamera({
      zoomLevel: newZoom,
      animationDuration: 300,
    });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(currentZoom - 1, 10); // Minimum zoom level
    setCurrentZoom(newZoom);
    cameraRef.current?.setCamera({
      zoomLevel: newZoom,
      animationDuration: 300,
    });
  };

  const handleRecenterMap = () => {
    cameraRef.current?.setCamera({
      centerCoordinate: PEBBLE_BEACH_COURSE.location.coordinates,
      zoomLevel: ZOOM_LEVELS.OVERVIEW,
      animationDuration: 1000,
    });
    setCurrentZoom(ZOOM_LEVELS.OVERVIEW);
  };

  if (isLoading) {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-100">
        <VStack className="items-center gap-4">
          <Spinner size="large" />
          <Text className="text-gray-600">Loading map...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-100">
      {/* Header */}
      <Box className="bg-white px-4 py-3 border-b border-gray-200">
        <VStack className="gap-1">
          <Text className="text-xl font-bold text-gray-900">{PEBBLE_BEACH_COURSE.name}</Text>
          <HStack className="items-center gap-2">
            <Text className="text-sm text-gray-600">Distance Unit:</Text>
            <Text className="text-sm font-medium text-gray-900">{distanceUnit}</Text>
          </HStack>
        </VStack>
      </Box>

      {/* Map */}
      <Box className="flex-1">
        <MapboxGL.MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          styleURL={MapStyles.Satellite}
          onDidFinishLoadingMap={handleMapReady}
          pitchEnabled={false}
          rotateEnabled={false}
          compassEnabled={true}
          scaleBarEnabled={true}
          attributionEnabled={false}
          logoEnabled={false}
          onRegionDidChange={(feature) => {
            if (feature?.properties?.zoomLevel) {
              setCurrentZoom(feature.properties.zoomLevel);
            }
          }}
        >
          {/* Camera */}
          <MapboxGL.Camera
            ref={cameraRef}
            centerCoordinate={PEBBLE_BEACH_COURSE.location.coordinates}
            zoomLevel={ZOOM_LEVELS.OVERVIEW}
            animationMode={DEFAULT_CAMERA_SETTINGS.animationMode}
            animationDuration={DEFAULT_CAMERA_SETTINGS.animationDuration}
          />

          {/* User Location */}
          {hasPermission && (
            <MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true} />
          )}

          {/* Course center marker (temporary) */}
          <MapboxGL.PointAnnotation
            id="course-center"
            coordinate={PEBBLE_BEACH_COURSE.location.coordinates}
          >
            <Box className="bg-green-600 rounded-full p-2 border-2 border-white">
              <Text className="text-white text-xs font-bold">PB</Text>
            </Box>
          </MapboxGL.PointAnnotation>
        </MapboxGL.MapView>
      </Box>

      {/* Map Controls Overlay */}
      {isMapReady && (
        <Box className="absolute bottom-8 right-4">
          <VStack className="gap-2">
            <Button className="bg-white rounded-full shadow-lg w-12 h-12" onPress={handleZoomIn}>
              <Text className="text-gray-900 text-lg font-bold">+</Text>
            </Button>
            <Button className="bg-white rounded-full shadow-lg w-12 h-12" onPress={handleZoomOut}>
              <Text className="text-gray-900 text-lg font-bold">−</Text>
            </Button>
            <Button
              className="bg-white rounded-full shadow-lg w-12 h-12"
              onPress={handleRecenterMap}
            >
              <Text className="text-gray-900 text-lg">📍</Text>
            </Button>
          </VStack>
        </Box>
      )}

      {/* Loading overlay */}
      {!isMapReady && (
        <Box className="absolute inset-0 bg-black/20 justify-center items-center">
          <Box className="bg-white rounded-lg p-4">
            <VStack className="items-center gap-2">
              <Spinner size="small" />
              <Text className="text-gray-600">Loading satellite imagery...</Text>
            </VStack>
          </Box>
        </Box>
      )}
    </Box>
  );
}

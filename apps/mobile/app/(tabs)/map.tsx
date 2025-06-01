import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Box, Text, VStack, HStack, Button } from '@gluestack-ui/themed';
import MapboxGL, { MapStyles, DEFAULT_CAMERA_SETTINGS, ZOOM_LEVELS } from '../../src/config/mapbox';
import { requestLocationPermission, checkLocationPermission } from '../../src/utils/permissions';
import { useUserPreferencesStore } from '../../src/stores';
import {
  HoleMarkers,
  CourseBoundary,
  OfflineDownloadButton,
  MapPerformanceOverlay,
} from '../../src/components/golf';
import { getCourseWithHoles } from '../../src/services/mockCourseData';
import { LoadingSpinner } from '../../components/ui/animations';
import { createGestureDebouncer, useGestureOptimization } from '../../src/utils/mapPerformance';
import type { CourseWithHoles } from '../../src/types/golf';

export default function MapScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentZoom, setCurrentZoom] = useState<number>(ZOOM_LEVELS.OVERVIEW);
  const [courseData, setCourseData] = useState<CourseWithHoles | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [viewBounds, setViewBounds] = useState<
    { sw: [number, number]; ne: [number, number] } | undefined
  >();
  const { distanceUnit } = useUserPreferencesStore();
  const { isGesturing, handleGestureStart, handleGestureEnd } = useGestureOptimization();

  const cameraRef = useRef<MapboxGL.Camera>(null);
  const mapRef = useRef<MapboxGL.MapView>(null);

  // Create debounced region change handler
  const debouncedRegionChange = useRef(
    createGestureDebouncer((feature: any) => {
      if (feature?.properties?.zoomLevel) {
        setCurrentZoom(feature.properties.zoomLevel);
      }

      // Update view bounds for frustum culling
      if (feature?.geometry?.coordinates && feature?.properties?.visibleBounds) {
        const bounds = feature.properties.visibleBounds;
        if (bounds && bounds.length >= 4) {
          setViewBounds({
            sw: [bounds[0], bounds[1]], // Southwest corner
            ne: [bounds[2], bounds[3]], // Northeast corner
          });
        }
      }

      handleGestureEnd();
    }, 150)
  ).current;

  useEffect(() => {
    checkPermissions();
    loadCourseData();
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

  const loadCourseData = async () => {
    try {
      setIsLoadingCourse(true);
      const course = await getCourseWithHoles('1'); // Load default course
      setCourseData(course);
    } catch (error) {
      console.error('Failed to load course data:', error);
      Alert.alert(
        'Course Loading Error',
        'Failed to load course information. Some features may not be available.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const handleMapReady = () => {
    setIsMapReady(true);
    console.log('Map is ready');
  };

  const zoomToCourse = () => {
    if (cameraRef.current && courseData) {
      cameraRef.current.setCamera({
        centerCoordinate: courseData.location.coordinates,
        zoomLevel: ZOOM_LEVELS.OVERVIEW,
        animationDuration: 1000,
      });
    }
  };

  const zoomToHoles = () => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        zoomLevel: ZOOM_LEVELS.HOLE_VIEW,
        animationDuration: 1000,
      });
    }
  };

  const handleRegionWillChange = useCallback(() => {
    handleGestureStart();
  }, [handleGestureStart]);

  const handleRegionDidChange = useCallback(
    (feature: any) => {
      debouncedRegionChange(feature);
    },
    [debouncedRegionChange]
  );

  if (isLoading || isLoadingCourse) {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-100">
        <LoadingSpinner size={60} />
        <Text className="text-gray-600 mt-4">Loading map...</Text>
      </Box>
    );
  }

  if (!courseData) {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-600 text-center">
          Failed to load course data.{'\n'}Please try again later.
        </Text>
        <Button onPress={loadCourseData} className="mt-4">
          <Text>Retry</Text>
        </Button>
      </Box>
    );
  }

  return (
    <Box className="flex-1">
      {/* Map Container */}
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
          onRegionWillChange={handleRegionWillChange}
          onRegionDidChange={handleRegionDidChange}
        >
          {/* Camera */}
          <MapboxGL.Camera
            ref={cameraRef}
            centerCoordinate={courseData.location.coordinates}
            zoomLevel={ZOOM_LEVELS.OVERVIEW}
            animationMode={DEFAULT_CAMERA_SETTINGS.animationMode}
            animationDuration={DEFAULT_CAMERA_SETTINGS.animationDuration}
          />

          {/* User Location */}
          {hasPermission && (
            <MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true} />
          )}

          {/* Course Boundary */}
          <CourseBoundary course={courseData} />

          {/* Enhanced Hole Markers with Performance Optimizations */}
          {(() => {
            const holeMarkersProps: any = {
              holes: courseData.holes,
              currentZoom: currentZoom,
              enableClustering: true,
              showInfo: currentZoom >= ZOOM_LEVELS.HOLE_VIEW,
            };

            if (viewBounds) {
              holeMarkersProps.viewBounds = viewBounds;
            }

            return <HoleMarkers {...holeMarkersProps} />;
          })()}
        </MapboxGL.MapView>
      </Box>

      {/* Map Header Overlay */}
      <Box className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur border-b border-gray-200 p-4">
        <VStack className="gap-2">
          <HStack className="justify-between items-center">
            <VStack className="flex-1">
              <Text className="text-lg font-bold text-gray-900">{courseData.name}</Text>
              <Text className="text-sm text-gray-600">
                {courseData.holes.length} holes • Rating: {courseData.rating || 'N/A'}
              </Text>
            </VStack>

            <Button
              onPress={() => setShowOfflineModal(!showOfflineModal)}
              className="bg-blue-500 px-3 py-2"
            >
              <Text className="text-white text-xs">Offline</Text>
            </Button>
          </HStack>

          {/* Offline Download Panel */}
          {showOfflineModal && (
            <Box className="mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <OfflineDownloadButton course={courseData} compact={false} showProgress={true} />
            </Box>
          )}
        </VStack>
      </Box>

      {/* Map Controls Overlay */}
      <Box className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 p-4">
        <HStack className="justify-between items-center">
          <VStack className="gap-1">
            <Text className="text-xs text-gray-500">Zoom Level</Text>
            <Text className="text-sm font-medium">{currentZoom.toFixed(1)}x</Text>
          </VStack>

          <HStack className="gap-2">
            <Button onPress={zoomToCourse} className="bg-gray-500 px-3 py-2">
              <Text className="text-white text-xs">Course</Text>
            </Button>

            <Button onPress={zoomToHoles} className="bg-green-500 px-3 py-2">
              <Text className="text-white text-xs">Holes</Text>
            </Button>
          </HStack>

          <VStack className="gap-1 items-end">
            <Text className="text-xs text-gray-500">Distance Units</Text>
            <Text className="text-sm font-medium">
              {distanceUnit === 'meters' ? 'Meters' : 'Yards'}
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Performance Monitoring Overlay (Development only) */}
      <MapPerformanceOverlay enabled={__DEV__} />
    </Box>
  );
}

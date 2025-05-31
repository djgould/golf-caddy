import { useEffect, useState } from 'react';
import { Position } from '../types/stores';
import { LocationService } from '../services/locationService';
import { useAppStateStore } from '../stores/appStateStore';
import { useUserPreferencesStore } from '../stores/userPreferencesStore';

interface UseLocationOptions {
  enableTracking?: boolean;
  enableMockMode?: boolean;
}

interface UseLocationReturn {
  currentPosition: Position | null;
  isTracking: boolean;
  hasPermission: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
  calculateDistanceTo: (target: Position) => number | null;
}

export function useLocation(options: UseLocationOptions = {}): UseLocationReturn {
  const { enableTracking = true, enableMockMode = false } = options;

  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { hasLocationPermission, isTrackingLocation, setLocationPermission, setTrackingLocation } =
    useAppStateStore();

  const { autoTrackLocation, highAccuracyGPS } = useUserPreferencesStore();

  const locationService = LocationService.getInstance();

  // Set mock mode
  useEffect(() => {
    if (enableMockMode) {
      locationService.enableMockMode();
    } else {
      locationService.disableMockMode();
    }
  }, [enableMockMode, locationService]);

  // Check permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      const status = await locationService.checkPermissions();
      setLocationPermission(status === 'granted');
    };

    checkPermissions();
  }, [locationService, setLocationPermission]);

  // Auto-start tracking if enabled
  useEffect(() => {
    if (enableTracking && autoTrackLocation && hasLocationPermission && !isTrackingLocation) {
      startTracking();
    }

    return () => {
      if (isTrackingLocation) {
        stopTracking();
      }
    };
  }, [enableTracking, autoTrackLocation, hasLocationPermission]);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const granted = await locationService.requestPermissions();
      setLocationPermission(granted);
      return granted;
    } catch (err) {
      setError('Failed to request location permission');
      return false;
    }
  };

  const startTracking = async (): Promise<void> => {
    try {
      setError(null);

      // Get initial position
      const initialPosition = await locationService.getCurrentPosition(highAccuracyGPS);
      if (initialPosition) {
        setCurrentPosition(initialPosition);
      }

      // Start continuous tracking
      const success = await locationService.startLocationTracking(
        (position) => {
          setCurrentPosition(position);
        },
        highAccuracyGPS,
        1000 // Update every second
      );

      if (success) {
        setTrackingLocation(true);
      } else {
        setError('Failed to start location tracking');
      }
    } catch (err) {
      setError('Error starting location tracking');
      console.error('Error starting location tracking:', err);
    }
  };

  const stopTracking = async (): Promise<void> => {
    try {
      await locationService.stopLocationTracking();
      setTrackingLocation(false);
    } catch (err) {
      setError('Error stopping location tracking');
      console.error('Error stopping location tracking:', err);
    }
  };

  const calculateDistanceTo = (target: Position): number | null => {
    if (!currentPosition) {
      return null;
    }

    return LocationService.calculateDistance(currentPosition, target);
  };

  return {
    currentPosition,
    isTracking: isTrackingLocation,
    hasPermission: hasLocationPermission,
    error,
    requestPermission,
    startTracking,
    stopTracking,
    calculateDistanceTo,
  };
}

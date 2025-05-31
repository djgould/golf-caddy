import * as Location from 'expo-location';
import { Position } from '../types/stores';

// Mock location for testing (Pebble Beach Golf Links)
const MOCK_LOCATION: Position = {
  latitude: 36.5665,
  longitude: -121.9475,
  accuracy: 5,
  timestamp: Date.now(),
};

export class LocationService {
  private static instance: LocationService;
  private locationSubscription: Location.LocationSubscription | null = null;
  private mockMode = false;
  private mockUpdateInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  async checkPermissions(): Promise<'granted' | 'denied' | 'undetermined'> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return 'undetermined';
    }
  }

  async getCurrentPosition(highAccuracy = true): Promise<Position | null> {
    if (this.mockMode) {
      return this.getMockPosition();
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: highAccuracy ? Location.Accuracy.BestForNavigation : Location.Accuracy.Balanced,
      });

      const position: Position = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      };

      if (location.coords.accuracy !== null && location.coords.accuracy !== undefined) {
        position.accuracy = location.coords.accuracy;
      }

      return position;
    } catch (error) {
      console.error('Error getting current position:', error);
      return null;
    }
  }

  async startLocationTracking(
    onLocationUpdate: (position: Position) => void,
    highAccuracy = true,
    intervalMs = 1000
  ): Promise<boolean> {
    try {
      // Stop any existing tracking
      await this.stopLocationTracking();

      if (this.mockMode) {
        // Start mock location updates
        this.mockUpdateInterval = setInterval(() => {
          onLocationUpdate(this.getMockPosition());
        }, intervalMs);
        return true;
      }

      // Check permissions first
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      // Start real location tracking
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: highAccuracy ? Location.Accuracy.BestForNavigation : Location.Accuracy.Balanced,
          timeInterval: intervalMs,
          distanceInterval: 1, // Update on 1 meter movement
        },
        (location) => {
          const position: Position = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
          };

          if (location.coords.accuracy !== null && location.coords.accuracy !== undefined) {
            position.accuracy = location.coords.accuracy;
          }

          onLocationUpdate(position);
        }
      );

      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return false;
    }
  }

  async stopLocationTracking(): Promise<void> {
    if (this.mockUpdateInterval) {
      clearInterval(this.mockUpdateInterval);
      this.mockUpdateInterval = null;
    }

    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  // Mock mode for testing
  enableMockMode(): void {
    this.mockMode = true;
  }

  disableMockMode(): void {
    this.mockMode = false;
    if (this.mockUpdateInterval) {
      clearInterval(this.mockUpdateInterval);
      this.mockUpdateInterval = null;
    }
  }

  private getMockPosition(): Position {
    // Add some random variation to simulate movement
    const variation = 0.0001; // About 11 meters
    return {
      latitude: MOCK_LOCATION.latitude + (Math.random() - 0.5) * variation,
      longitude: MOCK_LOCATION.longitude + (Math.random() - 0.5) * variation,
      accuracy: 5 + Math.random() * 5, // 5-10 meters accuracy
      timestamp: Date.now(),
    };
  }

  // Utility functions
  static calculateDistance(from: Position, to: Position): number {
    const R = 6371000; // Earth's radius in meters
    const φ1 = (from.latitude * Math.PI) / 180;
    const φ2 = (to.latitude * Math.PI) / 180;
    const Δφ = ((to.latitude - from.latitude) * Math.PI) / 180;
    const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceInMeters = R * c;
    const distanceInYards = distanceInMeters * 1.09361;

    return Math.round(distanceInYards);
  }

  static calculateBearing(from: Position, to: Position): number {
    const φ1 = (from.latitude * Math.PI) / 180;
    const φ2 = (to.latitude * Math.PI) / 180;
    const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);

    return ((θ * 180) / Math.PI + 360) % 360;
  }
}

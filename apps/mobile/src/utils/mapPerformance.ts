import { useCallback, useRef, useMemo } from 'react';
import { debounce, throttle } from 'lodash';

// Gesture debouncing utilities
export const createGestureDebouncer = (callback: (...args: any[]) => any, delay: number = 150) => {
  return debounce(callback, delay, { leading: false, trailing: true });
};

export const createGestureThrottler = (callback: (...args: any[]) => any, delay: number = 50) => {
  return throttle(callback, delay, { leading: true, trailing: true });
};

// Performance monitoring hook
export const useMapPerformance = () => {
  const renderCountRef = useRef(0);
  const lastRenderTime = useRef(Date.now());

  const trackRender = useCallback((componentName: string) => {
    renderCountRef.current++;
    const currentTime = Date.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;

    if (__DEV__ && timeSinceLastRender < 16) {
      // Less than 60fps
      console.warn(`${componentName} rendered too frequently: ${timeSinceLastRender}ms`);
    }

    lastRenderTime.current = currentTime;
  }, []);

  const getRenderStats = useCallback(
    () => ({
      renderCount: renderCountRef.current,
      avgFps:
        renderCountRef.current > 0
          ? 1000 / ((Date.now() - lastRenderTime.current) / renderCountRef.current)
          : 0,
    }),
    []
  );

  return { trackRender, getRenderStats };
};

// Layer visibility optimization based on zoom level
export const useLayerVisibility = (currentZoom: number) => {
  return useMemo(() => {
    const ZOOM_THRESHOLDS = {
      OVERVIEW: 15,
      HOLE_VIEW: 17,
      DETAIL_VIEW: 19,
    };

    return {
      showCourseOverview: currentZoom <= ZOOM_THRESHOLDS.OVERVIEW,
      showHoleMarkers: currentZoom >= ZOOM_THRESHOLDS.OVERVIEW - 1,
      showHoleDetails: currentZoom >= ZOOM_THRESHOLDS.HOLE_VIEW,
      showPinDetails: currentZoom >= ZOOM_THRESHOLDS.DETAIL_VIEW,
      // Reduce marker density at lower zoom levels
      markerDensity:
        currentZoom <= ZOOM_THRESHOLDS.OVERVIEW
          ? 'low'
          : currentZoom <= ZOOM_THRESHOLDS.HOLE_VIEW
            ? 'medium'
            : 'high',
    };
  }, [currentZoom]);
};

// View frustum culling for markers
export const useViewFrustumCulling = (
  markers: Array<{ coordinates: [number, number]; id: string }>,
  viewBounds?: { sw: [number, number]; ne: [number, number] }
) => {
  return useMemo(() => {
    if (!viewBounds) return markers;

    const { sw, ne } = viewBounds;
    return markers.filter((marker) => {
      const [lng, lat] = marker.coordinates;
      return lng >= sw[0] && lng <= ne[0] && lat >= sw[1] && lat <= ne[1];
    });
  }, [markers, viewBounds]);
};

// Gesture state management for smooth interactions
export const useGestureOptimization = () => {
  const isGesturingRef = useRef(false);
  const gestureTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleGestureStart = useCallback(() => {
    isGesturingRef.current = true;
    if (gestureTimeoutRef.current) {
      clearTimeout(gestureTimeoutRef.current);
    }
  }, []);

  const handleGestureEnd = useCallback(() => {
    gestureTimeoutRef.current = setTimeout(() => {
      isGesturingRef.current = false;
    }, 100); // Small delay to detect continuous gestures
  }, []);

  const getIsGesturing = () => isGesturingRef.current;

  return {
    isGesturing: getIsGesturing,
    handleGestureStart,
    handleGestureEnd,
  };
};

// Marker clustering utilities
export const clusterMarkers = (
  markers: Array<{ coordinates: [number, number]; id: string; type: string }>,
  zoomLevel: number,
  clusterRadius: number = 50
) => {
  // Simple distance-based clustering
  const clusters: Array<{
    id: string;
    coordinates: [number, number];
    markers: typeof markers;
    count: number;
  }> = [];

  const processed = new Set<string>();

  markers.forEach((marker) => {
    if (processed.has(marker.id)) return;

    const cluster = {
      id: `cluster-${marker.id}`,
      coordinates: marker.coordinates,
      markers: [marker],
      count: 1,
    };

    // Find nearby markers to cluster
    markers.forEach((otherMarker) => {
      if (processed.has(otherMarker.id) || marker.id === otherMarker.id) return;

      const distance = getDistance(marker.coordinates, otherMarker.coordinates);
      const distanceThreshold = clusterRadius / Math.pow(2, zoomLevel); // Adjust based on zoom

      if (distance < distanceThreshold) {
        cluster.markers.push(otherMarker);
        cluster.count++;
        processed.add(otherMarker.id);
      }
    });

    clusters.push(cluster);
    processed.add(marker.id);
  });

  return clusters;
};

// Helper function to calculate distance between two points
const getDistance = (coord1: [number, number], coord2: [number, number]): number => {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Optimized re-render prevention
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  throttleMs: number = 50
) => {
  const throttledCallback = useMemo(
    () => throttle(callback, throttleMs, { leading: true, trailing: true }),
    deps
  );

  return useCallback(throttledCallback, [throttledCallback]);
};

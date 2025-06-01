import React, { useMemo } from 'react';
import { Box, Text } from '@gluestack-ui/themed';
import MapboxGL from '../../config/mapbox';
import type { Hole } from '../../types/golf';
import { useLayerVisibility, clusterMarkers, useMapPerformance } from '../../utils/mapPerformance';

interface HoleMarkersProps {
  holes: Hole[];
  currentZoom?: number;
  viewBounds?: { sw: [number, number]; ne: [number, number] };
  enableClustering?: boolean;
  clusterRadius?: number;
  showInfo?: boolean; // Legacy prop for backward compatibility
}

interface ClusterMarkerProps {
  cluster: {
    id: string;
    coordinates: [number, number];
    markers: Array<{ coordinates: [number, number]; id: string; type: string; hole?: Hole }>;
    count: number;
  };
  currentZoom: number;
}

const ClusterMarker: React.FC<ClusterMarkerProps> = React.memo(({ cluster, currentZoom }) => {
  const { trackRender } = useMapPerformance();

  React.useEffect(() => {
    trackRender('ClusterMarker');
  });

  if (cluster.count === 1 && cluster.markers[0]?.hole) {
    // Single marker - render individual hole marker
    const marker = cluster.markers[0];
    const hole = marker.hole;
    if (!hole) return null; // Type guard

    return <IndividualHoleMarker hole={hole} showDetails={currentZoom >= 17} />;
  }

  // Cluster marker for multiple holes
  return (
    <MapboxGL.PointAnnotation id={cluster.id} coordinate={cluster.coordinates}>
      <Box className="bg-blue-800 rounded-full border-2 border-white shadow-lg min-w-10 min-h-10 justify-center items-center">
        <Text className="text-white text-xs font-bold text-center">{cluster.count}</Text>
      </Box>
    </MapboxGL.PointAnnotation>
  );
});

interface IndividualHoleMarkerProps {
  hole: Hole;
  showDetails: boolean;
}

const IndividualHoleMarker: React.FC<IndividualHoleMarkerProps> = React.memo(
  ({ hole, showDetails }) => {
    const { trackRender } = useMapPerformance();

    React.useEffect(() => {
      trackRender('IndividualHoleMarker');
    });

    return (
      <React.Fragment key={hole.id}>
        {/* Tee Marker */}
        <MapboxGL.PointAnnotation
          id={`tee-${hole.holeNumber}`}
          coordinate={hole.teeLocation.coordinates}
        >
          <Box className="bg-blue-600 rounded-full border-2 border-white shadow-lg min-w-8 min-h-8 justify-center items-center">
            <Text className="text-white text-xs font-bold text-center">{hole.holeNumber}</Text>
          </Box>
        </MapboxGL.PointAnnotation>

        {/* Green Marker */}
        <MapboxGL.PointAnnotation
          id={`green-${hole.holeNumber}`}
          coordinate={hole.greenLocation.coordinates}
        >
          <Box className="bg-red-600 rounded-full border-2 border-white shadow-lg w-6 h-6 justify-center items-center">
            <Box className="bg-white rounded-full w-2 h-2" />
          </Box>
        </MapboxGL.PointAnnotation>

        {/* Hole Info Marker - only show at high zoom levels */}
        {showDetails && (
          <MapboxGL.PointAnnotation
            id={`info-${hole.holeNumber}`}
            coordinate={[
              hole.teeLocation.coordinates[0] + 0.0005,
              hole.teeLocation.coordinates[1] + 0.0005,
            ]}
          >
            <Box className="bg-white rounded-lg border border-gray-300 shadow-md px-2 py-1 min-w-16">
              <Text className="text-gray-900 text-xs font-semibold text-center">
                Par {hole.par}
              </Text>
              <Text className="text-gray-600 text-xs text-center">{hole.yardage}y</Text>
            </Box>
          </MapboxGL.PointAnnotation>
        )}
      </React.Fragment>
    );
  }
);

// Legacy individual marker components for backward compatibility
export const TeeMarker: React.FC<{ hole: Hole }> = ({ hole }) => {
  return <IndividualHoleMarker hole={hole} showDetails={false} />;
};

export const GreenMarker: React.FC<{ hole: Hole }> = ({ hole }) => {
  const coordinates = hole.greenLocation.coordinates;
  return (
    <MapboxGL.PointAnnotation id={`green-${hole.holeNumber}`} coordinate={coordinates}>
      <Box className="bg-red-600 rounded-full border-2 border-white shadow-lg w-6 h-6 justify-center items-center">
        <Box className="bg-white rounded-full w-2 h-2" />
      </Box>
    </MapboxGL.PointAnnotation>
  );
};

export const HoleInfoMarker: React.FC<{ hole: Hole }> = ({ hole }) => {
  const teeCoords = hole.teeLocation.coordinates;
  const offsetCoords: [number, number] = [teeCoords[0] + 0.0005, teeCoords[1] + 0.0005];

  return (
    <MapboxGL.PointAnnotation id={`info-${hole.holeNumber}`} coordinate={offsetCoords}>
      <Box className="bg-white rounded-lg border border-gray-300 shadow-md px-2 py-1 min-w-16">
        <Text className="text-gray-900 text-xs font-semibold text-center">Par {hole.par}</Text>
        <Text className="text-gray-600 text-xs text-center">{hole.yardage}y</Text>
      </Box>
    </MapboxGL.PointAnnotation>
  );
};

export const HoleMarkers: React.FC<HoleMarkersProps> = React.memo(
  ({
    holes,
    currentZoom = 15, // Default zoom level
    viewBounds,
    enableClustering = true,
    clusterRadius = 50,
    showInfo = true, // Legacy prop
  }) => {
    const { trackRender } = useMapPerformance();
    const layerVisibility = useLayerVisibility(currentZoom);

    React.useEffect(() => {
      trackRender('HoleMarkers');
    });

    // Convert holes to marker format for processing
    const markers = useMemo(() => {
      return holes.flatMap((hole) => [
        {
          id: `tee-${hole.holeNumber}`,
          coordinates: hole.teeLocation.coordinates,
          type: 'tee',
          hole,
        },
        {
          id: `green-${hole.holeNumber}`,
          coordinates: hole.greenLocation.coordinates,
          type: 'green',
          hole,
        },
      ]);
    }, [holes]);

    // Simple view bounds filtering (avoiding external dependency issues)
    const visibleMarkers = useMemo(() => {
      if (!viewBounds) return markers;

      const { sw, ne } = viewBounds;
      return markers.filter((marker) => {
        const [lng, lat] = marker.coordinates;
        return lng >= sw[0] && lng <= ne[0] && lat >= sw[1] && lat <= ne[1];
      });
    }, [markers, viewBounds]);

    // Apply clustering if enabled and zoom level is low
    const processedMarkers = useMemo(() => {
      if (!enableClustering || currentZoom >= 16) {
        // No clustering at high zoom levels
        return visibleMarkers.map((marker) => ({
          id: marker.id,
          coordinates: marker.coordinates,
          markers: [marker],
          count: 1,
        }));
      }

      return clusterMarkers(visibleMarkers, currentZoom, clusterRadius);
    }, [visibleMarkers, currentZoom, enableClustering, clusterRadius]);

    // Don't render markers if not visible at current zoom
    if (!layerVisibility.showHoleMarkers) {
      return null;
    }

    // Limit number of markers rendered based on performance
    const maxMarkersToRender =
      currentZoom >= 17 ? processedMarkers.length : Math.min(processedMarkers.length, 50);
    const markersToRender = processedMarkers.slice(0, maxMarkersToRender);

    // Determine if we should show details based on both new currentZoom and legacy showInfo prop
    const shouldShowDetails = showInfo && currentZoom >= 17;

    return (
      <>
        {markersToRender.map((cluster) => (
          <ClusterMarker key={cluster.id} cluster={cluster} currentZoom={currentZoom} />
        ))}
      </>
    );
  }
);

// Performance monitoring overlay component (for development)
export const MapPerformanceOverlay: React.FC<{ enabled?: boolean }> = ({ enabled = __DEV__ }) => {
  const { getRenderStats } = useMapPerformance();

  if (!enabled) return null;

  const stats = getRenderStats();

  return (
    <Box className="absolute top-16 right-4 bg-black/80 rounded-lg p-2">
      <Text className="text-white text-xs">Renders: {stats.renderCount}</Text>
      <Text className="text-white text-xs">Avg FPS: {stats.avgFps.toFixed(1)}</Text>
    </Box>
  );
};

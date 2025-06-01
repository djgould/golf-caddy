import React from 'react';
import MapboxGL from '../../config/mapbox';
import type { Course } from '../../types/golf';

interface CourseBoundaryProps {
  course: Course;
  fillOpacity?: number;
  strokeOpacity?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export const CourseBoundary: React.FC<CourseBoundaryProps> = ({
  course,
  fillOpacity = 0.1,
  strokeOpacity = 0.4,
  fillColor = '#22c55e', // Green color for golf course
  strokeColor = '#16a34a', // Darker green for stroke
  strokeWidth = 2,
}) => {
  // If no bounds data, don't render anything
  if (!course.bounds) {
    return null;
  }

  // Create GeoJSON feature for the course boundary
  const boundaryGeoJSON = {
    type: 'Feature' as const,
    properties: {
      name: course.name,
      id: course.id,
    },
    geometry: course.bounds,
  };

  return (
    <MapboxGL.ShapeSource id={`course-boundary-${course.id}`} shape={boundaryGeoJSON}>
      <MapboxGL.FillLayer
        id={`course-fill-${course.id}`}
        style={{
          fillColor: fillColor,
          fillOpacity: fillOpacity,
        }}
      />
      <MapboxGL.LineLayer
        id={`course-stroke-${course.id}`}
        style={{
          lineColor: strokeColor,
          lineOpacity: strokeOpacity,
          lineWidth: strokeWidth,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

// Helper component for multiple course boundaries
interface CoursesBoundariesProps {
  courses: Course[];
  fillOpacity?: number;
  strokeOpacity?: number;
}

export const CoursesBoundaries: React.FC<CoursesBoundariesProps> = ({
  courses,
  fillOpacity = 0.1,
  strokeOpacity = 0.4,
}) => {
  return (
    <>
      {courses.map((course) => (
        <CourseBoundary
          key={course.id}
          course={course}
          fillOpacity={fillOpacity}
          strokeOpacity={strokeOpacity}
        />
      ))}
    </>
  );
};

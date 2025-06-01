-- Enable PostGIS extension for spatial data support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable PostGIS topology (optional but useful for advanced spatial operations)
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Enable PostGIS raster support (optional, for elevation data)
CREATE EXTENSION IF NOT EXISTS postgis_raster;

-- Enable fuzzy string matching (useful for course name searches)
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

-- Verify PostGIS is installed correctly
SELECT PostGIS_Version();

-- Create a test to ensure spatial functions work
SELECT ST_Distance(
    ST_MakePoint(-121.9508, 36.5686)::geography,  -- Pebble Beach
    ST_MakePoint(-122.4194, 37.7749)::geography   -- San Francisco
) / 1609.34 as distance_in_miles;

-- Should return approximately 120 miles 
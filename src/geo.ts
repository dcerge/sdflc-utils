// ./src/geo.ts

import { DEFAULT_DISTANCE_THRESHOLD_M, EARTH_RADIUS_M } from './constants';
import { toDegrees, toRadians } from './converters';
import { BoundingBox, CalcDistanceArgs, GeoCoords } from './interfaces';

// =============================================================================
// Internal helpers
// =============================================================================

/**
 * Returns true if `value` is a finite number (not NaN, not ±Infinity).
 * Used for runtime validation of numeric inputs.
 */
const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && isFinite(value);

// =============================================================================
// Coordinate String Helpers
// =============================================================================

/**
 * Format coordinates as a display string.
 *
 * @param coords    - Coordinates to format.
 * @param precision - Number of decimal places (default: 5).
 * @returns Formatted string like `"51.50740, -0.12780"`, or `""` if coords is falsy or invalid.
 */
export function buildCoordinatesStr(coords: GeoCoords | null | undefined, precision: number = 5): string {
  if (!isValidCoordinate(coords)) return '';
  const p = isFiniteNumber(precision) && precision >= 0 ? precision : 5;
  return `${coords!.latitude.toFixed(p)}, ${coords!.longitude.toFixed(p)}`;
}

/**
 * Parse a `"latitude,longitude"` string into a `GeoCoords` object.
 * Latitude and longitude are returned as numbers (NaN if unparseable).
 *
 * @param coordinatesStr - String in the format `"lat,lng"`.
 * @returns Object with numeric `latitude` and `longitude` properties.
 */
export const extractLatitudeLongitude = (coordinatesStr: string): GeoCoords => {
  const [latStr, lngStr] = (coordinatesStr || '').split(',');
  return {
    latitude: Number(latStr),
    longitude: Number(lngStr),
  };
};

/**
 * @deprecated Renamed to `extractLatitudeLongitude`. Will be removed in a future major version.
 */
export const extractLatitueLongitude = extractLatitudeLongitude;

/**
 * Build a coordinates payload object from a source object containing geo fields.
 *
 * @param query - Source object containing `latitude`, `longitude`, and optional geo fields.
 */
export const buildCoordinates = (query: Partial<GeoCoords> & Record<string, any>) => {
  return {
    coordinates: buildCoordinatesStr(query as GeoCoords),
    coordinatesCode: query?.coordinatesCode === undefined ? undefined : Number(query.coordinatesCode) || 0,
    coordinatesExtra: JSON.stringify({
      latitude: query?.latitude,
      longitude: query?.longitude,
      altitude: query?.altitude,
      accuracy: query?.accuracy,
      altitudeAccuracy: query?.altitudeAccuracy,
      heading: query?.heading,
      speed: query?.speed,
    }),
  };
};

/**
 * Returns the list of property names expected by `buildCoordinates`.
 */
export const coordinatesParamNames = (): string[] => {
  return ['latitude', 'longitude', 'altitude', 'accuracy', 'altitudeAccuracy', 'heading', 'speed', 'coordinatesCode'];
};

// =============================================================================
// Coordinate Validation
// =============================================================================

/**
 * Check if a coordinate is valid (non-null, numeric, within valid lat/lng ranges).
 *
 * @param coords - Coordinates to validate.
 * @returns `true` if the coordinates are a valid lat/lng pair.
 */
export function isValidCoordinate(coords: GeoCoords | null | undefined): boolean {
  if (!coords) return false;

  const { latitude, longitude } = coords;

  if (!isFiniteNumber(latitude) || !isFiniteNumber(longitude)) return false;
  if (latitude < -90 || latitude > 90) return false;
  if (longitude < -180 || longitude > 180) return false;

  return true;
}

// =============================================================================
// Distance Calculations
// =============================================================================

/**
 * Calculate the Haversine great-circle distance between two coordinates.
 * Returns `0` if either coordinate is invalid.
 *
 * @param coord1 - First coordinate.
 * @param coord2 - Second coordinate.
 * @returns Distance in meters, or `0` if either input is invalid.
 *
 * @example
 * ```ts
 * haversineDistanceM(
 *   { latitude: 51.5074, longitude: -0.1278 }, // London
 *   { latitude: 48.8566, longitude: 2.3522 }   // Paris
 * ); // ~343,000 meters
 * ```
 */
export function haversineDistanceM(coord1: GeoCoords, coord2: GeoCoords): number {
  if (!isValidCoordinate(coord1) || !isValidCoordinate(coord2)) return 0;

  const lat1Rad = toRadians(coord1.latitude) ?? 0;
  const lat2Rad = toRadians(coord2.latitude) ?? 0;
  const deltaLat = toRadians(coord2.latitude - coord1.latitude) ?? 0;
  const deltaLng = toRadians(coord2.longitude - coord1.longitude) ?? 0;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Calculate the great-circle distance between two coordinates using the
 * Haversine formula (atan2 variant), which is numerically stable even for
 * near-antipodal points.
 *
 * Returns `0` if either coordinate is invalid.
 *
 * @param args - Object containing `position1` and `position2`.
 * @returns Distance in kilometers, or `0` if either position is missing/invalid.
 */
export const calcDistance = (args: CalcDistanceArgs): number => {
  const { position1, position2 } = args || {};
  if (!isValidCoordinate(position1) || !isValidCoordinate(position2)) return 0;
  return haversineDistanceM(position1!, position2!) / 1000;
};

// =============================================================================
// Location Comparison Helpers
// =============================================================================

/**
 * Check if two coordinates are within a given distance threshold.
 * Returns `false` if either coordinate is invalid.
 *
 * @param coord1     - First coordinate.
 * @param coord2     - Second coordinate.
 * @param thresholdM - Distance threshold in meters (default: `DEFAULT_DISTANCE_THRESHOLD_M`).
 * @returns `true` if the coordinates are within the threshold distance.
 */
export function areCoordinatesNear(
  coord1: GeoCoords,
  coord2: GeoCoords,
  thresholdM: number = DEFAULT_DISTANCE_THRESHOLD_M,
): boolean {
  if (!isValidCoordinate(coord1) || !isValidCoordinate(coord2)) return false;
  if (!isFiniteNumber(thresholdM) || thresholdM < 0) return false;
  return haversineDistanceM(coord1, coord2) <= thresholdM;
}

/**
 * Find the nearest location from a list of coordinates.
 *
 * @param target    - Target coordinate to compare against.
 * @param locations - Array of locations with coordinates.
 * @param getCoords - Function to extract a `GeoCoords` from each location.
 * @returns The nearest `{ item, distance }` pair, or `null` if no valid locations found.
 *
 * @example
 * ```ts
 * const nearest = findNearestLocation(userCoords, cachedLocations, (loc) => loc.coords);
 * if (nearest && nearest.distance < 100) {
 *   // Use cached location
 * }
 * ```
 */
export function findNearestLocation<T>(
  target: GeoCoords,
  locations: T[] | null | undefined,
  getCoords: (item: T) => GeoCoords,
): { item: T; distance: number } | null {
  if (!locations?.length || !isValidCoordinate(target)) return null;

  let nearest: { item: T; distance: number } | null = null;

  for (const item of locations) {
    const coords = getCoords(item);
    if (!isValidCoordinate(coords)) continue;

    const distance = haversineDistanceM(target, coords);
    if (!nearest || distance < nearest.distance) {
      nearest = { item, distance };
    }
  }

  return nearest;
}

// =============================================================================
// Coordinate Formatting
// =============================================================================

/**
 * Round coordinates to a specified decimal precision.
 * Returns `null` if coords is invalid.
 *
 * @param coords    - Coordinates to format.
 * @param precision - Decimal places (default: 6, ~0.1m precision).
 * @returns New `GeoCoords` object with rounded values, or `null` if coords is invalid.
 */
export function formatCoordinates(coords: GeoCoords | null | undefined, precision: number = 6): GeoCoords | null {
  if (!isValidCoordinate(coords)) return null;
  const p = isFiniteNumber(precision) && precision >= 0 ? precision : 6;
  return {
    latitude: Number(coords!.latitude.toFixed(p)),
    longitude: Number(coords!.longitude.toFixed(p)),
  };
}

// =============================================================================
// Bounding Box Helpers
// =============================================================================

/**
 * Create a bounding box around a coordinate with a given radius.
 * Returns `null` if center is invalid or radius is not a positive finite number.
 *
 * @param center  - Center coordinate.
 * @param radiusM - Radius in meters. Must be a positive finite number.
 * @returns Bounding box, or `null` if inputs are invalid.
 */
export function createBoundingBox(center: GeoCoords | null | undefined, radiusM: number): BoundingBox | null {
  if (!isValidCoordinate(center)) return null;
  if (!isFiniteNumber(radiusM) || radiusM <= 0) return null;

  const latDegPerM = 1 / 111320;
  const lngDegPerM = 1 / (111320 * Math.cos(toRadians(center!.latitude) ?? 0));

  const latOffset = radiusM * latDegPerM;
  const lngOffset = radiusM * lngDegPerM;

  return {
    north: center!.latitude + latOffset,
    south: center!.latitude - latOffset,
    east: center!.longitude + lngOffset,
    west: center!.longitude - lngOffset,
  };
}

/**
 * Check if a coordinate falls within a bounding box.
 * Returns `false` if either argument is null/undefined/invalid.
 *
 * @param coords - Coordinate to check.
 * @param box    - Bounding box.
 * @returns `true` if the coordinate is within the box.
 */
export function isWithinBoundingBox(
  coords: GeoCoords | null | undefined,
  box: BoundingBox | null | undefined,
): boolean {
  if (!isValidCoordinate(coords) || !box) return false;

  return (
    coords!.latitude >= box.south &&
    coords!.latitude <= box.north &&
    coords!.longitude >= box.west &&
    coords!.longitude <= box.east
  );
}

// =============================================================================
// Bearing Calculations
// =============================================================================

/**
 * Calculate the initial bearing (forward azimuth) from `p1` to `p2`.
 * Returns `null` if either coordinate is invalid.
 *
 * @param p1 - Origin coordinate.
 * @param p2 - Destination coordinate.
 * @returns Bearing in degrees (0–360), where 0 = North, 90 = East. `null` if inputs invalid.
 */
export const calculateBearing = (p1: GeoCoords | null | undefined, p2: GeoCoords | null | undefined): number | null => {
  if (!isValidCoordinate(p1) || !isValidCoordinate(p2)) return null;

  const lat1 = toRadians(p1!.latitude) ?? 0;
  const lat2 = toRadians(p2!.latitude) ?? 0;
  const dLng = toRadians(p2!.longitude - p1!.longitude) ?? 0;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  // Parentheses around toDegrees are required — `+ 360` must apply to the
  // result, not to the `?? 0` fallback.
  return ((toDegrees(Math.atan2(y, x)) ?? 0) + 360) % 360;
};

/**
 * Calculate the absolute angular difference between two bearings.
 * Handles the 0°/360° wraparound correctly.
 * Returns `null` if either bearing is not a finite number.
 *
 * @param bearing1 - First bearing in degrees.
 * @param bearing2 - Second bearing in degrees.
 * @returns Difference in degrees (0–180), or `null` if either input is invalid.
 */
export const bearingDelta = (bearing1: number, bearing2: number): number | null => {
  if (!isFiniteNumber(bearing1) || !isFiniteNumber(bearing2)) return null;
  const diff = Math.abs(bearing1 - bearing2) % 360;
  return diff > 180 ? 360 - diff : diff;
};

// =============================================================================
// Path / Route Helpers
// =============================================================================

/**
 * Sum the great-circle distances between consecutive points in a path.
 * Skips invalid coordinates rather than failing the whole calculation.
 *
 * @param points - Ordered array of coordinates.
 * @returns Total distance in meters, or `0` if fewer than 2 valid points.
 */
export const calculateTotalDistance = (points: GeoCoords[] | null | undefined): number => {
  if (!points || points.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    if (!isValidCoordinate(prev) || !isValidCoordinate(curr)) continue;
    total += haversineDistanceM(prev, curr);
  }
  return total;
};

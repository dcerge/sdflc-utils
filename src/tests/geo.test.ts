// ./src/tests/geo.test.ts

import {
  buildCoordinatesStr,
  extractLatitudeLongitude,
  extractLatitueLongitude,
  buildCoordinates,
  coordinatesParamNames,
  haversineDistanceM,
  calcDistance,
  areCoordinatesNear,
  isValidCoordinate,
  findNearestLocation,
  formatCoordinates,
  createBoundingBox,
  isWithinBoundingBox,
  calculateBearing,
  bearingDelta,
  calculateTotalDistance,
} from '../';

// Well-known coordinates used across tests
const LONDON = { latitude: 51.5074, longitude: -0.1278 };
const PARIS = { latitude: 48.8566, longitude: 2.3522 };
const ORIGIN = { latitude: 0, longitude: 0 };

// Reusable invalid inputs
const NULL_COORD = null;
const INVALID_COORD = { latitude: 999, longitude: 0 };
const NAN_COORD = { latitude: NaN, longitude: 0 };
const INF_COORD = { latitude: Infinity, longitude: 0 };
const STR_COORD = { latitude: '51' as any, longitude: 0 };

// =============================================================================
// buildCoordinatesStr
// =============================================================================
describe('buildCoordinatesStr', () => {
  it('formats coordinates with default precision (5)', () => {
    expect(buildCoordinatesStr(LONDON)).toBe('51.50740, -0.12780');
  });

  it('formats coordinates with custom precision', () => {
    expect(buildCoordinatesStr(LONDON, 2)).toBe('51.51, -0.13');
  });

  it('returns "" for null', () => {
    expect(buildCoordinatesStr(null)).toBe('');
  });

  it('returns "" for undefined', () => {
    expect(buildCoordinatesStr(undefined)).toBe('');
  });

  it('returns "" for invalid coordinates', () => {
    expect(buildCoordinatesStr(INVALID_COORD)).toBe('');
    expect(buildCoordinatesStr(NAN_COORD)).toBe('');
  });

  it('falls back to precision 5 for invalid precision argument', () => {
    expect(buildCoordinatesStr(LONDON, NaN)).toBe('51.50740, -0.12780');
    expect(buildCoordinatesStr(LONDON, -1)).toBe('51.50740, -0.12780');
  });
});

// =============================================================================
// extractLatitudeLongitude
// =============================================================================
describe('extractLatitudeLongitude', () => {
  it('parses "lat,lng" string into numeric GeoCoords', () => {
    const result = extractLatitudeLongitude('51.5074,-0.1278');
    expect(result.latitude).toBeCloseTo(51.5074);
    expect(result.longitude).toBeCloseTo(-0.1278);
  });

  it('returns 0 for empty string (Number("") === 0)', () => {
    // ''.split(',') produces [''], and Number('') is 0 — not NaN.
    // A missing longitude segment produces Number(undefined) which is NaN.
    const result = extractLatitudeLongitude('');
    expect(result.latitude).toBe(0);
    expect(result.longitude).toBeNaN();
  });

  it('returns NaN for non-numeric content', () => {
    const result = extractLatitudeLongitude('abc,def');
    expect(result.latitude).toBeNaN();
    expect(result.longitude).toBeNaN();
  });

  it('extractLatitueLongitude is a deprecated alias', () => {
    const result = extractLatitueLongitude('48.8566,2.3522');
    expect(result.latitude).toBeCloseTo(48.8566);
  });
});

// =============================================================================
// buildCoordinates
// =============================================================================
describe('buildCoordinates', () => {
  it('builds coordinates object from a full query', () => {
    const query = {
      latitude: 51.5074,
      longitude: -0.1278,
      altitude: 10,
      accuracy: 5,
      altitudeAccuracy: 3,
      heading: 90,
      speed: 1.5,
      coordinatesCode: '42',
    };
    const result = buildCoordinates(query);
    expect(result.coordinates).toBe('51.50740, -0.12780');
    expect(result.coordinatesCode).toBe(42);
    const extra = JSON.parse(result.coordinatesExtra);
    expect(extra.latitude).toBe(51.5074);
    expect(extra.altitude).toBe(10);
  });

  it('sets coordinatesCode to undefined when absent', () => {
    expect(buildCoordinates({ latitude: 0, longitude: 0 }).coordinatesCode).toBeUndefined();
  });

  it('sets coordinatesCode to 0 for falsy non-undefined value', () => {
    expect(buildCoordinates({ latitude: 0, longitude: 0, coordinatesCode: '' }).coordinatesCode).toBe(0);
  });

  it('does not throw for null/undefined query', () => {
    expect(() => buildCoordinates(null as any)).not.toThrow();
    expect(() => buildCoordinates(undefined as any)).not.toThrow();
  });
});

// =============================================================================
// coordinatesParamNames
// =============================================================================
describe('coordinatesParamNames', () => {
  it('returns an array containing all expected field names', () => {
    const names = coordinatesParamNames();
    [
      'latitude',
      'longitude',
      'altitude',
      'accuracy',
      'altitudeAccuracy',
      'heading',
      'speed',
      'coordinatesCode',
    ].forEach((name) => {
      expect(names).toContain(name);
    });
  });
});

// =============================================================================
// isValidCoordinate
// =============================================================================
describe('isValidCoordinate', () => {
  it('returns true for valid coordinates', () => {
    expect(isValidCoordinate(LONDON)).toBe(true);
    expect(isValidCoordinate(ORIGIN)).toBe(true);
    expect(isValidCoordinate({ latitude: 90, longitude: 180 })).toBe(true);
    expect(isValidCoordinate({ latitude: -90, longitude: -180 })).toBe(true);
  });

  it('returns false for null/undefined', () => {
    expect(isValidCoordinate(null)).toBe(false);
    expect(isValidCoordinate(undefined)).toBe(false);
  });

  it('returns false for out-of-range latitude', () => {
    expect(isValidCoordinate({ latitude: 91, longitude: 0 })).toBe(false);
    expect(isValidCoordinate({ latitude: -91, longitude: 0 })).toBe(false);
  });

  it('returns false for out-of-range longitude', () => {
    expect(isValidCoordinate({ latitude: 0, longitude: 181 })).toBe(false);
    expect(isValidCoordinate({ latitude: 0, longitude: -181 })).toBe(false);
  });

  it('returns false for NaN values', () => {
    expect(isValidCoordinate(NAN_COORD)).toBe(false);
  });

  it('returns false for Infinity values', () => {
    expect(isValidCoordinate(INF_COORD)).toBe(false);
  });

  it('returns false for non-number types', () => {
    expect(isValidCoordinate(STR_COORD)).toBe(false);
  });
});

// =============================================================================
// haversineDistanceM
// =============================================================================
describe('haversineDistanceM', () => {
  it('returns ~343,000m between London and Paris', () => {
    const dist = haversineDistanceM(LONDON, PARIS);
    expect(dist).toBeGreaterThan(340_000);
    expect(dist).toBeLessThan(346_000);
  });

  it('returns 0 for identical coordinates', () => {
    expect(haversineDistanceM(LONDON, LONDON)).toBeCloseTo(0);
  });

  it('is symmetric', () => {
    expect(haversineDistanceM(LONDON, PARIS)).toBeCloseTo(haversineDistanceM(PARIS, LONDON));
  });

  it('returns 0 for null coord1', () => {
    expect(haversineDistanceM(NULL_COORD as any, PARIS)).toBe(0);
  });

  it('returns 0 for null coord2', () => {
    expect(haversineDistanceM(LONDON, NULL_COORD as any)).toBe(0);
  });

  it('returns 0 for invalid coord1', () => {
    expect(haversineDistanceM(INVALID_COORD, PARIS)).toBe(0);
  });

  it('returns 0 for NaN coord', () => {
    expect(haversineDistanceM(NAN_COORD, PARIS)).toBe(0);
  });

  it('returns 0 for Infinity coord', () => {
    expect(haversineDistanceM(INF_COORD, PARIS)).toBe(0);
  });
});

// =============================================================================
// calcDistance
// =============================================================================
describe('calcDistance', () => {
  it('returns ~343km between London and Paris', () => {
    const dist = calcDistance({ position1: LONDON, position2: PARIS });
    expect(dist).toBeGreaterThan(340);
    expect(dist).toBeLessThan(346);
  });

  it('returns 0 for identical coordinates', () => {
    expect(calcDistance({ position1: LONDON, position2: LONDON })).toBeCloseTo(0);
  });

  it('returns 0 when position1 is null', () => {
    expect(calcDistance({ position1: null as any, position2: PARIS })).toBe(0);
  });

  it('returns 0 when position2 is null', () => {
    expect(calcDistance({ position1: LONDON, position2: null as any })).toBe(0);
  });

  it('returns 0 when args is null/undefined', () => {
    expect(calcDistance(null as any)).toBe(0);
    expect(calcDistance(undefined as any)).toBe(0);
  });

  it('equals haversineDistanceM / 1000', () => {
    expect(calcDistance({ position1: LONDON, position2: PARIS })).toBeCloseTo(haversineDistanceM(LONDON, PARIS) / 1000);
  });
});

// =============================================================================
// areCoordinatesNear
// =============================================================================
describe('areCoordinatesNear', () => {
  it('returns true for identical coordinates', () => {
    expect(areCoordinatesNear(LONDON, LONDON)).toBe(true);
  });

  it('returns false for London vs Paris', () => {
    expect(areCoordinatesNear(LONDON, PARIS)).toBe(false);
  });

  it('respects custom threshold', () => {
    const nearby = { latitude: LONDON.latitude + 0.0001, longitude: LONDON.longitude };
    expect(areCoordinatesNear(LONDON, nearby, 20)).toBe(true);
    expect(areCoordinatesNear(LONDON, nearby, 1)).toBe(false);
  });

  it('returns false for null coord1', () => {
    expect(areCoordinatesNear(NULL_COORD as any, PARIS)).toBe(false);
  });

  it('returns false for null coord2', () => {
    expect(areCoordinatesNear(LONDON, NULL_COORD as any)).toBe(false);
  });

  it('returns false for invalid coord', () => {
    expect(areCoordinatesNear(INVALID_COORD, PARIS)).toBe(false);
  });

  it('returns false for negative threshold', () => {
    expect(areCoordinatesNear(LONDON, LONDON, -1)).toBe(false);
  });

  it('returns false for NaN threshold', () => {
    expect(areCoordinatesNear(LONDON, LONDON, NaN)).toBe(false);
  });
});

// =============================================================================
// findNearestLocation
// =============================================================================
describe('findNearestLocation', () => {
  const locations = [
    { name: 'London', coords: LONDON },
    { name: 'Paris', coords: PARIS },
  ];
  const getCoords = (loc: (typeof locations)[0]) => loc.coords;

  it('finds the nearest location', () => {
    const result = findNearestLocation(LONDON, locations, getCoords);
    expect(result?.item.name).toBe('London');
    expect(result?.distance).toBeCloseTo(0);
  });

  it('returns null for empty array', () => {
    expect(findNearestLocation(LONDON, [], getCoords)).toBeNull();
  });

  it('returns null for null locations', () => {
    expect(findNearestLocation(LONDON, null as any, getCoords)).toBeNull();
  });

  it('returns null for invalid target', () => {
    expect(findNearestLocation(INVALID_COORD, locations, getCoords)).toBeNull();
  });

  it('returns null for NaN target', () => {
    expect(findNearestLocation(NAN_COORD, locations, getCoords)).toBeNull();
  });

  it('skips items with invalid coordinates', () => {
    const mixed = [
      { name: 'Invalid', coords: INVALID_COORD },
      { name: 'Paris', coords: PARIS },
    ];
    expect(findNearestLocation(LONDON, mixed, (l) => l.coords)?.item.name).toBe('Paris');
  });

  it('returns null when all locations have invalid coordinates', () => {
    const invalid = [{ name: 'Bad', coords: INVALID_COORD }];
    expect(findNearestLocation(LONDON, invalid, (l) => l.coords)).toBeNull();
  });
});

// =============================================================================
// formatCoordinates
// =============================================================================
describe('formatCoordinates', () => {
  it('rounds to 6 decimal places by default', () => {
    const result = formatCoordinates({ latitude: 51.1234567, longitude: -0.1234567 });
    expect(result?.latitude).toBe(51.123457);
    expect(result?.longitude).toBe(-0.123457);
  });

  it('rounds to custom precision', () => {
    const result = formatCoordinates({ latitude: 51.123456789, longitude: -0.987654321 }, 3);
    expect(result?.latitude).toBe(51.123);
    expect(result?.longitude).toBe(-0.988);
  });

  it('returns null for null input', () => {
    expect(formatCoordinates(null)).toBeNull();
  });

  it('returns null for invalid coordinates', () => {
    expect(formatCoordinates(INVALID_COORD)).toBeNull();
    expect(formatCoordinates(NAN_COORD)).toBeNull();
  });

  it('falls back to precision 6 for invalid precision argument', () => {
    const result = formatCoordinates(LONDON, NaN);
    expect(result?.latitude.toString().split('.')[1]?.length).toBeLessThanOrEqual(6);
  });
});

// =============================================================================
// createBoundingBox
// =============================================================================
describe('createBoundingBox', () => {
  it('creates a box with north > south and east > west', () => {
    const box = createBoundingBox(LONDON, 1000);
    expect(box!.north).toBeGreaterThan(box!.south);
    expect(box!.east).toBeGreaterThan(box!.west);
  });

  it('contains the center point', () => {
    const box = createBoundingBox(LONDON, 1000);
    expect(isWithinBoundingBox(LONDON, box)).toBe(true);
  });

  it('produces a larger box for a larger radius', () => {
    const small = createBoundingBox(LONDON, 500)!;
    const large = createBoundingBox(LONDON, 5000)!;
    expect(large.north - large.south).toBeGreaterThan(small.north - small.south);
  });

  it('returns null for null center', () => {
    expect(createBoundingBox(null, 1000)).toBeNull();
  });

  it('returns null for invalid center', () => {
    expect(createBoundingBox(INVALID_COORD, 1000)).toBeNull();
  });

  it('returns null for zero radius', () => {
    expect(createBoundingBox(LONDON, 0)).toBeNull();
  });

  it('returns null for negative radius', () => {
    expect(createBoundingBox(LONDON, -100)).toBeNull();
  });

  it('returns null for NaN radius', () => {
    expect(createBoundingBox(LONDON, NaN)).toBeNull();
  });
});

// =============================================================================
// isWithinBoundingBox
// =============================================================================
describe('isWithinBoundingBox', () => {
  const box = { north: 52, south: 51, east: 1, west: -1 };

  it('returns true for coordinate inside the box', () => {
    expect(isWithinBoundingBox({ latitude: 51.5, longitude: 0 }, box)).toBe(true);
  });

  it('returns false for coordinate outside the box', () => {
    expect(isWithinBoundingBox(PARIS, box)).toBe(false);
  });

  it('returns true on boundary', () => {
    expect(isWithinBoundingBox({ latitude: 51, longitude: -1 }, box)).toBe(true);
  });

  it('returns false for null coords', () => {
    expect(isWithinBoundingBox(null, box)).toBe(false);
  });

  it('returns false for null box', () => {
    expect(isWithinBoundingBox(LONDON, null)).toBe(false);
  });

  it('returns false for invalid coords', () => {
    expect(isWithinBoundingBox(INVALID_COORD, box)).toBe(false);
  });

  it('returns false for NaN coords', () => {
    expect(isWithinBoundingBox(NAN_COORD, box)).toBe(false);
  });
});

// =============================================================================
// calculateBearing
// =============================================================================
describe('calculateBearing', () => {
  it('returns ~90° going due East', () => {
    expect(calculateBearing({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 10 })).toBeCloseTo(90, 0);
  });

  it('returns ~0° going due North', () => {
    expect(calculateBearing({ latitude: 0, longitude: 0 }, { latitude: 10, longitude: 0 })).toBeCloseTo(0, 0);
  });

  it('returns a value in [0, 360)', () => {
    const b = calculateBearing(LONDON, PARIS)!;
    expect(b).toBeGreaterThanOrEqual(0);
    expect(b).toBeLessThan(360);
  });

  it('returns null for null p1', () => {
    expect(calculateBearing(null, PARIS)).toBeNull();
  });

  it('returns null for null p2', () => {
    expect(calculateBearing(LONDON, null)).toBeNull();
  });

  it('returns null for invalid coord', () => {
    expect(calculateBearing(INVALID_COORD, PARIS)).toBeNull();
    expect(calculateBearing(LONDON, NAN_COORD)).toBeNull();
  });
});

// =============================================================================
// bearingDelta
// =============================================================================
describe('bearingDelta', () => {
  it('returns 0 for identical bearings', () => {
    expect(bearingDelta(90, 90)).toBe(0);
  });

  it('returns 180 for opposite bearings', () => {
    expect(bearingDelta(0, 180)).toBe(180);
  });

  it('handles 0/360 wraparound', () => {
    expect(bearingDelta(10, 350)).toBe(20);
    expect(bearingDelta(350, 10)).toBe(20);
  });

  it('never returns more than 180', () => {
    expect(bearingDelta(0, 270)).toBe(90);
  });

  it('returns null for NaN bearing', () => {
    expect(bearingDelta(NaN, 90)).toBeNull();
    expect(bearingDelta(90, NaN)).toBeNull();
  });

  it('returns null for Infinity bearing', () => {
    expect(bearingDelta(Infinity, 90)).toBeNull();
  });
});

// =============================================================================
// calculateTotalDistance
// =============================================================================
describe('calculateTotalDistance', () => {
  it('returns 0 for fewer than 2 points', () => {
    expect(calculateTotalDistance([])).toBe(0);
    expect(calculateTotalDistance([LONDON])).toBe(0);
  });

  it('returns 0 for null/undefined input', () => {
    expect(calculateTotalDistance(null as any)).toBe(0);
    expect(calculateTotalDistance(undefined as any)).toBe(0);
  });

  it('returns correct distance for two points', () => {
    expect(calculateTotalDistance([LONDON, PARIS])).toBeCloseTo(haversineDistanceM(LONDON, PARIS));
  });

  it('sums distances across multiple points', () => {
    const expected = haversineDistanceM(LONDON, PARIS) + haversineDistanceM(PARIS, ORIGIN);
    expect(calculateTotalDistance([LONDON, PARIS, ORIGIN])).toBeCloseTo(expected);
  });

  it('skips invalid coordinates without throwing', () => {
    const points = [LONDON, INVALID_COORD, PARIS];
    const result = calculateTotalDistance(points);
    // LONDON→INVALID skipped, INVALID→PARIS skipped; result should be 0
    expect(result).toBe(0);
  });

  it('skips NaN coordinates without throwing', () => {
    expect(() => calculateTotalDistance([LONDON, NAN_COORD, PARIS])).not.toThrow();
  });
});

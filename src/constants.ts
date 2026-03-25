// ./src/constants.ts

export const VALUE_TYPES = {
  NUMBER: 100,
  INTEGER: 101,
  FLOAT: 102,
  DECIMAL: 103,
  CURRENCY: 200,
  BOOLEAN: 300,
  STRING: 400,
  JSON: 500,
  EMAIL: 1001,
  PHONE: 1002,
  URL: 1003,
} as const;

export const VALUE_TYPES_LIST = Object.values(VALUE_TYPES);

export const STATUSES = {
  TEST: 50,
  ACTIVE: 100,
  DRAFT: 200,
  PENDING: 300,
  BLOCKED: 1000,
  DISABLED: 5000,
  REMOVED: 10000,
} as const;

export const ACCESS_RIGHTS = {
  LIST: 1,
  GET: 2,
  CREATE: 4,
  UPDATE: 8,
  REMOVE: 16,
  RUN: 32,
} as const;

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// =============================================================================
// Physical / conversion constants
// =============================================================================

export const MILES_TO_KM = 1.60934;
export const US_GALLONS_TO_LITERS = 3.78541;
export const UK_GALLONS_TO_LITERS = 4.54609;

/** Earth's radius in meters */
export const EARTH_RADIUS_M = 6371000;

/** Default distance threshold for "same location" checks (meters) */
export const DEFAULT_DISTANCE_THRESHOLD_M = 30;

/** Default max age for location freshness (5 minutes in ms) */
export const DEFAULT_MAX_AGE_MS = 5 * 60 * 1000;

// =============================================================================
// Unit constants
// =============================================================================

/**
 * Distance units.
 * @example
 * toMetricDistance(value, DISTANCE_UNITS.MILES)
 */
export const DISTANCE_UNITS = {
  KM: 'km',
  MILES: 'mi',
} as const;

export type DistanceUnit = (typeof DISTANCE_UNITS)[keyof typeof DISTANCE_UNITS];

/**
 * Volume / energy / mass units for fuel.
 * @example
 * toMetricVolume(value, VOLUME_UNITS.GALLONS_US)
 */
export const VOLUME_UNITS = {
  LITERS: 'l',
  GALLONS_US: 'gal-us',
  GALLONS_UK: 'gal-uk',
  KWH: 'kwh',
  KG: 'kg',
} as const;

export type VolumeUnit = (typeof VOLUME_UNITS)[keyof typeof VOLUME_UNITS];

/**
 * Fuel / energy consumption units.
 *
 * Naming convention:
 *   - `X_PER_100Y`  = X consumed per 100 Y  (lower is better, e.g. l/100km)
 *   - `Y_PER_X`     = Y distance per unit X  (higher is better, e.g. km/l)
 *
 * @example
 * calculateConsumption(dist, vol, CONSUMPTION_UNITS.L_PER_100KM)
 */
export const CONSUMPTION_UNITS = {
  // Liquid
  L_PER_100KM: 'l100km',
  KM_PER_L: 'km-l',
  MPG_US: 'mpg-us',
  MPG_UK: 'mpg-uk',
  MI_PER_L: 'mi-l',

  // Electric
  KWH_PER_100KM: 'kwh100km',
  KWH_PER_100MI: 'kwh100mi',
  WH_PER_MI: 'wh-mi',
  KM_PER_KWH: 'km-kwh',
  MI_PER_KWH: 'mi-kwh',

  // Hydrogen
  KG_PER_100KM: 'kg100km',
  KG_PER_100MI: 'kg100mi',
  KM_PER_KG: 'km-kg',
  MI_PER_KG: 'mi-kg',
} as const;

export type ConsumptionUnit = (typeof CONSUMPTION_UNITS)[keyof typeof CONSUMPTION_UNITS];

// =============================================================================
// Alphabets / identifiers
// =============================================================================

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const ALPHABET_AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const ALPHABET_az = 'abcdefghijklmnopqrstuvwxyz';
export const ALPHABET_09 = '0123456789';
export const ALPHABET_CODE = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789';

export const UUID_EMPTY = '00000000-0000-4000-9000-000000000000';
export const UUID_ZERO = '00000000-0000-0000-0000-000000000000';
export const UUID_ONE = '00000000-0000-4000-9000-000000000001';
export const UUID_TWO = '00000000-0000-4000-9001-000000000000';
export const UUID_THREE = '00000000-0000-4001-9000-000000000000';
export const UUID_FOUR = '00000000-0001-4000-9000-000000000000';
export const UUID_FIVE = '00000001-0000-4000-9000-000000000000';

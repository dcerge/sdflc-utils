// ./src/converters.ts

import {
  MILES_TO_KM,
  UK_GALLONS_TO_LITERS,
  US_GALLONS_TO_LITERS,
  VALUE_TYPES,
  DISTANCE_UNITS,
  VOLUME_UNITS,
  CONSUMPTION_UNITS,
  DistanceUnit,
  VolumeUnit,
  ConsumptionUnit,
} from './constants';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Round a number to 3 decimal places. */
const round3 = (n: number): number => Number(Number(n).toFixed(3));

// =============================================================================
// String / Object Converters
// =============================================================================

/**
 * Converts a string to a specified value type.
 * Throws if the type is unsupported.
 *
 * @param value     The string value to convert.
 * @param valueType One of the VALUE_TYPES constants.
 */
export const convertStringToValue = (value: any, valueType: number) => {
  switch (valueType) {
    case VALUE_TYPES.STRING:
      return value;
    case VALUE_TYPES.NUMBER:
    case VALUE_TYPES.DECIMAL:
      return Number(value);
    case VALUE_TYPES.INTEGER:
      if (isNaN(Number(value))) return NaN;
      return parseInt(value);
    case VALUE_TYPES.FLOAT:
      if (isNaN(Number(value))) return NaN;
      return parseFloat(value);
    case VALUE_TYPES.BOOLEAN:
      return (value || '').toLowerCase() === 'true';
    default:
      throw Error(`Can't convert string value to the type '${valueType}' as it is unsupported`);
  }
};

/**
 * @deprecated Renamed to `convertStringToValue`. Will be removed in a future major version.
 */
export const converStringToValue = convertStringToValue;

/**
 * Safely stringify an object to a JSON string.
 * Returns the stringified `defaultObj` if serialization fails.
 */
export const stringifyObject = (config: any, defaultObj: any = {}): string => {
  try {
    return JSON.stringify(config);
  } catch {
    return JSON.stringify(defaultObj);
  }
};

/**
 * Safely parse a JSON string into an object shaped like `defaultObj`.
 * - Returns a copy of `defaultObj` if parsing fails or input is falsy.
 * - Keeps only properties present in `defaultObj`.
 * - Falls back to the default value on type mismatch.
 * - Handles nested objects and arrays appropriately.
 *
 * @param jsonString  The JSON string to parse.
 * @param defaultObj  The shape and default values of the expected object.
 */
export const parseObject = <T extends Record<string, any>>(jsonString: string | null | undefined, defaultObj: T): T => {
  if (!jsonString) return { ...defaultObj };

  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ...defaultObj };
    }

    const result: Record<string, any> = {};

    for (const key of Object.keys(defaultObj)) {
      const defaultValue = defaultObj[key];
      const parsedValue = parsed[key];

      if (parsedValue === undefined) {
        result[key] = defaultValue;
        continue;
      }

      const defaultType = Array.isArray(defaultValue) ? 'array' : typeof defaultValue;
      const parsedType = Array.isArray(parsedValue) ? 'array' : typeof parsedValue;

      result[key] = defaultType === parsedType || defaultValue === null ? parsedValue : defaultValue;
    }

    return result as T;
  } catch {
    return { ...defaultObj };
  }
};

// =============================================================================
// Math / Physics Converters
// =============================================================================

/**
 * Convert degrees to radians.
 */
export const toRadians = (degrees: number | null | undefined): number | null => {
  if (degrees === null || degrees === undefined) return null;
  return degrees * (Math.PI / 180);
};

/**
 * Converts radians to degrees.
 */
export const toDegrees = (rad: number | null | undefined): number | null => {
  if (rad === null || rad === undefined) return null;
  return (rad * 180) / Math.PI;
};

/**
 * Convert meters to kilometers, rounded to 3 decimal places.
 */
export const metersToKm = (meters: number | null | undefined): number | null => {
  if (meters === null || meters === undefined) return null;
  return round3(meters / 1000);
};

/**
 * Convert meters per second to kilometers per hour.
 */
export const mpsToKmh = (mps: number | null | undefined): number | null => {
  if (mps === null || mps === undefined) return null;
  return mps * 3.6;
};

// =============================================================================
// Fuel Type Helpers
// =============================================================================

/** Returns true if the unit represents electric vehicle energy (kWh). */
export function isElectricUnit(unit: string): boolean {
  return unit === VOLUME_UNITS.KWH;
}

/** Returns true if the unit represents hydrogen fuel (kg). */
export function isHydrogenUnit(unit: string): boolean {
  return unit === VOLUME_UNITS.KG;
}

/** Returns true if the unit represents a liquid fuel (l, gal-us, gal-uk). */
export function isLiquidUnit(unit: string): boolean {
  return ([VOLUME_UNITS.LITERS, VOLUME_UNITS.GALLONS_US, VOLUME_UNITS.GALLONS_UK] as string[]).includes(unit);
}

// =============================================================================
// Distance Conversions
// =============================================================================

/**
 * Convert distance from user's preferred unit to metric (kilometers).
 *
 * @param value Distance in user's preferred unit.
 * @param unit  User's distance unit — use `DISTANCE_UNITS`.
 * @returns Distance in kilometers, or `null` if input is `null`/`undefined`.
 */
export function toMetricDistance(value: number | null | undefined, unit: DistanceUnit | string): number | null {
  if (value === null || value === undefined) return null;
  return unit === DISTANCE_UNITS.MILES ? value * MILES_TO_KM : value;
}

/**
 * Convert distance from metric (kilometers) to user's preferred unit.
 *
 * @param value Distance in kilometers.
 * @param unit  User's distance unit — use `DISTANCE_UNITS`.
 * @returns Distance in user's preferred unit, or `null` if input is `null`/`undefined`.
 */
export function fromMetricDistance(value: number | null | undefined, unit: DistanceUnit | string): number | null {
  if (value === null || value === undefined) return null;
  return unit === DISTANCE_UNITS.MILES ? value / MILES_TO_KM : value;
}

/**
 * Convert distance from metric (kilometers) to user's preferred unit, rounded to a whole number.
 * Use when the original entered value is unavailable (e.g. user changed unit preferences).
 *
 * @param value Distance in kilometers.
 * @param unit  User's distance unit — use `DISTANCE_UNITS`.
 * @returns Rounded distance in user's preferred unit, or `null` if input is `null`/`undefined`.
 */
export function fromMetricDistanceRounded(
  value: number | null | undefined,
  unit: DistanceUnit | string,
): number | null {
  const converted = fromMetricDistance(value, unit);
  return converted === null ? null : Math.round(converted);
}

// =============================================================================
// Volume / Energy / Mass Conversions
// =============================================================================

/**
 * Convert volume/energy/mass from user's entered unit to metric base.
 * - Liquid fuels → liters
 * - Electric (kWh) → kWh (no conversion)
 * - Hydrogen (kg) → kg (no conversion)
 *
 * @param value Volume/energy/mass in user's entered unit.
 * @param unit  User's unit — use `VOLUME_UNITS`.
 * @returns Value in metric base unit rounded to 3 d.p., or `null` if input is `null`/`undefined`.
 */
export function toMetricVolume(value: number | null | undefined, unit: VolumeUnit | string): number | null {
  if (value === null || value === undefined) return null;

  switch (unit) {
    case VOLUME_UNITS.GALLONS_US:
      return round3(value * US_GALLONS_TO_LITERS);
    case VOLUME_UNITS.GALLONS_UK:
      return round3(value * UK_GALLONS_TO_LITERS);
    default:
      return round3(value);
  }
}

/**
 * Convert volume/energy/mass from metric base to user's preferred unit.
 * - Liquid fuels → from liters
 * - Electric (kWh) → kWh (no conversion)
 * - Hydrogen (kg) → kg (no conversion)
 *
 * @param value Volume/energy/mass in metric base unit.
 * @param unit  User's unit — use `VOLUME_UNITS`.
 * @returns Value in user's preferred unit rounded to 3 d.p., or `null` if input is `null`/`undefined`.
 */
export function fromMetricVolume(value: number | null | undefined, unit: VolumeUnit | string): number | null {
  if (value === null || value === undefined) return null;

  switch (unit) {
    case VOLUME_UNITS.GALLONS_US:
      return round3(value / US_GALLONS_TO_LITERS);
    case VOLUME_UNITS.GALLONS_UK:
      return round3(value / UK_GALLONS_TO_LITERS);
    default:
      return round3(value);
  }
}

// =============================================================================
// Fuel Consumption Unit Mapping
// =============================================================================

/** Map a liquid fuel consumption unit preference to the equivalent electric unit. */
function mapToElectricConsumptionUnit(liquidUnit: string): ConsumptionUnit {
  switch (liquidUnit) {
    case CONSUMPTION_UNITS.L_PER_100KM:
      return CONSUMPTION_UNITS.KWH_PER_100KM;
    case CONSUMPTION_UNITS.KM_PER_L:
      return CONSUMPTION_UNITS.KM_PER_KWH;
    case CONSUMPTION_UNITS.MPG_US:
    case CONSUMPTION_UNITS.MPG_UK:
    case CONSUMPTION_UNITS.MI_PER_L:
      return CONSUMPTION_UNITS.MI_PER_KWH;
    default:
      return CONSUMPTION_UNITS.KWH_PER_100KM;
  }
}

/** Map a liquid fuel consumption unit preference to the equivalent hydrogen unit. */
function mapToHydrogenConsumptionUnit(liquidUnit: string): ConsumptionUnit {
  switch (liquidUnit) {
    case CONSUMPTION_UNITS.L_PER_100KM:
      return CONSUMPTION_UNITS.KG_PER_100KM;
    case CONSUMPTION_UNITS.KM_PER_L:
      return CONSUMPTION_UNITS.KM_PER_KG;
    case CONSUMPTION_UNITS.MPG_US:
    case CONSUMPTION_UNITS.MPG_UK:
    case CONSUMPTION_UNITS.MI_PER_L:
      return CONSUMPTION_UNITS.MI_PER_KG;
    default:
      return CONSUMPTION_UNITS.KG_PER_100KM;
  }
}

/**
 * Get the appropriate consumption unit based on user preference and fuel type.
 * Maps liquid fuel preferences to equivalent electric/hydrogen units automatically.
 *
 * @param userConsumptionUnit User's consumption preference — use `CONSUMPTION_UNITS`.
 * @param volumeUnit          The unit the fuel was entered in — use `VOLUME_UNITS`.
 * @returns Appropriate consumption unit for the fuel type.
 */
export function getConsumptionUnitForFuelType(
  userConsumptionUnit: ConsumptionUnit | string,
  volumeUnit: VolumeUnit | string,
): ConsumptionUnit | string {
  if (isElectricUnit(volumeUnit)) return mapToElectricConsumptionUnit(userConsumptionUnit);
  if (isHydrogenUnit(volumeUnit)) return mapToHydrogenConsumptionUnit(userConsumptionUnit);
  return userConsumptionUnit;
}

/**
 * Derive a sensible consumption unit from distance and volume units.
 * Used when no explicit consumption preference is available (e.g. for car units).
 *
 * @param distanceUnit Distance unit — use `DISTANCE_UNITS`.
 * @param volumeUnit   Volume unit — use `VOLUME_UNITS`.
 * @returns Appropriate consumption unit string.
 */
export function deriveConsumptionUnit(
  distanceUnit: DistanceUnit | string,
  volumeUnit: VolumeUnit | string,
): ConsumptionUnit {
  const isMiles = distanceUnit === DISTANCE_UNITS.MILES;

  if (isElectricUnit(volumeUnit)) return isMiles ? CONSUMPTION_UNITS.MI_PER_KWH : CONSUMPTION_UNITS.KWH_PER_100KM;
  if (isHydrogenUnit(volumeUnit)) return isMiles ? CONSUMPTION_UNITS.MI_PER_KG : CONSUMPTION_UNITS.KG_PER_100KM;

  if (isMiles) {
    switch (volumeUnit) {
      case VOLUME_UNITS.GALLONS_US:
        return CONSUMPTION_UNITS.MPG_US;
      case VOLUME_UNITS.GALLONS_UK:
        return CONSUMPTION_UNITS.MPG_UK;
      default:
        return CONSUMPTION_UNITS.MI_PER_L;
    }
  }

  switch (volumeUnit) {
    case VOLUME_UNITS.GALLONS_US:
    case VOLUME_UNITS.GALLONS_UK:
      return CONSUMPTION_UNITS.KM_PER_L;
    default:
      return CONSUMPTION_UNITS.L_PER_100KM;
  }
}

// =============================================================================
// Fuel Consumption Calculations
// =============================================================================

/**
 * Calculate fuel/energy consumption in the specified unit.
 *
 * Supported units (use `CONSUMPTION_UNITS`):
 * - Liquid:   `L_PER_100KM`, `KM_PER_L`, `MPG_US`, `MPG_UK`, `MI_PER_L`
 * - Electric: `KWH_PER_100KM`, `KWH_PER_100MI`, `WH_PER_MI`, `KM_PER_KWH`, `MI_PER_KWH`
 * - Hydrogen: `KG_PER_100KM`, `KG_PER_100MI`, `KM_PER_KG`, `MI_PER_KG`
 *
 * @param distanceKm      Distance in kilometers (metric base).
 * @param volumeOrEnergy  Volume in liters, energy in kWh, or mass in kg.
 * @param consumptionUnit Target consumption unit — use `CONSUMPTION_UNITS`.
 * @returns Consumption value, or `null` if inputs are invalid/zero.
 */
export function calculateConsumption(
  distanceKm: number | null | undefined,
  volumeOrEnergy: number | null | undefined,
  consumptionUnit: ConsumptionUnit | string,
): number | null {
  if (!distanceKm || distanceKm <= 0 || !volumeOrEnergy || volumeOrEnergy <= 0) {
    return null;
  }

  const miles = distanceKm / MILES_TO_KM;

  switch (consumptionUnit) {
    // Liquid
    case CONSUMPTION_UNITS.L_PER_100KM:
      return (volumeOrEnergy / distanceKm) * 100;
    case CONSUMPTION_UNITS.KM_PER_L:
      return distanceKm / volumeOrEnergy;
    case CONSUMPTION_UNITS.MPG_US:
      return miles / (volumeOrEnergy / US_GALLONS_TO_LITERS);
    case CONSUMPTION_UNITS.MPG_UK:
      return miles / (volumeOrEnergy / UK_GALLONS_TO_LITERS);
    case CONSUMPTION_UNITS.MI_PER_L:
      return miles / volumeOrEnergy;

    // Electric
    case CONSUMPTION_UNITS.KWH_PER_100KM:
      return (volumeOrEnergy / distanceKm) * 100;
    case CONSUMPTION_UNITS.KWH_PER_100MI:
      return (volumeOrEnergy / miles) * 100;
    case CONSUMPTION_UNITS.WH_PER_MI:
      return (volumeOrEnergy * 1000) / miles;
    case CONSUMPTION_UNITS.KM_PER_KWH:
      return distanceKm / volumeOrEnergy;
    case CONSUMPTION_UNITS.MI_PER_KWH:
      return miles / volumeOrEnergy;

    // Hydrogen
    case CONSUMPTION_UNITS.KG_PER_100KM:
      return (volumeOrEnergy / distanceKm) * 100;
    case CONSUMPTION_UNITS.KG_PER_100MI:
      return (volumeOrEnergy / miles) * 100;
    case CONSUMPTION_UNITS.KM_PER_KG:
      return distanceKm / volumeOrEnergy;
    case CONSUMPTION_UNITS.MI_PER_KG:
      return miles / volumeOrEnergy;

    default:
      return (volumeOrEnergy / distanceKm) * 100;
  }
}

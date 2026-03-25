// ./src/tests/converters.test.ts

import {
  convertStringToValue,
  converStringToValue,
  stringifyObject,
  parseObject,
  toRadians,
  metersToKm,
  mpsToKmh,
  isElectricUnit,
  isHydrogenUnit,
  isLiquidUnit,
  toMetricDistance,
  fromMetricDistance,
  fromMetricDistanceRounded,
  toMetricVolume,
  fromMetricVolume,
  getConsumptionUnitForFuelType,
  deriveConsumptionUnit,
  calculateConsumption,
} from '../';

import {
  VALUE_TYPES,
  DISTANCE_UNITS,
  VOLUME_UNITS,
  CONSUMPTION_UNITS,
  MILES_TO_KM,
  US_GALLONS_TO_LITERS,
  UK_GALLONS_TO_LITERS,
} from '../constants';

// =============================================================================
// convertStringToValue
// =============================================================================
describe('convertStringToValue', () => {
  it('returns string as-is for VALUE_TYPES.STRING', () => {
    expect(convertStringToValue('hello', VALUE_TYPES.STRING)).toBe('hello');
  });

  it('converts to number for VALUE_TYPES.NUMBER', () => {
    expect(convertStringToValue('42', VALUE_TYPES.NUMBER)).toBe(42);
    expect(convertStringToValue('3.14', VALUE_TYPES.NUMBER)).toBe(3.14);
  });

  it('converts to number for VALUE_TYPES.DECIMAL', () => {
    expect(convertStringToValue('9.99', VALUE_TYPES.DECIMAL)).toBe(9.99);
  });

  it('converts to integer for VALUE_TYPES.INTEGER', () => {
    expect(convertStringToValue('7', VALUE_TYPES.INTEGER)).toBe(7);
    expect(convertStringToValue('7.9', VALUE_TYPES.INTEGER)).toBe(7);
  });

  it('returns NaN for invalid integer string', () => {
    expect(convertStringToValue('abc', VALUE_TYPES.INTEGER)).toBeNaN();
  });

  it('converts to float for VALUE_TYPES.FLOAT', () => {
    expect(convertStringToValue('3.14', VALUE_TYPES.FLOAT)).toBeCloseTo(3.14);
  });

  it('returns NaN for invalid float string', () => {
    expect(convertStringToValue('xyz', VALUE_TYPES.FLOAT)).toBeNaN();
  });

  it('converts "true" to boolean true', () => {
    expect(convertStringToValue('true', VALUE_TYPES.BOOLEAN)).toBe(true);
    expect(convertStringToValue('TRUE', VALUE_TYPES.BOOLEAN)).toBe(true);
  });

  it('converts non-"true" strings to boolean false', () => {
    expect(convertStringToValue('false', VALUE_TYPES.BOOLEAN)).toBe(false);
    expect(convertStringToValue('', VALUE_TYPES.BOOLEAN)).toBe(false);
    expect(convertStringToValue(null, VALUE_TYPES.BOOLEAN)).toBe(false);
  });

  it('throws for unsupported type', () => {
    expect(() => convertStringToValue('x', 9999)).toThrow();
  });

  it('converStringToValue is a deprecated alias for convertStringToValue', () => {
    expect(converStringToValue('42', VALUE_TYPES.NUMBER)).toBe(42);
  });
});

// =============================================================================
// stringifyObject
// =============================================================================
describe('stringifyObject', () => {
  it('stringifies a plain object', () => {
    expect(stringifyObject({ a: 1 })).toBe('{"a":1}');
  });

  it('returns stringified defaultObj on serialization failure', () => {
    const circular: any = {};
    circular.self = circular;
    expect(stringifyObject(circular, { fallback: true })).toBe('{"fallback":true}');
  });

  it('returns "{}" when serialization fails and no defaultObj provided', () => {
    const circular: any = {};
    circular.self = circular;
    expect(stringifyObject(circular)).toBe('{}');
  });
});

// =============================================================================
// parseObject
// =============================================================================
describe('parseObject', () => {
  const defaults = { name: 'default', count: 0, active: false, tags: [] as string[] };

  it('returns defaultObj copy for null input', () => {
    expect(parseObject(null, defaults)).toEqual(defaults);
  });

  it('returns defaultObj copy for undefined input', () => {
    expect(parseObject(undefined, defaults)).toEqual(defaults);
  });

  it('returns defaultObj copy for empty string', () => {
    expect(parseObject('', defaults)).toEqual(defaults);
  });

  it('returns defaultObj copy for invalid JSON', () => {
    expect(parseObject('not json', defaults)).toEqual(defaults);
  });

  it('returns defaultObj copy if parsed value is an array', () => {
    expect(parseObject('[]', defaults)).toEqual(defaults);
  });

  it('returns defaultObj copy if parsed value is a primitive', () => {
    expect(parseObject('"hello"', defaults)).toEqual(defaults);
  });

  it('parses valid JSON and fills matching properties', () => {
    const json = JSON.stringify({ name: 'Alice', count: 5 });
    expect(parseObject(json, defaults)).toEqual({ name: 'Alice', count: 5, active: false, tags: [] });
  });

  it('uses default for missing keys', () => {
    const json = JSON.stringify({ name: 'Bob' });
    expect(parseObject(json, defaults)).toEqual({ ...defaults, name: 'Bob' });
  });

  it('uses default on type mismatch', () => {
    const json = JSON.stringify({ name: 'Alice', count: 'not-a-number' });
    expect(parseObject(json, defaults)).toEqual({ ...defaults, name: 'Alice', count: 0 });
  });

  it('strips keys not present in defaultObj', () => {
    const json = JSON.stringify({ name: 'Alice', extra: 'unwanted' });
    expect(parseObject(json, defaults)).not.toHaveProperty('extra');
  });

  it('accepts null default values (any parsed type accepted)', () => {
    const d = { value: null as any };
    expect(parseObject(JSON.stringify({ value: 42 }), d)).toEqual({ value: 42 });
  });

  it('handles array type matching', () => {
    const json = JSON.stringify({ tags: ['a', 'b'] });
    expect(parseObject(json, defaults)).toEqual({ ...defaults, tags: ['a', 'b'] });
  });
});

// =============================================================================
// toRadians
// =============================================================================
describe('toRadians', () => {
  it('converts 180° to π', () => expect(toRadians(180)).toBeCloseTo(Math.PI));
  it('converts 0° to 0', () => expect(toRadians(0)).toBe(0));
  it('converts 90° to π/2', () => expect(toRadians(90)).toBeCloseTo(Math.PI / 2));
  it('returns null for null', () => expect(toRadians(null)).toBeNull());
  it('returns null for undefined', () => expect(toRadians(undefined)).toBeNull());
});

// =============================================================================
// metersToKm
// =============================================================================
describe('metersToKm', () => {
  it('converts 1000m to 1km', () => expect(metersToKm(1000)).toBe(1));
  it('converts 1500m to 1.5km', () => expect(metersToKm(1500)).toBe(1.5));
  it('converts 1m to 0.001km', () => expect(metersToKm(1)).toBe(0.001));
  it('converts 1234m to 1.234km', () => expect(metersToKm(1234)).toBe(1.234));
  it('returns null for null', () => expect(metersToKm(null)).toBeNull());
  it('returns null for undefined', () => expect(metersToKm(undefined)).toBeNull());
});

// =============================================================================
// mpsToKmh
// =============================================================================
describe('mpsToKmh', () => {
  it('converts 1 m/s to 3.6 km/h', () => expect(mpsToKmh(1)).toBe(3.6));
  it('converts 0 m/s to 0 km/h', () => expect(mpsToKmh(0)).toBe(0));
  it('converts 27.78 m/s to ~100 km/h', () => expect(mpsToKmh(27.78)).toBeCloseTo(100, 0));
  it('returns null for null', () => expect(mpsToKmh(null)).toBeNull());
  it('returns null for undefined', () => expect(mpsToKmh(undefined)).toBeNull());
});

// =============================================================================
// Fuel type helpers
// =============================================================================
describe('isElectricUnit', () => {
  it('returns true for VOLUME_UNITS.KWH', () => expect(isElectricUnit(VOLUME_UNITS.KWH)).toBe(true));
  it('returns false for VOLUME_UNITS.LITERS', () => expect(isElectricUnit(VOLUME_UNITS.LITERS)).toBe(false));
  it('returns false for VOLUME_UNITS.KG', () => expect(isElectricUnit(VOLUME_UNITS.KG)).toBe(false));
});

describe('isHydrogenUnit', () => {
  it('returns true for VOLUME_UNITS.KG', () => expect(isHydrogenUnit(VOLUME_UNITS.KG)).toBe(true));
  it('returns false for VOLUME_UNITS.KWH', () => expect(isHydrogenUnit(VOLUME_UNITS.KWH)).toBe(false));
  it('returns false for VOLUME_UNITS.LITERS', () => expect(isHydrogenUnit(VOLUME_UNITS.LITERS)).toBe(false));
});

describe('isLiquidUnit', () => {
  it('returns true for VOLUME_UNITS.LITERS', () => expect(isLiquidUnit(VOLUME_UNITS.LITERS)).toBe(true));
  it('returns true for VOLUME_UNITS.GALLONS_US', () => expect(isLiquidUnit(VOLUME_UNITS.GALLONS_US)).toBe(true));
  it('returns true for VOLUME_UNITS.GALLONS_UK', () => expect(isLiquidUnit(VOLUME_UNITS.GALLONS_UK)).toBe(true));
  it('returns false for VOLUME_UNITS.KWH', () => expect(isLiquidUnit(VOLUME_UNITS.KWH)).toBe(false));
  it('returns false for VOLUME_UNITS.KG', () => expect(isLiquidUnit(VOLUME_UNITS.KG)).toBe(false));
});

// =============================================================================
// toMetricDistance / fromMetricDistance / fromMetricDistanceRounded
// =============================================================================
describe('toMetricDistance', () => {
  it('returns value unchanged for DISTANCE_UNITS.KM', () => expect(toMetricDistance(100, DISTANCE_UNITS.KM)).toBe(100));
  it('converts miles to km', () => expect(toMetricDistance(1, DISTANCE_UNITS.MILES)).toBeCloseTo(MILES_TO_KM));
  it('returns null for null input', () => expect(toMetricDistance(null, DISTANCE_UNITS.KM)).toBeNull());
  it('returns null for undefined input', () => expect(toMetricDistance(undefined, DISTANCE_UNITS.KM)).toBeNull());
});

describe('fromMetricDistance', () => {
  it('returns value unchanged for DISTANCE_UNITS.KM', () =>
    expect(fromMetricDistance(100, DISTANCE_UNITS.KM)).toBe(100));
  it('converts km to miles', () => expect(fromMetricDistance(MILES_TO_KM, DISTANCE_UNITS.MILES)).toBeCloseTo(1));
  it('returns null for null input', () => expect(fromMetricDistance(null, DISTANCE_UNITS.KM)).toBeNull());
  it('returns null for undefined input', () => expect(fromMetricDistance(undefined, DISTANCE_UNITS.MILES)).toBeNull());
});

describe('fromMetricDistanceRounded', () => {
  it('rounds down converted miles', () =>
    expect(fromMetricDistanceRounded(MILES_TO_KM * 2.4, DISTANCE_UNITS.MILES)).toBe(2));
  it('rounds up converted miles', () =>
    expect(fromMetricDistanceRounded(MILES_TO_KM * 2.6, DISTANCE_UNITS.MILES)).toBe(3));
  it('rounds km values', () => expect(fromMetricDistanceRounded(10.7, DISTANCE_UNITS.KM)).toBe(11));
  it('returns null for null input', () => expect(fromMetricDistanceRounded(null, DISTANCE_UNITS.KM)).toBeNull());
});

// =============================================================================
// toMetricVolume / fromMetricVolume
// =============================================================================
describe('toMetricVolume', () => {
  it('returns liters unchanged', () => expect(toMetricVolume(10, VOLUME_UNITS.LITERS)).toBe(10));
  it('converts US gallons to liters', () =>
    expect(toMetricVolume(1, VOLUME_UNITS.GALLONS_US)).toBeCloseTo(US_GALLONS_TO_LITERS, 3));
  it('converts UK gallons to liters', () =>
    expect(toMetricVolume(1, VOLUME_UNITS.GALLONS_UK)).toBeCloseTo(UK_GALLONS_TO_LITERS, 3));
  it('returns kWh unchanged', () => expect(toMetricVolume(50, VOLUME_UNITS.KWH)).toBe(50));
  it('returns kg unchanged', () => expect(toMetricVolume(5, VOLUME_UNITS.KG)).toBe(5));
  it('returns null for null input', () => expect(toMetricVolume(null, VOLUME_UNITS.LITERS)).toBeNull());
  it('rounds result to 3 decimal places', () => {
    const result = toMetricVolume(1, VOLUME_UNITS.GALLONS_US)!;
    expect(result.toString().split('.')[1]?.length ?? 0).toBeLessThanOrEqual(3);
  });
});

describe('fromMetricVolume', () => {
  it('returns liters unchanged', () => expect(fromMetricVolume(10, VOLUME_UNITS.LITERS)).toBe(10));
  it('converts liters to US gallons', () =>
    expect(fromMetricVolume(US_GALLONS_TO_LITERS, VOLUME_UNITS.GALLONS_US)).toBeCloseTo(1, 3));
  it('converts liters to UK gallons', () =>
    expect(fromMetricVolume(UK_GALLONS_TO_LITERS, VOLUME_UNITS.GALLONS_UK)).toBeCloseTo(1, 3));
  it('returns kWh unchanged', () => expect(fromMetricVolume(50, VOLUME_UNITS.KWH)).toBe(50));
  it('returns null for null input', () => expect(fromMetricVolume(null, VOLUME_UNITS.LITERS)).toBeNull());
});

// =============================================================================
// getConsumptionUnitForFuelType
// =============================================================================
describe('getConsumptionUnitForFuelType', () => {
  it('passes liquid unit through for liquid volume', () => {
    expect(getConsumptionUnitForFuelType(CONSUMPTION_UNITS.L_PER_100KM, VOLUME_UNITS.LITERS)).toBe(
      CONSUMPTION_UNITS.L_PER_100KM,
    );
    expect(getConsumptionUnitForFuelType(CONSUMPTION_UNITS.MPG_US, VOLUME_UNITS.GALLONS_US)).toBe(
      CONSUMPTION_UNITS.MPG_US,
    );
  });

  it('maps to electric units for KWH volume', () => {
    expect(getConsumptionUnitForFuelType(CONSUMPTION_UNITS.L_PER_100KM, VOLUME_UNITS.KWH)).toBe(
      CONSUMPTION_UNITS.KWH_PER_100KM,
    );
    expect(getConsumptionUnitForFuelType(CONSUMPTION_UNITS.KM_PER_L, VOLUME_UNITS.KWH)).toBe(
      CONSUMPTION_UNITS.KM_PER_KWH,
    );
    expect(getConsumptionUnitForFuelType(CONSUMPTION_UNITS.MPG_US, VOLUME_UNITS.KWH)).toBe(
      CONSUMPTION_UNITS.MI_PER_KWH,
    );
    expect(getConsumptionUnitForFuelType(CONSUMPTION_UNITS.MPG_UK, VOLUME_UNITS.KWH)).toBe(
      CONSUMPTION_UNITS.MI_PER_KWH,
    );
    expect(getConsumptionUnitForFuelType(CONSUMPTION_UNITS.MI_PER_L, VOLUME_UNITS.KWH)).toBe(
      CONSUMPTION_UNITS.MI_PER_KWH,
    );
  });

  it('maps to hydrogen units for KG volume', () => {
    expect(getConsumptionUnitForFuelType(CONSUMPTION_UNITS.L_PER_100KM, VOLUME_UNITS.KG)).toBe(
      CONSUMPTION_UNITS.KG_PER_100KM,
    );
    expect(getConsumptionUnitForFuelType(CONSUMPTION_UNITS.KM_PER_L, VOLUME_UNITS.KG)).toBe(
      CONSUMPTION_UNITS.KM_PER_KG,
    );
    expect(getConsumptionUnitForFuelType(CONSUMPTION_UNITS.MPG_US, VOLUME_UNITS.KG)).toBe(CONSUMPTION_UNITS.MI_PER_KG);
    expect(getConsumptionUnitForFuelType(CONSUMPTION_UNITS.MPG_UK, VOLUME_UNITS.KG)).toBe(CONSUMPTION_UNITS.MI_PER_KG);
    expect(getConsumptionUnitForFuelType(CONSUMPTION_UNITS.MI_PER_L, VOLUME_UNITS.KG)).toBe(
      CONSUMPTION_UNITS.MI_PER_KG,
    );
  });

  it('falls back to KWH_PER_100KM for unknown unit with KWH volume', () => {
    expect(getConsumptionUnitForFuelType('unknown', VOLUME_UNITS.KWH)).toBe(CONSUMPTION_UNITS.KWH_PER_100KM);
  });

  it('falls back to KG_PER_100KM for unknown unit with KG volume', () => {
    expect(getConsumptionUnitForFuelType('unknown', VOLUME_UNITS.KG)).toBe(CONSUMPTION_UNITS.KG_PER_100KM);
  });
});

// =============================================================================
// deriveConsumptionUnit
// =============================================================================
describe('deriveConsumptionUnit', () => {
  it('derives electric units', () => {
    expect(deriveConsumptionUnit(DISTANCE_UNITS.KM, VOLUME_UNITS.KWH)).toBe(CONSUMPTION_UNITS.KWH_PER_100KM);
    expect(deriveConsumptionUnit(DISTANCE_UNITS.MILES, VOLUME_UNITS.KWH)).toBe(CONSUMPTION_UNITS.MI_PER_KWH);
  });

  it('derives hydrogen units', () => {
    expect(deriveConsumptionUnit(DISTANCE_UNITS.KM, VOLUME_UNITS.KG)).toBe(CONSUMPTION_UNITS.KG_PER_100KM);
    expect(deriveConsumptionUnit(DISTANCE_UNITS.MILES, VOLUME_UNITS.KG)).toBe(CONSUMPTION_UNITS.MI_PER_KG);
  });

  it('derives liquid + miles units', () => {
    expect(deriveConsumptionUnit(DISTANCE_UNITS.MILES, VOLUME_UNITS.GALLONS_US)).toBe(CONSUMPTION_UNITS.MPG_US);
    expect(deriveConsumptionUnit(DISTANCE_UNITS.MILES, VOLUME_UNITS.GALLONS_UK)).toBe(CONSUMPTION_UNITS.MPG_UK);
    expect(deriveConsumptionUnit(DISTANCE_UNITS.MILES, VOLUME_UNITS.LITERS)).toBe(CONSUMPTION_UNITS.MI_PER_L);
  });

  it('derives liquid + km units', () => {
    expect(deriveConsumptionUnit(DISTANCE_UNITS.KM, VOLUME_UNITS.LITERS)).toBe(CONSUMPTION_UNITS.L_PER_100KM);
    expect(deriveConsumptionUnit(DISTANCE_UNITS.KM, VOLUME_UNITS.GALLONS_US)).toBe(CONSUMPTION_UNITS.KM_PER_L);
    expect(deriveConsumptionUnit(DISTANCE_UNITS.KM, VOLUME_UNITS.GALLONS_UK)).toBe(CONSUMPTION_UNITS.KM_PER_L);
  });
});

// =============================================================================
// calculateConsumption
// =============================================================================
describe('calculateConsumption', () => {
  // Null / invalid inputs
  it('returns null for null distanceKm', () =>
    expect(calculateConsumption(null, 10, CONSUMPTION_UNITS.L_PER_100KM)).toBeNull());
  it('returns null for null volumeOrEnergy', () =>
    expect(calculateConsumption(100, null, CONSUMPTION_UNITS.L_PER_100KM)).toBeNull());
  it('returns null for zero distance', () =>
    expect(calculateConsumption(0, 10, CONSUMPTION_UNITS.L_PER_100KM)).toBeNull());
  it('returns null for zero volume', () =>
    expect(calculateConsumption(100, 0, CONSUMPTION_UNITS.L_PER_100KM)).toBeNull());

  // Liquid units
  it('calculates L_PER_100KM', () => {
    expect(calculateConsumption(100, 10, CONSUMPTION_UNITS.L_PER_100KM)).toBeCloseTo(10);
  });

  it('calculates KM_PER_L', () => {
    expect(calculateConsumption(100, 10, CONSUMPTION_UNITS.KM_PER_L)).toBeCloseTo(10);
  });

  it('calculates MPG_US', () => {
    const miles = 100 / MILES_TO_KM;
    const gallons = 10 / US_GALLONS_TO_LITERS;
    expect(calculateConsumption(100, 10, CONSUMPTION_UNITS.MPG_US)).toBeCloseTo(miles / gallons);
  });

  it('calculates MPG_UK', () => {
    const miles = 100 / MILES_TO_KM;
    const gallons = 10 / UK_GALLONS_TO_LITERS;
    expect(calculateConsumption(100, 10, CONSUMPTION_UNITS.MPG_UK)).toBeCloseTo(miles / gallons);
  });

  it('calculates MI_PER_L', () => {
    const miles = 100 / MILES_TO_KM;
    expect(calculateConsumption(100, 10, CONSUMPTION_UNITS.MI_PER_L)).toBeCloseTo(miles / 10);
  });

  // Electric units
  it('calculates KWH_PER_100KM', () => {
    expect(calculateConsumption(100, 20, CONSUMPTION_UNITS.KWH_PER_100KM)).toBeCloseTo(20);
  });

  it('calculates KWH_PER_100MI', () => {
    const miles = 100 / MILES_TO_KM;
    expect(calculateConsumption(100, 20, CONSUMPTION_UNITS.KWH_PER_100MI)).toBeCloseTo((20 / miles) * 100);
  });

  it('calculates WH_PER_MI', () => {
    const miles = 100 / MILES_TO_KM;
    expect(calculateConsumption(100, 20, CONSUMPTION_UNITS.WH_PER_MI)).toBeCloseTo((20 * 1000) / miles);
  });

  it('calculates KM_PER_KWH', () => {
    expect(calculateConsumption(100, 20, CONSUMPTION_UNITS.KM_PER_KWH)).toBeCloseTo(5);
  });

  it('calculates MI_PER_KWH', () => {
    const miles = 100 / MILES_TO_KM;
    expect(calculateConsumption(100, 20, CONSUMPTION_UNITS.MI_PER_KWH)).toBeCloseTo(miles / 20);
  });

  // Hydrogen units
  it('calculates KG_PER_100KM', () => {
    expect(calculateConsumption(100, 5, CONSUMPTION_UNITS.KG_PER_100KM)).toBeCloseTo(5);
  });

  it('calculates KG_PER_100MI', () => {
    const miles = 100 / MILES_TO_KM;
    expect(calculateConsumption(100, 5, CONSUMPTION_UNITS.KG_PER_100MI)).toBeCloseTo((5 / miles) * 100);
  });

  it('calculates KM_PER_KG', () => {
    expect(calculateConsumption(100, 5, CONSUMPTION_UNITS.KM_PER_KG)).toBeCloseTo(20);
  });

  it('calculates MI_PER_KG', () => {
    const miles = 100 / MILES_TO_KM;
    expect(calculateConsumption(100, 5, CONSUMPTION_UNITS.MI_PER_KG)).toBeCloseTo(miles / 5);
  });

  // Default fallback
  it('falls back to X/100km for unknown unit', () => {
    expect(calculateConsumption(100, 10, 'unknown-unit')).toBeCloseTo(10);
  });
});

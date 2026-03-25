// ./src/tests/numbers.test.ts

import { roundNumberValue, roundNumberValues, parseNumericInput } from '../';

// =============================================================================
// roundNumberValue
// =============================================================================
describe('roundNumberValue', () => {
  it('rounds to 2 decimal places by default', () => {
    expect(roundNumberValue(2.34567)).toBe(2.35);
    expect(roundNumberValue(45.213)).toBe(45.21);
  });

  it('rounds to a custom number of decimal places', () => {
    expect(roundNumberValue(2.34567, 3)).toBe(2.346);
    expect(roundNumberValue(2.34567, 0)).toBe(2);
    expect(roundNumberValue(2.34567, 4)).toBe(2.3457);
  });

  it('handles 0 decimals correctly (not treated as falsy)', () => {
    expect(roundNumberValue(2.5, 0)).toBe(3);
    expect(roundNumberValue(2.4, 0)).toBe(2);
  });

  it('returns NaN as-is for NaN input', () => {
    expect(roundNumberValue(NaN)).toBeNaN();
  });

  it('handles negative numbers', () => {
    expect(roundNumberValue(-2.34567)).toBe(-2.35);
    expect(roundNumberValue(-2.34567, 3)).toBe(-2.346);
  });

  it('handles zero', () => {
    expect(roundNumberValue(0)).toBe(0);
  });

  it('handles whole numbers', () => {
    expect(roundNumberValue(42)).toBe(42);
  });
});

// =============================================================================
// roundNumberValues
// =============================================================================
describe('roundNumberValues', () => {
  // Null / falsy inputs
  it('returns null for null input', () => {
    expect(roundNumberValues(null)).toBeNull();
  });

  it('returns undefined for undefined input', () => {
    expect(roundNumberValues(undefined)).toBeUndefined();
  });

  // Primitive number
  it('rounds a bare number', () => {
    expect(roundNumberValues(2.34567)).toBe(2.35);
  });

  it('returns non-number primitives unchanged', () => {
    expect(roundNumberValues('hello')).toBe('hello');
    expect(roundNumberValues(true)).toBe(true);
  });

  // Flat object
  it('rounds all number fields in a flat object', () => {
    expect(roundNumberValues({ a: 2.34567, b: 45.213 })).toEqual({ a: 2.35, b: 45.21 });
  });

  it('leaves non-number fields in an object unchanged', () => {
    expect(roundNumberValues({ name: 'Alice', score: 9.999 })).toEqual({ name: 'Alice', score: 10 });
  });

  // Nested object
  it('recursively rounds numbers in nested objects', () => {
    expect(roundNumberValues({ a: 1.111, b: { c: 2.345, d: 'text' } })).toEqual({ a: 1.11, b: { c: 2.35, d: 'text' } });
  });

  it('recursively rounds deeply nested objects', () => {
    expect(roundNumberValues({ a: { b: { c: 3.14159 } } })).toEqual({ a: { b: { c: 3.14 } } });
  });

  // Arrays
  it('rounds numbers in a flat array', () => {
    expect(roundNumberValues([1.111, 2.345, 3.678])).toEqual([1.11, 2.35, 3.68]);
  });

  it('recursively rounds numbers in array of objects', () => {
    expect(roundNumberValues([{ x: 1.111 }, { x: 2.345 }])).toEqual([{ x: 1.11 }, { x: 2.35 }]);
  });

  it('handles nested arrays', () => {
    expect(roundNumberValues([[1.111, 2.345], [3.678]])).toEqual([[1.11, 2.35], [3.68]]);
  });

  it('handles empty array', () => {
    expect(roundNumberValues([])).toEqual([]);
  });

  it('handles empty object', () => {
    expect(roundNumberValues({})).toEqual({});
  });

  // Custom decimals
  it('respects custom decimals argument', () => {
    expect(roundNumberValues({ a: 2.34567, b: 45.213 }, 3)).toEqual({ a: 2.346, b: 45.213 });
  });

  it('respects 0 decimals (rounds to integers)', () => {
    expect(roundNumberValues({ a: 2.6, b: 3.4 }, 0)).toEqual({ a: 3, b: 3 });
  });

  // Mutation — intentional behaviour
  it('mutates the original object in place', () => {
    const original = { a: 2.34567, b: 45.213 };
    roundNumberValues(original);
    expect(original).toEqual({ a: 2.35, b: 45.21 });
  });

  it('mutates the original array in place', () => {
    const original = [1.111, 2.345];
    roundNumberValues(original);
    expect(original).toEqual([1.11, 2.35]);
  });
});

// =============================================================================
// parseNumericInput
// =============================================================================
describe('parseNumericInput', () => {
  // Null / empty / undefined
  it('returns null for null', () => expect(parseNumericInput(null)).toBeNull());
  it('returns null for undefined', () => expect(parseNumericInput(undefined)).toBeNull());
  it('returns null for ""', () => expect(parseNumericInput('')).toBeNull());

  // Number passthrough
  it('returns a valid number as-is', () => expect(parseNumericInput(42)).toBe(42));
  it('returns a float as-is', () => expect(parseNumericInput(3.14)).toBe(3.14));
  it('returns 0 as-is', () => expect(parseNumericInput(0)).toBe(0));
  it('returns negative number as-is', () => expect(parseNumericInput(-5)).toBe(-5));
  it('returns null for NaN number', () => expect(parseNumericInput(NaN)).toBeNull());

  // String parsing
  it('parses a numeric string', () => expect(parseNumericInput('42')).toBe(42));
  it('parses a float string', () => expect(parseNumericInput('3.14')).toBe(3.14));
  it('parses a negative string', () => expect(parseNumericInput('-5')).toBe(-5));
  it('parses a string with leading whitespace', () => expect(parseNumericInput('  7')).toBe(7));
  it('returns null for non-numeric string', () => expect(parseNumericInput('abc')).toBeNull());
  it('returns null for empty-ish string "  "', () => expect(parseNumericInput('  ')).toBeNull());
  it('parses leading number in mixed string', () => expect(parseNumericInput('3px')).toBe(3));
});

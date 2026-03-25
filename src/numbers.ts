// ./src/numbers.ts

/**
 * Rounds a number to `decimals` digits after the decimal point.
 *
 * @example
 * roundNumberValue(2.34567)    // => 2.35  (default 2 decimals)
 * roundNumberValue(2.34567, 3) // => 2.346
 * roundNumberValue(2.5,     0) // => 3
 *
 * @param value    - The number to round. Returns `NaN` as-is if input is NaN.
 * @param decimals - Decimal places to keep (default: 2).
 */
export const roundNumberValue = (value: number, decimals?: number): number => {
  return isNaN(value) ? value : Number(Number(value).toFixed(decimals ?? 2));
};

/**
 * Recursively rounds all number values in an object or array to `decimals`
 * decimal places. Nested objects and arrays are fully traversed.
 *
 * **Mutates the input in place** and also returns it.
 *
 * @example
 * roundNumberValues({ a: 2.34567, b: { c: 45.213 } })
 * // => { a: 2.35, b: { c: 45.21 } }
 *
 * @param obj      - Value to process. Primitives are rounded directly if numeric.
 * @param decimals - Decimal places to keep (default: 2).
 */
export const roundNumberValues = (obj: any, decimals?: number): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    for (let idx = 0, len = obj.length; idx < len; idx++) {
      obj[idx] = roundNumberValues(obj[idx], decimals);
    }
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach((field) => {
      if (typeof obj[field] === 'number') {
        obj[field] = roundNumberValue(obj[field], decimals);
      } else {
        obj[field] = roundNumberValues(obj[field], decimals);
      }
    });
  } else if (typeof obj === 'number') {
    obj = roundNumberValue(obj, decimals);
  }

  return obj;
};

/**
 * Normalises a value from a numeric input field into a `number | null`.
 *
 * - `null` / `undefined` / empty string → `null`
 * - Already a number                    → returned as-is
 * - Parseable string                    → parsed via `parseFloat`
 * - Non-parseable string                → `null`
 *
 * @param value - Raw input value.
 */
export const parseNumericInput = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return isNaN(value) ? null : value;
  const parsed = parseFloat(value as string);
  return isNaN(parsed) ? null : parsed;
};

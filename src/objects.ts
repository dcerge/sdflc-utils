// ./src/objects.ts

/**
 * Recursively replaces all empty string values in an object or array with `null`.
 * Traverses nested objects and arrays of objects.
 * Non-string and non-empty values are left unchanged.
 *
 * @example
 * setNullOnEmptyString({ firstName: 'John', lastName: '', address: { city: '' } })
 * // => { firstName: 'John', lastName: null, address: { city: null } }
 *
 * @param obj - Value to process.
 */
export const setNullOnEmptyString = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => setNullOnEmptyString(item));
  }

  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const tmp: any = {};
    Object.keys(obj).forEach((key) => {
      tmp[key] = setNullOnEmptyString(obj[key]);
    });
    return tmp;
  }

  return obj === '' ? null : obj;
};

/**
 * Creates an instance of `destinationType` and copies across only the
 * properties that exist on that type, sourced from `source`.
 * Properties not present on `destinationType` are ignored.
 *
 * @example
 * class UserDto { id = 0; name = ''; }
 * onlyPropsOf({ id: 1, name: 'Alice', extra: 'ignored' }, UserDto)
 * // => UserDto { id: 1, name: 'Alice' }
 *
 * @param source          - Source object to copy values from.
 * @param destinationType - Class whose properties define what to keep.
 */
export function onlyPropsOf<T>(source: any, destinationType: new () => T): T {
  const result: any = new destinationType();

  Object.keys(result).forEach((key: string) => {
    result[key] = source != null ? source[key] : undefined;
  });

  return result;
}

/**
 * Recursively removes all properties with `undefined` values from an object or array.
 * Properties explicitly set to `null` are preserved.
 *
 * @example
 * compactObject({ a: 1, b: undefined, c: { d: undefined, e: 2 } })
 * // => { a: 1, c: { e: 2 } }
 *
 * @param obj - Value to compact.
 */
export const compactObject = (obj: any): any => {
  if (obj == null) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => compactObject(item));
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const value = obj[key];
      if (value !== undefined) {
        acc[key] = typeof value === 'object' ? compactObject(value) : value;
      }
      return acc;
    }, {});
  }

  return obj;
};

/**
 * Creates a deep clone of `obj`.
 *
 * Handles the following correctly:
 * - `Date` objects (cloned as new Date instances)
 * - `undefined` values (preserved)
 * - `NaN` and `Infinity` (preserved)
 * - Circular references (detected and re-linked in the clone)
 * - Arrays and nested objects
 *
 * Note: Functions are not cloned — they are copied by reference.
 *
 * @param obj - Value to clone.
 */
export const cloneDeep = (obj: any, _seen = new WeakMap()): any => {
  // Primitives and null — return as-is
  if (obj === null || typeof obj !== 'object') return obj;

  // Circular reference — return the already-cloned counterpart
  if (_seen.has(obj)) return _seen.get(obj);

  // Date
  if (obj instanceof Date) return new Date(obj.getTime());

  // Array
  if (Array.isArray(obj)) {
    const clone: any[] = [];
    _seen.set(obj, clone);
    obj.forEach((item, i) => {
      clone[i] = cloneDeep(item, _seen);
    });
    return clone;
  }

  // Plain object
  const clone: Record<string, any> = {};
  _seen.set(obj, clone);
  Object.keys(obj).forEach((key) => {
    clone[key] = cloneDeep(obj[key], _seen);
  });
  return clone;
};

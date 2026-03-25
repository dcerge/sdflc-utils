// ./src/arrays.ts

/**
 * Convert an array of objects into a plain object whose property names and values
 * are taken from `nameKey` and `valueKey` of each item.
 *
 * @example
 * const arr = [{ name: 'status', value: 'active' }, { name: 'name', value: 'Some name' }];
 * arrayToObject(arr, 'name', 'value') // => { status: 'active', name: 'Some name' }
 *
 * @param arr     Array of objects to process. Returns {} if not a valid array.
 * @param nameKey Property name on each item to use as the output key.
 * @param valueKey Property name on each item to use as the output value.
 * @returns A plain object built from the array entries.
 *
 * @note If `nameKey` is missing on an item, that item's value will be assigned to key `"undefined"`,
 *       potentially overwriting previous entries. Ensure `nameKey` is present on all items.
 */
export const arrayToObject = <T extends Record<string, unknown>>(
  arr: T[],
  nameKey: keyof T,
  valueKey: keyof T,
): Record<string, unknown> => {
  if (!Array.isArray(arr)) {
    return {};
  }

  return arr.reduce<Record<string, unknown>>((acc, item) => {
    const key = item[nameKey];
    if (key != null) {
      acc[String(key)] = item[valueKey];
    }
    return acc;
  }, {});
};

/**
 * Convert a plain object into an array of objects, using `nameKey` for the
 * property name entries and `valueKey` for the property value entries.
 * This is the reverse of `arrayToObject`.
 *
 * @example
 * const obj = { status: 'active', name: 'Some name' };
 * objectToArray(obj, 'name', 'value')
 * // => [{ name: 'status', value: 'active' }, { name: 'name', value: 'Some name' }]
 *
 * @param obj      - Plain object to convert. Returns [] if null/undefined/non-object.
 * @param nameKey  - Property name to use for the key entries in each item.
 * @param valueKey - Property name to use for the value entries in each item.
 * @returns Array of objects built from the input object's entries.
 */
export const objectToArray = <N extends string, V extends string>(
  obj: Record<string, unknown>,
  nameKey: N,
  valueKey: V,
): Array<Record<N | V, unknown>> => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return [];
  }

  return Object.keys(obj).map((key) => ({
    [nameKey]: key,
    [valueKey]: obj[key],
  })) as Array<Record<N | V, unknown>>;
};

/**
 * Uppercase each string in the array.
 * Null or undefined items are coerced to an empty string.
 *
 * @param arr Array of strings to uppercase. Defaults to [] if falsy.
 */
export const arrToUpperCase = (arr: string[]): string[] => {
  return (arr || []).map((item) => (item || '').toUpperCase());
};

/**
 * Lowercase each string in the array.
 * Null or undefined items are coerced to an empty string.
 *
 * @param arr Array of strings to lowercase. Defaults to [] if falsy.
 */
export const arrToLowerCase = (arr: string[]): string[] => {
  return (arr || []).map((item) => (item || '').toLowerCase());
};

/**
 * Split an array into sequential chunks of a given size.
 * The last chunk may contain fewer elements than `chunkSize`.
 *
 * @param arr       Array to split. Returns [] if falsy.
 * @param chunkSize Number of items per chunk. Returns original array if < 1 or NaN.
 * @returns Array of arrays (chunks).
 *
 * @example
 * arrToChunks([1,2,3,4,5], 2) // => [[1,2],[3,4],[5]]
 */
export const arrToChunks = <T>(arr: T[], chunkSize: number): T[] | T[][] => {
  if (!arr) return [];

  if (chunkSize == null || isNaN(chunkSize) || chunkSize < 1) {
    return arr;
  }

  const chunks: T[][] = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }

  return chunks;
};

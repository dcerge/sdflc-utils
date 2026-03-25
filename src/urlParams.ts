// ./src/urlParams.ts

/**
 * Recursively appends a value to `URLSearchParams`.
 *
 * Key format conventions:
 * - Object properties: `parent.child`
 * - Array items:       `parent[0]`
 *
 * Null/undefined values are skipped.
 * Date values are serialised via `.toISOString()`.
 */
const addParam = (params: URLSearchParams, paramName: string, paramValue: unknown): void => {
  if (paramValue === null || paramValue === undefined) {
    // Skip null/undefined — no meaningful query string representation
    return;
  }

  if (paramValue instanceof Date) {
    params.append(paramName, paramValue.toISOString());
    return;
  }

  if (Array.isArray(paramValue)) {
    paramValue.forEach((value: unknown, idx: number) => {
      const fullKey = paramName ? `${paramName}[${idx}]` : `[${idx}]`;
      addParam(params, fullKey, value);
    });
    return;
  }

  if (typeof paramValue === 'object') {
    Object.keys(paramValue as Record<string, unknown>).forEach((key: string) => {
      const fullKey = paramName ? `${paramName}.${key}` : key;
      addParam(params, fullKey, (paramValue as Record<string, unknown>)[key]);
    });
    return;
  }

  params.append(paramName, String(paramValue));
};

/**
 * Converts a plain object into a `URLSearchParams` instance.
 *
 * Supports nested objects (dot notation), arrays (bracket notation),
 * primitives, Dates, and mixed structures.
 *
 * Null and undefined values are omitted.
 *
 * @example
 * buildURLSearchParams({ name: 'Alice', tags: ['a', 'b'] })
 * // => name=Alice&tags[0]=a&tags[1]=b
 *
 * @param data - Object to serialise. Returns empty params if falsy or non-object.
 * @returns A `URLSearchParams` instance.
 */
export const buildURLSearchParams = (data: any): URLSearchParams => {
  const params = new URLSearchParams();

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return params;
  }

  addParam(params, '', data);

  return params;
};

// ./src/tests/arrays.test.ts

import { arrayToObject, arrToUpperCase, arrToLowerCase, arrToChunks, objectToArray } from '../';

describe('arrayToObject', () => {
  it('converts an array of objects to a keyed object', () => {
    const src = [
      { name: 'status', value: 'active' },
      { name: 'name', value: 'Some name' },
    ];
    expect(arrayToObject(src, 'name', 'value')).toEqual({
      status: 'active',
      name: 'Some name',
    });
  });

  it('returns {} for an empty array', () => {
    expect(arrayToObject([], 'name', 'value')).toEqual({});
  });

  it('returns {} for a non-array input', () => {
    expect(arrayToObject(null as any, 'name', 'value')).toEqual({});
    expect(arrayToObject('not an array' as any, 'name', 'value')).toEqual({});
  });

  it('skips items where nameKey value is null or undefined', () => {
    const src = [
      { name: null, value: 'ignored' },
      { name: 'status', value: 'active' },
    ];
    expect(arrayToObject(src as any, 'name', 'value')).toEqual({ status: 'active' });
  });
});

// =============================================================================
// objectToArray
// =============================================================================
describe('objectToArray', () => {
  it('converts a plain object to an array of key/value objects', () => {
    expect(objectToArray({ status: 'active', name: 'Some name' }, 'name', 'value')).toEqual([
      { name: 'status', value: 'active' },
      { name: 'name', value: 'Some name' },
    ]);
  });

  it('uses custom nameKey and valueKey', () => {
    expect(objectToArray({ a: 1, b: 2 }, 'key', 'val')).toEqual([
      { key: 'a', val: 1 },
      { key: 'b', val: 2 },
    ]);
  });

  it('returns [] for null input', () => expect(objectToArray(null as any, 'name', 'value')).toEqual([]));
  it('returns [] for undefined input', () => expect(objectToArray(undefined as any, 'name', 'value')).toEqual([]));
  it('returns [] for an array input', () => expect(objectToArray([] as any, 'name', 'value')).toEqual([]));
  it('returns [] for a non-object input', () => expect(objectToArray('str' as any, 'name', 'value')).toEqual([]));
  it('returns [] for an empty object', () => expect(objectToArray({}, 'name', 'value')).toEqual([]));

  it('handles objects with mixed value types', () => {
    const result = objectToArray({ count: 42, active: true, label: null }, 'name', 'value');
    expect(result).toEqual([
      { name: 'count', value: 42 },
      { name: 'active', value: true },
      { name: 'label', value: null },
    ]);
  });

  it('is the inverse of arrayToObject (round-trip)', () => {
    const original = { status: 'active', name: 'Some name' };
    const arr = objectToArray(original, 'name', 'value');
    const restored = arrayToObject(arr, 'name', 'value');
    expect(restored).toEqual(original);
  });

  it('arrayToObject → objectToArray round-trip', () => {
    const original = [
      { name: 'status', value: 'active' },
      { name: 'role', value: 'admin' },
    ];
    const obj = arrayToObject(original, 'name', 'value');
    const restored = objectToArray(obj as Record<string, unknown>, 'name', 'value');
    expect(restored).toEqual(original);
  });
});

describe('arrToUpperCase', () => {
  it('uppercases all strings in the array', () => {
    expect(arrToUpperCase(['abc', 'def1'])).toEqual(['ABC', 'DEF1']);
  });

  it('returns [] for an empty array', () => {
    expect(arrToUpperCase([])).toEqual([]);
  });

  it('returns [] for a falsy input', () => {
    expect(arrToUpperCase(null as any)).toEqual([]);
  });

  it('coerces null/undefined items to empty string', () => {
    expect(arrToUpperCase([null as any, undefined as any, 'abc'])).toEqual(['', '', 'ABC']);
  });
});

describe('arrToLowerCase', () => {
  it('lowercases all strings in the array', () => {
    expect(arrToLowerCase(['ABC', 'DeF1'])).toEqual(['abc', 'def1']);
  });

  it('returns [] for an empty array', () => {
    expect(arrToLowerCase([])).toEqual([]);
  });

  it('returns [] for a falsy input', () => {
    expect(arrToLowerCase(null as any)).toEqual([]);
  });

  it('coerces null/undefined items to empty string', () => {
    expect(arrToLowerCase([null as any, undefined as any, 'ABC'])).toEqual(['', '', 'abc']);
  });
});

describe('arrToChunks', () => {
  const src = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  it('splits into chunks of 3', () => {
    expect(arrToChunks(src, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [0]]);
  });

  it('splits into chunks of 5 (even split)', () => {
    expect(arrToChunks(src, 5)).toEqual([
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 0],
    ]);
  });

  it('returns original array for chunkSize of 0', () => {
    expect(arrToChunks(src, 0)).toEqual(src);
  });

  it('returns original array for chunkSize of NaN', () => {
    expect(arrToChunks(src, NaN)).toEqual(src);
  });

  it('returns original array for negative chunkSize', () => {
    expect(arrToChunks(src, -1)).toEqual(src);
  });

  it('returns [] for an empty array', () => {
    expect(arrToChunks([], 3)).toEqual([]);
  });

  it('returns [] for null/undefined input', () => {
    expect(arrToChunks(null as any, 3)).toEqual([]);
    expect(arrToChunks(undefined as any, 3)).toEqual([]);
  });
});

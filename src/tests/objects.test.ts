// ./src/tests/objects.test.ts

import { setNullOnEmptyString, onlyPropsOf, compactObject, cloneDeep } from '../';

// =============================================================================
// setNullOnEmptyString
// =============================================================================
describe('setNullOnEmptyString', () => {
  it('replaces empty strings with null', () => {
    expect(setNullOnEmptyString({ firstName: 'John', lastName: '' })).toEqual({ firstName: 'John', lastName: null });
  });

  it('leaves non-empty strings unchanged', () => {
    expect(setNullOnEmptyString({ a: 'hello', b: 'world' })).toEqual({ a: 'hello', b: 'world' });
  });

  it('leaves null values unchanged', () => {
    expect(setNullOnEmptyString({ a: null })).toEqual({ a: null });
  });

  it('leaves undefined values unchanged', () => {
    expect(setNullOnEmptyString({ a: undefined })).toEqual({ a: undefined });
  });

  it('leaves numbers unchanged', () => {
    expect(setNullOnEmptyString({ a: 0, b: 42 })).toEqual({ a: 0, b: 42 });
  });

  it('handles empty object', () => {
    expect(setNullOnEmptyString({})).toEqual({});
  });

  it('returns null for null input', () => {
    expect(setNullOnEmptyString(null)).toBeNull();
  });

  it('returns undefined for undefined input', () => {
    expect(setNullOnEmptyString(undefined)).toBeUndefined();
  });

  it('recursively processes nested objects', () => {
    expect(setNullOnEmptyString({ a: '', nested: { b: '', c: 'keep' } })).toEqual({
      a: null,
      nested: { b: null, c: 'keep' },
    });
  });

  it('recursively processes deeply nested objects', () => {
    expect(setNullOnEmptyString({ a: { b: { c: '' } } })).toEqual({ a: { b: { c: null } } });
  });

  it('processes arrays of objects', () => {
    expect(setNullOnEmptyString([{ a: '' }, { a: 'keep' }])).toEqual([{ a: null }, { a: 'keep' }]);
  });

  it('processes arrays of primitives', () => {
    expect(setNullOnEmptyString(['', 'hello', ''])).toEqual([null, 'hello', null]);
  });

  it('handles mixed nested arrays and objects', () => {
    expect(setNullOnEmptyString({ items: [{ name: '' }, { name: 'Alice' }] })).toEqual({
      items: [{ name: null }, { name: 'Alice' }],
    });
  });

  it('leaves Date instances untouched', () => {
    const date = new Date('2025-01-01');
    expect(setNullOnEmptyString({ d: date })).toEqual({ d: date });
  });
});

// =============================================================================
// onlyPropsOf
// =============================================================================
describe('onlyPropsOf', () => {
  class UserDto {
    id: number = 0;
    name: string = '';
  }

  it('copies only properties defined on the destination type', () => {
    const result = onlyPropsOf({ id: 1, name: 'Alice', extra: 'ignored' }, UserDto);
    expect(result).toEqual({ id: 1, name: 'Alice' });
    expect((result as any).extra).toBeUndefined();
  });

  it('returns an instance of the destination type', () => {
    const result = onlyPropsOf({ id: 1, name: 'Alice' }, UserDto);
    expect(result).toBeInstanceOf(UserDto);
  });

  it('sets missing source properties to undefined', () => {
    const result = onlyPropsOf({ id: 1 }, UserDto);
    expect(result.id).toBe(1);
    expect(result.name).toBeUndefined();
  });

  it('sets all properties to undefined when source is null', () => {
    const result = onlyPropsOf(null, UserDto);
    expect(result.id).toBeUndefined();
    expect(result.name).toBeUndefined();
  });

  it('sets all properties to undefined when source is undefined', () => {
    const result = onlyPropsOf(undefined, UserDto);
    expect(result.id).toBeUndefined();
    expect(result.name).toBeUndefined();
  });
});

// =============================================================================
// compactObject
// =============================================================================
describe('compactObject', () => {
  // Null / undefined passthrough
  it('returns null for null input', () => expect(compactObject(null)).toBeNull());
  it('returns undefined for undefined', () => expect(compactObject(undefined)).toBeUndefined());

  // Flat object
  it('removes undefined properties from a flat object', () => {
    expect(compactObject({ a: 1, b: undefined, c: 'x' })).toEqual({ a: 1, c: 'x' });
  });

  it('preserves null values', () => {
    expect(compactObject({ a: null, b: undefined })).toEqual({ a: null });
  });

  it('preserves 0 and false', () => {
    expect(compactObject({ a: 0, b: false, c: undefined })).toEqual({ a: 0, b: false });
  });

  it('handles empty object', () => {
    expect(compactObject({})).toEqual({});
  });

  // Nested object
  it('recursively removes undefined from nested objects', () => {
    expect(compactObject({ a: 1, b: { c: undefined, d: 2 } })).toEqual({ a: 1, b: { d: 2 } });
  });

  it('recursively handles deeply nested objects', () => {
    expect(compactObject({ a: { b: { c: undefined, d: 3 } } })).toEqual({ a: { b: { d: 3 } } });
  });

  // Arrays
  it('processes arrays of primitives', () => {
    expect(compactObject([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('recursively processes arrays of objects', () => {
    expect(compactObject([{ a: 1, b: undefined }, { a: 2 }])).toEqual([{ a: 1 }, { a: 2 }]);
  });

  it('handles nested arrays inside objects', () => {
    expect(compactObject({ arr: [{ x: 1, y: undefined }] })).toEqual({ arr: [{ x: 1 }] });
  });

  it('handles empty array', () => {
    expect(compactObject([])).toEqual([]);
  });

  // Primitives
  it('returns non-object primitives as-is', () => {
    expect(compactObject(42)).toBe(42);
    expect(compactObject('hello')).toBe('hello');
  });
});

// =============================================================================
// cloneDeep
// =============================================================================
describe('cloneDeep', () => {
  it('creates a deep copy of a plain object', () => {
    const original = { a: 1, b: { c: 2 } };
    const clone = cloneDeep(original);
    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
    expect(clone.b).not.toBe(original.b);
  });

  it('creates a deep copy of an array', () => {
    const original = [1, [2, 3]];
    const clone = cloneDeep(original);
    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
    expect(clone[1]).not.toBe(original[1]);
  });

  it('mutations to the clone do not affect the original', () => {
    const original = { a: { b: 1 } };
    const clone = cloneDeep(original);
    clone.a.b = 99;
    expect(original.a.b).toBe(1);
  });

  it('clones Date objects as new Date instances', () => {
    const date = new Date('2025-01-01T00:00:00.000Z');
    const clone = cloneDeep({ d: date });
    expect(clone.d).toBeInstanceOf(Date);
    expect(clone.d.getTime()).toBe(date.getTime());
    expect(clone.d).not.toBe(date);
  });

  it('preserves undefined values', () => {
    const clone = cloneDeep({ a: 1, b: undefined });
    expect('b' in clone).toBe(true);
    expect(clone.b).toBeUndefined();
  });

  it('preserves NaN', () => {
    const clone = cloneDeep({ a: NaN });
    expect(clone.a).toBeNaN();
  });

  it('preserves Infinity', () => {
    const clone = cloneDeep({ a: Infinity, b: -Infinity });
    expect(clone.a).toBe(Infinity);
    expect(clone.b).toBe(-Infinity);
  });

  it('handles circular references without throwing', () => {
    const circular: any = { name: 'root' };
    circular.self = circular;
    const clone = cloneDeep(circular);
    expect(clone.name).toBe('root');
    expect(clone.self).toBe(clone); // re-linked to the clone
  });

  it('handles circular references in arrays', () => {
    const arr: any[] = [1, 2];
    arr.push(arr);
    const clone = cloneDeep(arr);
    expect(clone[0]).toBe(1);
    expect(clone[2]).toBe(clone); // re-linked to the clone
  });

  it('returns primitives as-is', () => {
    expect(cloneDeep(42)).toBe(42);
    expect(cloneDeep('hello')).toBe('hello');
    expect(cloneDeep(null)).toBeNull();
    expect(cloneDeep(undefined)).toBeUndefined();
  });

  it('copies functions by reference', () => {
    const fn = () => 42;
    const clone = cloneDeep({ fn });
    expect(clone.fn).toBe(fn);
  });
});

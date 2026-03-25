// ./src/tests/urlParams.test.ts

import { buildURLSearchParams } from '../';

/** Helper to turn URLSearchParams into a plain object for easy assertion. */
const toObj = (p: URLSearchParams): Record<string, string> => {
  const result: Record<string, string> = {};
  p.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

/** Helper to get all values for a key (for duplicate keys). */
const toMultiObj = (p: URLSearchParams): Record<string, string[]> => {
  const result: Record<string, string[]> = {};
  p.forEach((value, key) => {
    if (!result[key]) result[key] = [];
    result[key].push(value);
  });
  return result;
};

// =============================================================================
// Null / empty / invalid inputs
// =============================================================================
describe('buildURLSearchParams — null / empty / invalid inputs', () => {
  it('returns empty params for null', () => expect(buildURLSearchParams(null).toString()).toBe(''));
  it('returns empty params for undefined', () => expect(buildURLSearchParams(undefined).toString()).toBe(''));
  it('returns empty params for a string', () => expect(buildURLSearchParams('hello').toString()).toBe(''));
  it('returns empty params for a number', () => expect(buildURLSearchParams(42).toString()).toBe(''));
  it('returns empty params for an array', () => expect(buildURLSearchParams([1, 2]).toString()).toBe(''));
  it('returns empty params for empty object', () => expect(buildURLSearchParams({}).toString()).toBe(''));
});

// =============================================================================
// Flat primitives
// =============================================================================
describe('buildURLSearchParams — flat primitives', () => {
  it('serialises string values', () => {
    const p = buildURLSearchParams({ name: 'Alice' });
    expect(toObj(p)).toEqual({ name: 'Alice' });
  });

  it('serialises number values', () => {
    const p = buildURLSearchParams({ age: 30 });
    expect(toObj(p)).toEqual({ age: '30' });
  });

  it('serialises boolean values', () => {
    const p = buildURLSearchParams({ active: true });
    expect(toObj(p)).toEqual({ active: 'true' });
  });

  it('serialises multiple flat fields', () => {
    const p = buildURLSearchParams({ a: '1', b: '2', c: '3' });
    expect(toObj(p)).toEqual({ a: '1', b: '2', c: '3' });
  });

  it('skips null values', () => {
    const p = buildURLSearchParams({ a: 'keep', b: null });
    expect(toObj(p)).toEqual({ a: 'keep' });
    expect(p.has('b')).toBe(false);
  });

  it('skips undefined values', () => {
    const p = buildURLSearchParams({ a: 'keep', b: undefined });
    expect(toObj(p)).toEqual({ a: 'keep' });
    expect(p.has('b')).toBe(false);
  });
});

// =============================================================================
// Arrays
// =============================================================================
describe('buildURLSearchParams — arrays', () => {
  it('serialises a flat array using bracket notation', () => {
    const p = buildURLSearchParams({ tags: ['a', 'b', 'c'] });
    expect(toObj(p)).toEqual({
      'tags[0]': 'a',
      'tags[1]': 'b',
      'tags[2]': 'c',
    });
  });

  it('serialises an array of numbers', () => {
    const p = buildURLSearchParams({ ids: [1, 2, 3] });
    expect(toObj(p)).toEqual({ 'ids[0]': '1', 'ids[1]': '2', 'ids[2]': '3' });
  });

  it('handles empty array (produces no params)', () => {
    const p = buildURLSearchParams({ tags: [] });
    expect(p.has('tags')).toBe(false);
    expect(p.toString()).toBe('');
  });

  it('serialises an array of objects', () => {
    const p = buildURLSearchParams({ users: [{ name: 'Alice' }, { name: 'Bob' }] });
    expect(toObj(p)).toEqual({
      'users[0].name': 'Alice',
      'users[1].name': 'Bob',
    });
  });

  it('skips null/undefined items in arrays', () => {
    const p = buildURLSearchParams({ tags: ['a', null, 'b'] });
    expect(toObj(p)).toEqual({ 'tags[0]': 'a', 'tags[2]': 'b' });
    expect(p.has('tags[1]')).toBe(false);
  });
});

// =============================================================================
// Nested objects
// =============================================================================
describe('buildURLSearchParams — nested objects', () => {
  it('serialises a nested object using dot notation', () => {
    const p = buildURLSearchParams({ address: { city: 'Calgary', country: 'CA' } });
    expect(toObj(p)).toEqual({
      'address.city': 'Calgary',
      'address.country': 'CA',
    });
  });

  it('serialises deeply nested objects', () => {
    const p = buildURLSearchParams({ a: { b: { c: 'deep' } } });
    expect(toObj(p)).toEqual({ 'a.b.c': 'deep' });
  });

  it('skips null nested values', () => {
    const p = buildURLSearchParams({ a: { b: 'keep', c: null } });
    expect(toObj(p)).toEqual({ 'a.b': 'keep' });
    expect(p.has('a.c')).toBe(false);
  });
});

// =============================================================================
// Date values
// =============================================================================
describe('buildURLSearchParams — Date values', () => {
  it('serialises a Date as an ISO string', () => {
    const date = new Date('2025-03-25T00:00:00.000Z');
    const p = buildURLSearchParams({ createdAt: date });
    expect(toObj(p)).toEqual({ createdAt: '2025-03-25T00:00:00.000Z' });
  });

  it('serialises a Date inside a nested object', () => {
    const date = new Date('2025-03-25T00:00:00.000Z');
    const p = buildURLSearchParams({ filter: { from: date } });
    expect(toObj(p)).toEqual({ 'filter.from': '2025-03-25T00:00:00.000Z' });
  });
});

// =============================================================================
// Mixed / complex structures
// =============================================================================
describe('buildURLSearchParams — mixed / complex structures', () => {
  it('handles a mix of primitives, arrays, and nested objects', () => {
    const p = buildURLSearchParams({
      name: 'Alice',
      age: 30,
      tags: ['admin', 'user'],
      address: { city: 'Calgary' },
    });
    expect(toObj(p)).toEqual({
      name: 'Alice',
      age: '30',
      'tags[0]': 'admin',
      'tags[1]': 'user',
      'address.city': 'Calgary',
    });
  });

  it('handles an array of objects with nested arrays', () => {
    const p = buildURLSearchParams({
      filters: [{ field: 'status', values: ['active', 'pending'] }],
    });
    expect(toObj(p)).toEqual({
      'filters[0].field': 'status',
      'filters[0].values[0]': 'active',
      'filters[0].values[1]': 'pending',
    });
  });

  it('returns a URLSearchParams instance', () => {
    expect(buildURLSearchParams({ a: '1' })).toBeInstanceOf(URLSearchParams);
  });
});

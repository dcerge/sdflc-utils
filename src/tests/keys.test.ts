// ./src/tests/strings.test.ts

import { camelKeys, camelResponse, pascalCase, pascalCases, buildKey, buildKeys, isIdEmpty, slug } from '../';

import { UUID_EMPTY, UUID_ZERO } from '../constants';

// =============================================================================
// camelKeys
// =============================================================================
describe('camelKeys', () => {
  it('converts snake_case keys to camelCase', () => {
    expect(camelKeys({ first_name: 'John', last_name: 'Doe' })).toEqual({ firstName: 'John', lastName: 'Doe' });
  });

  it('converts kebab-case keys to camelCase', () => {
    expect(camelKeys({ 'first-name': 'John' })).toEqual({ firstName: 'John' });
  });

  it('recursively converts nested object keys', () => {
    expect(camelKeys({ user_data: { first_name: 'John' } })).toEqual({ userData: { firstName: 'John' } });
  });

  it('recursively converts arrays of objects', () => {
    expect(camelKeys([{ first_name: 'A' }, { first_name: 'B' }])).toEqual([{ firstName: 'A' }, { firstName: 'B' }]);
  });

  it('leaves Date instances untouched', () => {
    const date = new Date('2024-01-01');
    expect(camelKeys({ created_at: date })).toEqual({ createdAt: date });
    expect(camelKeys(date)).toBe(date);
  });

  it('leaves null untouched', () => {
    expect(camelKeys(null)).toBeNull();
  });

  it('leaves primitives untouched', () => {
    expect(camelKeys(42)).toBe(42);
    expect(camelKeys('hello')).toBe('hello');
    expect(camelKeys(undefined)).toBeUndefined();
  });

  it('handles empty object', () => {
    expect(camelKeys({})).toEqual({});
  });

  it('handles empty array', () => {
    expect(camelKeys([])).toEqual([]);
  });
});

// =============================================================================
// camelResponse
// =============================================================================
describe('camelResponse', () => {
  it('converts keys for a plain object', () => {
    expect(camelResponse({ first_name: 'John' })).toEqual({ firstName: 'John' });
  });

  it('returns null unchanged', () => {
    expect(camelResponse(null)).toBeNull();
  });

  it('returns undefined unchanged', () => {
    expect(camelResponse(undefined)).toBeUndefined();
  });

  it('returns result with rows property unchanged (raw DB result set)', () => {
    const dbResult = { rows: [{ first_name: 'John' }], rowCount: 1 };
    expect(camelResponse(dbResult)).toBe(dbResult);
  });

  it('converts result without rows property', () => {
    const result = { user_id: 1, user_name: 'Alice' };
    expect(camelResponse(result)).toEqual({ userId: 1, userName: 'Alice' });
  });
});

// =============================================================================
// pascalCase
// =============================================================================
describe('pascalCase', () => {
  it('converts snake_case to PascalCase', () => {
    expect(pascalCase('hello_world')).toBe('HelloWorld');
  });

  it('converts kebab-case to PascalCase', () => {
    expect(pascalCase('hello-world')).toBe('HelloWorld');
  });

  it('converts space-separated to PascalCase', () => {
    expect(pascalCase('hello world')).toBe('HelloWorld');
  });

  it('handles already-PascalCase input', () => {
    expect(pascalCase('HelloWorld')).toBe('HelloWorld');
  });

  it('handles single word', () => {
    expect(pascalCase('hello')).toBe('Hello');
  });

  it('returns empty string unchanged', () => {
    expect(pascalCase('')).toBe('');
  });

  it('returns null-ish values unchanged', () => {
    expect(pascalCase(null as any)).toBeNull();
    expect(pascalCase(undefined as any)).toBeUndefined();
  });
});

// =============================================================================
// pascalCases
// =============================================================================
describe('pascalCases', () => {
  it('converts object keys to PascalCase', () => {
    expect(pascalCases({ src: { first_name: 'John', last_name: 'Doe' } })).toEqual({
      FirstName: 'John',
      LastName: 'Doe',
    });
  });

  it('recursively converts nested object keys', () => {
    expect(pascalCases({ src: { user_data: { first_name: 'John' } } })).toEqual({ UserData: { FirstName: 'John' } });
  });

  it('converts arrays of objects', () => {
    expect(pascalCases({ src: [{ first_name: 'A' }, { first_name: 'B' }] })).toEqual([
      { FirstName: 'A' },
      { FirstName: 'B' },
    ]);
  });

  it('applies mapKey overrides', () => {
    const result = pascalCases({
      src: { id: 1, first_name: 'John' },
      mapKey: { id: 'Id' },
    });
    expect(result).toEqual({ Id: 1, FirstName: 'John' });
  });

  it('returns null for null src', () => {
    expect(pascalCases({ src: null })).toBeNull();
  });

  it('returns undefined for undefined src', () => {
    expect(pascalCases({ src: undefined })).toBeUndefined();
  });

  it('returns null for null args', () => {
    expect(pascalCases(null)).toBeNull();
  });

  it('leaves Date instances untouched', () => {
    const date = new Date('2024-01-01');
    expect(pascalCases({ src: { created_at: date } })).toEqual({ CreatedAt: date });
    // Date itself should not have keys processed
    const result = pascalCases({ src: date });
    expect(result).toBe(date);
  });

  it('leaves primitives untouched', () => {
    expect(pascalCases({ src: 42 })).toBe(42);
    expect(pascalCases({ src: 'hello' })).toBe('hello');
  });
});

// =============================================================================
// buildKey
// =============================================================================
describe('buildKey', () => {
  it('slugifies a string', () => {
    expect(buildKey('hello world')).toBe('hello-world');
  });

  it('slugifies a number', () => {
    expect(buildKey(42)).toBe('42');
  });

  it('joins and slugifies an array', () => {
    expect(buildKey(['hello', 'world'])).toBe('hello-world');
  });

  it('JSON-stringifies an object', () => {
    expect(buildKey({ a: 1 })).toBe('{"a":1}');
  });

  it('returns "" for circular object', () => {
    const circular: any = {};
    circular.self = circular;
    expect(buildKey(circular)).toBe('');
  });

  it('returns "" for null', () => {
    expect(buildKey(null)).toBe('');
  });

  it('returns "" for undefined', () => {
    expect(buildKey(undefined)).toBe('');
  });

  it('returns "" for boolean', () => {
    expect(buildKey(true)).toBe('');
    expect(buildKey(false)).toBe('');
  });
});

// =============================================================================
// buildKeys
// =============================================================================
describe('buildKeys', () => {
  it('maps buildKey over an array', () => {
    expect(buildKeys(['hello world', 42, ['a', 'b']])).toEqual(['hello-world', '42', 'a-b']);
  });

  it('returns [] for empty array', () => {
    expect(buildKeys([])).toEqual([]);
  });

  it('returns [] for null input', () => {
    expect(buildKeys(null as any)).toEqual([]);
  });
});

// =============================================================================
// isIdEmpty
// =============================================================================
describe('isIdEmpty', () => {
  it('returns true for null', () => expect(isIdEmpty(null)).toBe(true));
  it('returns true for undefined', () => expect(isIdEmpty(undefined)).toBe(true));
  it('returns true for ""', () => expect(isIdEmpty('')).toBe(true));
  it('returns true for "0"', () => expect(isIdEmpty('0')).toBe(true));
  it('returns true for 0', () => expect(isIdEmpty(0)).toBe(true));
  it('returns true for UUID_EMPTY', () => expect(isIdEmpty(UUID_EMPTY)).toBe(true));
  it('returns true for UUID_ZERO', () => expect(isIdEmpty(UUID_ZERO)).toBe(true));

  it('returns false for a non-empty string', () => expect(isIdEmpty('abc')).toBe(false));
  it('returns false for a positive number', () => expect(isIdEmpty(1)).toBe(false));
  it('returns false for a valid UUID', () => expect(isIdEmpty('123e4567-e89b-12d3-a456-426614174000')).toBe(false));
});

// =============================================================================
// slug
// =============================================================================
describe('slug', () => {
  it('lowercases the string', () => {
    expect(slug('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slug('hello world')).toBe('hello-world');
  });

  it('collapses multiple spaces/hyphens', () => {
    expect(slug('hello   world')).toBe('hello-world');
    expect(slug('hello---world')).toBe('hello-world');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slug('  hello  ')).toBe('hello');
  });

  it('removes special characters', () => {
    expect(slug('hello!@#world')).toBe('hello-world');
  });

  it('converts accented Latin characters', () => {
    expect(slug('café')).toBe('cafe');
    expect(slug('naïve')).toBe('naive');
    expect(slug('résumé')).toBe('resume');
  });

  it('converts ä → a and ö → o and ü → u', () => {
    expect(slug('äöü')).toBe('aou');
  });

  it('converts Cyrillic characters', () => {
    expect(slug('Привет')).toBe('privet');
  });

  it('converts copyright symbol', () => {
    expect(slug('hello © world')).toBe('hello-c-world');
  });

  it('handles numeric strings', () => {
    expect(slug('123')).toBe('123');
  });

  it('handles empty string', () => {
    expect(slug('')).toBe('');
  });

  it('handles non-string input via String() coercion', () => {
    expect(slug(42 as any)).toBe('42');
    expect(slug(null as any)).toBe('null');
  });

  it('converts ß to ss', () => {
    expect(slug('straße')).toBe('strasse');
  });

  it('converts æ to ae', () => {
    expect(slug('æther')).toBe('aether');
  });
});

// ./src/tests/strings2.test.ts

import {
  doesValueMatchAlphabet,
  isLengthBetween,
  areStringsEqual,
  replaceAt,
  insertAt,
  randomString,
  escapeRegExp,
  formatString,
  normalizeName,
} from '../';

// =============================================================================
// doesValueMatchAlphabet
// =============================================================================
describe('doesValueMatchAlphabet', () => {
  const alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';

  it('returns true when all characters are in the alphabet', () => {
    expect(doesValueMatchAlphabet('ABC123', alpha)).toBe(true);
  });

  it('returns false when a character is not in the alphabet', () => {
    expect(doesValueMatchAlphabet('ABC!', alpha)).toBe(false);
  });

  it('returns false for lowercase when alphabet is uppercase only', () => {
    expect(doesValueMatchAlphabet('abc', alpha)).toBe(false);
  });

  it('returns true for empty string (vacuously true)', () => {
    expect(doesValueMatchAlphabet('', alpha)).toBe(true);
  });

  it('returns false on first non-matching character', () => {
    expect(doesValueMatchAlphabet('AAA$AAA', alpha)).toBe(false);
  });

  it('works with a custom alphabet', () => {
    expect(doesValueMatchAlphabet('010101', '01')).toBe(true);
    expect(doesValueMatchAlphabet('0102', '01')).toBe(false);
  });
});

// =============================================================================
// isLengthBetween
// =============================================================================
describe('isLengthBetween', () => {
  it('returns true when length is within range', () => {
    expect(isLengthBetween('hello', 3, 10)).toBe(true);
  });

  it('returns true on exact min boundary', () => {
    expect(isLengthBetween('hi', 2, 5)).toBe(true);
  });

  it('returns true on exact max boundary', () => {
    expect(isLengthBetween('hello', 3, 5)).toBe(true);
  });

  it('returns false when shorter than min', () => {
    expect(isLengthBetween('hi', 3, 10)).toBe(false);
  });

  it('returns false when longer than max', () => {
    expect(isLengthBetween('hello world', 3, 5)).toBe(false);
  });

  it('treats falsy input as empty string', () => {
    expect(isLengthBetween(null as any, 0, 5)).toBe(true);
    expect(isLengthBetween(null as any, 1, 5)).toBe(false);
  });
});

// =============================================================================
// areStringsEqual
// =============================================================================
describe('areStringsEqual', () => {
  it('returns true for equal strings', () => {
    expect(areStringsEqual('hello', 'hello')).toBe(true);
  });

  it('returns true for case-insensitive match', () => {
    expect(areStringsEqual('Hello', 'hello')).toBe(true);
    expect(areStringsEqual('HELLO', 'hello')).toBe(true);
  });

  it('returns false for different strings', () => {
    expect(areStringsEqual('hello', 'world')).toBe(false);
  });

  it('treats null/undefined as empty string', () => {
    expect(areStringsEqual(null as any, null as any)).toBe(true);
    expect(areStringsEqual('', null as any)).toBe(true);
    expect(areStringsEqual('a', null as any)).toBe(false);
  });
});

// =============================================================================
// replaceAt
// =============================================================================
describe('replaceAt', () => {
  it('replaces characters at the given index', () => {
    expect(replaceAt('hello world', 6, 'there')).toBe('hello there');
  });

  it('replaces at index 0', () => {
    expect(replaceAt('hello', 0, 'H')).toBe('Hello');
  });

  it('returns the original string when index equals string length', () => {
    expect(replaceAt('hello', 5, '!')).toBe('hello');
  });

  it('returns the original string when index is beyond string length', () => {
    expect(replaceAt('hello', 10, '!')).toBe('hello');
  });

  it('handles replacement longer than remaining string', () => {
    expect(replaceAt('hi', 1, 'ello')).toBe('hello');
  });
});

// =============================================================================
// insertAt
// =============================================================================
describe('insertAt', () => {
  it('inserts a string at the given index', () => {
    expect(insertAt('helo', 3, 'l')).toBe('hello');
  });

  it('inserts at index 0 (prepend)', () => {
    expect(insertAt('world', 0, 'hello ')).toBe('hello world');
  });

  it('inserts at the end (append)', () => {
    expect(insertAt('hello', 5, '!')).toBe('hello!');
  });

  it('returns the original string when index is beyond string length', () => {
    expect(insertAt('hello', 10, '!')).toBe('hello');
  });

  it('does not remove existing characters', () => {
    expect(insertAt('abcd', 2, 'XY')).toBe('abXYcd');
  });
});

// =============================================================================
// randomString
// =============================================================================
describe('randomString', () => {
  it('returns a string of the requested length', () => {
    expect(randomString(10)).toHaveLength(10);
    expect(randomString(1)).toHaveLength(1);
  });

  it('defaults to length 16 for invalid input', () => {
    expect(randomString(NaN)).toHaveLength(16);
    expect(randomString(0)).toHaveLength(16);
    expect(randomString(-1)).toHaveLength(16);
  });

  it('uses only characters from the default alphabet', () => {
    const alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    const result = randomString(100);
    expect(doesValueMatchAlphabet(result, alpha)).toBe(true);
  });

  it('uses only characters from a custom alphabet', () => {
    const result = randomString(50, 'abc');
    expect(doesValueMatchAlphabet(result, 'abc')).toBe(true);
  });

  it('returns different values across calls (probabilistic)', () => {
    const results = new Set(Array.from({ length: 20 }, () => randomString(10)));
    expect(results.size).toBeGreaterThan(1);
  });
});

// =============================================================================
// escapeRegExp
// =============================================================================
describe('escapeRegExp', () => {
  it('escapes regex special characters', () => {
    expect(escapeRegExp('.*+?^${}()|[\\')).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\\\');
  });

  it('leaves normal strings unchanged', () => {
    expect(escapeRegExp('hello')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(escapeRegExp('')).toBe('');
  });

  it('handles null/undefined input', () => {
    expect(escapeRegExp(null as any)).toBe('');
    expect(escapeRegExp(undefined as any)).toBe('');
  });

  it('escaped string works safely inside RegExp', () => {
    const pattern = escapeRegExp('{{name}}');
    expect(() => new RegExp(pattern)).not.toThrow();
    expect('{{name}}'.match(new RegExp(pattern))).not.toBeNull();
  });
});

// =============================================================================
// formatString
// =============================================================================
describe('formatString', () => {
  it('replaces a single placeholder', () => {
    expect(formatString('Hello {{name}}!', { name: 'Alice' })).toBe('Hello Alice!');
  });

  it('replaces multiple placeholders', () => {
    expect(formatString('{{greeting}}, {{name}}!', { greeting: 'Hi', name: 'Bob' })).toBe('Hi, Bob!');
  });

  it('replaces the same placeholder multiple times', () => {
    expect(formatString('{{x}} + {{x}} = 2', { x: '1' })).toBe('1 + 1 = 2');
  });

  it('leaves placeholder unchanged when value is null', () => {
    expect(formatString('Hello {{name}}!', { name: null as any })).toBe('Hello {{name}}!');
  });

  it('leaves placeholder unchanged when value is undefined', () => {
    expect(formatString('Hello {{name}}!', { name: undefined as any })).toBe('Hello {{name}}!');
  });

  it('uses custom wrappers', () => {
    expect(formatString('Hi ${name}!', { name: 'Carol' }, { leftWrapper: '${', rightWrapper: '}' })).toBe('Hi Carol!');
  });

  it('matching is case-sensitive', () => {
    expect(formatString('Hello {{Name}}!', { name: 'Alice' })).toBe('Hello {{Name}}!');
  });

  it('returns str unchanged for null str', () => {
    expect(formatString(null as any, { name: 'Alice' })).toBeNull();
  });

  it('returns str unchanged for non-string str', () => {
    expect(formatString(42 as any, { name: 'Alice' })).toBe(42 as any);
  });

  it('returns str unchanged for null obj', () => {
    expect(formatString('Hello {{name}}!', null as any)).toBe('Hello {{name}}!');
  });

  it('handles numeric values', () => {
    expect(formatString('Count: {{n}}', { n: 42 })).toBe('Count: 42');
  });

  it('handles boolean values', () => {
    expect(formatString('Active: {{v}}', { v: true })).toBe('Active: true');
  });
});

// =============================================================================
// normalizeName
// =============================================================================
describe('normalizeName', () => {
  it('trims and lowercases a name', () => {
    expect(normalizeName('  Alice  ')).toBe('alice');
    expect(normalizeName('JOHN')).toBe('john');
  });

  it('handles already normalised input', () => {
    expect(normalizeName('alice')).toBe('alice');
  });

  it('returns undefined for null', () => {
    expect(normalizeName(null)).toBeUndefined();
  });

  it('returns undefined for undefined', () => {
    expect(normalizeName(undefined)).toBeUndefined();
  });

  it('handles empty string', () => {
    expect(normalizeName('')).toBe('');
  });
});

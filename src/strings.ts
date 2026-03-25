// ./src/strings.ts

import { FormatStringOptInterface } from './interfaces/formatStringOptInterface';

const DEFAULT_LENGTH = 16;
const DEFAULT_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';

// =============================================================================
// Alphabet / character helpers
// =============================================================================

/**
 * Returns `true` if every character in `value` is present in `alphabet`.
 *
 * @param value    - String to check.
 * @param alphabet - String of allowed characters.
 */
export const doesValueMatchAlphabet = (value: string, alphabet: string): boolean => {
  const allowed = new Set(alphabet);

  for (let idx = 0, len = value.length; idx < len; idx++) {
    if (!allowed.has(value[idx])) return false;
  }

  return true;
};

/**
 * Returns `true` if `str` length is between `minLen` and `maxLen` (inclusive).
 *
 * @param str    - String to check. Treated as empty string if falsy.
 * @param minLen - Minimum allowed length.
 * @param maxLen - Maximum allowed length.
 */
export const isLengthBetween = (str: string, minLen: number, maxLen: number): boolean => {
  const s = str || '';
  return s.length >= minLen && s.length <= maxLen;
};

/**
 * Returns `true` if `strLeft` and `strRight` are equal ignoring case.
 *
 * @param strLeft  - Left operand. Treated as empty string if falsy.
 * @param strRight - Right operand. Treated as empty string if falsy.
 */
export const areStringsEqual = (strLeft: string, strRight: string): boolean => {
  return (strLeft || '').toUpperCase() === (strRight || '').toUpperCase();
};

// =============================================================================
// String mutation helpers
// =============================================================================

/**
 * Replaces characters in `str` starting at `index` with `replacement`.
 * Returns `str` unchanged if `index` is beyond the string length.
 *
 * @param str         - Source string.
 * @param index       - Zero-based position to start replacing at.
 * @param replacement - String to write at `index`.
 */
export const replaceAt = (str: string, index: number, replacement: string): string => {
  if (index >= str.length) return str;
  return str.slice(0, index) + replacement + str.slice(index + replacement.length);
};

/**
 * Inserts `insert` into `str` at `index` without removing any characters.
 * Returns `str` unchanged if `index` is beyond the string length.
 *
 * @param str   - Source string.
 * @param index - Zero-based position to insert at.
 * @param insert - String to insert.
 */
export const insertAt = (str: string, index: number, insert: string): string => {
  if (index > str.length) return str;
  return str.slice(0, index) + insert + str.slice(index);
};

// =============================================================================
// Random string
// =============================================================================

/**
 * Generates a random string of `length` characters drawn from `alphabet`.
 * Not suitable for cryptographic or security purposes.
 *
 * @param length   - Length of the result. Defaults to 16 if invalid.
 * @param alphabet - Characters to draw from. Defaults to `ABCDEFGHJKLMNPQRSTUVWXYZ0123456789`.
 */
export const randomString = (length: number, alphabet?: string): string => {
  const actualLength = isNaN(length) || length < 1 ? DEFAULT_LENGTH : length;
  const actualAlphabet = alphabet || DEFAULT_ALPHABET;
  const alphabetSize = actualAlphabet.length;
  let value = '';

  for (let idx = 0; idx < actualLength; idx++) {
    value += actualAlphabet.charAt(Math.floor(Math.random() * alphabetSize));
  }

  return value;
};

// =============================================================================
// Regex helpers
// =============================================================================

/**
 * Escapes all regex special characters in `str` so it can be used safely
 * inside `new RegExp(...)`.
 *
 * @param str - String to escape.
 */
export const escapeRegExp = (str: string): string => {
  return (str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// =============================================================================
// String formatting
// =============================================================================

/**
 * Replaces `{{key}}` placeholders in `str` with corresponding values from `obj`.
 *
 * - Placeholder delimiters can be customised via `opt.leftWrapper` / `opt.rightWrapper`.
 * - Matching is case-sensitive by default.
 * - If a key's value is `null` or `undefined`, the placeholder is left in the output unchanged.
 *
 * @example
 * formatString('Hello {{name}}!', { name: 'Alice' }) // => 'Hello Alice!'
 * formatString('Hi ${name}!', { name: 'Bob' }, { leftWrapper: '${', rightWrapper: '}' })
 * // => 'Hi Bob!'
 *
 * @param str - Template string.
 * @param obj - Key/value pairs to substitute.
 * @param opt - Optional wrapper overrides.
 */
export const formatString = (str: string, obj: Record<string, unknown>, opt?: FormatStringOptInterface): string => {
  if (str == null || typeof str !== 'string' || obj == null || typeof obj !== 'object') {
    return str;
  }

  const leftWrapper = opt?.leftWrapper ?? '{{';
  const rightWrapper = opt?.rightWrapper ?? '}}';

  let result = str;

  Object.keys(obj).forEach((key) => {
    const varName = `${leftWrapper}${key}${rightWrapper}`;
    const value = obj[key] == null ? varName : String(obj[key]);
    result = result.replace(new RegExp(escapeRegExp(varName), 'g'), () => value);
  });

  return result;
};

// =============================================================================
// Name helpers
// =============================================================================

/**
 * Trims and lowercases a name string for normalised comparison or storage.
 * Returns `undefined` if input is `null` or `undefined`.
 *
 * @param name - Name to normalise.
 */
export const normalizeName = (name: string | null | undefined): string | undefined => {
  return name?.trim().toLowerCase();
};

import { FormatStringOptInterface } from './interfaces/formatStringOptInterface';

const DEFAULT_LENGTH = 16;
const DEFAULT_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';

/**
 * Verifies if string contains only of letters from provided alphabet.
 * @param {string} value a string to check.
 * @param {string} alphabet a alphabet-string to use for verification.
 */
export const doesValueMatchAlphabet = (value: string, alphabet: string): boolean => {
  const alphabetMap: any = {};

  for (let idx = 0, len = value.length; idx < len; idx++) {
    const char = value[idx];
    if (alphabetMap[char] === undefined) {
      if (alphabet.indexOf(char) !== -1) {
        alphabetMap[char] = char;
      } else {
        return false;
      }
    }
  }

  return true;
};

/**
 * Returns true if provided string's length is within minLen and maxLen
 * @param {string} str a string to verify.
 * @param {number} minLen a value for min allowed length.
 * @param {number} maxLen a value for max allowed length.
 */
export const isLengthBetween = (str: string, minLen: number, maxLen: number): boolean => {
  const chkStr = str || '';
  return chkStr.length >= minLen && chkStr.length <= maxLen;
};

/**
 * Returns true if strLeft and strRight are case insensitive equal.
 * @param {string} strLeft left string to compare
 * @param {string} strRight right string to compare
 */
export const areStringsEqual = (strLeft: string, strRight: string): boolean => {
  return (strLeft || '').toUpperCase() === (strRight || '').toUpperCase();
};

/**
 *
 * @param {string} str source string
 * @param {number} index position within string's length
 * @param {string} replacement string to replace
 */
export const replaceAt = (str: string, index: number, replacement: string): string => {
  if (index > str.length) {
    return str;
  }

  return str.substr(0, index) + replacement + str.substr(index + replacement.length);
};

/**
 *
 * @param {string} str source string
 * @param {number} index position within string's length
 * @param {string} replacement string to replace
 */
export const insertAt = (str: string, index: number, insert: string): string => {
  if (index > str.length) {
    return str;
  }

  return str.substr(0, index) + insert + str.substr(index);
};

/**
 * A simple function to generate random string with specified length with letter of provided alphabet.
 * This function is not for security purposes.
 * @param length a length for result random string
 * @param alphabet a string of allowed letters in the random string
 */
export const randomString = (length: number, alphabet?: string) => {
  let value = '';
  const actualLength = isNaN(length) || length < 1 ? DEFAULT_LENGTH : length;
  const actualAlphabet = alphabet || DEFAULT_ALPHABET;
  const alphabetSize = actualAlphabet.length;

  for (let idx = 0; idx < actualLength; idx++) {
    value += actualAlphabet.charAt(Math.floor(Math.random() * alphabetSize));
  }

  return value;
};

export const escapeRegExp = (str: string) => {
  return (str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

/**
 * Replaces variables by their values in provided string template
 * @param str string template where to replace variable to their values
 * @param obj an object that has props
 * @param opt options for the replacing
 * @returns formatted string
 */
export const formatString = (str: string, obj: any, opt?: FormatStringOptInterface) => {
  if (str == null || typeof str !== 'string' || obj == null || typeof obj !== 'object') {
    return str;
  }

  const leftWrapper = opt ? opt.leftWrapper || '' : '{{';
  const rightWrapper = opt ? opt.rightWrapper || '' : '}}';

  const vars = Object.keys(obj).reduce((acc: any, key: string) => {
    const varName = `${leftWrapper}${key}${rightWrapper}`;
    acc[varName] = obj[key];
    return acc;
  }, {});

  let result: string = str;

  Object.keys(vars).forEach((variable) => {
    result = result.replace(new RegExp(escapeRegExp(variable), 'gi'), vars[variable]);
  });

  return result;
};

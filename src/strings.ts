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
 * Truncates provided string it its length exceeds maxLen.
 * @param {string} str a source string to truncate
 * @param maxLen
 */
export const truncateToLength = (str: string, maxLen: number): string|null => {
  if (typeof str !== 'string') {
    return null;
  }

  return str.length > maxLen ? str.substr(0, maxLen) : str;
};

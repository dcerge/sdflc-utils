// ./src/languages.ts

/**
 * Parses an `Accept-Language` header string into an ordered array of language tags.
 * Quality weights (`q=`) are stripped; ordering from the header is preserved.
 *
 * @example
 * extractLanguages('en-US,en;q=0.9,ru;q=0.8,fr;q=0.7')
 * // => ['en-US', 'en', 'ru', 'fr']
 *
 * @param str - Value of the `Accept-Language` HTTP header.
 * @returns Array of language tag strings, or `[]` if input is falsy.
 */
export const extractLanguages = (str: string): string[] => {
  if (!str) return [];

  return str
    .split(',') // split into individual "lang;q=weight" entries
    .map((part) => part.split(';')[0]) // drop the ;q=weight suffix
    .map((lang) => lang.trim()) // remove surrounding whitespace
    .filter(Boolean); // remove any empty entries
};

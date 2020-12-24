/**
 * Accept-Language: en-US,en;q=0.9,ru;q=0.8,fr;q=0.7
 * @param {string} str A string from 'Accept-Language' header of a HTTP request
 * @returns {string[]} An array of languages found in the string.
 */
export const extractLanguages = (str: string): string[] => {
  if (!str) {
    return [];
  }

  const langs: string[] = [];
  const parts = (str || '').split(';');
  parts.forEach((part: string) => {
    const subparts = part.split(',');
    subparts.forEach((subpart) => {
      if (!subpart.startsWith('q=')) {
        langs.push(subpart);
      }
    });
  });

  return langs;
};

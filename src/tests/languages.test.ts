import { extractLanguages } from '../';

describe('Language tests', () => {
  test('Languages: extractLanguages', () => {
    const src = 'en,en-US;q=0.9,ru;q=0.8';
    const dst = ['en', 'en-US', 'ru'];

    expect(extractLanguages(src)).toEqual(dst);
    expect(extractLanguages('')).toEqual([]);
  });
});

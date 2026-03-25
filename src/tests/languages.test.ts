// ./src/tests/languages.test.ts

import { extractLanguages } from '../';

describe('extractLanguages', () => {
  it('parses a standard Accept-Language header', () => {
    expect(extractLanguages('en-US,en;q=0.9,ru;q=0.8,fr;q=0.7')).toEqual(['en-US', 'en', 'ru', 'fr']);
  });

  it('handles a single language with no weight', () => {
    expect(extractLanguages('en')).toEqual(['en']);
  });

  it('handles a single language with a weight', () => {
    expect(extractLanguages('en;q=0.9')).toEqual(['en']);
  });

  it('trims whitespace around language tags', () => {
    expect(extractLanguages('en-US, en;q=0.9, fr;q=0.7')).toEqual(['en-US', 'en', 'fr']);
  });

  it('returns [] for empty string', () => {
    expect(extractLanguages('')).toEqual([]);
  });

  it('returns [] for null', () => {
    expect(extractLanguages(null as any)).toEqual([]);
  });

  it('returns [] for undefined', () => {
    expect(extractLanguages(undefined as any)).toEqual([]);
  });

  it('filters out empty entries from malformed input', () => {
    expect(extractLanguages('en,,fr')).toEqual(['en', 'fr']);
  });

  it('preserves header ordering', () => {
    const result = extractLanguages('fr;q=0.7,en-US,en;q=0.9');
    expect(result).toEqual(['fr', 'en-US', 'en']);
  });
});

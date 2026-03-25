// ./src/tests/colors.test.ts

import { getRandomHexColor, getMostContrastingColor } from '../';

describe('getRandomHexColor', () => {
  it('returns a string starting with #', () => {
    expect(getRandomHexColor()).toMatch(/^#/);
  });

  it('returns a valid 7-character hex color', () => {
    expect(getRandomHexColor()).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('returns different values across multiple calls (probabilistic)', () => {
    const results = new Set(Array.from({ length: 20 }, () => getRandomHexColor()));
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('getMostContrastingColor', () => {
  // --- Input validation ---
  it('throws for null input', () => {
    expect(() => getMostContrastingColor(null as any)).toThrow();
  });

  it('throws for undefined input', () => {
    expect(() => getMostContrastingColor(undefined as any)).toThrow();
  });

  it('throws for empty string', () => {
    expect(() => getMostContrastingColor('')).toThrow();
  });

  it('throws for an invalid hex format', () => {
    expect(() => getMostContrastingColor('#ZZZZZ')).toThrow();
    expect(() => getMostContrastingColor('#12')).toThrow();
    expect(() => getMostContrastingColor('#1234567')).toThrow();
  });

  // --- Dark backgrounds → expect white text ---
  it('returns #FFFFFF for black (#000000)', () => {
    expect(getMostContrastingColor('#000000')).toBe('#FFFFFF');
  });

  it('returns #FFFFFF for a dark color (#1a1a2e)', () => {
    expect(getMostContrastingColor('#1a1a2e')).toBe('#FFFFFF');
  });

  it('returns #FFFFFF for a dark navy (#003366)', () => {
    expect(getMostContrastingColor('#003366')).toBe('#FFFFFF');
  });

  // --- Light backgrounds → expect black text ---
  it('returns #000000 for white (#FFFFFF)', () => {
    expect(getMostContrastingColor('#FFFFFF')).toBe('#000000');
  });

  it('returns #000000 for a light color (#f0f0f0)', () => {
    expect(getMostContrastingColor('#f0f0f0')).toBe('#000000');
  });

  it('returns #000000 for yellow (#FFFF00)', () => {
    expect(getMostContrastingColor('#FFFF00')).toBe('#000000');
  });

  // --- Shorthand hex ---
  it('handles 3-char shorthand #FFF', () => {
    expect(getMostContrastingColor('#FFF')).toBe('#000000');
  });

  it('handles 3-char shorthand #000', () => {
    expect(getMostContrastingColor('#000')).toBe('#FFFFFF');
  });

  it('handles 3-char shorthand dark color #123', () => {
    expect(getMostContrastingColor('#123')).toBe('#FFFFFF');
  });

  // --- Alpha channel ---
  it('preserves alpha from 8-char hex (#RRGGBBAA)', () => {
    const result = getMostContrastingColor('#000000aa');
    expect(result).toBe('#FFFFFFaa');
  });

  it('preserves alpha from 4-char shorthand (#RGBA)', () => {
    const result = getMostContrastingColor('#000a');
    expect(result).toBe('#FFFFFFaa');
  });

  it('does not append alpha when input has no alpha (#RRGGBB)', () => {
    const result = getMostContrastingColor('#ffffff');
    expect(result).toBe('#000000');
    expect(result).toHaveLength(7);
  });

  // --- Without leading # ---
  it('handles hex without leading #', () => {
    expect(getMostContrastingColor('ffffff')).toBe('#000000');
    expect(getMostContrastingColor('000000')).toBe('#FFFFFF');
  });
});

// ./src/colors.ts

/**
 * Generate a random hex color string including #000000 and #FFFFFF.
 * @returns A hex color string in the format `#RRGGBB`.
 */
export const getRandomHexColor = (): string => {
  const randomColor = Math.floor(Math.random() * 0x1000000);
  return `#${randomColor.toString(16).padStart(6, '0')}`;
};

/**
 * Returns either `#000000` or `#FFFFFF` — whichever has the higher WCAG contrast
 * ratio against the given background color.
 *
 * Supports hex formats: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
 *
 * Note: Alpha is preserved in the output (e.g. `#FFFFFFaa`) but is NOT factored
 * into the luminance calculation, as that would require knowing the background
 * color beneath the alpha layer.
 *
 * @param hex - Background color in hex format (with or without leading `#`).
 * @throws {Error} If the hex string is not a valid supported format.
 * @returns `#000000` or `#FFFFFF`, with alpha suffix appended if input had alpha.
 */
export const getMostContrastingColor = (hex: string): string => {
  if (!hex || typeof hex !== 'string') {
    throw new Error('Invalid hex color: input must be a non-empty string.');
  }

  // Remove leading #
  let cleanHex = hex.replace(/^#/, '');

  // Expand shorthand: #RGB → #RRGGBB, #RGBA → #RRGGBBAA
  if (cleanHex.length === 3 || cleanHex.length === 4) {
    cleanHex = cleanHex
      .split('')
      .map((ch) => ch + ch)
      .join('');
  }

  if (cleanHex.length !== 6 && cleanHex.length !== 8) {
    throw new Error('Invalid hex color format. Expected #RGB, #RGBA, #RRGGBB, or #RRGGBBAA.');
  }

  // Parse RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Parse alpha if present (not used in luminance — see JSDoc note)
  const a = cleanHex.length === 8 ? parseInt(cleanHex.substring(6, 8), 16) : 255;

  // Compute relative luminance per WCAG 2.1
  const luminance = [r, g, b]
    .map((v) => {
      const normalized = v / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
    })
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);

  // WCAG contrast ratio: (L1 + 0.05) / (L2 + 0.05), where L1 >= L2
  const contrastWithBlack = (luminance + 0.05) / 0.05;
  const contrastWithWhite = 1.05 / (luminance + 0.05);

  const best = contrastWithBlack > contrastWithWhite ? '#000000' : '#FFFFFF';

  // Preserve alpha channel in output if input had one
  if (a !== 255) {
    return best + a.toString(16).padStart(2, '0');
  }

  return best;
};

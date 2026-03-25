// ./src/keys.ts

import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';
import { UUID_EMPTY, UUID_ZERO } from './constants';

// =============================================================================
// Case Conversion
// =============================================================================

/**
 * Recursively converts all keys in an object (or array of objects) to camelCase.
 * Leaves Date instances, primitives, and null untouched.
 */
export const camelKeys = (result: any): any => {
  if (Array.isArray(result)) {
    return result.map((row) => camelKeys(row));
  }

  if (result !== null && typeof result === 'object' && !(result instanceof Date)) {
    const camelResult = mapKeys(result, (_value: any, key: string) => camelCase(key));
    return Object.fromEntries(Object.entries(camelResult).map(([key, value]) => [key, camelKeys(value)]));
  }

  return result;
};

/**
 * Converts a plain object's keys to camelCase.
 * Returns the original value unchanged if it is falsy or has a `rows` property
 * (e.g. raw database result sets that should be handled separately).
 *
 * @note If `result.rows` is present the value is returned as-is. Handle the
 * `rows` array explicitly before passing to this function if camelCasing is needed.
 */
export const camelResponse = (result: any): any => {
  if (!result || result.rows) {
    return result;
  }

  return camelKeys(result);
};

/**
 * Converts a string to PascalCase using lodash camelCase as the base.
 *
 * @param name - String to convert. Returns the original value if falsy.
 */
export const pascalCase = (name: string): string => {
  if (!name) return name;

  const tmp = camelCase(name);
  return tmp.charAt(0).toUpperCase() + tmp.slice(1);
};

/**
 * Recursively converts all keys in `src` to PascalCase.
 * An optional `mapKey` object can override the key transformation for specific keys.
 * Date instances and non-object primitives are returned as-is.
 *
 * @param args.src    - The value to transform.
 * @param args.mapKey - Optional map of original key → desired key overrides.
 */
export const pascalCases = (args: any): any => {
  if (!args || typeof args !== 'object') {
    return args;
  }

  const { src, mapKey } = args || {};

  if (!src) return src;

  if (Array.isArray(src)) {
    return src.map((item) => pascalCases({ src: item, mapKey }));
  }

  if (typeof src === 'object' && !(src instanceof Date)) {
    return Object.keys(src).reduce((acc: any, key: string) => {
      const key2use = mapKey?.[key] ?? pascalCase(key);
      acc[key2use] = pascalCases({ src: src[key], mapKey });
      return acc;
    }, {});
  }

  return src;
};

// =============================================================================
// Key / Slug Builders
// =============================================================================

/**
 * Converts a string/array/number/object to a slug-based key.
 * Objects are JSON-serialised; circular references return `""`.
 *
 * @param keys - Value to convert to a key string.
 */
export const buildKey = (keys: any): string => {
  if (keys instanceof Array) {
    return slug(keys.join('-'));
  } else if (typeof keys === 'string') {
    return slug(keys);
  } else if (typeof keys === 'number') {
    return slug(keys.toString());
  } else if (typeof keys === 'object' && keys !== null) {
    try {
      return JSON.stringify(keys);
    } catch {
      return '';
    }
  }

  return '';
};

/**
 * Calls `buildKey` for each item in the provided array.
 * Returns `[]` for falsy input.
 *
 * @param keys - Array of values to convert.
 */
export const buildKeys = (keys: any[]): string[] => {
  return (keys || []).map((key) => buildKey(key));
};

// =============================================================================
// ID Helpers
// =============================================================================

/**
 * Returns `true` if the value represents an empty/unset ID:
 * - `null`, `undefined`, or empty string `""`
 * - string `'0'` or number `0`
 * - `UUID_EMPTY` (`'00000000-0000-4000-9000-000000000000'`)
 * - `UUID_ZERO`  (`'00000000-0000-0000-0000-000000000000'`)
 *
 * @param value - The ID value to check.
 */
export const isIdEmpty = (value: string | number | undefined | null): boolean => {
  return !value || value === '0' || value === 0 || value === UUID_EMPTY || value === UUID_ZERO;
};

// =============================================================================
// Slug
// =============================================================================

/**
 * Converts a string to a URL-friendly slug.
 * Normalises accented and Unicode characters to their ASCII equivalents,
 * then replaces any remaining non-alphanumeric characters with hyphens.
 *
 * Non-string values are coerced via `String()`.
 *
 * @param str - String to slugify.
 */
export const slug = (str: string): string => {
  let s = String(str).trim().toLowerCase();

  // Normalise Unicode / accented characters to ASCII equivalents.
  // Note: characters that appear in single-char entries (e.g. ö→o, ü→u)
  // are intentionally omitted from multi-char entries (oe, ue) to avoid
  // ambiguous double-mapping.
  const swaps: Record<string, string[]> = {
    '0': ['°', '₀', '۰', '０'],
    '1': ['¹', '₁', '۱', '１'],
    '2': ['²', '₂', '۲', '２'],
    '3': ['³', '₃', '۳', '３'],
    '4': ['⁴', '₄', '۴', '٤', '４'],
    '5': ['⁵', '₅', '۵', '٥', '５'],
    '6': ['⁶', '₆', '۶', '٦', '６'],
    '7': ['⁷', '₇', '۷', '７'],
    '8': ['⁸', '₈', '۸', '８'],
    '9': ['⁹', '₉', '۹', '９'],
    a: [
      'à',
      'á',
      'ả',
      'ã',
      'ạ',
      'ă',
      'ắ',
      'ằ',
      'ẳ',
      'ẵ',
      'ặ',
      'â',
      'ấ',
      'ầ',
      'ẩ',
      'ẫ',
      'ậ',
      'ā',
      'ą',
      'å',
      'α',
      'ά',
      'ἀ',
      'ἁ',
      'ἂ',
      'ἃ',
      'ἄ',
      'ἅ',
      'ἆ',
      'ἇ',
      'ᾀ',
      'ᾁ',
      'ᾂ',
      'ᾃ',
      'ᾄ',
      'ᾅ',
      'ᾆ',
      'ᾇ',
      'ὰ',
      'ά',
      'ᾰ',
      'ᾱ',
      'ᾲ',
      'ᾳ',
      'ᾴ',
      'ᾶ',
      'ᾷ',
      'а',
      'أ',
      'အ',
      'ာ',
      'ါ',
      'ǻ',
      'ǎ',
      'ª',
      'ა',
      'अ',
      'ا',
      'ａ',
      'ä',
    ],
    b: ['б', 'β', 'ب', 'ဗ', 'ბ', 'ｂ'],
    c: ['ç', 'ć', 'č', 'ĉ', 'ċ', 'ｃ'],
    d: ['ď', 'ð', 'đ', 'ƌ', 'ȡ', 'ɖ', 'ɗ', 'ᵭ', 'ᶁ', 'ᶑ', 'д', 'δ', 'د', 'ض', 'ဍ', 'ဒ', 'დ', 'ｄ'],
    e: [
      'é',
      'è',
      'ẻ',
      'ẽ',
      'ẹ',
      'ê',
      'ế',
      'ề',
      'ể',
      'ễ',
      'ệ',
      'ë',
      'ē',
      'ę',
      'ě',
      'ĕ',
      'ė',
      'ε',
      'έ',
      'ἐ',
      'ἑ',
      'ἒ',
      'ἓ',
      'ἔ',
      'ἕ',
      'ὲ',
      'έ',
      'е',
      'ё',
      'э',
      'є',
      'ə',
      'ဧ',
      'ေ',
      'ဲ',
      'ე',
      'ए',
      'إ',
      'ئ',
      'ｅ',
    ],
    f: ['ф', 'φ', 'ف', 'ƒ', 'ფ', 'ｆ'],
    g: ['ĝ', 'ğ', 'ġ', 'ģ', 'г', 'ґ', 'γ', 'ဂ', 'გ', 'گ', 'ｇ'],
    h: ['ĥ', 'ħ', 'η', 'ή', 'ح', 'ه', 'ဟ', 'ှ', 'ჰ', 'ｈ'],
    i: [
      'í',
      'ì',
      'ỉ',
      'ĩ',
      'ị',
      'î',
      'ï',
      'ī',
      'ĭ',
      'į',
      'ı',
      'ι',
      'ί',
      'ϊ',
      'ΐ',
      'ἰ',
      'ἱ',
      'ἲ',
      'ἳ',
      'ἴ',
      'ἵ',
      'ἶ',
      'ἷ',
      'ὶ',
      'ί',
      'ῐ',
      'ῑ',
      'ῒ',
      'ΐ',
      'ῖ',
      'ῗ',
      'і',
      'ї',
      'и',
      'ဣ',
      'ိ',
      'ီ',
      'ည်',
      'ǐ',
      'ი',
      'इ',
      'ی',
      'ｉ',
    ],
    j: ['ĵ', 'ј', 'Ј', 'ჯ', 'ج', 'ｊ'],
    k: ['ķ', 'ĸ', 'к', 'κ', 'Ķ', 'ق', 'ك', 'က', 'კ', 'ქ', 'ک', 'ｋ'],
    l: ['ł', 'ľ', 'ĺ', 'ļ', 'ŀ', 'л', 'λ', 'ل', 'လ', 'ლ', 'ｌ'],
    m: ['м', 'μ', 'م', 'မ', 'მ', 'ｍ'],
    n: ['ñ', 'ń', 'ň', 'ņ', 'ŉ', 'ŋ', 'ν', 'н', 'ن', 'န', 'ნ', 'ｎ'],
    o: [
      'ó',
      'ò',
      'ỏ',
      'õ',
      'ọ',
      'ô',
      'ố',
      'ồ',
      'ổ',
      'ỗ',
      'ộ',
      'ơ',
      'ớ',
      'ờ',
      'ở',
      'ỡ',
      'ợ',
      'ø',
      'ō',
      'ő',
      'ŏ',
      'ο',
      'ὀ',
      'ὁ',
      'ὂ',
      'ὃ',
      'ὄ',
      'ὅ',
      'ὸ',
      'ό',
      'о',
      'و',
      'θ',
      'ို',
      'ǒ',
      'ǿ',
      'º',
      'ო',
      'ओ',
      'ｏ',
      'ö',
    ],
    p: ['п', 'π', 'ပ', 'პ', 'پ', 'ｐ'],
    q: ['ყ', 'ｑ'],
    r: ['ŕ', 'ř', 'ŗ', 'р', 'ρ', 'ر', 'რ', 'ｒ'],
    s: ['ś', 'š', 'ş', 'с', 'σ', 'ș', 'ς', 'س', 'ص', 'စ', 'ſ', 'ს', 'ｓ'],
    t: ['ť', 'ţ', 'т', 'τ', 'ț', 'ت', 'ط', 'ဋ', 'တ', 'ŧ', 'თ', 'ტ', 'ｔ'],
    u: [
      'ú',
      'ù',
      'ủ',
      'ũ',
      'ụ',
      'ư',
      'ứ',
      'ừ',
      'ử',
      'ữ',
      'ự',
      'û',
      'ū',
      'ů',
      'ű',
      'ŭ',
      'ų',
      'µ',
      'у',
      'ဉ',
      'ု',
      'ူ',
      'ǔ',
      'ǖ',
      'ǘ',
      'ǚ',
      'ǜ',
      'უ',
      'उ',
      'ｕ',
      'ў',
      'ü',
    ],
    v: ['в', 'ვ', 'ϐ', 'ｖ'],
    w: ['ŵ', 'ω', 'ώ', 'ဝ', 'ွ', 'ｗ'],
    x: ['χ', 'ξ', 'ｘ'],
    y: ['ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ', 'ÿ', 'ŷ', 'й', 'ы', 'υ', 'ϋ', 'ύ', 'ΰ', 'ي', 'ယ', 'ｙ'],
    z: ['ź', 'ž', 'ż', 'з', 'ζ', 'ز', 'ဇ', 'ზ', 'ｚ'],
    aa: ['ع', 'आ', 'آ'],
    ae: ['æ', 'ǽ'],
    ai: ['ऐ'],
    ch: ['ч', 'ჩ', 'ჭ', 'چ'],
    dj: ['ђ', 'đ'],
    dz: ['џ', 'ძ'],
    ei: ['ऍ'],
    gh: ['غ', 'ღ'],
    ii: ['ई'],
    ij: ['ĳ'],
    kh: ['х', 'خ', 'ხ'],
    lj: ['љ'],
    nj: ['њ'],
    oe: ['œ', 'ؤ'], // ö removed — already mapped to 'o' above
    oi: ['ऑ'],
    oii: ['ऒ'],
    ps: ['ψ'],
    sh: ['ш', 'შ', 'ش'],
    shch: ['щ'],
    ss: ['ß'],
    sx: ['ŝ'],
    th: ['þ', 'ϑ', 'ث', 'ذ', 'ظ'],
    ts: ['ц', 'ც', 'წ'],
    ue: [], // ü removed — already mapped to 'u' above
    uu: ['ऊ'],
    ya: ['я'],
    yu: ['ю'],
    zh: ['ж', 'ჟ', 'ژ'],
    '(c)': ['©'],
    A: [
      'Á',
      'À',
      'Ả',
      'Ã',
      'Ạ',
      'Ă',
      'Ắ',
      'Ằ',
      'Ẳ',
      'Ẵ',
      'Ặ',
      'Â',
      'Ấ',
      'Ầ',
      'Ẩ',
      'Ẫ',
      'Ậ',
      'Å',
      'Ā',
      'Ą',
      'Α',
      'Ά',
      'Ἀ',
      'Ἁ',
      'Ἂ',
      'Ἃ',
      'Ἄ',
      'Ἅ',
      'Ἆ',
      'Ἇ',
      'ᾈ',
      'ᾉ',
      'ᾊ',
      'ᾋ',
      'ᾌ',
      'ᾍ',
      'ᾎ',
      'ᾏ',
      'Ᾰ',
      'Ᾱ',
      'Ὰ',
      'Ά',
      'ᾼ',
      'А',
      'Ǻ',
      'Ǎ',
      'Ａ',
      'Ä',
    ],
    B: ['Б', 'Β', 'ब', 'Ｂ'],
    C: ['Ç', 'Ć', 'Č', 'Ĉ', 'Ċ', 'Ｃ'],
    D: ['Ď', 'Ð', 'Đ', 'Ɖ', 'Ɗ', 'Ƌ', 'ᴅ', 'ᴆ', 'Д', 'Δ', 'Ｄ'],
    E: [
      'É',
      'È',
      'Ẻ',
      'Ẽ',
      'Ẹ',
      'Ê',
      'Ế',
      'Ề',
      'Ể',
      'Ễ',
      'Ệ',
      'Ë',
      'Ē',
      'Ę',
      'Ě',
      'Ĕ',
      'Ė',
      'Ε',
      'Έ',
      'Ἐ',
      'Ἑ',
      'Ἒ',
      'Ἓ',
      'Ἔ',
      'Ἕ',
      'Έ',
      'Ὲ',
      'Е',
      'Ё',
      'Э',
      'Є',
      'Ə',
      'Ｅ',
    ],
    F: ['Ф', 'Φ', 'Ｆ'],
    G: ['Ğ', 'Ġ', 'Ģ', 'Г', 'Ґ', 'Γ', 'Ｇ'],
    H: ['Η', 'Ή', 'Ħ', 'Ｈ'],
    I: [
      'Í',
      'Ì',
      'Ỉ',
      'Ĩ',
      'Ị',
      'Î',
      'Ï',
      'Ī',
      'Ĭ',
      'Į',
      'İ',
      'Ι',
      'Ί',
      'Ϊ',
      'Ἰ',
      'Ἱ',
      'Ἳ',
      'Ἴ',
      'Ἵ',
      'Ἶ',
      'Ἷ',
      'Ῐ',
      'Ῑ',
      'Ὶ',
      'Ί',
      'И',
      'І',
      'Ї',
      'Ǐ',
      'ϒ',
      'Ｉ',
    ],
    J: ['Ｊ'],
    K: ['К', 'Κ', 'Ｋ'],
    L: ['Ĺ', 'Ł', 'Л', 'Λ', 'Ļ', 'Ľ', 'Ŀ', 'ल', 'Ｌ'],
    M: ['М', 'Μ', 'Ｍ'],
    N: ['Ń', 'Ñ', 'Ň', 'Ņ', 'Ŋ', 'Н', 'Ν', 'Ｎ'],
    O: [
      'Ó',
      'Ò',
      'Ỏ',
      'Õ',
      'Ọ',
      'Ô',
      'Ố',
      'Ồ',
      'Ổ',
      'Ỗ',
      'Ộ',
      'Ơ',
      'Ớ',
      'Ờ',
      'Ở',
      'Ỡ',
      'Ợ',
      'Ø',
      'Ō',
      'Ő',
      'Ŏ',
      'Ο',
      'Ό',
      'Ὀ',
      'Ὁ',
      'Ὂ',
      'Ὃ',
      'Ὄ',
      'Ὅ',
      'Ὸ',
      'Ό',
      'О',
      'Θ',
      'Ө',
      'Ǒ',
      'Ǿ',
      'Ｏ',
      'Ö',
    ],
    P: ['П', 'Π', 'Ｐ'],
    Q: ['Ｑ'],
    R: ['Ř', 'Ŕ', 'Р', 'Ρ', 'Ŗ', 'Ｒ'],
    S: ['Ş', 'Ŝ', 'Ș', 'Š', 'Ś', 'С', 'Σ', 'Ｓ'],
    T: ['Ť', 'Ţ', 'Ŧ', 'Ț', 'Т', 'Τ', 'Ｔ'],
    U: [
      'Ú',
      'Ù',
      'Ủ',
      'Ũ',
      'Ụ',
      'Ư',
      'Ứ',
      'Ừ',
      'Ử',
      'Ữ',
      'Ự',
      'Û',
      'Ū',
      'Ů',
      'Ű',
      'Ŭ',
      'Ų',
      'У',
      'Ǔ',
      'Ǖ',
      'Ǘ',
      'Ǚ',
      'Ǜ',
      'Ｕ',
      'Ў',
      'Ü',
    ],
    V: ['В', 'Ｖ'],
    W: ['Ω', 'Ώ', 'Ŵ', 'Ｗ'],
    X: ['Χ', 'Ξ', 'Ｘ'],
    Y: ['Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ', 'Ÿ', 'Ῠ', 'Ῡ', 'Ὺ', 'Ύ', 'Ы', 'Й', 'Υ', 'Ϋ', 'Ŷ', 'Ｙ'],
    Z: ['Ź', 'Ž', 'Ż', 'З', 'Ζ', 'Ｚ'],
    AE: ['Æ', 'Ǽ'],
    Ch: ['Ч'],
    Dj: ['Ђ'],
    Dz: ['Џ'],
    Gx: ['Ĝ'],
    Hx: ['Ĥ'],
    Ij: ['Ĳ'],
    Jx: ['Ĵ'],
    Kh: ['Х'],
    Lj: ['Љ'],
    Nj: ['Њ'],
    Oe: ['Œ'],
    Ps: ['Ψ'],
    Sh: ['Ш'],
    Shch: ['Щ'],
    Ss: ['ẞ'],
    Th: ['Þ'],
    Ts: ['Ц'],
    Ya: ['Я'],
    Yu: ['Ю'],
    Zh: ['Ж'],
  };

  Object.keys(swaps).forEach((swap) => {
    swaps[swap].forEach((ch) => {
      s = s.replace(new RegExp(ch, 'g'), swap);
    });
  });

  return s
    .replace(/[^a-zA-Z0-9]/g, '-') // replace non-alphanumeric with hyphen
    .replace(/\s+/g, '-') // collapse whitespace
    .replace(/-+/g, '-') // collapse consecutive hyphens
    .replace(/^-+/, '') // trim leading hyphens
    .replace(/-+$/, ''); // trim trailing hyphens
};

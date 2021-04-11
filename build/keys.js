"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slug = exports.isIdEmpty = exports.buildKeys = exports.buildKey = exports.camelResponse = exports.camelKeys = void 0;
var lodash_1 = require("lodash");
var camelKeys = function (result) {
    if (Array.isArray(result)) {
        return result.map(function (row) {
            return lodash_1.mapKeys(row, function (value, key) {
                return lodash_1.camelCase(key);
            });
        });
    }
    return lodash_1.mapKeys(result, function (value, key) {
        return lodash_1.camelCase(key);
    });
};
exports.camelKeys = camelKeys;
var camelResponse = function (result) {
    if (!result || result.rows) {
        return result;
    }
    return exports.camelKeys(result);
};
exports.camelResponse = camelResponse;
/**
 * Converts string/array/number to a key value.
 * A key value is a uppercased string.
 * @param {any} keys a string or array or number to convert
 */
var buildKey = function (keys) {
    if (keys instanceof Array) {
        return exports.slug(keys.join('-'));
    }
    else if (typeof keys === 'string') {
        return exports.slug(keys);
    }
    else if (typeof keys === 'number') {
        return exports.slug(keys.toString());
    }
    return exports.slug(keys.toString());
};
exports.buildKey = buildKey;
/**
 * Calls buildKey for each items of provided array.
 * @param {string[]} keys array of strings to be processed.
 */
var buildKeys = function (keys) {
    return keys.map(function (key) { return exports.buildKey(key); });
};
exports.buildKeys = buildKeys;
/**
 * Returns true if passed value is an empty ID which could be:
 * - empty string or null or undefined
 * - string '0'
 * - number 0
 * - guid '00000000-0000-0000-0000-000000000000'
 * @param {string|number} value
 * @returns {boolean} True if value represents empty ID
 */
var isIdEmpty = function (value) {
    return !value || value === '0' || value === 0 || value === '00000000-0000-0000-0000-000000000000';
};
exports.isIdEmpty = isIdEmpty;
/**
 * Converts provided string to a slug.
 * @param {string} str string to be coverted to a slug
 */
var slug = function (str) {
    str = String(str).toString();
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    // remove accents, swap ñ for n, etc
    var swaps = {
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
        oe: ['ö', 'œ', 'ؤ'],
        oi: ['ऑ'],
        oii: ['ऒ'],
        ps: ['ψ'],
        sh: ['ш', 'შ', 'ش'],
        shch: ['щ'],
        ss: ['ß'],
        sx: ['ŝ'],
        th: ['þ', 'ϑ', 'ث', 'ذ', 'ظ'],
        ts: ['ц', 'ც', 'წ'],
        ue: ['ü'],
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
    Object.keys(swaps).forEach(function (swap) {
        swaps[swap].forEach(function (s) {
            str = str.replace(new RegExp(s, 'g'), swap);
        });
    });
    return str
        .replace(/[^a-zA-Z0-9]/g, '-') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-') // collapse dashes
        .replace(/^-+/, '') // trim - from start of text
        .replace(/-+$/, ''); // trim - from end of text
};
exports.slug = slug;

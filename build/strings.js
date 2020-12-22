"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateToLength = exports.insertAt = exports.replaceAt = exports.areStringsEqual = exports.isLengthBetween = exports.doesValueMatchAlphabet = void 0;
/**
 * Verifies if string contains only of letters from provided alphabet.
 * @param {string} value a string to check.
 * @param {string} alphabet a alphabet-string to use for verification.
 */
var doesValueMatchAlphabet = function (value, alphabet) {
    var alphabetMap = {};
    for (var idx = 0, len = value.length; idx < len; idx++) {
        var char = value[idx];
        if (alphabetMap[char] === undefined) {
            if (alphabet.indexOf(char) !== -1) {
                alphabetMap[char] = char;
            }
            else {
                return false;
            }
        }
    }
    return true;
};
exports.doesValueMatchAlphabet = doesValueMatchAlphabet;
/**
 * Returns true if provided string's length is within minLen and maxLen
 * @param {string} str a string to verify.
 * @param {number} minLen a value for min allowed length.
 * @param {number} maxLen a value for max allowed length.
 */
var isLengthBetween = function (str, minLen, maxLen) {
    var chkStr = str || '';
    return chkStr.length >= minLen && chkStr.length <= maxLen;
};
exports.isLengthBetween = isLengthBetween;
/**
 * Returns true if strLeft and strRight are case insensitive equal.
 * @param {string} strLeft left string to compare
 * @param {string} strRight right string to compare
 */
var areStringsEqual = function (strLeft, strRight) {
    return (strLeft || '').toUpperCase() === (strRight || '').toUpperCase();
};
exports.areStringsEqual = areStringsEqual;
/**
 *
 * @param {string} str source string
 * @param {number} index position within string's length
 * @param {string} replacement string to replace
 */
var replaceAt = function (str, index, replacement) {
    if (index > str.length) {
        return str;
    }
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
};
exports.replaceAt = replaceAt;
/**
 *
 * @param {string} str source string
 * @param {number} index position within string's length
 * @param {string} replacement string to replace
 */
var insertAt = function (str, index, insert) {
    if (index > str.length) {
        return str;
    }
    return str.substr(0, index) + insert + str.substr(index);
};
exports.insertAt = insertAt;
/**
 * Truncates provided string it its length exceeds maxLen.
 * @param {string} str a source string to truncate
 * @param maxLen
 */
var truncateToLength = function (str, maxLen) {
    if (typeof str !== 'string') {
        return null;
    }
    return (str.length > maxLen) ? str.substr(0, maxLen) : str;
};
exports.truncateToLength = truncateToLength;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractLanguages = void 0;
/**
 * Accept-Language: en-US,en;q=0.9,ru;q=0.8,fr;q=0.7
 * @param {string} str A string from 'Accept-Language' header of a HTTP request
 * @returns {string[]} An array of languages found in the string.
 */
var extractLanguages = function (str) {
    if (!str) {
        return [];
    }
    var langs = [];
    var parts = (str || '').split(';');
    parts.forEach(function (part) {
        var subparts = part.split(',');
        subparts.forEach(function (subpart) {
            if (!subpart.startsWith('q=')) {
                langs.push(subpart);
            }
        });
    });
    return langs;
};
exports.extractLanguages = extractLanguages;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNullOnEmptyString = void 0;
/**
 * Replace all empty strings in all the object properties to null values.
 * Example:
 * const srcObj = { firstName: 'John', lastName: '' };
 * const dstObj = setNullOnEmptyString(srcObj);
 * dstObj => { firstName: 'John', lastName: null };
 * @param {any} obj an object to process
 */
var setNullOnEmptyString = function (obj) {
    var tmp = {};
    Object.keys(obj || {}).forEach(function (key) {
        tmp[key] = obj[key] === '' ? null : obj[key];
    });
    return tmp;
};
exports.setNullOnEmptyString = setNullOnEmptyString;

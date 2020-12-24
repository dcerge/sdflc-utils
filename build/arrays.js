"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrToLowerCase = exports.arrToUpperCase = exports.arrayToObject = void 0;
/**
 * Convert an array of objects into an object which properties names and values are taken from nameKey and valueKey of each item.
 * Example:
 * const arr = [{ name: 'status', value: 'active' }, { name: 'name', value: 'Some name' }];
 * const obj = arrayToObject(arr, 'name', 'value');
 * obj => { status: 'active', name: 'Some name' }
 * @param arr array of object to process
 * @param nameKey an object property name to use for retrieving new object property name
 * @param valueKey an object property name to use for retrieving new object property value
 * @returns {object} an object with properties and values taken from the input array
 */
var arrayToObject = function (arr, nameKey, valueKey) {
    var obj = {};
    if (arr instanceof Array === false) {
        return obj;
    }
    return arr.reduce(function (acc, item) {
        acc[item[nameKey]] = item[valueKey];
        return acc;
    }, obj);
};
exports.arrayToObject = arrayToObject;
/**
 * Uppercase each string in the array
 * @param {string[]} arr arrays of string to upper case
 */
var arrToUpperCase = function (arr) {
    return (arr || []).map(function (item) { return (item || '').toUpperCase(); });
};
exports.arrToUpperCase = arrToUpperCase;
/**
 * Lowercase each string in the array
 * @param {string[]} arr arrays of string to lower case
 */
var arrToLowerCase = function (arr) {
    return (arr || []).map(function (item) { return (item || '').toLowerCase(); });
};
exports.arrToLowerCase = arrToLowerCase;

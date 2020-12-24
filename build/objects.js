"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyPropsOf = exports.setNullOnEmptyString = void 0;
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
/**
 * Creates an instance of type T
 * @param c Type instanceof which should be created
 * @example createInstance(MyClassName)
 */
// function createInstance<T>(c: new () => T): T {
//   return new c();
// }
/**
 * Takes an object and creates another object of `destinationType` type.
 * @param {any} source an object to process
 * @param {any} destinationType a class with properties to copy
 */
function onlyPropsOf(source, destinationType) {
    var result = new destinationType();
    Object.keys(result).forEach(function (key) {
        result[key] = source && source[key];
    });
    return result;
}
exports.onlyPropsOf = onlyPropsOf;

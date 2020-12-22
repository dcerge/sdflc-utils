"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyPropsOf = void 0;
/**
 * Creates an instance of type T
 * @param c Type instanceof which should be created
 * @example createInstance(MyClassName)
 */
function createInstance(c) {
    return new c();
}
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

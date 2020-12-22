"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.converStringToValue = void 0;
var constants_1 = require("./constants");
/**
 * Converts provided string to specified type. If type is not supported throws and exception.
 * @param {any} value string value to be converted
 * @param {string} type name of type to convert the string to
 */
var converStringToValue = function (value, type) {
    var valueType = type.toUpperCase();
    switch (valueType) {
        case constants_1.VALUE_TYPES.STRING:
            return value;
        case constants_1.VALUE_TYPES.NUMBER:
        case constants_1.VALUE_TYPES.DECIMAL:
            return Number(value);
        case constants_1.VALUE_TYPES.INTEGER:
            if (isNaN(value)) {
                return NaN;
            }
            return parseInt(value);
        case constants_1.VALUE_TYPES.FLOAT:
            if (isNaN(value)) {
                return NaN;
            }
            return parseFloat(value);
        case constants_1.VALUE_TYPES.BOOLEAN:
            return (value || '').toLowerCase() === 'true';
        default:
            throw Error("Can't convert string value to the type '" + valueType + "' as it is unsupported");
    }
};
exports.converStringToValue = converStringToValue;

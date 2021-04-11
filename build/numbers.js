"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundNumberValues = exports.roundNumberValue = void 0;
/**
 * Rounds decimal `value` to `decimals` digits after point.
 * For example, 2.34567 => 2.35
 * @param {number} value
 */
var roundNumberValue = function (value, decimals) {
    return isNaN(value) ? value : Number(Number(value).toFixed(decimals || 2));
};
exports.roundNumberValue = roundNumberValue;
/**
 * Takes an object or array and goes through all his props and for numbers rounds up to 2 digits after point.
 * For example, { a: 2.34567, b: 45.213 } => { a: 2.35, b: 45.21 }
 * @param {number} obj Object to process
 */
var roundNumberValues = function (obj, decimals) {
    if (!obj) {
        return obj;
    }
    if (Array.isArray(obj)) {
        for (var idx = 0, len = obj.length; idx < len; idx++) {
            obj[idx] = exports.roundNumberValues(obj[idx], decimals);
        }
    }
    else if (typeof obj === 'object') {
        Object.keys(obj || {}).forEach(function (field) {
            if (typeof obj[field] === 'number') {
                obj[field] = exports.roundNumberValue(obj[field], decimals);
            }
        });
    }
    else {
        obj = exports.roundNumberValue(obj, decimals);
    }
    return obj;
};
exports.roundNumberValues = roundNumberValues;

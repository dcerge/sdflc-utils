"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
describe('Numbers tests', function () {
    test('Round a number to 2 decimals digits', function () {
        var value = 34.567;
        expect(__1.roundNumberValue(value)).toEqual(34.57);
    });
    test('Round a number to 3 decimals digits', function () {
        var value = 34.5674;
        expect(__1.roundNumberValue(value, 3)).toEqual(34.567);
    });
    test('Round an array of numbers', function () {
        var values = [34.567, 2.456, 7.233];
        expect(__1.roundNumberValues(values)).toEqual([34.57, 2.46, 7.23]);
    });
    test('Round an array of objects', function () {
        var inValues = [
            { a: 34.567, b: 'a' },
            { a: 2.456, b: 'a' },
            { a: 7.233, b: 'a' },
        ];
        var outValues = [
            { a: 34.57, b: 'a' },
            { a: 2.46, b: 'a' },
            { a: 7.23, b: 'a' },
        ];
        expect(__1.roundNumberValues(inValues)).toEqual(outValues);
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
describe('Converters tets', function () {
    test('Converters: converStringToValue', function () {
        var toTest = [
            {
                value: 'string1',
                type: __1.VALUE_TYPES.STRING,
                expect: 'string1',
            },
            {
                value: '123',
                type: __1.VALUE_TYPES.INTEGER,
                expect: 123,
            },
            {
                value: '123asd',
                type: __1.VALUE_TYPES.INTEGER,
                expect: NaN,
            },
            {
                value: '123',
                type: __1.VALUE_TYPES.NUMBER,
                expect: 123,
            },
            {
                value: '123asd',
                type: __1.VALUE_TYPES.NUMBER,
                expect: NaN,
            },
            {
                value: '12.3',
                type: __1.VALUE_TYPES.FLOAT,
                expect: 12.3,
            },
            {
                value: '12.3sdfdsds',
                type: __1.VALUE_TYPES.FLOAT,
                expect: NaN,
            },
            {
                value: '12.3',
                type: __1.VALUE_TYPES.DECIMAL,
                expect: 12.3,
            },
            {
                value: '12.3sdfdsds',
                type: __1.VALUE_TYPES.DECIMAL,
                expect: NaN,
            },
            {
                value: 'true',
                type: __1.VALUE_TYPES.BOOLEAN,
                expect: true,
            },
            {
                value: 'false',
                type: __1.VALUE_TYPES.BOOLEAN,
                expect: false,
            },
            {
                value: 'blah',
                type: __1.VALUE_TYPES.BOOLEAN,
                expect: false,
            },
        ];
        toTest.forEach(function (test) {
            expect(__1.converStringToValue(test.value, test.type)).toEqual(test.expect);
        });
    });
});

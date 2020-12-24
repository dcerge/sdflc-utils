"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
test('Arrays: arrayToObject', function () {
    var src = [
        { name: 'status', value: 'active' },
        { name: 'name', value: 'Some name' },
    ];
    var dst = {
        status: 'active',
        name: 'Some name',
    };
    expect(__1.arrayToObject(src, 'name', 'value')).toEqual(dst);
    expect(__1.arrayToObject([], 'name', 'value')).toEqual({});
});
test('Arrays: arrToUpperCase', function () {
    var src = ['abc', 'def1'];
    var dst = ['ABC', 'DEF1'];
    expect(__1.arrToUpperCase(src)).toEqual(dst);
    expect(__1.arrToUpperCase([])).toEqual([]);
});
test('Arrays: arrToLowerCase', function () {
    var src = ['ABC', 'DeF1'];
    var dst = ['abc', 'def1'];
    expect(__1.arrToLowerCase(src)).toEqual(dst);
    expect(__1.arrToLowerCase([])).toEqual([]);
});

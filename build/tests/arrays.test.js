"use strict";
var _a = require('../'), arrayToObject = _a.arrayToObject, arrToChunks = _a.arrToChunks, arrToUpperCase = _a.arrToUpperCase;
test('Arrays: arrayToObject', function () {
    var src = [
        { name: 'status', value: 'active' },
        { name: 'name', value: 'Some name' }
    ];
    var dst = {
        status: 'active',
        name: 'Some name'
    };
    expect(arrayToObject(src, 'name', 'value')).toEqual(dst);
    expect(arrayToObject([], 'name', 'value')).toEqual({});
});
test('Arrays: arrToChunks', function () {
    var src = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var dst = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];
    expect(arrToChunks(src, 3)).toEqual(dst);
    expect(arrToChunks([], 3)).toEqual([]);
});
test('Arrays: arrToUpperCase', function () {
    var src = ['abc', 'def1'];
    var dst = ['ABC', 'DEF1'];
    expect(arrToUpperCase(src, 3)).toEqual(dst);
    expect(arrToUpperCase([], 3)).toEqual([]);
});

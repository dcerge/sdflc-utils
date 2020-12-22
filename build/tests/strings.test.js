"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./../constants");
var _a = require('../'), doesValueMatchAlphabet = _a.doesValueMatchAlphabet, isLengthBetween = _a.isLengthBetween, areStringsEqual = _a.areStringsEqual, replaceAt = _a.replaceAt, insertAt = _a.insertAt, truncateToLength = _a.truncateToLength;
test('Strings: doesValueMatchAlphabet', function () {
    expect(doesValueMatchAlphabet('password', constants_1.ALPHABET)).toEqual(true);
    expect(doesValueMatchAlphabet('password', '0123456789')).toEqual(false);
});
test('Strings: isLengthBetween', function () {
    expect(isLengthBetween('password', 1, 15)).toEqual(true);
    expect(isLengthBetween('password', 10, 15)).toEqual(false);
    expect(isLengthBetween('password', 1, 5)).toEqual(false);
});
test('Strings: areStringsEqual', function () {
    expect(areStringsEqual('password', 'PASSWORD')).toEqual(true);
    expect(areStringsEqual('password', 'PASSWORD1')).toEqual(false);
});
test('Strings: replaceAt', function () {
    expect(replaceAt('password', 4, '*****')).toEqual('pass*****');
    expect(replaceAt('password', 10, '**')).toEqual('password');
});
test('Strings: truncateToLength', function () {
    expect(truncateToLength('password', 4)).toEqual('pass');
    expect(truncateToLength('password', 10)).toEqual('password');
    expect(truncateToLength('', 10)).toEqual('');
});
test('Strings: insertAt', function () {
    expect(insertAt('password', 4, '****')).toEqual('pass****word');
    expect(insertAt('password', 10, '**')).toEqual('password');
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./../constants");
var index_1 = require("../index");
describe('Strings tests', function () {
    test('Strings: doesValueMatchAlphabet', function () {
        expect(index_1.doesValueMatchAlphabet('password', constants_1.ALPHABET)).toEqual(true);
        expect(index_1.doesValueMatchAlphabet('password', '0123456789')).toEqual(false);
    });
    test('Strings: isLengthBetween', function () {
        expect(index_1.isLengthBetween('password', 1, 15)).toEqual(true);
        expect(index_1.isLengthBetween('password', 10, 15)).toEqual(false);
        expect(index_1.isLengthBetween('password', 1, 5)).toEqual(false);
    });
    test('Strings: areStringsEqual', function () {
        expect(index_1.areStringsEqual('password', 'PASSWORD')).toEqual(true);
        expect(index_1.areStringsEqual('password', 'PASSWORD1')).toEqual(false);
    });
    test('Strings: replaceAt', function () {
        expect(index_1.replaceAt('password', 4, '*****')).toEqual('pass*****');
        expect(index_1.replaceAt('password', 10, '**')).toEqual('password');
    });
    test('Strings: insertAt', function () {
        expect(index_1.insertAt('password', 4, '****')).toEqual('pass****word');
        expect(index_1.insertAt('password', 10, '**')).toEqual('password');
    });
    test('Strings: randomString', function () {
        var str = index_1.randomString(16, 'ABCDEF0123456789');
        expect(str).toHaveLength(16);
    });
});

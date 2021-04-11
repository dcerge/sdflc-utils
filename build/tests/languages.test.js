"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
describe('Language tests', function () {
    test('Languages: extractLanguages', function () {
        var src = 'en,en-US;q=0.9,ru;q=0.8';
        var dst = ['en', 'en-US', 'ru'];
        expect(__1.extractLanguages(src)).toEqual(dst);
        expect(__1.extractLanguages('')).toEqual([]);
    });
});

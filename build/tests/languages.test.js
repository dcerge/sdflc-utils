"use strict";
var extractLanguages = require('../').extractLanguages;
test('Languages: extractLanguages', function () {
    var src = 'en,en-US;q=0.9,ru;q=0.8';
    var dst = ['en', 'en-US', 'ru'];
    expect(extractLanguages(src)).toEqual(dst);
    expect(extractLanguages(null)).toEqual([]);
});

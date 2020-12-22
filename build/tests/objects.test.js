"use strict";
var setNullOnEmptyString = require('../').setNullOnEmptyString;
test('Objects: setNullOnEmptyString', function () {
    var src = {
        firstName: 'John',
        lastName: ''
    };
    var dst = {
        firstName: 'John',
        lastName: null
    };
    expect(setNullOnEmptyString(src)).toEqual(dst);
    expect(setNullOnEmptyString(null)).toEqual({});
});

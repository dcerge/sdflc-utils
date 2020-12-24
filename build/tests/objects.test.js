"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
test('Objects: setNullOnEmptyString', function () {
    var src = {
        firstName: 'John',
        lastName: '',
    };
    var dst = {
        firstName: 'John',
        lastName: null,
    };
    expect(__1.setNullOnEmptyString(src)).toEqual(dst);
    expect(__1.setNullOnEmptyString(null)).toEqual({});
});

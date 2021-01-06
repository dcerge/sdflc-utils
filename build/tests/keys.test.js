"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
test('Keys: camelKeys', function () {
    expect(__1.camelKeys({ 'camel-case': 'value' })).toEqual({ camelCase: 'value' });
    expect(__1.camelKeys([{ 'camel-case': 'value' }, { 'camel-case': 'value' }])).toEqual([
        { camelCase: 'value' },
        { camelCase: 'value' },
    ]);
});
test('Keys: camelResponse', function () {
    expect(__1.camelResponse({ 'camel-case': 'value' })).toEqual({ camelCase: 'value' });
    expect(__1.camelResponse([{ 'camel-case': 'value' }, { 'camel-case': 'value' }])).toEqual([
        { camelCase: 'value' },
        { camelCase: 'value' },
    ]);
});
test('Keys: buildKey', function () {
    expect(__1.buildKey('PassWORD')).toEqual('password');
    expect(__1.buildKey(['Password', 'ABC'])).toEqual('password-abc');
    expect(__1.buildKey('One Two Three!')).toEqual('one-two-three');
    expect(__1.buildKey(123)).toEqual('123');
});
test('Keys: buildKeys', function () {
    expect(__1.buildKeys(['PassWORD', 'ABC'])).toEqual(['password', 'abc']);
    expect(__1.buildKeys(['PassWORD', ['ABC', '123']])).toEqual(['password', 'abc-123']);
});
test('Keys: slug', function () {
    expect(__1.slug('some/path/to/page.html')).toEqual('some-path-to-page-html');
    expect(__1.slug('some!value@email.com')).toEqual('some-value-email-com');
    expect(__1.slug('some   value to slugify!!!')).toEqual('some-value-to-slugify');
});

"use strict";
var _a = require('../'), camelKeys = _a.camelKeys, camelResponse = _a.camelResponse, buildKey = _a.buildKey, buildKeys = _a.buildKeys, slug = _a.slug;
test('Keys: camelKeys', function () {
    expect(camelKeys({ 'camel-case': 'value' })).toEqual({ camelCase: 'value' });
    expect(camelKeys([{ 'camel-case': 'value' }, { 'camel-case': 'value' }])).toEqual([{ camelCase: 'value' }, { camelCase: 'value' }]);
});
test('Keys: camelResponse', function () {
    expect(camelResponse({ 'camel-case': 'value' })).toEqual({ camelCase: 'value' });
    expect(camelResponse([{ 'camel-case': 'value' }, { 'camel-case': 'value' }])).toEqual([{ camelCase: 'value' }, { camelCase: 'value' }]);
});
test('Keys: buildKey', function () {
    expect(buildKey('password')).toEqual('PASSWORD');
    expect(buildKey(['password', 'abc'])).toEqual('PASSWORD-ABC');
    expect(buildKey(123)).toEqual('123');
});
test('Keys: buildKeys', function () {
    expect(buildKeys(['password', 'abc'])).toEqual(['PASSWORD', 'ABC']);
    expect(buildKeys(['password', ['abc', '123']])).toEqual(['PASSWORD', 'ABC-123']);
});
test('Keys: slug', function () {
    expect(slug('some/path/to/page.html', 4)).toEqual('some-path-to-page-html');
    expect(slug('some!value@email.com', 4)).toEqual('some-value-email-com');
    expect(slug('some   value to slugify!!!', 4)).toEqual('some-value-to-slugify');
});

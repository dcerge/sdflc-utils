const { camelKeys, camelResponse, buildKey, buildKeys, slug } = require('../');

test('Keys: camelKeys', () => {
  expect(camelKeys({ 'camel-case': 'value' })).toEqual({ camelCase: 'value' });
  expect(camelKeys([{ 'camel-case': 'value' }, { 'camel-case': 'value' }])).toEqual([{ camelCase: 'value' }, { camelCase: 'value' }]);
});

test('Keys: camelResponse', () => {
  expect(camelResponse({ 'camel-case': 'value' })).toEqual({ camelCase: 'value' });
  expect(camelResponse([{ 'camel-case': 'value' }, { 'camel-case': 'value' }])).toEqual([{ camelCase: 'value' }, { camelCase: 'value' }]);
});

test('Keys: buildKey', () => {
  expect(buildKey('password')).toEqual('PASSWORD');
  expect(buildKey(['password', 'abc'])).toEqual('PASSWORD-ABC');
  expect(buildKey(123)).toEqual('123');
});

test('Keys: buildKeys', () => {
  expect(buildKeys(['password', 'abc'])).toEqual(['PASSWORD','ABC']);
  expect(buildKeys(['password', ['abc', '123']])).toEqual(['PASSWORD', 'ABC-123']);
});

test('Keys: slug', () => {
  expect(slug('some/path/to/page.html', 4)).toEqual('some-path-to-page-html');
  expect(slug('some!value@email.com', 4)).toEqual('some-value-email-com');
  expect(slug('some   value to slugify!!!', 4)).toEqual('some-value-to-slugify');
});
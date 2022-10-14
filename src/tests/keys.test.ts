import { camelKeys, camelResponse, buildKey, buildKeys, isIdEmpty, slug, pascalCase, pascalCases } from '../';

describe('Keys tests', () => {
  test('Keys: camelKeys', () => {
    expect(camelKeys({ 'camel-case': 'value' })).toEqual({ camelCase: 'value' });
    expect(camelKeys([{ 'camel-case': 'value' }, { 'camel-case': 'value' }])).toEqual([
      { camelCase: 'value' },
      { camelCase: 'value' },
    ]);
  });

  test('Keys: camelResponse', () => {
    expect(camelResponse({ 'camel-case': 'value' })).toEqual({ camelCase: 'value' });
    expect(camelResponse([{ 'camel-case': 'value' }, { 'camel-case': 'value' }])).toEqual([
      { camelCase: 'value' },
      { camelCase: 'value' },
    ]);
  });

  test('Keys: buildKey', () => {
    expect(buildKey('PassWORD')).toEqual('password');
    expect(buildKey(['Password', 'ABC'])).toEqual('password-abc');
    expect(buildKey('One Two Three!')).toEqual('one-two-three');
    expect(buildKey(123)).toEqual('123');
  });

  test('Keys: buildKeys', () => {
    expect(buildKeys(['PassWORD', 'ABC'])).toEqual(['password', 'abc']);
    expect(buildKeys(['PassWORD', ['ABC', '123']])).toEqual(['password', 'abc-123']);
  });

  test('Keys: isIdEmpty', () => {
    expect(isIdEmpty(null)).toEqual(true);
    expect(isIdEmpty(undefined)).toEqual(true);
    expect(isIdEmpty('')).toEqual(true);
    expect(isIdEmpty('0')).toEqual(true);
    expect(isIdEmpty('00000000-0000-4000-9000-000000000000')).toEqual(true);
    expect(isIdEmpty(0)).toEqual(true);
    expect(isIdEmpty(1)).toEqual(false);
    expect(isIdEmpty('1')).toEqual(false);
  });

  test('Keys: slug', () => {
    expect(slug('some/path/to/page.html')).toEqual('some-path-to-page-html');
    expect(slug('some!value@email.com')).toEqual('some-value-email-com');
    expect(slug('some   value to slugify!!!')).toEqual('some-value-to-slugify');
  });

  test('Keys: pascalCase', () => {
    expect(pascalCase('pascal_case')).toEqual('PascalCase');
    expect(pascalCase('pascal case')).toEqual('PascalCase');
    expect(pascalCase('pascalCase')).toEqual('PascalCase');
  });

  test('Keys: pascalCases', () => {
    expect(
      pascalCases({
        src: {
          snake_case: 'snake_case',
          camelCase: 'camelCase',
        },
      }),
    ).toEqual({
      SnakeCase: 'snake_case',
      CamelCase: 'camelCase',
    });

    expect(
      pascalCases({
        src: [
          {
            snake_case: 'snake_case',
            camelCase: 'camelCase',
          },
        ],
      }),
    ).toEqual([
      {
        SnakeCase: 'snake_case',
        CamelCase: 'camelCase',
      },
    ]);

    expect(
      pascalCases({
        src: {
          props: [
            {
              snake_case: 'snake_case',
              camelCase: 'camelCase',
            },
          ],
        },
      }),
    ).toEqual({
      Props: [
        {
          SnakeCase: 'snake_case',
          CamelCase: 'camelCase',
        },
      ],
    });
  });
});

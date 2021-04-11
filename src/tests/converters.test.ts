import { converStringToValue, VALUE_TYPES } from '../';

describe('Converters tets', () => {
  test('Converters: converStringToValue', () => {
    const toTest = [
      {
        value: 'string1',
        type: VALUE_TYPES.STRING,
        expect: 'string1',
      },
      {
        value: '123',
        type: VALUE_TYPES.INTEGER,
        expect: 123,
      },
      {
        value: '123asd',
        type: VALUE_TYPES.INTEGER,
        expect: NaN,
      },
      {
        value: '123',
        type: VALUE_TYPES.NUMBER,
        expect: 123,
      },
      {
        value: '123asd',
        type: VALUE_TYPES.NUMBER,
        expect: NaN,
      },
      {
        value: '12.3',
        type: VALUE_TYPES.FLOAT,
        expect: 12.3,
      },
      {
        value: '12.3sdfdsds',
        type: VALUE_TYPES.FLOAT,
        expect: NaN,
      },
      {
        value: '12.3',
        type: VALUE_TYPES.DECIMAL,
        expect: 12.3,
      },
      {
        value: '12.3sdfdsds',
        type: VALUE_TYPES.DECIMAL,
        expect: NaN,
      },
      {
        value: 'true',
        type: VALUE_TYPES.BOOLEAN,
        expect: true,
      },
      {
        value: 'false',
        type: VALUE_TYPES.BOOLEAN,
        expect: false,
      },
      {
        value: 'blah',
        type: VALUE_TYPES.BOOLEAN,
        expect: false,
      },
    ];

    toTest.forEach((test) => {
      expect(converStringToValue(test.value, test.type)).toEqual(test.expect);
    });
  });
});

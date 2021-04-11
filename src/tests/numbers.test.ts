import { roundNumberValue, roundNumberValues } from '../';

describe('Numbers tests', () => {
  test('Round a number to 2 decimals digits', () => {
    const value = 34.567;

    expect(roundNumberValue(value)).toEqual(34.57);
  });

  test('Round a number to 3 decimals digits', () => {
    const value = 34.5674;

    expect(roundNumberValue(value, 3)).toEqual(34.567);
  });

  test('Round an array of numbers', () => {
    const values = [34.567, 2.456, 7.233];

    expect(roundNumberValues(values)).toEqual([34.57, 2.46, 7.23]);
  });

  test('Round an array of objects', () => {
    const inValues = [
      { a: 34.567, b: 'a' },
      { a: 2.456, b: 'a' },
      { a: 7.233, b: 'a' },
    ];
    const outValues = [
      { a: 34.57, b: 'a' },
      { a: 2.46, b: 'a' },
      { a: 7.23, b: 'a' },
    ];

    expect(roundNumberValues(inValues)).toEqual(outValues);
  });
});

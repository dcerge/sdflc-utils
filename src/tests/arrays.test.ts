import { arrayToObject, arrToUpperCase, arrToLowerCase } from '../';

describe('Array tests', () => {
  test('Arrays: arrayToObject', () => {
    const src = [
      { name: 'status', value: 'active' },
      { name: 'name', value: 'Some name' },
    ];

    const dst = {
      status: 'active',
      name: 'Some name',
    };

    expect(arrayToObject(src, 'name', 'value')).toEqual(dst);
    expect(arrayToObject([], 'name', 'value')).toEqual({});
  });

  test('Arrays: arrToUpperCase', () => {
    const src = ['abc', 'def1'];
    const dst = ['ABC', 'DEF1'];

    expect(arrToUpperCase(src)).toEqual(dst);
    expect(arrToUpperCase([])).toEqual([]);
  });

  test('Arrays: arrToLowerCase', () => {
    const src = ['ABC', 'DeF1'];
    const dst = ['abc', 'def1'];

    expect(arrToLowerCase(src)).toEqual(dst);
    expect(arrToLowerCase([])).toEqual([]);
  });
});

import { arrayToObject, arrToUpperCase, arrToLowerCase, arrToChunks } from '../';

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

  test('Arrays: arrToChunks', () => {
    const src = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const dst3 = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [0]];
    const dst5 = [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 0],
    ];

    expect(arrToChunks(src, 3)).toEqual(dst3);
    expect(arrToChunks(src, 5)).toEqual(dst5);
    expect(arrToChunks(src, 0)).toEqual(src);
    expect(arrToChunks([], 3)).toEqual([]);
  });
});

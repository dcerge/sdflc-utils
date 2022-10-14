import { setNullOnEmptyString, compactObject } from '../';

describe('Objects tests', () => {
  test('Objects: setNullOnEmptyString', () => {
    const src = {
      firstName: 'John',
      lastName: '',
    };

    const dst = {
      firstName: 'John',
      lastName: null,
    };

    expect(setNullOnEmptyString(src)).toEqual(dst);
    expect(setNullOnEmptyString(null)).toEqual({});
  });
});

describe('Objects tests', () => {
  test('Objects: compactObject', () => {
    const src = {
      firstName: 'John',
      lastName: '',
      birthday: null,
      obj: {
        propA: 'A',
        propB: null,
      },
    };

    const dst = {
      firstName: 'John',
      lastName: '',
      obj: {
        propA: 'A',
      },
    };

    expect(compactObject(src)).toEqual(dst);
    expect(compactObject([src])).toEqual([dst]);
    expect(compactObject(null)).toEqual(null);
    expect(compactObject('test')).toEqual('test');
    expect(compactObject(5)).toEqual(5);
  });
});

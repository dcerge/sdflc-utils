import { setNullOnEmptyString } from '../';

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

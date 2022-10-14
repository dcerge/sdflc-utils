import { buildURLSearchParams } from '../';

describe('URL Params tests', () => {
  test('buildURLSearchParams', () => {
    const src = {
      fieldA: 'A',
      fieldB: [
        {
          arrA: '1',
          arrB: '2',
          arrC: {
            subA: '100',
          },
        },
      ],
    };

    const dst = 'fieldA=A&fieldB%5B0%5D.arrA=1&fieldB%5B0%5D.arrB=2&fieldB%5B0%5D.arrC.subA=100';

    expect(buildURLSearchParams(src).toString()).toEqual(dst);
  });
});

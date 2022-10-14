import { calcDistance } from '../';

describe('Geo Helpers tests', () => {
  test('Geo Helpers tests: calcDistance', () => {
    const position1 = {
      latitude: 50.947718,
      longitude: -114.123893,
    };
    const position2 = {
      latitude: 50.947745,
      longitude: -115.121994,
    };
    const dst = 69.92246849130429;

    expect(calcDistance({ position1, position2 })).toEqual(dst);
  });
});

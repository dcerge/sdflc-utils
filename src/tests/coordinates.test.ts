const { buildCoordinatesStr, extractLatitueLongitude, buildCoordinates } = require('../');

test('Coordinates: buildCoordinatesStr', () => {
  expect(buildCoordinatesStr({ longitude: '123', latitude: '456' })).toEqual('456,123');
  expect(buildCoordinatesStr({ longitude: '123' })).toEqual(undefined);
});

test('Coordinates: extractLatitueLongitude', () => {
  expect(extractLatitueLongitude('123,456')).toEqual({ longitude: '456', latitude: '123' });
  expect(extractLatitueLongitude('123')).toEqual({ longitude: undefined, latitude: '123' });
});

test('Coordinates: buildCoordinates', () => {
  const query = {
    latitude: '123',
    longitude: '456',
    altitude: '789',
    accuracy: 30,
    altitudeAccuracy: 100,
    heading: 'SW',
    speed: 5,
    coordinatesCode: 0
  };

  const coord = {
    coordinates: '123,456',
    coordinatesCode: 0,
    coordinatesExtra: JSON.stringify({
      latitude: '123',
      longitude: '456',
      altitude: '789',
      accuracy: 30,
      altitudeAccuracy: 100,
      heading: 'SW',
      speed: 5
    })
  };

  expect(buildCoordinates(query)).toEqual(coord);
});

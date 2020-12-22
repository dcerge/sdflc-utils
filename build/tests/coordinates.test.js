"use strict";
var _a = require('../'), buildCoordinatesStr = _a.buildCoordinatesStr, extractLatitueLongitude = _a.extractLatitueLongitude, buildCoordinates = _a.buildCoordinates;
test('Coordinates: buildCoordinatesStr', function () {
    expect(buildCoordinatesStr({ longitude: '123', latitude: '456' })).toEqual('456,123');
    expect(buildCoordinatesStr({ longitude: '123' })).toEqual(undefined);
});
test('Coordinates: extractLatitueLongitude', function () {
    expect(extractLatitueLongitude('123,456')).toEqual({ longitude: '456', latitude: '123' });
    expect(extractLatitueLongitude('123')).toEqual({ longitude: undefined, latitude: '123' });
});
test('Coordinates: buildCoordinates', function () {
    var query = {
        latitude: '123',
        longitude: '456',
        altitude: '789',
        accuracy: 30,
        altitudeAccuracy: 100,
        heading: 'SW',
        speed: 5,
        coordinatesCode: 0
    };
    var coord = {
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../");
test('Coordinates: buildCoordinatesStr', function () {
    expect(__1.buildCoordinatesStr({ longitude: '123', latitude: '456' })).toEqual('456,123');
    expect(__1.buildCoordinatesStr({ longitude: '123' })).toEqual(undefined);
});
test('Coordinates: extractLatitueLongitude', function () {
    expect(__1.extractLatitueLongitude('123,456')).toEqual({ longitude: '456', latitude: '123' });
    expect(__1.extractLatitueLongitude('123')).toEqual({ longitude: undefined, latitude: '123' });
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
        coordinatesCode: 0,
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
            speed: 5,
        }),
    };
    expect(__1.buildCoordinates(query)).toEqual(coord);
});

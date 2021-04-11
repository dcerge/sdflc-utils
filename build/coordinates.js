"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coordinatesParamNames = exports.buildCoordinates = exports.extractLatitueLongitude = exports.buildCoordinatesStr = void 0;
/**
 * Creates a string with latitude and longitude taken from provided object.
 * @param {object} obj an object that has latitude and longitude properties.
 * @returns {string} string formatted as `latitude,longitude`
 */
var buildCoordinatesStr = function (obj) {
    var _a = obj || {}, latitude = _a.latitude, longitude = _a.longitude;
    return latitude && longitude ? latitude + "," + longitude : undefined;
};
exports.buildCoordinatesStr = buildCoordinatesStr;
/**
 * Creates an object from a string formatted as `latitude,longitude`.
 * @param {string} coordinatesStr a tring that has longitude and latitude separated by comma.
 */
var extractLatitueLongitude = function (coordinatesStr) {
    var _a = (coordinatesStr || '').split(','), latitude = _a[0], longitude = _a[1];
    return {
        latitude: latitude,
        longitude: longitude,
    };
};
exports.extractLatitueLongitude = extractLatitueLongitude;
/**
 * Builds an object with coordinates taken from provided object.
 * @param {any} query a source object that contains necessary information.
 */
var buildCoordinates = function (query) {
    return {
        coordinates: exports.buildCoordinatesStr(query),
        coordinatesCode: query.coordinatesCode === undefined ? undefined : Number(query.coordinatesCode) || 0,
        coordinatesExtra: JSON.stringify({
            latitude: query.latitude,
            longitude: query.longitude,
            altitude: query.altitude,
            accuracy: query.accuracy,
            altitudeAccuracy: query.altitudeAccuracy,
            heading: query.heading,
            speed: query.speed,
        }),
    };
};
exports.buildCoordinates = buildCoordinates;
/**
 * Returns an array of property names needed for coordinates object.
 */
var coordinatesParamNames = function () {
    return ['latitude', 'longitude', 'altitude', 'accuracy', 'altitudeAccuracy', 'heading', 'speed', 'coordinatesCode'];
};
exports.coordinatesParamNames = coordinatesParamNames;

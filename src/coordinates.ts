/**
 * Creates a string with latitude and longitude taken from provided object.
 * @param {object} obj an object that has latitude and longitude properties.
 * @returns {string} string formatted as `latitude,longitude`
 */
export const buildCoordinatesStr = (obj: any): string | undefined => {
  const { latitude, longitude } = obj || {};
  return latitude && longitude ? `${latitude},${longitude}` : undefined;
};

/**
 * Creates an object from a string formatted as `latitude,longitude`.
 * @param {string} coordinatesStr a tring that has longitude and latitude separated by comma.
 */
export const extractLatitueLongitude = (coordinatesStr: string) => {
  const [latitude, longitude] = (coordinatesStr || '').split(',');
  return {
    latitude,
    longitude,
  };
};

/**
 * Builds an object with coordinates taken from provided object.
 * @param {any} query a source object that contains necessary information.
 */
export const buildCoordinates = (query: any) => {
  return {
    coordinates: buildCoordinatesStr(query),
    coordinatesCode: query.coordinatesCode === undefined ? undefined : Number(query.coordinatesCode) || 0,
    coordinatesExtra: JSON.stringify({
      latitude: query.latitude,
      longitude: query.longitude,
      altitude: query.altitude,
      accuracy: query.accuracy,
      altitudeAccuracy: query.altitudeAccuracy,
      heading: query.heading,
      speed: query.speed,
    })
  };
};

/**
 * Returns an array of property names needed for coordinates object.
 */
export const coordinatesParamNames = () => {
  return ['latitude', 'longitude', 'altitude', 'accuracy', 'altitudeAccuracy', 'heading', 'speed', 'coordinatesCode'];
};

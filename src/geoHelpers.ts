import { CalcDistanceArgs } from './interfaces';

export const calcDistance = (args: CalcDistanceArgs) => {
  const { position1, position2 } = args || {};

  if (!position1) {
    console.warn(
      `The 'calcDistance' expected the 'position1' to be an object { latitude, longitude } but got:`,
      position1,
    );
    return 0;
  }

  if (!position2) {
    console.warn(
      `The 'calcDistance' expected the 'position2' to be an object { latitude, longitude } but got:`,
      position2,
    );
    return 0;
  }

  // The math module contains a function named toRadians which converts from degrees to radians.
  const longitude1 = (position1.longitude * Math.PI) / 180;
  const longitude2 = (position2.longitude * Math.PI) / 180;
  const latitude1 = (position1.latitude * Math.PI) / 180;
  const latitude2 = (position2.latitude * Math.PI) / 180;

  // Haversine formula
  const dLongitude = longitude2 - longitude1;
  const dLatitude = latitude2 - latitude1;
  const a =
    Math.pow(Math.sin(dLatitude / 2), 2) +
    Math.cos(latitude1) * Math.cos(latitude2) * Math.pow(Math.sin(dLongitude / 2), 2);

  const c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956 for miles
  const earthRadius = 6371;

  // calculate the result
  return c * earthRadius;
};

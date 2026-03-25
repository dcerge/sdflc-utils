// ./src/interfaces/coordinatesInterfaces.ts

export interface GeoCoords {
  latitude: number;
  longitude: number;
}

export interface CalcDistanceArgs {
  position1: GeoCoords;
  position2: GeoCoords;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

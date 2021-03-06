import { resolveEstablishments } from "./geocoding";
import to from "await-to-js";

/**
 * configuration for near functions of both Scrambler and ScramblerAsync
 */
const minNear: number = 10;
const maxNear: number = 100;

/**
 * constant Earth radius
 */
const earthRadius: number = 6.3781e6;

/**
 * Returns a point within a specified distance from the initial point
 * @name Location
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {any|undefined} data - string query object for geocoding
 */
export class Location {
  0: number;
  1: number;
  x: number;
  y: number;
  data: any;
  constructor(x: number, y: number, data: any | undefined) {
    this[0] = x;
    this[1] = y;
    this.x = x;
    this.y = y;
    this.data = data;
  }
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 *
 * @export
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive)

 * @export
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/**
 * Normalizes distances based on unit
 *
 * @name normalizeDistance
 * @param {number} distance - distance from given initial point
 * @param {string} unit - distance unit
 * @returns {number} returns distance normalized to meters
 */
export function normalizeDistance(distance: number, unit: string): number {
  switch (unit) {
    case "mm":
      distance = distance * 0.001;
      break;
    case "cm":
      distance = distance * 0.01;
      break;
    case "m":
      distance = distance;
      break;
    case "dm":
      distance = distance * 10;
      break;
    case "km":
      distance = distance * 1000;
      break;
  }
  return distance;
}

/**
 * Returns a point within a specified distance from the initial locaton
 *
 * @export
 * @param {Location} location - initial location
 * @param {number} distance - radius to randomize within
 * @param {string} unit - unit of the distance
 * @returns {Location} returns location object
 */
export function within(
  location: Location,
  distance: number,
  unit: string
): Location {
  distance = normalizeDistance(distance, unit);
  return new Location(
    location.x +
      (Math.random() >= 0.5 ? -1 : 1) *
        (distance / earthRadius) *
        (180 / Math.PI),
    location.y +
      ((Math.random() >= 0.5 ? -1 : 1) *
        ((distance / earthRadius) * (180 / Math.PI))) /
        Math.cos((location.x * Math.PI) / 180),
    null
  );
}

/**
 * Returns a point near the initial location
 * @name near
 * @param {Location} location - initial location
 * @returns {Location} returns location object
 */
export function near(location: Location): Location {
  let distance = normalizeDistance(getRandomArbitrary(minNear, maxNear), "m");
  return new Location(
    location.x +
      (Math.random() >= 0.5 ? -1 : 1) *
        (distance / earthRadius) *
        (180 / Math.PI),
    location.y +
      ((Math.random() >= 0.5 ? -1 : 1) *
        ((distance / earthRadius) * (180 / Math.PI))) /
        Math.cos((location.x * Math.PI) / 180),
    null
  );
}

/**
 * Returns a point near the initial location
 * @name near
 * @param {Location} location - initial location
 * @returns {Promise<Location>} returns location object
 */
export async function nearbyEstablishment(
  location: Location
): Promise<Location> {
  let [err, data] = await to(
    resolveEstablishments(`${location.x},${location.y}`)
  );

  if (err) {
    throw err;
  }

  return new Location(
    data.resourceSets[0].resources[0].businessesAtLocation[
      getRandomInt(0, 5)
    ].businessAddress.latitude,
    data.resourceSets[0].resources[0].businessesAtLocation[
      getRandomInt(0, 5)
    ].businessAddress.longitude,
    null
  );
}

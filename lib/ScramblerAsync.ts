import * as geocoding from "./geocoding";
import { Location, near, within, nearbyEstablishment } from "./utils";
import to from "await-to-js";

/**
 * @class: gps-scramble geocode-enabled asynchronous class object.
 * @param {string | object} location - A string loaction name OR coordinate array [2]
 */
export class ScramblerAsync {
  initial: Location;

  constructor(location: string | Array<number>) {
    if (typeof location === "string") {
      // using geocoding
      this.initial = new Location(-1, -1, location);
    } else if (typeof location === "object" && location.length === 2) {
      this.initial = new Location(location[0], location[1], null);
    } else {
      throw "Incorrect initial location type.";
    }
  }

  /**
   * Initializes ScramblerAsync, if an initial coordinate fetch is required (when constructed with a query string)
   *
   * @memberof ScramblerAsync
   */
  public async init() {
    // resolve location first
    let [err, data] = await to(geocoding.resolveLocation(this.initial.data));
    if (err) {
      throw err;
    }

    if (!data.resourceSets[0].resources.length) {
      throw "Could not resolve nearby establishments: no results.";
    }

    this.initial = new Location(
      data.resourceSets[0].resources[0].geocodePoints[0].coordinates[0],
      data.resourceSets[0].resources[0].geocodePoints[0].coordinates[1],
      null
    );
  }

  /**
   * Getter for the X coordinate
   *
   * @readonly
   * @memberof ScramblerAsync
   */
  get x() {
    return this.initial.x;
  }
  /**
   * Getter for the Y coordinate
   *
   * @readonly
   * @memberof ScramblerAsync
   */
  get y() {
    return this.initial.y;
  }
  /**
   * Alternative getter for the X coordinate
   *
   * @readonly
   * @memberof ScramblerAsync
   */
  get 0() {
    return this.initial.x;
  }
  /**
   * Alternative getter for the Y coordinate
   *
   * @readonly
   * @memberof ScramblerAsync
   */
  get 1() {
    return this.initial.y;
  }

  /**
   * Returns a point near the initial point
   * @name near
   * @returns {Promise<Location>} returns promise-wrapped location object
   * @memberof ScramblerAsync
   */
  public near(): Promise<Location> {
    return new Promise(async (res, rej) => {
      // initializing if not initialized
      if (this.initial.x === -1) {
        await this.init();
      }
      // resolving with adjusted coords
      return res(near(this.initial));
    });
  }

  /**
   * Returns the location of a business near the initial point
   * @name nearbyEstablishment
   * @returns {Promise<Location>} returns promise-wrapped location object
   */
  public nearbyEstablishment(): Promise<Location> {
    return new Promise(async (res, rej) => {
      // initializing if not initialized
      if (this.initial.x === -1) {
        let [err] = await to(this.init());
        if (err) {
          return rej(err);
        }
      }
      // resolving with adjusted coords
      return res(nearbyEstablishment(this.initial));
    });
  }

  /**
   * Returns a point within a specified distance from the initial point
   * @name within
   * @param {number} distance - distance from given initial point
   * @param {string} unit - distance unit
   * @returns {Promise<Location>} returns promise-wrapped location object
   */
  public within(distance: number, unit: string): Promise<Location> {
    return new Promise(async (res, rej) => {
      // initializing if not initialized
      if (this.initial.x === -1) {
        await this.init();
      }
      return res(within(this.initial, distance, unit));
    });
  }
}

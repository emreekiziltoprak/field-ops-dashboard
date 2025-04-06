// src/service/unitSimulation/HaversinePositionCalculator.ts
import { IPositionCalculator } from "./IPositionCalculator";

export class HaversinePositionCalculator implements IPositionCalculator {
  // Earth radius in kilometers
  private readonly EARTH_RADIUS = 6371;

  /**
   * Calculate a new position based on current position, speed, and course
   * @param lat Current latitude in degrees
   * @param lng Current longitude in degrees
   * @param speed Speed in km/h
   * @param course Course in degrees (0-360, where 0/360 is North, 90 is East, etc.)
   * @param timeInterval Time interval in seconds
   * @returns New coordinates {lat, lng}
   */
  calculateNewPosition(
    lat: number,
    lng: number,
    speed: number,
    course: number,
    timeInterval: number
  ): { lat: number; lng: number } {
    // Convert degrees to radians
    const latRad = this.toRadians(lat);
    const lngRad = this.toRadians(lng);
    const courseRad = this.toRadians(course);

    // Calculate distance traveled during time interval in km
    // speed is in km/h, timeInterval in seconds, so we need to convert
    const distance = (speed * timeInterval) / 3600;

    // Calculate new position using haversine formula
    const angularDistance = distance / this.EARTH_RADIUS;

    // Calculate new latitude
    const newLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(angularDistance) +
        Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(courseRad)
    );

    // Calculate new longitude
    const newLngRad =
      lngRad +
      Math.atan2(
        Math.sin(courseRad) * Math.sin(angularDistance) * Math.cos(latRad),
        Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(newLatRad)
      );

    // Convert back to degrees and normalize
    const newLat = this.toDegrees(newLatRad);
    let newLng = this.toDegrees(newLngRad);

    // Normalize longitude to be between -180 and 180
    newLng = ((newLng + 540) % 360) - 180;

    return {
      lat: newLat,
      lng: newLng
    };
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Convert radians to degrees
   */
  private toDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
  }
}

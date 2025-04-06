// src/service/unitSimulation/IPositionCalculator.ts

export interface IPositionCalculator {
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
  ): { lat: number; lng: number };
}
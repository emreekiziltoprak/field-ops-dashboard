export interface IPositionCalculator {
    calculateNewPosition(
      lat: number,
      lng: number,
      speed: number,
      course: number,
      intervalSec: number
    ): { lat: number; lng: number };
  }
  
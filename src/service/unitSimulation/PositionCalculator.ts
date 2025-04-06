// src/service/PositionCalculator.ts

import { IPositionCalculator } from "./IPositionCalculator";


export class PositionCalculator implements IPositionCalculator {
  calculateNewPosition(
    lat: number,
    lng: number,
    speed: number,
    course: number,
    intervalSec: number
  ): { lat: number; lng: number } {
    const distance = speed * intervalSec; // metre cinsinden mesafe
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;
    const latRad = toRad(lat);
    const lngRad = toRad(lng);
    const bearingRad = toRad(course);
    const R = 6371000; // Earth radius (meters)
    const newLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(distance / R) +
      Math.cos(latRad) * Math.sin(distance / R) * Math.cos(bearingRad)
    );
    const newLngRad =
      lngRad +
      Math.atan2(
        Math.sin(bearingRad) * Math.sin(distance / R) * Math.cos(latRad),
        Math.cos(distance / R) - Math.sin(latRad) * Math.sin(newLatRad)
      );
    return { lat: toDeg(newLatRad), lng: toDeg(newLngRad) };
  }
}

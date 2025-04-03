import { Position, Unit } from '../../types/Unit';
import { IPositionCalculator } from './IPositionCalculator';


export class UnitSimulationService {
  private units: Unit[];
  private intervalId?: number;
  private updateInterval: number;
  private positionCalculator: IPositionCalculator;

  constructor(initialUnits: Unit[], updateInterval: number, positionCalculator: IPositionCalculator) {
    this.units = initialUnits;
    this.updateInterval = updateInterval;
    this.positionCalculator = positionCalculator;
  }

  start(updateCallback: (units: Unit[]) => void): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = window.setInterval(() => {
      this.units = this.units.map((unit) => {
        const { lat, lng } = unit.currentPosition;
        const newCoords = this.positionCalculator.calculateNewPosition(
          lat,
          lng,
          unit.speed,
          unit.course,
          this.updateInterval / 1000
        );
        const newPosition: Position = {
          timestamp: new Date().toISOString(),
          lat: newCoords.lat,
          lng: newCoords.lng,
        };
        return {
          ...unit,
          currentPosition: newPosition,
          positionHistory: [...unit.positionHistory, unit.currentPosition],
        };
      });
      updateCallback(this.units);
    }, this.updateInterval);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  getUnits(): Unit[] {
    return this.units;
  }
}

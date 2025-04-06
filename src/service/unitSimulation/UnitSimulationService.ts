// src/service/unitSimulation/UnitSimulationService.ts
import { Position, Unit } from "../../types/Unit";
import { IPositionCalculator } from "./IPositionCalculator";
import { Color, Viewer, Cartesian3 } from "cesium";

export class UnitSimulationService {

  private units: Unit[];
  private intervalId?: number;
  private updateInterval: number;
  private positionCalculator: IPositionCalculator;
  private polylines: Map<number, any>; // Entity references for each unit
  private trailLength: number; // Maximum number of positions to keep in the trail
  private isPaused: boolean = false;
  private lastUnits: Unit[] = [];
  private _updateCallback: ((units: Unit[]) => void) | null = null;

  constructor(
    initialUnits: Unit[],
    updateInterval: number,
    positionCalculator: IPositionCalculator,
    private viewer: Viewer,
    trailLength: number = 100 // Default trail length
  ) {
    this.units = initialUnits;
    this.updateInterval = updateInterval;
    this.positionCalculator = positionCalculator;
    this.polylines = new Map();
    this.trailLength = trailLength;
    
    // Initialize polylines for each unit
    this.initializePolylines();
  }

  /**
   * Initialize polylines for all units
   */
  private initializePolylines(): void {
    this.units.forEach(unit => {
      this.createPolylineForUnit(unit);
    });
  }

  /**
   * Create a polyline entity for a unit
   */
  private createPolylineForUnit(unit: Unit): void {
    // Start with the current position only
    const positions = [
      Cartesian3.fromDegrees(
        unit.currentPosition.lng, 
        unit.currentPosition.lat
      )
    ];

    // Add polyline entity to the viewer
    const polyline = this.viewer.entities.add({
      id: `trail-${unit.id}`,
      polyline: {
        positions: positions,
        width: 2,
        material: this.getUnitColor(unit),
        clampToGround: true
      }
    });

    this.polylines.set(unit.id, polyline);

    console.log("this.polylines",  this.polylines);
  }

  /**
   * Get color based on unit type or other properties
   */
  private getUnitColor(unit: Unit): Color {
    switch(unit.type) {
      case 'friendly':
        return Color.BLUE;
      case 'hostile':
        return Color.RED;
      case 'neutral':
        return Color.YELLOW;
      default:
        return Color.GREEN;
    }
  }

  /**
   * Temporarily pause the simulation
   */
  pause(): void {
    if (this.intervalId && !this.isPaused) {
      // Save current units
      this.lastUnits = [...this.units];
      // Clear the interval but don't remove polylines
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      this.isPaused = true;
      console.log("Simulation paused");
    }
  }

  /**
   * Resume a paused simulation
   */
  resume(): void {
    if (this.isPaused) {
      // Resume simulation with the last known units
      this.units = this.lastUnits;
      this.start(this._updateCallback || (() => {}));
      this.isPaused = false;
      console.log("Simulation resumed");
    }
  }

  /**
   * Start the simulation
   */
  start(updateCallback: (units: Unit[]) => void): void {
    // Store the callback
    this._updateCallback = updateCallback;
    
    if (this.intervalId) {
      this.stop();
    }
    
    this.intervalId = window.setInterval(() => {
      this.units = this.units.map((unit) => {
        const { lat, lng } = unit.currentPosition;
        
        // Calculate new position using the position calculator
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
        
        // Update trail visualization
        this.updateTrail(unit.id, newPosition);

        // Create updated unit with new position and history
        return {
          ...unit,
          currentPosition: newPosition,
          positionHistory: [...unit.positionHistory, unit.currentPosition].slice(-this.trailLength),
        };
      });

      updateCallback(this.units);

    }, this.updateInterval);
  }

  /**
   * Stop the simulation
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

/**
 * Clean up all visualization elements
 */
cleanup(): void {
  this.stop();
  
  // Check if polylines exist and viewer is valid before attempting to clean up
  if (this.polylines && this.polylines.size > 0 && this.viewer && !this.viewer.isDestroyed()) {
    try {
      // Use Array.from to create a stable copy of the polyline entries
      Array.from(this.polylines.entries()).forEach(([_, polyline]) => {
        if (polyline && this.viewer.entities) {
          this.viewer.entities.remove(polyline);
        }
      });
      
      this.polylines.clear();
    } catch (error) {
      console.error("Error during cleanup of polylines:", error);
    }
  }
}

  /**
   * Get all units
   */
  getUnits(): Unit[] {
    return this.units;
  }

  /**
   * Update the trail visualization for a unit
   */
  private updateTrail(unitId: number, position: Position): void {

    const polyline = this.polylines.get(unitId);
    
    if (!polyline) {
      return;
    }
    
    // Create new cartesian position
    const cartesianPosition = Cartesian3.fromDegrees(
      position.lng, 
      position.lat
    );

    // Get current positions array (make a copy to modify it)
    const currentPositions = polyline.polyline.positions.getValue() || [];
    
    // Create a new array with the updated positions
    const updatedPositions = [...currentPositions, cartesianPosition];
    
    // Limit the trail length if needed
    if (updatedPositions.length > this.trailLength) {
      // Remove oldest positions to maintain trail length
      updatedPositions.splice(0, updatedPositions.length - this.trailLength);
    }
    
    // Update the polyline positions
    //polyline.polyline.positions = updatedPositions;

     this.viewer.entities.add({
      id: `test-${new Date().toISOString()}`,
      polyline: {
        positions: updatedPositions,
        width: 24,
        material: Color.RED,
        clampToGround: true
      }
    });

  }

  /**
   * Add a new unit to the simulation
   */
  addUnit(unit: Unit): void {
    this.units.push(unit);
    this.createPolylineForUnit(unit);
  }

  /**
   * Remove a unit from the simulation
   */
  removeUnit(unitId: number): void {
    const index = this.units.findIndex(u => u.id === unitId);
    if (index !== -1) {
      this.units.splice(index, 1);
      
      // Remove polyline
      const polyline = this.polylines.get(unitId);
      if (polyline) {
        this.viewer.entities.remove(polyline);
        this.polylines.delete(unitId);
      }
    }
  }
  
}
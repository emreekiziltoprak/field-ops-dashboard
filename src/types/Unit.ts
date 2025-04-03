// Represents a single geographic position with timestamp
export interface Position {
    timestamp: string; // ISO 8601 format
    lat: number;
    lng: number;
  }
  
  // Represents a unit (e.g., vehicle or asset) tracked on the map
  export interface Unit { 
    id: number;
    icon: string; // SVG content as string
    name: string;
    type?: string; // Unit type, e.g. tank, vehicle, etc.
    speed: number;              // in km/h or m/s depending on system
    course: number;             // in degrees (0-360)
    currentPosition: Position;  // latest known position
    positionHistory: Position[]; // historical path
    isSelected?: boolean;       // whether the unit is selected (e.g., shown in right panel)
  }
  
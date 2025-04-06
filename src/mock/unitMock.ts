import { Unit } from "../types/Unit";
import  TankLogo  from '../assets/tank.svg';

export const initialUnits: Unit[] = [
    {
      id: 1,
      name: "Tank-1",
      icon: TankLogo,
      speed: 20030,
      course: 90,
      currentPosition: { timestamp: new Date().toISOString(), lat: 30.92077, lng: 30.85411 },
      positionHistory: [],
    },
    {
      id: 2,
      name: "Tank-2",
      icon: TankLogo,
      speed: 20030,
      course: 45,
      currentPosition: { timestamp: new Date().toISOString(), lat: 39.921, lng: 32.855 },
      positionHistory: [],
    },
  ];
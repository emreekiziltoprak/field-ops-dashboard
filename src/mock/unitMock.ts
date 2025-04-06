import { Unit } from "../types/Unit";
import  TankLogo  from '../assets/tank.svg';
import  IhaLogo from "../assets/iha.svg";

export const initialUnits: Unit[] = [
    {
      id: 1,
      name: "Tank-1",
      icon: TankLogo,
      speed: 230,
      course: 90,
      currentPosition: { timestamp: new Date().toISOString(), lat: 30.92077, lng: 30.85411 },
      positionHistory: [],
    },
    {
      id: 2,
      name: "IHA-1",
      icon: IhaLogo,
      speed: 50,
      course: 45,
      currentPosition: { timestamp: new Date().toISOString(), lat: 39.921, lng: 32.855 },
      positionHistory: [],
    },
  ];
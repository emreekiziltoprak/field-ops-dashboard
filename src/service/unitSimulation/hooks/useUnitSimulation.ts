import { useState, useEffect } from 'react';
import { Unit } from '../../../types/Unit';
import { UnitSimulationService } from '../UnitSimulationService';


export const useUnitSimulation = (simulationService: UnitSimulationService): Unit[] => {

  const [units, setUnits] = useState<Unit[]>(simulationService.getUnits());

  useEffect(() => {
    simulationService.start((updatedUnits: Unit[]) => {
      setUnits(updatedUnits);
    });
    return () => {
      simulationService.stop();
    };
  }, []);

  return units;
};

import { useState, useEffect } from 'react';
import { Unit } from '../../../types/Unit';
import { simulationService } from '../../../main';


export const useUnitSimulation = (): Unit[] => {
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

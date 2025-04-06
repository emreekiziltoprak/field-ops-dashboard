// src/features/unit/hooks/handleUnitClick.ts

import { ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian2 } from 'cesium';
import { Viewer } from 'cesium';
import { AppDispatch } from '../../../store';
import { addUnitToPanel } from '../../../store/unitSlice';
import { Unit } from '../../../types/Unit';
import { UnitMovementService } from '../UnitMovevementService';

export function attachUnitClickHandler(
  viewer: Viewer,
  dispatch: AppDispatch,
  units: Unit[]
) {
  const handler = new ScreenSpaceEventHandler(viewer.canvas);

  handler.setInputAction((event: { position: Cartesian2 }) => {
    const picked = viewer.scene.pick(event.position);
    
    if (picked && picked.id) {
      const entity = picked.id;
      
      // Check if the clicked entity is a unit
      if (entity.id && entity.id.startsWith('unit-')) {
        const unitId = parseInt(entity.id.split('-')[1]);
        const unit = units.find(u => u.id === unitId);
        
        if (unit) {
          // Dispatch the unit to the panel
          dispatch(addUnitToPanel(unit));
          
          // Highlight the unit's path on the map
          UnitMovementService.highlightUnitPath(unit, viewer);
        }
      }
    }
  }, ScreenSpaceEventType.LEFT_CLICK);

  return handler;
}
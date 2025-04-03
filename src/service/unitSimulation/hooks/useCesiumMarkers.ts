import { useEffect } from 'react';
import { Viewer, Cartesian3, VerticalOrigin, Color, Cartesian2 } from 'cesium';
import { Unit } from '../../../types/Unit';

/**
 * Custom hook that takes Unit data and adds them as markers (entities) in Cesium.
 * @param viewer Cesium Viewer instance or null
 * @param units Array of units
 */
export const useCesiumMarkers = (viewer: Viewer | null, units: Unit[]) => {
  useEffect(() => {
    if (!viewer) return;

    // remove existing markers for units
    const existingMarkers = viewer.entities.values.filter((entity) =>
      entity.id?.toString().startsWith('unit-')
    );
    existingMarkers.forEach((entity) => viewer.entities.remove(entity));

    // add marker for each unit
    units.forEach((unit) => {
      viewer.entities.add({
        id: `unit-${unit.id}`,
        position: Cartesian3.fromDegrees(unit.currentPosition.lng, unit.currentPosition.lat, 0),
        billboard: {
          image: unit.icon,
          verticalOrigin: VerticalOrigin.BOTTOM,
          width: 32,
          height: 32
        },
        label: {
          text: unit.name,
          font: '12pt sans-serif',
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: 1, // Cesium.LabelStyle.FILL_AND_OUTLINE
          verticalOrigin: VerticalOrigin.TOP,
          pixelOffset: new Cartesian2(0, 20),
        },
        // unit info on hover/click
        description: `<h3>${unit.name}</h3>
                      <p><strong>Tür:</strong> ${unit.type || 'Bilinmiyor'}</p>
                      <p><strong>Hız:</strong> ${unit.speed} m/s</p>
                      <p><strong>Yön:</strong> ${unit.course}°</p>`
      });
    });
  }, [units, viewer]);
};

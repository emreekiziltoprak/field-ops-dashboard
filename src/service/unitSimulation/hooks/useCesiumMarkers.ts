import { useEffect } from "react";
import {
  Viewer,
  Cartesian3,
  VerticalOrigin,
  Color,
  Cartesian2,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from "cesium";
import { Unit } from "../../../types/Unit";
import { useDispatch } from "react-redux";
import { addUnitToPanel } from "../../../store/unitSlice";

/**
 * Custom hook that takes Unit data and adds them as markers (entities) in Cesium.
 * When markers are clicked, they are added to the selectedUnits in Redux.
 * @param viewer Cesium Viewer instance or null
 * @param units Array of units
 */
export const useCesiumMarkers = (viewer: Viewer | null, units: Unit[]) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!viewer) return;

    // Remove existing markers for units
    const existingMarkers = viewer.entities.values.filter((entity) =>
      entity.id?.toString().startsWith("unit-")
    );
    existingMarkers.forEach((entity) => viewer.entities.remove(entity));

    // Add marker for each unit
    units.forEach((unit) => {
      viewer.entities.add({
        id: `unit-${unit.id}`,
        position: Cartesian3.fromDegrees(
          unit.currentPosition.lng,
          unit.currentPosition.lat,
          0
        ),
        billboard: {
          image: unit.icon,
          verticalOrigin: VerticalOrigin.BOTTOM,
          width: 55,
          height: 55,
        },
        label: {
          text: unit.name,
          font: "12pt sans-serif",
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: 1, // Cesium.LabelStyle.FILL_AND_OUTLINE
          verticalOrigin: VerticalOrigin.TOP,
          pixelOffset: new Cartesian2(0, 20),
        },
        // Unit info on hover/click
        description: `<h3>${unit.name}</h3>
                     <p><strong>Tür:</strong> ${unit.type || "Bilinmiyor"}</p>
                     <p><strong>Hız:</strong> ${unit.speed} m/s</p>
                     <p><strong>Yön:</strong> ${unit.course}°</p>`,
      });
    });

    // Set up click handler
    const handler = new ScreenSpaceEventHandler(viewer.canvas);

    handler.setInputAction((event: any) => {
      const pickedObject = viewer.scene.pick(event.position);

      if (pickedObject && pickedObject.id) {
        const entity = pickedObject.id;
        const entityId = entity.id;

        // Check if the clicked entity is a unit marker
        if (typeof entityId === "string" && entityId.startsWith("unit-")) {
          const unitId = entityId.replace("unit-", "");
          const selectedUnit = units.find((u) => u.id.toString() === unitId);

          if (selectedUnit) {
            // Dispatch action to add unit to panel
            dispatch(addUnitToPanel(selectedUnit));

            // Optional: Highlight the selected entity
            entity.billboard.scale = 1.2;
            setTimeout(() => {
              if (viewer.entities?.getById(entityId)) {
                entity.billboard.scale = 1.0;
              }
            }, 200);
          }
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    // Clean up function
    return () => {
      if (handler) {
        try {
          handler.destroy();
        } catch (error) {
          console.error("Error destroying handler:", error);
        }
      }

      // Clean up markers if needed
      if (viewer && !viewer.isDestroyed() && viewer.entities) {
        try {
          const markersToRemove = viewer.entities.values.filter(
            (entity) =>
              entity && entity.id && entity.id.toString().startsWith("unit-")
          );

          markersToRemove.forEach((entity) => {
            if (entity) {
              viewer.entities.remove(entity);
            }
          });
        } catch (error) {
          console.error("Error cleaning up markers:", error);
        }
      }
    };

  }, [units, viewer, dispatch]);
};

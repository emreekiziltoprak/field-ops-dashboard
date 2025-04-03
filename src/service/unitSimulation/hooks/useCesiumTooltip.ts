import { useEffect, useRef } from 'react';
import {
  Viewer,
  defined,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cartesian2
} from 'cesium';

/**
 * Shows entity.description as a custom tooltip when hovering over a marker.
 * @param viewer Cesium Viewer instance or null
 */
export const useCesiumTooltip = (viewer: Viewer | null) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!viewer) return;

    // Create tooltip element only once
    let tooltipEl = tooltipRef.current;
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'cesium-tooltip';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      tooltipEl.style.color = 'white';
      tooltipEl.style.padding = '5px 10px';
      tooltipEl.style.borderRadius = '4px';
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.fontSize = '12px';
      tooltipEl.style.display = 'none';
      tooltipEl.style.zIndex = '1000';
      document.body.appendChild(tooltipEl);
      tooltipRef.current = tooltipEl;
    }

    // Listen for mouse movements in Cesium
    const handler = new ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction((movement: { endPosition: Cartesian2 }) => {
      const pickedObject = viewer.scene.pick(movement.endPosition);
      if (defined(pickedObject) && pickedObject.id && pickedObject.id.description) {
        // Use getValue() if description is a Cesium Property, otherwise use directly as string
        const desc = pickedObject.id.description.getValue
          ? pickedObject.id.description.getValue()
          : pickedObject.id.description;

        tooltipEl!.innerHTML = desc;
        tooltipEl!.style.display = 'block';
        tooltipEl!.style.left = movement.endPosition.x + 10 + 'px';
        tooltipEl!.style.top = movement.endPosition.y + 10 + 'px';
      } else {
        tooltipEl!.style.display = 'none';
      }
    }, ScreenSpaceEventType.MOUSE_MOVE);

    // Cleanup
    return () => {
      handler.destroy();
      if (tooltipEl && tooltipEl.parentNode) {
        tooltipEl.parentNode.removeChild(tooltipEl);
      }
    };
  }, [viewer]);

  return tooltipRef;
};

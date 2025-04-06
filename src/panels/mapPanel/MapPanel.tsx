// src/components/MapPanel.tsx
import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  Ion,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cartesian2,
  Cartographic,
  Math as CesiumMath,
  Color,
  Cartesian3,
} from "cesium";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  setDrawingMode,
  addMission,
  selectMission,
  Mission,
} from "../../store/missionSlice";
import { usePolygonDraw } from "../../features/draw/hooks/usePolygonDraw";
import MissionFormModal from "../../features/mission/components/MissionFormModal";
import { useViewer } from "../../features/map/context/ViewerContext";
import { CesiumMissionRenderer } from "../../features/mission/renderer/CesiumMissionRenderer";
import { useCesiumMarkers } from "../../service/unitSimulation/hooks/useCesiumMarkers";
import { useCesiumTooltip } from "../../service/unitSimulation/hooks/useCesiumTooltip";
import { UnitSimulationService } from "../../service/unitSimulation/UnitSimulationService";
import { HaversinePositionCalculator } from "../../service/unitSimulation/HaversineCalc";
import { setUnits } from "../../store/simulationSlice";
import { initialUnits } from "../../mock/unitMock";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN as string;

const MapPanel = () => {
  const dispatch = useDispatch();
  const viewerDivRef = useRef<HTMLDivElement>(null);
  const { viewer, isInitialized, initializeViewer } = useViewer();
  const drawingMode = useSelector(
    (state: RootState) => state.mission.drawingMode
  );
  const missions = useSelector((state: RootState) => state.mission.missions);
  const [unitSimulationService, setUnitSimulationService] = useState<UnitSimulationService | null>(null);
  const units = useSelector((state: RootState) => state.simulation.units);
  const [showModal, setShowModal] = useState(false);
  const [lastPolygon, setLastPolygon] = useState<
    { lat: number; lng: number }[]
  >([]);

  // MapPanel.tsx'e ekleyin
useEffect(() => {
  if (drawingMode && unitSimulationService) {
    // Çizim modu aktifse simülasyonu duraklat
    unitSimulationService.pause();
  } else if (!drawingMode && unitSimulationService) {
    // Çizim modu bitince simülasyonu devam ettir
    unitSimulationService.resume();
  }
}, [drawingMode, unitSimulationService]);

  // Initialize viewer
  useEffect(() => {
    if (!isInitialized && viewerDivRef.current) {
      initializeViewer(viewerDivRef.current, {depthTestAgainstTerrain: false});
    }
  }, [isInitialized, initializeViewer]);


  // Initialize UnitSimulationService with HaversinePositionCalculator
  useEffect(() => {
    
    if (viewer) {
      // Important: Use the HaversinePositionCalculator instead of the normal PositionCalculator
      const positionCalculator = new HaversinePositionCalculator();
      
      // Create simulation service with proper trail length setting
      const simulationService = new UnitSimulationService(
        initialUnits,
        100, // Update interval in milliseconds
        positionCalculator,
        viewer,
        1000 // Trail length - number of positions to display in polyline
      );
      
      setUnitSimulationService(simulationService);
    }
  }, [viewer]);

  // Start/stop simulation when service is available
  useEffect(() => {
    if (unitSimulationService) {
      // Start simulation with callback to update Redux state
      unitSimulationService.start((updatedUnits) => {
        dispatch(setUnits(updatedUnits));
      });

      // Cleanup on component unmount
      return () => {
        unitSimulationService.stop();
        unitSimulationService.cleanup(); // Make sure to call cleanup to remove polylines
      };
    }
  }, [unitSimulationService, dispatch]);

  // Polygon drawing
  usePolygonDraw(viewer, drawingMode, (positions) => {
    const latLngs = positions.map((pos) => {
      const carto = Cartographic.fromCartesian(pos);
      return {
        lat: CesiumMath.toDegrees(carto.latitude),
        lng: CesiumMath.toDegrees(carto.longitude),
      };
    });
    setLastPolygon(latLngs);
    setShowModal(true);
    dispatch(setDrawingMode(false));
  });

  const handleSaveMission = useCallback(
    (data: {
      name: string;
      type: string;
      startTime: string;
      endTime: string;
    }) => {
      const newMission: Mission = {
        id: crypto.randomUUID(),
        ...data,
        coordinates: lastPolygon,
      };
      dispatch(addMission(newMission));
      dispatch(selectMission(newMission.id));
    },
    [dispatch, lastPolygon]
  );

  // Missions render
  useEffect(() => {
    if (!viewer) return;
    const missionRenderer = new CesiumMissionRenderer();
    missionRenderer.render(viewer, missions);
  }, [viewer, missions]);

  // Update markers
  useCesiumMarkers(viewer, units);

  // Enable tooltip
  useCesiumTooltip(viewer);

  // Mission selection on click
  useEffect(() => {
    if (!viewer) return;
    const handler = new ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction((movement: { position: Cartesian2 }) => {
      const pickedObject = viewer.scene.pick(movement.position);
      if (pickedObject && pickedObject.id) {
        // Check if the ID has a _id property (mission) or just regular id (unit)
        const id = pickedObject.id._id ? pickedObject.id._id : pickedObject.id;
        if (typeof id === 'string') {
          dispatch(selectMission(id));
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
    return () => handler.destroy();
  }, [viewer, dispatch]);

  return (
    <>
      <div ref={viewerDivRef} style={{ width: "100%", height: "100%" }} />
      <MissionFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSaveMission}
      />
    </>
  );
};

export default MapPanel;
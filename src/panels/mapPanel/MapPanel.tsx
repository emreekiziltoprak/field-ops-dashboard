// src/components/MapPanel.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Ion,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cartesian2,
  Cartographic,
  Math as CesiumMath
} from 'cesium';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setDrawingMode, addMission, selectMission, Mission } from '../../store/missionSlice';
import { usePolygonDraw } from '../../features/draw/hooks/usePolygonDraw';
import MissionFormModal from '../../features/mission/components/MissionFormModal';
import { useViewer } from '../../features/map/context/ViewerContext';
import { CesiumMissionRenderer } from '../../features/mission/renderer/CesiumMissionRenderer';
import { useUnitSimulation } from '../../service/unitSimulation/hooks/useUnitSimulation';
import { useCesiumMarkers } from '../../service/unitSimulation/hooks/useCesiumMarkers';
import { useCesiumTooltip } from '../../service/unitSimulation/hooks/useCesiumTooltip';

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN as string;

const MapPanel = () => {
  const dispatch = useDispatch();
  const viewerDivRef = useRef<HTMLDivElement>(null);
  const { viewer, isInitialized, initializeViewer } = useViewer(); // viewer: Viewer | null
  const drawingMode = useSelector((state: RootState) => state.mission.drawingMode);
  const missions = useSelector((state: RootState) => state.mission.missions);
  // Unit data from simulation
  const units = useUnitSimulation();

  const [showModal, setShowModal] = useState(false);
  const [lastPolygon, setLastPolygon] = useState<{ lat: number; lng: number }[]>([]);

  // Initialize viewer
  useEffect(() => {
    if (!isInitialized && viewerDivRef.current) {
      initializeViewer(viewerDivRef.current);
    }
  }, [isInitialized, initializeViewer]);

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
    (data: { name: string; type: string; startTime: string; endTime: string }) => {
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

  // Enable tooltip (info display on hover)
  useCesiumTooltip(viewer);

  // Mission selection on click
  useEffect(() => {
    if (!viewer) return;
    const handler = new ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction((movement: { position: Cartesian2 }) => {
      const pickedObject = viewer.scene.pick(movement.position);
      if (pickedObject && pickedObject.id) {
        dispatch(selectMission(pickedObject.id._id as string));
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
    return () => handler.destroy();
  }, [viewer, dispatch]);

  return (
    <>
      <div ref={viewerDivRef} style={{ width: '100%', height: '100%' }} />
      <MissionFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSaveMission}
      />
    </>
  );
};

export default MapPanel;

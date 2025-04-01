import {
  Viewer,
  Ion,
  Cartesian3,
  Cartographic,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Color,
  Cartesian2,
} from 'cesium'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import {
  setDrawingMode,
  addMission,
  selectMission,
} from '../../store/missionSlice'
import { usePolygonDraw } from '../../features/draw/hooks/usePolygonDraw'
import MissionFormModal from '../../features/mission/components/MissionFormModal'
import { useViewer } from '../../features/map/context/ViewerContext'
import { attachLeftClickHandler } from '../../features/draw/handleLeftClick'

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN as string

const MapPanel = () => {
  const dispatch = useDispatch()
  const viewerDivRef = useRef<HTMLDivElement>(null)
  const { viewer, setViewer } = useViewer()
  const drawingMode = useSelector((state: RootState) => state.mission.drawingMode)
  const missions = useSelector((state: RootState) => state.mission.missions)

  const [showModal, setShowModal] = useState(false)
  const [lastPolygon, setLastPolygon] = useState<{ lat: number; lng: number }[]>([])

  useEffect(() => {
    if (viewerDivRef.current && !viewer) {
      // Önceki viewer varsa destroy et
      const prevViewer = (window ).__cesiumViewer as Viewer | undefined
      if (prevViewer && !prevViewer.isDestroyed?.()) {
        prevViewer.destroy()
      }
  
      const cesiumViewer = new Viewer(viewerDivRef.current, {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        homeButton: false,
        fullscreenButton: false,
        infoBox: false,
        sceneModePicker: false,
      })
  
      cesiumViewer.camera.setView({
        destination: Cartesian3.fromDegrees(32.85, 39.93, 15000),
      })
  
      // referans için global değişkene de kaydet istersen
      ;(window ).__cesiumViewer = cesiumViewer
  
      setViewer(cesiumViewer)
    }
  }, [viewer, setViewer])
  

  // Polygon drawing logic
  usePolygonDraw(viewer ?? null, drawingMode, (positions) => {
    const latLngs = positions.map((pos) => {
      const carto = Cartographic.fromCartesian(pos)
      return {
        lat: CesiumMath.toDegrees(carto.latitude),
        lng: CesiumMath.toDegrees(carto.longitude),
      }
    })

    setLastPolygon(latLngs)
    setShowModal(true)
    dispatch(setDrawingMode(false))
  })

  // Modal submit
  const handleSaveMission = (data: {
    name: string
    type: string
    startTime: string
    endTime: string
  }) => {
    const newMission = {
      id: crypto.randomUUID(),
      ...data,
      coordinates: lastPolygon,
    }

    dispatch(addMission(newMission))
    dispatch(selectMission(newMission.id))
  }

  // Görevleri haritada göster
  useEffect(() => {
    if (!viewer) return

    viewer.entities.removeAll()

    missions.forEach((mission) => {
      const positions = mission.coordinates.map((coord) =>
        Cartesian3.fromDegrees(coord.lng, coord.lat)
      )

      viewer.entities.add({
        id: mission.id,
        name: mission.name,
        polygon: {
          hierarchy: positions,
          material: Color.BLUE.withAlpha(0.3),
          outline: true,
          outlineColor: Color.NAVY,
        },
        description: `Görev: ${mission.name}`,
      })
    })
  }, [viewer, missions])
  
  return (
    <>
      <div ref={viewerDivRef} style={{ width: '100%', height: '100%' }} />
      <MissionFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSaveMission}
      />
    </>
  )
}

export default MapPanel

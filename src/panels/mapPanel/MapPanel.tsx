import { useEffect, useRef } from 'react'
import { Ion, Viewer, Cartesian3 } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN

const MapPanel = () => {
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (viewerRef.current) {
      const viewer = new Viewer(viewerRef.current, {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        homeButton: false,
        sceneModePicker: false,
        fullscreenButton: false,
        geocoder: false,
        navigationHelpButton: false,
        selectionIndicator: false,
        infoBox: false,
      })

      viewer.scene.globe.enableLighting = true
      viewer.scene.skyAtmosphere.show = true

      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(32.8597, 39.9334, 10000), // Ankara
      })

      return () => viewer.destroy()
    }
  }, [])

  return <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
}

export default MapPanel

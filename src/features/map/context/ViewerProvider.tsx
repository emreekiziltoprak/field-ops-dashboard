import { useState, useCallback, useEffect } from 'react'
import { Viewer, Cartesian3 } from 'cesium'
import { ViewerContext, CesiumViewerOptions } from './ViewerContext'

type Props = {
  children: React.ReactNode
}

export const ViewerProvider = ({ children }: Props) => {
  const [viewer, setViewer] = useState<Viewer | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initializes the viewer on the specified container
  const initializeViewer = useCallback((divRef: HTMLDivElement, options?: Partial<CesiumViewerOptions>) => {
    if (viewer && !viewer.isDestroyed?.()) {
      viewer.destroy()
    }

    const cesiumViewer = new Viewer(divRef, {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      homeButton: false,
      fullscreenButton: false,
      infoBox: false,
      sceneModePicker: false,
      ...options,
    })

    cesiumViewer.camera.setView({
      destination: Cartesian3.fromDegrees(32.85, 39.93, 15000),
    })

    setViewer(cesiumViewer)
    setIsInitialized(true)
  }, [viewer])

  // Destroys the viewer and resets state
  const destroyViewer = useCallback(() => {
    if (viewer && !viewer.isDestroyed?.()) {
      viewer.destroy()
      setViewer(null)
      setIsInitialized(false)
    }
  }, [viewer])

  useEffect(() => {
    return () => {
      if (viewer && !viewer.isDestroyed?.()) {
        viewer.destroy()
      }
    }
  }, [viewer])

  return (
    <ViewerContext.Provider value={{ viewer, isInitialized, initializeViewer, destroyViewer }}>
      {children}
    </ViewerContext.Provider>
  )
}

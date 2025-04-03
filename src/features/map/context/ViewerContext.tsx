import { createContext, useContext } from 'react'
import { Viewer } from 'cesium'

// Interface definition containing lifecycle functions and state information for the Viewer
export interface ViewerContextType {
  viewer: Viewer | null
  isInitialized: boolean
  initializeViewer: (divRef: HTMLDivElement, options?: Partial<CesiumViewerOptions>) => void
  destroyViewer: () => void
}

// Optional settings type for Cesium Viewer (can be extended based on requirements)
export interface CesiumViewerOptions {
  animation?: boolean
  timeline?: boolean
  baseLayerPicker?: boolean
  homeButton?: boolean
  fullscreenButton?: boolean
  infoBox?: boolean
  sceneModePicker?: boolean
}

// Default values; initialize and destroy functions are defined as no-op
const defaultViewerContext: ViewerContextType = {
  viewer: null,
  isInitialized: false,
  initializeViewer: () => {},
  destroyViewer: () => {},
}

export const ViewerContext = createContext<ViewerContextType>(defaultViewerContext)

// Hook to simplify context usage
export const useViewer = () => useContext(ViewerContext)

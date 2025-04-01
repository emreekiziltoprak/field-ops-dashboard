// ViewerContext.tsx
import { createContext, useContext } from 'react'
import { Viewer } from 'cesium'

export type ViewerContextType = {
  viewer: Viewer | null
  setViewer: (v: Viewer) => void
}

export const ViewerContext = createContext<ViewerContextType>({
  viewer: null,
  setViewer: () => {},
})

export const useViewer = () => useContext(ViewerContext)

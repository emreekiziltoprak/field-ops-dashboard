// ViewerProvider.tsx
import { useState } from 'react'
import { Viewer } from 'cesium'
import { ViewerContext } from './ViewerContext'

type Props = {
  children: React.ReactNode
}

export const ViewerProvider = ({ children }: Props) => {
  const [viewer, setViewer] = useState<Viewer | null>(null)

  return (
    <ViewerContext.Provider value={{ viewer, setViewer }}>
      {children}
    </ViewerContext.Provider>
  )
}

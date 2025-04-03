import { Viewer } from 'cesium'

export interface Mission {
  id: string
  name: string
  type: string
  startTime: string
  endTime: string
  coordinates: { lat: number; lng: number }[]
}

export interface IMissionRenderer {
  render(viewer: Viewer, missions: Mission[]): void
}

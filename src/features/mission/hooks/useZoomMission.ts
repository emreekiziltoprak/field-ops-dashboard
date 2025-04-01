import { Cartographic, Rectangle } from 'cesium'
import { useViewer } from '../../map/context/ViewerContext';

export function useZoomToMission() {
  const { viewer } = useViewer()

  return (coordinates: { lat: number; lng: number }[]) => {
    if (!viewer || coordinates.length === 0) return

    const cartographics = coordinates.map(coord =>
      Cartographic.fromDegrees(coord.lng, coord.lat)
    )

    const rect = Rectangle.fromCartographicArray(cartographics)

    viewer.camera.flyTo({
      destination: rect,
      duration: 1.5,
    })
  }
}

import { ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian2 } from 'cesium'
import { Viewer } from 'cesium'
import { AppDispatch } from '../../store'
import { selectMission } from '../../store/missionSlice'

export function attachLeftClickHandler(
  viewer: Viewer,
  dispatch: AppDispatch,
  drawingMode: boolean
) {
  const handler = new ScreenSpaceEventHandler(viewer.canvas)

  handler.setInputAction((event: { position: Cartesian2 }) => {
    if (drawingMode) return
    const picked = viewer.scene.pick(event.position)
    if (picked && picked.id) {
      const entity = picked.id
      dispatch(selectMission(entity.id))
      viewer.zoomTo(entity)
    }
  }, ScreenSpaceEventType.LEFT_CLICK)

  return handler
}

import { Viewer, Cartesian3, Color } from 'cesium'
import { IMissionRenderer } from './IMissionRenderer'
import { Mission } from '../../../store/missionSlice'

export class CesiumMissionRenderer implements IMissionRenderer {
  render(viewer: Viewer, missions: Mission[]): void {
    if (!viewer) return
    // Clear previous entities
    viewer.entities.removeAll()

    missions.forEach((mission: Mission) => {
      const positions = mission.coordinates.map(coord =>
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
        description: `Mission: ${mission.name}`,
      })
    })
  }
}

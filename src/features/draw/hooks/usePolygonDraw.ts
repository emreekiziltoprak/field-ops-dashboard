import {
  CallbackProperty,
  Cartesian2,
  Cartesian3,
  Color,
  Entity,
  PolygonHierarchy,
  PolylineGraphics,
  PointGraphics,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer,
} from 'cesium'
import { useEffect, useRef } from 'react'

export function usePolygonDraw(
  viewer: Viewer | null,
  enabled: boolean,
  onComplete: (positions: Cartesian3[]) => void
) {
  const positions = useRef<Cartesian3[]>([])
  const handler = useRef<ScreenSpaceEventHandler | null>(null)
  const polygonEntity = useRef<Entity | null>(null)
  const polylineEntity = useRef<Entity | null>(null)
  const cursorEntity = useRef<Entity | null>(null)

  useEffect(() => {
    if (!viewer || !enabled) return

    // Clear
    positions.current = []

    if (polygonEntity.current) {
      viewer.entities.remove(polygonEntity.current)
      polygonEntity.current = null
    }

    if (polylineEntity.current) {
      viewer.entities.remove(polylineEntity.current)
      polylineEntity.current = null
    }

    if (cursorEntity.current) {
      viewer.entities.remove(cursorEntity.current)
      cursorEntity.current = null
    }

    handler.current = new ScreenSpaceEventHandler(viewer.canvas)

    // Mouse movement
    handler.current.setInputAction(({ endPosition }: { endPosition: Cartesian2 }) => {
      const moving = viewer.scene.pickPosition(endPosition)
      if (!moving) return

      const dynamicLine = [...positions.current, moving]
      const positionCallback = new CallbackProperty(() => moving, false)

      // Temporary line
      if (positions.current.length > 0) {
        const lineCallback = new CallbackProperty(() => dynamicLine, false)

        if (!polylineEntity.current) {
          polylineEntity.current = viewer.entities.add({
            polyline: new PolylineGraphics({
              positions: lineCallback,
              width: 2,
              material: Color.AQUAMARINE,
            }),
          })
        } else {
          const polyline = polylineEntity.current.polyline
          if (polyline?.positions instanceof CallbackProperty) {
            polyline.positions.setCallback(() => dynamicLine, false)
          }
        }
      }

      // Cursor point
      if (!cursorEntity.current) {
        cursorEntity.current = viewer.entities.add({
          position: positionCallback,
          point: new PointGraphics({
            pixelSize: 10,
            color: Color.LIME,
            outlineColor: Color.BLACK,
            outlineWidth: 1,
          }),
        })
      } else {
        cursorEntity.current.position = positionCallback
      }
    }, ScreenSpaceEventType.MOUSE_MOVE)

    // Left click - Add point
    handler.current.setInputAction(({ position }: { position: Cartesian2 }) => {
      const picked = viewer.scene.pickPosition(position)
      if (!picked) return

      positions.current.push(picked)

      if (!polygonEntity.current) {
        polygonEntity.current = viewer.entities.add({
          polygon: {
            hierarchy: new CallbackProperty(
              () => new PolygonHierarchy(positions.current),
              false
            ),
            material: Color.AQUA.withAlpha(0.4),
            outline: true,
            outlineColor: Color.AQUA,
          },
        })
      }
    }, ScreenSpaceEventType.LEFT_CLICK)

    // Right click - Complete drawing
    handler.current.setInputAction(() => {
      if (positions.current.length >= 3) {
        onComplete([...positions.current])
      }

      if (polygonEntity.current) {
        viewer.entities.remove(polygonEntity.current)
        polygonEntity.current = null
      }

      if (polylineEntity.current) {
        viewer.entities.remove(polylineEntity.current)
        polylineEntity.current = null
      }

      if (cursorEntity.current) {
        viewer.entities.remove(cursorEntity.current)
        cursorEntity.current = null
      }

      //handler.current?.destroy()
    }, ScreenSpaceEventType.RIGHT_CLICK)

    return () => {
      handler.current?.destroy()

      if (polygonEntity.current) {
        viewer.entities.remove(polygonEntity.current)
        polygonEntity.current = null
      }

      if (polylineEntity.current) {
        viewer.entities.remove(polylineEntity.current)
        polylineEntity.current = null
      }

      if (cursorEntity.current) {
        viewer.entities.remove(cursorEntity.current)
        cursorEntity.current = null
      }
    }
  }, [viewer, enabled, onComplete])
}

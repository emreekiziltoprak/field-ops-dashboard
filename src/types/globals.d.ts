// src/types/global.d.ts

import type { Viewer } from 'cesium'

declare global {
  interface Window {
    __cesiumViewer?: Viewer
  }
}

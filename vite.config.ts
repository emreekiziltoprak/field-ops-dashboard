import { defineConfig } from 'vite'
import cesium from 'vite-plugin-cesium'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react(), cesium()],
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium'),
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
/**
 * Note: this config is for CI use only to confirm build
 */
export default defineConfig({
  root: './ui',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    manifest: true
  }
})

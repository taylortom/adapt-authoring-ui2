import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    // Output directory for standalone build (used by CI and separate Node.js server)
    outDir: 'dist',
    sourcemap: true,
    // Generate manifest for asset references
    manifest: true
  }
})

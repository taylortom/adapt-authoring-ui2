import { build } from 'vite'
import { fileURLToPath } from 'url'
import { Hook } from 'adapt-authoring-core'
import path from 'path'
import react from '@vitejs/plugin-react'

class UiBuild {
  constructor ({ app, log, isDev, buildDir, uiPlugins }) {
    this.app = app
    this.log = log
    this.isDev = isDev
    this.buildDir = buildDir
    this.uiPlugins = uiPlugins.map(p => path.relative(this.app.rootDir, p).replaceAll('\\', '/'))

    this.preBuildHook = new Hook()
    this.postBuildHook = new Hook()
  }

  async run () {
    try {
      await this.preBuildHook.invoke(this)
      await build({
        root: path.resolve(fileURLToPath(new URL('..', import.meta.url)), './src'),
        build: {
          outDir: this.buildDir,
          sourcemap: this.isDev,
          manifest: true // Generate manifest for asset references
        },
        plugins: [react()]
      })
      await this.postBuildHook.invoke(this)
      this.log('info', 'UI built successfully')
    } catch (e) {
      this.logBuildError(e)
    }
  }
}

export default UiBuild

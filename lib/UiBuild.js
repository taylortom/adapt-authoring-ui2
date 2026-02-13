import { build, createLogger } from 'vite'
import { Hook } from 'adapt-authoring-core'
import path from 'path'
import react from '@vitejs/plugin-react'

class UiBuild {
  constructor ({ app, log, isDev, mountPoint = '', buildDir, srcDir, pluginDirs, enableWatch }) {
    this.app = app
    this.log = log
    this.isDev = isDev
    this.mountPoint = mountPoint
    this.buildDir = buildDir
    this.srcDir = srcDir
    this.pluginDirs = pluginDirs
    this.enableWatch = enableWatch

    console.log(pluginDirs);
    console.log(path.relative(this.srcDir, this.buildDir));
    

    this.preBuildHook = new Hook()
    this.postBuildHook = new Hook()
  }

  async run () {
    try {
      await this.preBuildHook.invoke(this)
      await build({
        root: this.srcDir,
        base: this.mountPoint,
        configFile: false,
        define: {
          __BASE_PATH__: JSON.stringify(this.mountPoint)
        },
        build: {
          assetsDir: 'static',
          emptyOutDir: true,
          outDir: this.buildDir,
          sourcemap: this.isDev,
          watch: this.enableWatch ? {} : undefined
        },
        plugins: [react()],
        customLogger: Object.assign(createLogger(), {
          info: msg => this.log('debug', msg),
          warn: msg => this.log('debug', msg),
          error: msg => this.log('error', msg),
        })
      })
      await this.postBuildHook.invoke(this)

      this.log('info', 'UI built successfully')
    } catch (e) {
      this.log('error', e)
    }
  }
}

export default UiBuild

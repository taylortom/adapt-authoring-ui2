import { AbstractModule, Hook } from 'adapt-authoring-core'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import path from 'path'
import UiBuild from './UiBuild.js'
/**
 * The main entry-point for the Adapt authoring tool web-app/front-end
 * @memberof ui
 * @extends {AbstractModule}
 */
class UiModule extends AbstractModule {
  /** @override */
  async init () {
    this.mountPoint = `/${this.getConfig('mountPoint')}`.replace('//', '/')
    /**
     * Source code directory for the app
     * @type {String}
     */
    this.srcDir = fileURLToPath(new URL('../ui', import.meta.url))
    /**
     * Build code directory for the app
     * @type {String}
     */
    this.buildDir = this.getConfig('buildDir')
    /**
     * Cached reference to isProduction config value
     */
    this.isProduction = this.app.getConfig('isProduction')
    /**
     * Reference to UI plugins which need to be included in build
     * @type {String[]}
     */
    this.uiPlugins = []
    /**
     * Invoked before every UI build
     * @type {Hook}
     */
    this.preBuildHook = new Hook()
    /**
     * Invoked after every UI build
     * @type {Hook}
     */
    this.postBuildHook = new Hook()

    const server = await this.app.waitForModule('server')
    server.root.addRoute({
      route: `${this.mountPoint}/static/:filename`,
      handlers: { get: this.serveAsset() }
    }, {
      route: `${this.mountPoint}{*splat}`,
      handlers: { get: this.serveFile('index.html') }
    })

    this.app.onReady()
      .then(this.getPlugins.bind(this))
      .then(this.build.bind(this))
      .then(() => this.log('info', `app available at ${this.app.config.get('adapt-authoring-server.url')}${this.mountPoint}`))
  }

  async getPlugins () {
    return (await Promise.all(Object.values(this.app.dependencies).map(d => {
      if (d.name === this.pkg.name) return
      const pluginDir = path.join(d.rootDir, 'ui')
      return fs.readdir(pluginDir).then(() => pluginDir).catch(() => {})
    }))).filter(Boolean)
  }

  /**
   * Builds the front-end application
   * @param {Array<String>} pluginDirs List of module plugin dirs
   * @return {Promise}
   */
  async build (pluginDirs) { 
    const build = new UiBuild({
      app: this.app,
      log: this.log.bind(this),
      isDev: !this.isProduction,
      mountPoint: this.mountPoint.slice(1),
      srcDir: this.srcDir,
      buildDir: this.buildDir,
      enableWatch: this.app.args.w || this.app.args.watch,
      pluginDirs
    })
    build.preBuildHook.tap(() => this.preBuildHook.invoke(build))
    build.postBuildHook.tap(() => this.postBuildHook.invoke(build))
    await build.run()
  }

  /**
   * Serves a static file
   * @return {Function} Express handler function
   */
  serveAsset () {
    return async (req, res, next) => res.sendFile(path.join(this.buildDir, 'static', req.params.filename))
  }

  /**
   * Serves a static file
   * @param {String} filename
   * @return {Function} Express handler function
   */
  serveFile (filename) {
    return async (req, res, next) => res.sendFile(path.resolve(this.buildDir, filename))
  }
}

export default UiModule

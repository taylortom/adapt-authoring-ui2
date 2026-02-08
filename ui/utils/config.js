import { App } from 'adapt-authoring-core'

const _config = App.instance.config.getPublicConfig()

console.log(_config)

export function getConfig (key) {
  return _config[key]
}

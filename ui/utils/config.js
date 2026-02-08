// Frontend configuration loaded from backend
import packageJson from '../../package.json'

let configCache = null
let configPromise = null

export async function loadConfig () {
  if (configCache) {
    return configCache
  }

  if (configPromise) {
    return configPromise
  }

  configPromise = fetch('/api/config')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to load config')
      }
      return res.json()
    })
    .then(config => {
      configCache = config
      return config
    })
    .catch(error => {
      console.error('Failed to load config, using defaults:', error)
      return {}
    })

  return configPromise
}

export function getConfig (key) {
  if (!configCache) {
    throw new Error('Config not loaded. Call loadConfig() first.')
  }
  if (!key.includes('.')) key = `${packageJson.name}.${key}`
  return configCache[key]
}

export function getConfigSync () {
  return configCache
}

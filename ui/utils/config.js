// Frontend configuration loaded from backend
let configCache = null
let configPromise = null

const FALLBACK_CONFIG = {
  apiUrl: 'http://localhost:3001/api',
  wsUrl: 'ws://localhost:3001'
}

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
      configCache = FALLBACK_CONFIG
      return configCache
    })

  return configPromise
}

export function getConfig (key) {
  if (!configCache) {
    throw new Error('Config not loaded. Call loadConfig() first.')
  }
  return configCache[key]
}

export function getConfigSync () {
  return configCache
}

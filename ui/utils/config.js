// Frontend configuration loaded from backend
import { prefetchApiQuery, getApiQueryData } from './api'
import packageJson from '../../package.json'

export function loadConfig () {
  return prefetchApiQuery('config', (api) => api.get(), { staleTime: Infinity, gcTime: Infinity })
}

export function getConfig (key) {
  const config = getApiQueryData('config')
  if (!config) {
    throw new Error('Config not loaded. Call loadConfig() first.')
  }
  if (!key.includes('.')) key = `${packageJson.name}.${key}`
  return config[key]
}

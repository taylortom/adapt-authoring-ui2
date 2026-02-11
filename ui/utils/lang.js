// Translation utility loaded from backend
import { prefetchApiQuery, getApiQueryData } from './api'

export function loadLang (locale = navigator.language.split('-')[0]) {
  return prefetchApiQuery('lang', (api) => api.get(locale), { staleTime: Infinity })
}

export function t (key, data) {
  const phrases = getApiQueryData('lang')
  if (!phrases) {
    throw new Error('Lang not loaded. Call loadLang() first.')
  }
  const phrase = phrases[key]
  return !phrase ? key : !data ? phrase : phrase.replace(/\$\{(\w+)\}/g, (_, name) => data[name] ?? '')
}

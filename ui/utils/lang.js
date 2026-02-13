// Translation utility loaded from backend
import { prefetchApiQuery, getApiQueryData } from './api'

const TEMP_KEYS = {
  'app.about': 'About',
  'app.assets': 'Assets',
  'app.article': 'Article',
  'app.block': 'Block',
  'app.component': 'Component',
  'app.config': 'Config',
  'app.course': 'Course',
  'app.coursestructure': 'Course structure',
  'app.default': 'Added by default',
  'app.disable': 'Disable',
  'app.enable': 'Enable',
  'app.form': 'Form example',
  'app.menu': 'Menu',
  'app.notdefault': 'Not added by default',
  'app.nousers': 'No users found',
  'app.page': 'Page',
  'app.pagesize': 'Page size',
  'app.plugins': 'Plugins',
  'app.pluginspagesubtitle': 'Manage installed Adapt plugins',
  'app.pluginspagesubtitle': 'Manage installed Adapt plugins',
  'app.projects': 'Projects',
  'app.theme': 'Set theme',
  'app.updateavailable': 'Update available',
  'app.users': 'Users',
}

export function loadLang (locale = navigator.language.split('-')[0]) {
  return prefetchApiQuery('lang', (api) => api.get(locale), { staleTime: Infinity, gcTime: Infinity })
}

export function t (key, data) {
  const phrases = getApiQueryData('lang')
  if (!phrases) {
    throw new Error('Lang not loaded. Call loadLang() first.')
  }
  const phrase = phrases[key] ?? TEMP_KEYS[key]
  return !phrase ? key : !data ? phrase : phrase.replace(/\$\{(\w+)\}/g, (_, name) => data[name] ?? '')
}

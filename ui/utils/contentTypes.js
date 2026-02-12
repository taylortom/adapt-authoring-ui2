import Icons from './icons'

const CONTENT_TYPES = {
  course: { label: 'app.course', icon: Icons.Course, iconColour: '#1565c0', children: ['menu'] },
  menu: { label: 'app.menu', icon: Icons.AdaptMenu, iconColour: '#2e7d32', children: ['menu', 'page'] },
  page: { label: 'app.page', icon: Icons.Page, iconColour: '#ed6c02', children: ['article'] },
  article: { label: 'app.article', icon: Icons.Article, iconColour: '#9c27b0', children: ['block'] },
  block: { label: 'app.block', icon: Icons.Block, iconColour: '#d32f2f', children: ['component'] },
  component: { label: 'app.component', icon: Icons.AdaptComponent, iconColour: '#0288d1', children: [] },
  config: { label: 'app.config', icon: Icons.Settings, iconColour: '#616161', children: [] }
}

export function getAllowedChildTypes (parentType) {
  return CONTENT_TYPES[parentType]?.children ?? []
}

export function getContentTypeIcon (type) {
  return CONTENT_TYPES[type]?.icon ?? Icons.Help
}

export function getContentTypeIconColour (type) {
  return CONTENT_TYPES[type]?.iconColour ?? 'primary.main'
}

export default CONTENT_TYPES

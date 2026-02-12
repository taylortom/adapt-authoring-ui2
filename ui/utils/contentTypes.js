import Icons from './icons'

const CONTENT_TYPES = {
  course: { label: 'app.course', icon: Icons.Course, children: ['menu'] },
  menu: { label: 'app.menu', icon: Icons.AdaptMenu, children: ['menu', 'page'] },
  page: { label: 'app.page', icon: Icons.Page, children: ['article'] },
  article: { label: 'app.article', icon: Icons.Article, children: ['block'] },
  block: { label: 'app.block', icon: Icons.Block, children: ['component'] },
  component: { label: 'app.component', icon: Icons.AdaptComponent, children: [] }
}

export function getAllowedChildTypes (parentType) {
  return CONTENT_TYPES[parentType]?.children ?? []
}

export function getContentTypeIcon (type) {
  return CONTENT_TYPES[type]?.icon ?? Icons.Help
}

export default CONTENT_TYPES

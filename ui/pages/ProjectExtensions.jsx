import { useParams } from 'react-router-dom'
import ListCollection from '../components/ListCollection'
import { useApiQuery, useApiMutation } from '../utils/api'
import Icons from '../utils/icons'
import { t } from '../utils/lang'

const PLUGIN_TYPE_CONFIG = {
  component: { icon: Icons.AdaptComponent, color: 'primary.main' },
  extension: { icon: Icons.AdaptExtension, color: 'secondary.main' },
  menu: { icon: Icons.AdaptMenu, color: 'warning.main' },
  theme: { icon: Icons.AdaptTheme, color: 'error.main' },
  default: { icon: Icons.AdaptPlugin, color: '#757575' }
}

export default function ProjectExtensions () {
  const { id: courseId } = useParams()

  const { data: contentData } = useApiQuery(
    'content',
    (api) => api.query('', { body: { _courseId: courseId } }),
    { key: `project-${courseId}` }
  )

  const items = contentData?.results ?? contentData ?? []
  const config = items.find?.(i => i._type === 'config')
  const course = items.find?.(i => i._type === 'course')
  const enabledPlugins = config?._enabledPlugins ?? []
  const courseTitle = course?.displayTitle || course?.title || ''

  const configMutation = useApiMutation('content', (api, { _id, ...body }) => api.patch(_id, body))

  const togglePlugin = (pluginName) => {
    if (!config?._id) return
    const updated = enabledPlugins.includes(pluginName)
      ? enabledPlugins.filter(n => n !== pluginName)
      : [...enabledPlugins, pluginName]
    configMutation.mutate({ _id: config._id, _enabledPlugins: updated })
  }

  return (
    <ListCollection
      apiRoot='contentplugins'
      transformData={(plugins) =>
        plugins
          .filter(p => p.isEnabled !== false && p.type === 'extension')
          .map(p => ({
            ...p,
            _group: enabledPlugins.includes(p.name) ? 'enabled' : 'available',
            disabled: !enabledPlugins.includes(p.name)
          }))
          .sort((a, b) => a.displayName.localeCompare(b.displayName))}
      groupBy={(p) => p._group}
      groupOrder={['enabled', 'available']}
      groupLabel={(key) => key === 'enabled' ? 'Enabled' : 'Available'}
      mapItem={(plugin) => {
        const config = PLUGIN_TYPE_CONFIG[plugin.type] || PLUGIN_TYPE_CONFIG.default
        const isEnabled = plugin._group === 'enabled'
        return {
          icon: config.icon,
          iconColor: config.color,
          primary: plugin.displayName,
          secondary: plugin.description,
          actions: [
            {
              label: isEnabled ? 'Remove from project' : 'Add to project',
              icon: isEnabled ? Icons.Disable : Icons.Enable,
              color: isEnabled ? 'error' : 'primary',
              onClick: () => togglePlugin(plugin.name)
            }
          ]
        }
      }}
      emptyMessage={t('app.noplugins')}
      title='Extensions'
      subtitle={courseTitle}
      crumbs={[
        { label: t('app.projects'), href: '/' },
        { label: courseTitle, href: `/project/${courseId}` },
        { label: 'Extensions' }
      ]}
    />
  )
}

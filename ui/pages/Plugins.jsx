import { Chip } from '@mui/material'
import ListCollection from '../components/ListCollection'
import { useApiQuery, useApiMutation } from '../utils/api'

import Icons from '../utils/icons'
import { t } from '../utils/lang'

const API_ROOT = 'contentplugins'

const PLUGIN_TYPE_CONFIG = {
  component: { icon: Icons.AdaptComponent, color: 'primary.main' },
  extension: { icon: Icons.AdaptExtension, color: 'secondary.main' },
  menu: { icon: Icons.AdaptMenu, color: 'warning.main' },
  theme: { icon: Icons.AdaptTheme, color: 'error.main' },
  default: { icon: Icons.AdaptPlugin, color: '#757575' }
}

function PluginVersion (plugin) {
  return (
    <>
      {plugin.canBeUpdated ? <Chip color='primary' variant='outlined' label={t('app.updateavailable')} size='small' sx={{ minWidth: 80 }} /> : ''}
      <Chip label={`v${plugin.version}`} size='small' variant='outlined' sx={{ marginLeft: '5px', minWidth: 80 }} />
    </>
  )
}

export default function Plugins () {
  const { data: updateData } = useApiQuery(
    API_ROOT,
    (api) => api.query('?includeUpdateInfo=true'),
    { key: 'updates' }
  )

  const updateMutation = useApiMutation(API_ROOT, (api, { _id, data }) => api.patch(_id, data))
  const deleteMutation = useApiMutation(API_ROOT, (api, { _id }) => api.remove(_id))

  const updateMap = new Map()
  const updateResults = updateData?.results ?? updateData
  if (Array.isArray(updateResults)) {
    updateResults.forEach(p => updateMap.set(p._id, p))
  }

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const typeOrder = Object.keys(PLUGIN_TYPE_CONFIG).filter(k => k !== 'default')

  return (
    <ListCollection
      apiRoot={API_ROOT}
      transformData={(items) =>
        items.map(plugin => {
          const update = updateMap.get(plugin._id)
          return {
            ...plugin,
            ...(update && { canBeUpdated: update.canBeUpdated }),
            disabled: plugin.isEnabled === false
          }
        }).sort((a, b) => a.displayName.localeCompare(b.displayName))}
      groupBy={(plugin) => plugin.type}
      groupOrder={typeOrder}
      groupLabel={(key) => key.charAt(0).toUpperCase() + key.slice(1) + 's'}
      mapItem={(plugin) => {
        const config = PLUGIN_TYPE_CONFIG[plugin.type] || PLUGIN_TYPE_CONFIG.default
        const actions = [
          {
            label: plugin.isEnabled ? t('app.disable') : t('app.enable'),
            icon: plugin.isEnabled ? Icons.Enable : Icons.Disable,
            color: plugin.isEnabled ? 'secondary' : 'disabled',
            onClick: () => updateMutation.mutate({ _id: plugin._id, data: { isEnabled: !plugin.isEnabled } })
          },
          {
            label: plugin.isDefault ? t('app.isdefault') : t('app.notdefault'),
            icon: plugin.isDefault ? Icons.Install : Icons.Uninstall,
            color: plugin.isDefault ? 'secondary' : 'disabled',
            onClick: () => updateMutation.mutate({ _id: plugin._id, data: { isDefault: !plugin.isDefault } })
          },
          ...(plugin.canBeUpdated
            ? [{
                label: t('app.update'),
                icon: Icons.Update,
                color: 'primary',
                onClick: () => console.log('Update plugin:', plugin)
              }]
            : []),
          {
            label: t('app.remove'),
            icon: Icons.Delete,
            color: 'error',
            onClick: () => {
              if (window.confirm(t('app.confirmdelete', { name: plugin.displayName }))) {
                deleteMutation.mutate({ _id: plugin._id })
              }
            }
          }
        ]
        return {
          icon: config.icon,
          iconColor: config.color,
          primary: plugin.displayName,
          secondary: plugin.description,
          secondaryAction: PluginVersion(plugin),
          actions
        }
      }}
      emptyMessage={t('app.noplugins')}
      title={t('app.plugins')}
      subtitle={t('app.pluginspagesubtitle')}
      sidebarItems={[
        { type: 'link', label: 'Components', icon: Icons.AdaptComponent, handleClick: () => scrollTo('component') },
        { type: 'link', label: 'Extensions', icon: Icons.AdaptExtension, handleClick: () => scrollTo('extension') },
        { type: 'link', label: 'Menus', icon: Icons.AdaptMenu, handleClick: () => scrollTo('menu') },
        { type: 'link', label: 'Themes', icon: Icons.AdaptTheme, handleClick: () => scrollTo('theme') }
      ]}
    />
  )
}

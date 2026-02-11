import { useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import Page from '../components/Page'
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

function getPluginTypeIcon (type) {
  if (!PLUGIN_TYPE_CONFIG[type]) console.log('getPluginTypeIcon: missing type', type)
  const config = PLUGIN_TYPE_CONFIG[type] || PLUGIN_TYPE_CONFIG.default
  return config
}

function PluginVersion (plugin) {
  return (
    <>
      {plugin.canBeUpdated ? <Chip color='primary' variant='outlined' label={t('app.updateavailable')} size='small' sx={{ minWidth: 80 }} /> : ''}
      <Chip label={`v${plugin.version}`} size='small' variant='outlined' sx={{ marginLeft: '5px', minWidth: 80 }} />
    </>
  )
}
function PluginListItem ({ plugin, divider }) {
  const typeConfig = getPluginTypeIcon(plugin.type)
  const TypeIcon = typeConfig.icon
  const [open, setOpen] = useState(false)

  const updateMutation = useApiMutation(API_ROOT, (api, { _id, data }) => api.patch(_id, data))
  const deleteMutation = useApiMutation(API_ROOT, (api, { _id }) => api.remove(_id))

  const handleToggleEnabled = (plugin) => {
    updateMutation.mutate({ _id: plugin._id, data: { isEnabled: !plugin.isEnabled } })
  }

  const handleToggleDefault = (plugin) => {
    updateMutation.mutate({ _id: plugin._id, data: { isDefault: !plugin.isDefault } })
  }

  const handleUpdate = (plugin) => {
    // TODO: Implement plugin update logic
    console.log('Update plugin:', plugin)
  }

  const handleDelete = (plugin) => {
    if (window.confirm(t('app.confirmdelete', { name: plugin.displayName }))) {
      deleteMutation.mutate({ _id: plugin._id })
    }
  }

  return (
    <>
      <ListItem key={plugin._id} secondaryAction={PluginVersion(plugin)} disablePadding>
        <ListItemButton divider={divider} onClick={() => setOpen(!open)}>
          <ListItemAvatar><Avatar sx={{ bgcolor: typeConfig.color }}><TypeIcon /></Avatar></ListItemAvatar>
          <ListItemText primary={plugin.displayName} secondary={plugin.description} />
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout='auto' unmountOnExit sx={{ bgcolor: 'dark' }}>
        <Stack direction='row' spacing='1px' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant='contained'
            endIcon={plugin.isEnabled ? (<Icons.Enable />) : (<Icons.Disable />)}
            aria-label='enabled'
            onClick={() => handleToggleEnabled(plugin)}
            disabled={updateMutation.isPending}
            color={plugin.isEnabled ? 'secondary' : 'disabled'}
            sx={{ borderRadius: 0, flex: 1 }}
          >
            {plugin.isEnabled ? t('app.disable') : t('app.enable')}
          </Button>
          <Button
            variant='contained'
            endIcon={plugin.isDefault ? (<Icons.Install />) : (<Icons.Uninstall />)}
            aria-label='default'
            onClick={() => handleToggleDefault(plugin)}
            disabled={updateMutation.isPending}
            color={plugin.isDefault ? 'secondary' : 'disabled'}
            sx={{ borderRadius: 0, flex: 1 }}
          >
            {plugin.isDefault ? t('app.isdefault') : t('app.notdefault')}
          </Button>
          {plugin.canBeUpdated
            ? <Button
                variant='contained'
                endIcon={updateMutation.isPending ? (<CircularProgress size={24} />) : (<Icons.Update />)}
                aria-label='enabled'
                onClick={() => handleUpdate(plugin)}
                disabled={updateMutation.isPending}
                color='primary'
                sx={{ borderRadius: 0, flex: 1 }}
              >
              {t('app.update')}
            </Button>
            : ''}
          <Button
            variant='contained'
            endIcon={deleteMutation.isPending ? (<CircularProgress size={24} />) : (<Icons.Delete />)}
            aria-label='enabled'
            onClick={() => handleDelete(plugin)}
            disabled={updateMutation.isPending}
            color='error'
            sx={{ borderRadius: 0, flex: 1 }}
          >
            {t('app.remove')}
          </Button>
        </Stack>
      </Collapse>
    </>
  )
}

export default function ContentPluginsPage () {
  const { data, isLoading, error } = useApiQuery(API_ROOT, (api) => api.get())
  const { data: updateData } = useApiQuery(
    API_ROOT,
    (api) => api.query('?includeUpdateInfo=true'),
    { key: 'updates' }
  )

  if (isLoading) {
    return (
      <>
        <Container>
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='50vh'>
            <CircularProgress />
          </Box>
        </Container>
      </>
    )
  }
  if (error) {
    return (
      <>
        <Container sx={{ mt: 4 }}>
          <Alert severity='error'>{t('app.errorloadingdata')}: {error.message}</Alert>
        </Container>
      </>
    )
  }

  const updateMap = new Map()
  if (Array.isArray(updateData)) {
    updateData.forEach(p => updateMap.set(p._id, p))
  }

  const plugins = Array.isArray(data)
    ? [...data].map(plugin => {
        const update = updateMap.get(plugin._id)
        return update ? { ...plugin, canBeUpdated: update.canBeUpdated } : plugin
      }).sort((a, b) => a.displayName.localeCompare(b.displayName))
    : []

  const pluginsByType = Object.groupBy(plugins, p => p.type)
  const typeOrder = Object.keys(PLUGIN_TYPE_CONFIG).filter(k => k !== 'default')

  const crumbs = [
    { label: t('app.dashboard'), href: '/' },
    { label: t('app.plugins') }
  ]
  const actions = [
    { label: t('app.update'), icon: Icons.Update },
    { label: t('app.delete'), icon: Icons.Delete }
  ]
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const sidebarItems = [
    { type: 'link', label: 'Components', icon: Icons.AdaptComponent, handleClick: () => scrollTo('component') },
    { type: 'link', label: 'Extensions', icon: Icons.AdaptExtension, handleClick: () => scrollTo('extension') },
    { type: 'link', label: 'Menus', icon: Icons.AdaptMenu, handleClick: () => scrollTo('menu') },
    { type: 'link', label: 'Themes', icon: Icons.AdaptTheme, handleClick: () => scrollTo('theme') },
  ]
  return (
    <Page title={t('app.plugins')} subtitle={t('app.pluginspagesubtitle')} actions={actions} crumbs={crumbs} sidebarItems={sidebarItems} includePaper={false}>
      {plugins.length === 0
        ? (<Alert severity='info'>{t('app.noplugins')}</Alert>)
        : typeOrder.map(type => {
            const group = pluginsByType[type]
            if (!group?.length) return null
            return (
              <Paper key={type} id={type} sx={{ mb: 3 }}>
                <Typography variant='subtitle1' sx={{ px: 2, pt: 2, pb: 1 }}>
                  {type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                </Typography>
                <List disablePadding>
                  {group.map((plugin, index) => (
                    <PluginListItem key={plugin._id} plugin={plugin} divider={index < group.length - 1} />
                  ))}
                </List>
              </Paper>
            )
          })}
    </Page>
  )
}

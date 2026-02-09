import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { useApi } from '../utils/api'

import AddLinkIcon from '@mui/icons-material/AddLink'
import ArticleIcon from '@mui/icons-material/Article'
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode'
import DeleteIcon from '@mui/icons-material/Delete'
import ExtensionIcon from '@mui/icons-material/Extension'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import PaletteIcon from '@mui/icons-material/Palette'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import WindowIcon from '@mui/icons-material/Window'

const api = useApi('contentplugins')

const PLUGIN_TYPE_CONFIG = {
  component: { icon: ChromeReaderModeIcon, color: 'primary.main' },
  extension: { icon: ExtensionIcon, color: 'secondary.main' },
  menu: { icon: WindowIcon, color: 'warning.main' },
  theme: { icon: PaletteIcon, color: 'error.main' },
  default: { icon: ArticleIcon, color: '#757575' }
}

function getPluginTypeIcon (type) {
  if (!PLUGIN_TYPE_CONFIG[type]) console.log('getPluginTypeIcon: missing type', type)
  const config = PLUGIN_TYPE_CONFIG[type] || PLUGIN_TYPE_CONFIG.default
  return config
}

function PluginVersion (plugin) {
  return (
    <>
      {plugin.canBeUpdated ? <Chip color='primary' variant='outlined' label='Update available' size='small' sx={{ minWidth: 80 }} /> : ''}
      <Chip label={`v${plugin.version}`} size='small' variant='outlined' sx={{ marginLeft: '5px', minWidth: 80 }} />
    </>
  )
}
function PluginListItem ({ plugin, divider }) {
  const queryClient = useQueryClient()
  const typeConfig = getPluginTypeIcon(plugin.type)
  const TypeIcon = typeConfig.icon
  const [open, setOpen] = useState(false)

  const updateMutation = useMutation({
    mutationFn: api.patch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.key] })
  })

  const deleteMutation = useMutation({
    mutationFn: ({ pluginId }) => api.delete(pluginId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.key] })
  })

  const handleToggleEnabled = (plugin) => {
    updateMutation.mutate(plugin._id, { isEnabled: !plugin.isEnabled })
  }

  const handleToggleDefault = (plugin) => {
    updateMutation.mutate(plugin._id, { isDefault: !plugin.isDefault })
  }

  const handleUpdate = (plugin) => {
    // TODO: Implement plugin update logic
    console.log('Update plugin:', plugin)
  }

  const handleDelete = (plugin) => {
    if (window.confirm(`Are you sure you want to delete "${plugin.displayName}"?`)) {
      deleteMutation.mutate(plugin._id)
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
            endIcon={plugin.isEnabled ? (<VisibilityIcon />) : (<VisibilityOffIcon />)}
            aria-label='enabled'
            onClick={() => handleToggleEnabled(plugin)}
            disabled={updateMutation.isPending}
            color={plugin.isEnabled ? 'secondary' : 'disabled'}
            sx={{ borderRadius: 0, flex: 1 }}
          >
            {plugin.isEnabled ? 'Disable' : 'Enable'}
          </Button>
          <Button
            variant='contained'
            endIcon={plugin.isDefault ? (<AddLinkIcon />) : (<LinkOffIcon />)}
            aria-label='default'
            onClick={() => handleToggleDefault(plugin)}
            disabled={updateMutation.isPending}
            color={plugin.isDefault ? 'secondary' : 'disabled'}
            sx={{ borderRadius: 0, flex: 1 }}
          >
            {plugin.isDefault ? 'Is default' : 'Not default'}
          </Button>
          {plugin.canBeUpdated
            ? <Button
                variant='contained'
                endIcon={updateMutation.isPending ? (<CircularProgress size={24} />) : (<FileUploadIcon />)}
                aria-label='enabled'
                onClick={() => handleUpdate(plugin)}
                disabled={updateMutation.isPending}
                color='primary'
                sx={{ borderRadius: 0, flex: 1 }}
              >
              Update
              </Button>
            : ''}
          <Button
            variant='contained'
            endIcon={deleteMutation.isPending ? (<CircularProgress size={24} />) : (<DeleteIcon />)}
            aria-label='enabled'
            onClick={() => handleDelete(plugin)}
            disabled={updateMutation.isPending}
            color='error'
            sx={{ borderRadius: 0, flex: 1 }}
          >
            Remove
          </Button>
        </Stack>
      </Collapse>
    </>
  )
}

export default function ContentPluginsPage () {
  const { data, isLoading, error } = useQuery({
    queryKey: [api.key],
    queryFn: () => api.get()
  })
  const { data: updateData } = useQuery({
    queryKey: [api.key, 'updates'],
    queryFn: () => api.query('?includeUpdateInfo=true')
  })

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
          <Alert severity='error'>Error loading content plugins: {error.message}</Alert>
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

  const crumbs = [
    { label: 'Dashboard', href: '/' },
    { label: 'Content Plugins' }
  ]
  const actions = [
    { label: 'Update', icon: FileUploadIcon },
    { label: 'Selete', icon: DeleteIcon }
  ]
  const links = [
    { label: 'Dashboard', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Content Plugins', href: '/contentplugins' }
  ]
  return (
    <Page title='Content Plugins' body='Installed content plugins available in the authoring tool' actions={actions} crumbs={crumbs} links={links}>
      {plugins.length === 0
        ? (<Alert severity='info'>No content plugins installed</Alert>)
        : (<List>{plugins.map((plugin, index) => (<PluginListItem key={plugin._id} plugin={plugin} divider={index < plugins.length - 1} />))}</List>)}
    </Page>
  )
}

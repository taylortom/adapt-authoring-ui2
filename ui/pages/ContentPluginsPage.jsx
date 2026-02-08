import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert, Box, Checkbox, Chip, CircularProgress, Container, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Stack, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import UpdateIcon from '@mui/icons-material/Update'
import ArticleIcon from '@mui/icons-material/Article'
import PaletteIcon from '@mui/icons-material/Palette'
import WindowIcon from '@mui/icons-material/Window'
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode'
import ExtensionIcon from '@mui/icons-material/Extension'
import PageBar from '../components/PageBar'

const PLUGIN_TYPE_CONFIG = {
  component: { icon: ChromeReaderModeIcon, color: 'primary.name' },
  extension: { icon: ExtensionIcon, color: 'secondary.main' },
  menu: { icon: WindowIcon, color: 'warning.main' },
  theme: { icon: PaletteIcon, color: 'error.main' },
  default: { icon: ArticleIcon, color: '#757575' }
}

function getPluginTypeIcon (type) {
  const config = PLUGIN_TYPE_CONFIG[type] || PLUGIN_TYPE_CONFIG.default
  return config
}

async function fetchContentPlugins () {
  const response = await fetch('/api/contentplugins', {
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Failed to fetch content plugins')
  }
  return response.json()
}

async function updatePlugin (pluginId, updates) {
  const response = await fetch(`/api/contentplugins/${pluginId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates)
  })
  if (!response.ok) {
    throw new Error('Failed to update plugin')
  }
  return response.json()
}

async function deletePlugin (pluginId) {
  const response = await fetch(`/api/contentplugins/${pluginId}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Failed to delete plugin')
  }
}

export default function ContentPluginsPage () {
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['contentplugins'],
    queryFn: fetchContentPlugins
  })

  const updateMutation = useMutation({
    mutationFn: ({ pluginId, updates }) => updatePlugin(pluginId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentplugins'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deletePlugin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentplugins'] })
      setDeletingId(null)
    }
  })

  const handleToggleEnabled = (plugin) => {
    updateMutation.mutate({
      pluginId: plugin._id,
      updates: { isEnabled: !plugin.isEnabled }
    })
  }

  const handleToggleDefault = (plugin) => {
    updateMutation.mutate({
      pluginId: plugin._id,
      updates: { isDefault: !plugin.isDefault }
    })
  }

  const handleUpdate = (plugin) => {
    // TODO: Implement plugin update logic
    console.log('Update plugin:', plugin)
  }

  const handleDelete = (plugin) => {
    if (window.confirm(`Are you sure you want to delete "${plugin.displayName || plugin.name}"?`)) {
      setDeletingId(plugin._id)
      deleteMutation.mutate(plugin._id)
    }
  }

  if (isLoading) {
    return (
      <>
        <PageBar title='Content Plugins' />
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
        <PageBar title='Content Plugins' />
        <Container sx={{ mt: 4 }}>
          <Alert severity='error'>Error loading content plugins: {error.message}</Alert>
        </Container>
      </>
    )
  }

  const plugins = Array.isArray(data) ? data : []

  return (
    <>
      <PageBar title='Content Plugins' />
      <Container sx={{ mt: 4 }}>
        <Typography variant='body1' color='text.secondary' paragraph>
          Installed content plugins available in the authoring tool
        </Typography>
        {plugins.length === 0
          ? (<Alert severity='info'>No content plugins installed</Alert>)
          : (
            <Paper elevation={2}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', px: 2, py: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
                <Stack direction='row' spacing={1} alignItems='center'>
                  <Typography variant='body2' sx={{ minWidth: 80 }}>Version</Typography>
                  <Typography variant='body2' sx={{ minWidth: 80, textAlign: 'center' }}>Enabled</Typography>
                  <Typography variant='body2' sx={{ minWidth: 80, textAlign: 'center' }}>Default</Typography>
                  <Box sx={{ width: 48 }} />
                  <Box sx={{ width: 48 }} />
                </Stack>
              </Box>
              <List>
                {plugins.map((plugin, index) => {
                  const typeConfig = getPluginTypeIcon(plugin.type)
                  const TypeIcon = typeConfig.icon
                  return (
                    <ListItem
                      key={plugin._id || plugin.name || index}
                      divider={index < plugins.length - 1}
                      secondaryAction={
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Chip label={`v${plugin.version}`} size='small' variant='outlined' sx={{ minWidth: 80 }} />
                          <Box sx={{ minWidth: 80, display: 'flex', justifyContent: 'center' }}>
                            <Checkbox checked={plugin.isEnabled} onChange={() => handleToggleEnabled(plugin)} disabled={updateMutation.isPending} />
                          </Box>
                          <Box sx={{ minWidth: 80, display: 'flex', justifyContent: 'center' }}>
                            <Checkbox checked={plugin.isDefault} onChange={() => handleToggleDefault(plugin)} disabled={updateMutation.isPending} />
                          </Box>
                          <IconButton color='primary' aria-label='update' onClick={() => handleUpdate(plugin)} disabled={updateMutation.isPending}>
                            <UpdateIcon />
                          </IconButton>
                          <IconButton color='error' aria-label='delete' onClick={() => handleDelete(plugin)} disabled={deleteMutation.isPending && deletingId === plugin._id}>
                            {deleteMutation.isPending && deletingId === plugin._id ? (<CircularProgress size={24} />) : (<DeleteIcon />)}
                          </IconButton>
                        </Stack>
                      }
                    >
                      <ListItemIcon><TypeIcon sx={{ color: typeConfig.color, fontSize: 40 }} /></ListItemIcon>
                      <ListItemText primary={plugin.displayName} secondary={plugin.description} />
                    </ListItem>
                  )
                })}
              </List>
            </Paper>
            )}
      </Container>
    </>
  )
}

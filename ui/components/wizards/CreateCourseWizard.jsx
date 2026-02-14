import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import Wizard from '../Wizard'
import SchemaForm from '../SchemaForm'
import { createApiClient, useApiQuery } from '../../utils/api'
import adaptLogo from '../../assets/images/adapt_logo.png'

const COURSE_FIELDS = ['title', 'description', 'heroImage', '_isShared', '_shareWithUsers']

export default function CreateCourseWizard ({ open, onClose }) {
  const navigate = useNavigate()
  const [courseData, setCourseData] = useState({})
  const [selectedTheme, setSelectedTheme] = useState('')
  const [selectedExtensions, setSelectedExtensions] = useState([])

  const { data: pluginsData } = useApiQuery(
    'contentplugins',
    (api) => api.query('', { body: { isEnabled: true } }),
    { key: 'enabled' }
  )

  const plugins = pluginsData?.results ?? pluginsData ?? []
  const themes = useMemo(() => plugins.filter(p => p.type === 'theme'), [plugins])
  const extensions = useMemo(() => plugins.filter(p => p.type === 'extension'), [plugins])

  const toggleExtension = (name) => {
    setSelectedExtensions(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const handleComplete = async () => {
    const api = createApiClient('content')
    const course = await api.post({ _type: 'course', ...courseData })
    const { results } = await api.query('', { body: { _courseId: course._id } })
    const items = Array.isArray(results) ? results : []
    const config = items.find(i => i._type === 'config')
    if (config) {
      await api.patch(config._id, { _theme: selectedTheme, _enabledPlugins: selectedExtensions })
    }
    onClose()
    navigate(`/project/${course._id}`)
  }

  const steps = [
    {
      label: 'Welcome',
      content: (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Box component='img' src={adaptLogo} alt='Adapt' sx={{ maxWidth: 200, mb: 3 }} />
          <Typography variant='h5' gutterBottom>Create a new project</Typography>
          <Typography color='text.secondary'>
            This wizard will guide you through setting up your new course. You'll configure the basic details, choose a theme, and select which extensions to include.
          </Typography>
        </Box>
      )
    },
    {
      label: 'Course details',
      content: (
        <SchemaForm
          apiName='content'
          queryString='_type=course'
          formData={courseData}
          onChange={({ formData }) => setCourseData(formData)}
          fields={COURSE_FIELDS}
        />
      )
    },
    {
      label: 'Theme',
      content: (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Theme</InputLabel>
          <Select
            value={selectedTheme}
            label='Theme'
            onChange={(e) => setSelectedTheme(e.target.value)}
          >
            {themes.map(t => (
              <MenuItem key={t.name} value={t.name}>{t.displayName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    },
    {
      label: 'Extensions',
      content: (
        <List>
          {extensions.map(ext => (
            <ListItem key={ext.name} disablePadding>
              <ListItemButton onClick={() => toggleExtension(ext.name)}>
                <Checkbox checked={selectedExtensions.includes(ext.name)} edge='start' tabIndex={-1} disableRipple />
                <ListItemText primary={ext.displayName} secondary={ext.description} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )
    }
  ]

  return (
    <Wizard
      open={open}
      onClose={onClose}
      onComplete={handleComplete}
      title='Create new project'
      steps={steps}
    />
  )
}

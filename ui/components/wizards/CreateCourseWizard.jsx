import { Box, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createApiClient, useApiQuery } from '../../utils/api'
import Icons from '../../utils/icons'
import Wizard from '../Wizard'

export default function CreateCourseWizard ({ open, onClose }) {
  const navigate = useNavigate()
  const [activePath, setActivePath] = useState(null)

  const { data: pluginsData } = useApiQuery(
    'contentplugins',
    (api) => api.query('', { body: { isEnabled: true } }),
    { key: 'enabled' }
  )

  const plugins = pluginsData?.results ?? pluginsData ?? []
  const themes = useMemo(() => plugins.filter(p => p.type === 'theme').map(t => ({ key: t.name, label: t.displayName })), [plugins])
  const extensions = useMemo(() => plugins.filter(p => p.type === 'extension').map(e => ({ key: e.name, label: e.displayName, description: e.description })), [plugins])

  const handleComplete = async (stepData) => {
    if (activePath === 'scratch') {
      const api = createApiClient('content')
      const course = await api.post({ _type: 'course', ...stepData.basicInfo })
      const { results } = await api.query('', { body: { _courseId: course._id } })
      const items = Array.isArray(results) ? results : []
      const config = items.find(i => i._type === 'config')
      if (config) {
        await api.patch(config._id, { _theme: stepData.theme, _enabledPlugins: stepData.extensions ?? [] })
      }
      onClose()
      navigate(`/project/${course._id}`)
    }
  }

  const paths = [
    {
      key: 'scratch',
      label: 'Start afresh',
      description: 'Start with a blank course and configure everything yourself.',
      icon: Icons.Add,
      steps: [
        {
          key: 'basicInfo',
          label: 'Basic Info',
          title: 'Add some basic information to your course',
          type: 'form',
          apiName: 'content',
          queryString: '_type=course',
          fields: ['displayTitle', 'description', 'heroImage']
        },
        {
          key: 'theme',
          label: 'Theme',
          title: 'Choose a theme',
          type: 'select',
          items: themes
        },
        {
          key: 'extensions',
          label: 'Extensions',
          title: 'Customise the functionality',
          type: 'select',
          multiple: true,
          items: extensions
        },
        {
          key: 'sharing',
          label: 'Sharing',
          title: 'Set who can access your course',
          type: 'form',
          apiName: 'content',
          queryString: '_type=course',
          fields: ['_isShared', '_shareWithUsers']
        }
      ]
    },
    {
      key: 'import',
      label: 'Import a course',
      description: 'Import an existing course from a zip file.',
      icon: Icons.Zip,
      steps: [
        {
          key: 'upload',
          label: 'Upload',
          type: 'custom',
          content: (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant='h6' gutterBottom>Import course</Typography>
              <Typography color='text.secondary'>Course import coming soon.</Typography>
            </Box>
          )
        }
      ]
    }
  ]

  return (
    <Wizard
      open={open}
      onClose={onClose}
      onComplete={handleComplete}
      onPathChange={setActivePath}
      paths={paths}
    />
  )
}

import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import GridCollection from '../components/GridCollection'
import { t } from '../utils/lang'
import Icons from '../utils/icons'

import projectPlaceholder from '../assets/images/project_placeholder.jpg'

function ProjectCard ({ project }) {
  const navigate = useNavigate()
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea>
        <CardMedia
          component='img'
          height='140'
          image={project.heroImage ? `/api/assets/serve/${project.heroImage}` : projectPlaceholder}
          alt={project.title}
          sx={{ bgcolor: 'grey.200' }}
        />
        <CardContent>
          <Typography variant='subtitle1' color='secondary' align='center' noWrap>{project.title}</Typography>
          <Typography variant='overline' color='text.secondary' align='center' display='block'>
            {t('app.lastupdated')}
          </Typography>
          <Typography variant='caption' color='text.secondary' align='center' display='block'>
            {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Tooltip title={t('app.edit')}>
          <IconButton size='small' color='primary' onClick={() => navigate(`/project/${project._id}`)}>
            <Icons.Edit />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  )
}

export default function Projects () {
  const crumbs = [
    { label: t('app.dashboard'), href: '/' },
    { label: t('app.projects') }
  ]
  const dial = {
    label: 'course actions',
    actions: [
      { icon: Icons.Add, label: t('app.addnewproject') },
      { icon: Icons.Import, label: t('app.importcourse') }
    ]
  }
  const sidebarItems = [
    { type: 'button', label: t('app.addnewproject'), handleClick: () => {} },
    { type: 'button', style: 'secondary', label: t('app.importcourse'), handleClick: () => {} }
  ]

  return (
    <GridCollection
      apiRoot='content'
      queryBody={{ _type: 'course' }}
      sortOptions={[
        { value: 'title', label: t('app.title') },
        { value: 'updatedAt', label: t('app.lastupdated') }
      ]}
      defaultSort={{ field: 'updatedAt', order: -1 }}
      pageSizeOptions={[12, 24, 48]}
      renderItem={(item) => <ProjectCard project={item} />}
      title={t('app.projects')}
      crumbs={crumbs}
      dial={dial}
      sidebarItems={sidebarItems}
      fullWidth
    />
  )
}

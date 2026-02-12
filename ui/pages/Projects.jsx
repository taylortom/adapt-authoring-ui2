import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TablePagination,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import Page from '../components/Page'
import { useApiQuery } from '../utils/api'
import { t } from '../utils/lang'
import Icons from '../utils/icons'

import projectPlaceholder from '../assets/images/project_placeholder.jpg'

const API_ROOT = 'content'
const PAGE_SIZE = 12

export default function Projects () {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [sortField, setSortField] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState(-1)
  const [search, setSearch] = useState('')
  const searchTimer = useRef(null)

  const params = new URLSearchParams({
    skip: String(page * limit),
    limit: String(limit),
    sort: JSON.stringify({ [sortField]: sortOrder })
  })
  if (search) params.set('search', search)

  const { data, isLoading, error } = useApiQuery(
    API_ROOT,
    (api) => api.query(`?${params}`, { body: { _type: 'course' } }),
    { key: params.toString() }
  )

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setSearch(value)
      setPage(0)
    }, 300)
  }, [])

  const handleSortFieldChange = (e) => {
    setSortField(e.target.value)
    setPage(0)
  }

  const handleToggleSortOrder = () => {
    setSortOrder(prev => prev === 1 ? -1 : 1)
    setPage(0)
  }

  const handlePageChange = (_, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (e) => {
    setLimit(parseInt(e.target.value, 10))
    setPage(0)
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity='error'>{t('app.errorloadingdata')}: {error.message}</Alert>
      </Container>
    )
  }

  const projects = Array.isArray(data) ? data : []
  const crumbs = [
    { label: t('app.dashboard'), href: '/' },
    { label: t('app.projects') }
  ]
  const actions = [
    { icon: Icons.Add, color: 'primary' }
  ]
  const sidebarItems = [
    { type: 'button', label: t('app.createcourse'), handleClick: () => {} },
    { type: 'button', style: 'secondary', label: t('app.importsource'), handleClick: () => {} },
  ]

  return (
    <Page title={t('app.projects')} crumbs={crumbs} actions={actions} sidebarItems={sidebarItems} includePaper={false}>
      <Stack direction='row' spacing={0} sx={{ mb: 3, alignItems: 'center' }}>
        <TextField
          size='small'
          placeholder={t('app.search')}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'><SearchIcon /></InputAdornment>
              )
            }
          }}
          sx={{ flex: 1, maxWidth: 400 }}
        />
        <Select size='small' value={sortField} onChange={handleSortFieldChange}>
          <MenuItem value='title'>{t('app.title')}</MenuItem>
          <MenuItem value='updatedAt'>{t('app.lastupdated')}</MenuItem>
        </Select>
        <Tooltip title={sortOrder === 1 ? t('app.ascending') : t('app.descending')}>
          <IconButton size='small' onClick={handleToggleSortOrder}>
            {sortOrder === 1 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </Tooltip>
      </Stack>

      {isLoading
        ? (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='30vh'>
            <CircularProgress />
          </Box>
          )
        : projects.length === 0
          ? (<Alert severity='info'>{t('app.noresults')}</Alert>)
          : (
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid key={project._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardActionArea>
                      <CardMedia
                        component='img'
                        height='140'
                        image={project.heroImage ? `api/assets/serve/${project.heroImage}` : projectPlaceholder}
                        alt={project.title}
                        sx={{ bgcolor: 'grey.200' }}
                      />
                      <CardContent>
                        <Typography variant='subtitle1' color='secondary' align='center' noWrap>{project.title}</Typography>
                        <Typography variant='overline' color='text.secondary' align='center' display='block'>
                          {t('app.lastupdated')}
                        </Typography>
                        <Typography variant='caption' color='text.secondary' align='center' display='block'>
                          {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric"  }) : ''}
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
                </Grid>
              ))}
            </Grid>
            )}

      <TablePagination
        component='div'
        count={-1}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[12, 24, 48]}
        labelDisplayedRows={({ from, to }) => `${from}–${to}`}
      />
    </Page>
  )
}

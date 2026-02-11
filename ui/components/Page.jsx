import { usePreferences } from '../contexts/UserPreferencesContext'
import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Drawer,
  Fab,
  IconButton,
  Link,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useTheme
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { t } from '../utils/lang'

function Actions (items) {
  if (!items?.length) {
    return ''
  }
  return (
    <Stack direction='row' spacing={1}>
      {items.map((item, i) => <Fab key={i} color={item.color ?? 'secondary'} size='medium' aria-label={item.label} sx={{ boxShadow: 'none' }}><item.icon /></Fab>)}
    </Stack>
  )
}

function Crumbs (items) {
  if (!items?.length) {
    return ''
  }
  return (
    <Breadcrumbs separator='›' aria-label='breadcrumb'>
      {items.map((item, i) => item.href
        ? <Link key={i} underline='hover' color='inherit' href={item.href}>{item.label}</Link>
        : <Typography key={i} color='primary'>{item.label}</Typography>)}
    </Breadcrumbs>
  )
}

function Links (items) {
  if (!items?.length) {
    return ''
  }
  return (
    <AppBar position='sticky' color='tertiary'>
      <Toolbar variant='dense' sx={{ minHeight: 'auto', px: 1, py: 0.5 }}>
        <Stack direction='row' sx={{ justifyContent: 'center', width: '100%' }}>
          {items.map((item, i) => <Button key={i} color={item.color ?? 'primary'} size='medium' aria-label={item.label}>{item.label}</Button>)}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

function Sidebar ({ children }) {
  const { sidebarOpen: open, setSidebarOpen: setOpen } = usePreferences()
  const theme = useTheme()
  const toolbarHeight = theme.mixins.toolbar.minHeight
  const drawerWidth = theme.custom.drawerWidth
  const style = {
    width: open ? drawerWidth : 0,
    flexShrink: 0,
    transition: 'width 0.3s ease',
    '& .MuiDrawer-paper': {
      position: 'fixed',
      top: toolbarHeight,
      left: 0,
      height: `calc(100vh - ${toolbarHeight}px)`,
      boxSizing: 'border-box',
      overflowX: 'hidden',
      width: open ? drawerWidth : 0,
      transition: 'width 0.3s ease',
      bgcolor: 'tertiary.main'
    }
  }
  return (
    <>
      {!open && (
        <IconButton
          size='small'
          color='primary'
          aria-label={t('app.opensidebar')}
          onClick={() => setOpen(true)}
          sx={{ position: 'fixed', top: toolbarHeight + 8, left: 8, p: 2, zIndex: 'drawer' }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
      <Drawer variant='permanent' anchor='left' sx={style}>
        <Box sx={{ p: 2, alignSelf: 'flex-end' }}>
          <IconButton size='small' color='primary' aria-label={t('app.closesidebar')} onClick={() => setOpen(false)} sx={{ boxShadow: 'none' }}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        {children}
      </Drawer>
    </>
  )
}

export default function Page ({ title = '', subtitle = '', actions = {}, crumbs = [], links = [], children, sidebarChildren, contentPadding = 4 }) {
  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      <Sidebar>
        {sidebarChildren}
      </Sidebar>
      <Box sx={{ flex: 6, overflow: 'auto' }}>
        <AppBar position='sticky' sx={{ p: 3, bgcolor: 'background.paper', color: 'text.primary' }}>
          <Container>
            {Crumbs(crumbs)}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='h4'>{title}</Typography>
              {Actions(actions)}
            </Box>
            {subtitle ? <Typography variant='subtitle1'>{subtitle}</Typography> : ''}
          </Container>
        </AppBar>
        {Links(links)}
        <Box>
          <Container sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: contentPadding }}>
              {children}
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

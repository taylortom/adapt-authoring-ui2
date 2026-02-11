import { useState } from 'react'
import {
  AppBar,
  Box,
  Breadcrumbs,
  Container,
  Drawer,
  Fab,
  IconButton,
  Link,
  Paper,
  Stack,
  Toolbar,
  Typography
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

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
      <Toolbar>
        <Stack direction='row' spacing={2} sx={{ justifyContent: 'center' }}>
          {items.map((item, i) => <Link key={i} href={item.href}><Typography variant='button'>{item.label}</Typography></Link>)}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

function Sidebar ({ children }) {
  const [open, setOpen] = useState(true)
  const style = {
    flex: open ? 1 : 0,
    transition: 'flex 0.6s ease',
    '& .MuiDrawer-paper': {
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden',
      width: open ? 'auto' : 0,
      transition: 'width 0.3s ease',
      bgcolor: 'tertiary.main'
    }
  }
  return (
    <Drawer variant='permanent' anchor='left' sx={style}>
      <Box sx={{ p: 2, alignSelf: 'flex-end' }}>
        <IconButton size='small' color='primary' aria-label={open ? t('app.closesidebar') : t('app.opensidebar')} onClick={() => setOpen(!open)} sx={{ boxShadow: 'none' }}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      {children}
    </Drawer>
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

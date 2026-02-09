import { useState } from 'react'
import {
  Box,
  Breadcrumbs,
  Container,
  Drawer,
  Fab,
  Link,
  Paper,
  Stack,
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
      {items.map((item, i) => <Fab key={i} color={item.color ?? 'secondary'} size='medium' aria-label={item.label}><item.icon /></Fab>)}
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
    <Stack direction='row' spacing={2} sx={{ p: 1, bgcolor: 'tertiary.main', justifyContent: 'center' }}>
      {items.map((item, i) => <Link key={i} href={item.href}><Typography variant='button'>{item.label}</Typography></Link>)}
    </Stack>
  )
}

function Sidebar ({ children }) {
  const [open, setOpen] = useState(true)
  const style = {
    flex: open ? 1 : 0,
    transition: 'flex 0.3s ease',
    '& .MuiDrawer-paper': {
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden',
      width: open ? 'auto' : 0,
      transition: 'width 0.3s ease'
    }
  }
  return (
    <Drawer variant='permanent' anchor='left' sx={style}>
      <Box sx={{ p: 2, alignSelf: 'flex-end' }}>
        <Fab size='small' color='primary' aria-label={open ? 'close sidebar' : 'open sidebar'} onClick={() => setOpen(!open)}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </Fab>
      </Box>
      {children}
    </Drawer>
  )
}

export default function Page ({ title = '', body = '', actions = {}, crumbs = [], links = [], children, sidebarChildren }) {
  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      <Sidebar>
        {sidebarChildren}
      </Sidebar>
      <Box sx={{ flex: 6, overflow: 'auto' }}>
        <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', py: 2 }}>
          <Container>
            {Crumbs(crumbs)}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='h4' component='h1'>{title}</Typography>
              {Actions(actions)}
            </Box>
          </Container>
        </Box>
        {Links(links)}
        <Box>
          <Container sx={{ mt: 4, mb: 4 }}>
            {body && <Typography variant='body1' color='text.secondary' sx={{ mt: 4, mb: 4 }}>{body}</Typography>}
            <Paper sx={{ p: 4 }}>
              {children}
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Fab,
  Link,
  Paper,
  Stack,
  Toolbar,
  Typography
} from '@mui/material'
import Sidebar from './Sidebar'

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

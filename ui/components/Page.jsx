import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Fab,
  Link,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
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
      {items.map((item, i) => <Fab key={i} color={item.color ?? 'secondary'} size='medium' href={item.href} aria-label={item.label} sx={{ boxShadow: 'none' }}><item.icon /></Fab>)}
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
    <AppBar position='sticky' sx={{ bgcolor: 'tertiary.main', color: 'secondary.main' }}>
      <Toolbar variant='dense' sx={{ minHeight: 'auto', px: 1, py: 0.5 }}>
        <Stack direction='row' sx={{ justifyContent: 'center', width: '100%' }}>
          {items.map((item, i) => <Button key={i} color={item.color ?? 'primary'} size='medium' href={item.href} aria-label={item.label}>{item.label}</Button>)}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

function SpeedDialActions (data) {
  if (!data) {
    return ''
  }
  const Icon = data.icon
  return (
    <SpeedDial
      ariaLabel={data.label}
      icon={Icon ? <Icon /> : <SpeedDialIcon />}
      direction='down'
      FabProps={{ color: 'primary', size: 'medium', sx: { boxShadow: 'none' } }}
      sx={{
        '& .MuiSpeedDial-actions': { position: 'absolute', top: '100%' },
        '& .MuiSpeedDialAction-staticTooltipLabel': { whiteSpace: 'nowrap' }
      }}
    >
      {data.actions?.map((a, j) => (
        <SpeedDialAction
          key={j}
          icon={<a.icon />}
          slotProps={{
            tooltip: { open: true, title: a.label },
            fab: {
              sx: {
                p: 2,
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                '&:hover': { bgcolor: 'secondary.dark' }
              }
            }
          }}
          onClick={a.handleClick}
        />
      ))}
    </SpeedDial>
  )
}

export default function Page ({ title = '', subtitle = '', actions = {}, dial, crumbs = [], links = [], children, sidebarItems = [], fullWidth = false }) {
  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      <Sidebar items={sidebarItems} />
      <Box sx={{ flex: 6, overflow: 'auto' }}>
        <AppBar position='sticky' sx={{ p: 3, bgcolor: 'background.paper', color: 'text.primary' }}>
          <Container maxWidth={fullWidth ? false : 'lg'}>
            {Crumbs(crumbs)}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='h4'>{title}</Typography>
              <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
                {Actions(actions)}
                {SpeedDialActions(dial)}
              </Stack>
            </Box>
            {subtitle ? <Typography variant='subtitle1'>{subtitle}</Typography> : ''}
          </Container>
        </AppBar>
        {Links(links)}
        <Container maxWidth={fullWidth ? false : 'lg'} sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}

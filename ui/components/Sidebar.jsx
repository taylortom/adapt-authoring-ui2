import { usePreferences } from '../contexts/UserPreferencesContext'
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  useTheme,
} from '@mui/material'
import Icons from '../utils/icons'
import { t } from '../utils/lang'

function SidebarItems ({ items }) {
  if (!items?.length) {
    return ''
  }
  return (
    <List sx={{ p: 2, pt: 0, }}>
      {items.map((item, i) => {
        if (item.type === 'divider') {
          return <Divider key={i} />
        }
        if (item.type === 'heading') {
          return <ListSubheader key={i} size='large' sx={{ bgcolor: 'transparent', color: 'secondary.main', textAlign: 'center' }}>{item.label}</ListSubheader>
        }
        if (item.type === 'button') {
          const colour = item.style ?? 'primary'
          const variant = colour === 'primary' ? 'contained' : 'outlined'
          return (
            <ListItem key={i}>
              <Button onClick={item.handleClick} color={colour} variant={variant} fullWidth={true} sx={{ p: 2 }}>
                {item.label}
              </Button>
            </ListItem>
          )
        }
        if (item.type === 'link') {
          const Icon = item.icon ?? Icons.OpenSidebar
          return (
            <ListItem key={i} disablePadding>
              <ListItemButton onClick={item.handleClick} href={item.href} selected={item.selected}>
                <ListItemIcon sx={{ color: 'primary.main' }}><Icon /></ListItemIcon>
                <ListItemText primary={item.label} sx={{ color: 'secondary.main' }} />
              </ListItemButton>
            </ListItem>
          )
        }
        if (item.type === 'custom') {
          return <Box key={i}>{item.content}</Box>
        }
      })}
    </List>
  )
}

export default function Sidebar ({ items }) {
  const { sidebarOpen: open, setSidebarOpen: setOpen } = usePreferences()
  const theme = useTheme()
  const toolbarHeight = theme.mixins.toolbar.minHeight
  const width = theme.custom.sidebarWidth
  const style = {
    width: open ? width : 0,
    flexShrink: 0,
    transition: 'width 0.3s ease',
    '& .MuiDrawer-paper': {
      position: 'fixed',
      top: toolbarHeight,
      left: 0,
      height: `calc(100vh - ${toolbarHeight}px)`,
      boxSizing: 'border-box',
      overflowX: 'hidden',
      width: open ? width : 0,
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
          <Icons.OpenSidebar />
        </IconButton>
      )}
      <Drawer variant='permanent' anchor='left' sx={style}>
        <Box sx={{ p: 2, alignSelf: 'flex-end' }}>
          <IconButton size='small' color='primary' aria-label={t('app.closesidebar')} onClick={() => setOpen(false)} sx={{ boxShadow: 'none' }}>
            <Icons.CloseSidebar />
          </IconButton>
        </Box>
        <SidebarItems items={items} />
      </Drawer>
    </>
  )
}

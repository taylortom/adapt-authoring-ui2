import { usePreferences } from '../contexts/UserPreferencesContext'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  useTheme
} from '@mui/material'
import Icons from '../utils/icons'
import { t } from '../utils/lang'

function SidebarItems ({ items }) {
  if (!items?.length) {
    return ''
  }
  return (
    <List>
      {items.map((item, i) => {
        if (item.type === 'divider') {
          return <Divider key={i} />
        }
        if (item.type === 'heading') {
          return <ListSubheader key={i} sx={{ bgcolor: 'transparent', color: 'primary.contrastText' }}>{item.label}</ListSubheader>
        }
        return (
          <ListItem key={i} disablePadding>
            <ListItemButton onClick={item.handleClick} href={item.href} selected={item.selected}>
              {item.icon && <ListItemIcon sx={{ color: 'primary.contrastText' }}><item.icon /></ListItemIcon>}
              <ListItemText primary={item.label} sx={{ color: 'primary.contrastText' }} />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )
}

export default function Sidebar ({ items }) {
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

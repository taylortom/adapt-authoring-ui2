import { usePreferences } from '../contexts/UserPreferencesContext'
import {
  Box,
  Drawer,
  IconButton,
  useTheme
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { t } from '../utils/lang'

export default function Sidebar ({ children }) {
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

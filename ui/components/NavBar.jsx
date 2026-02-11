import { useState } from 'react'
import {
  AppBar,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { useNavigate, useLocation } from 'react-router-dom'
import Icons from '../utils/icons'
import { useAuth } from '../contexts/AuthContext'
import { usePreferences } from '../contexts/UserPreferencesContext'
import { getConfig } from '../utils/config'
import { t } from '../utils/lang'

export default function NavBar () {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { setMode } = useColorScheme()
  const { colorMode, setColorMode } = usePreferences()
  const [navMenuAnchor, setNavMenuAnchor] = useState(null)
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)

  const appTitle = getConfig('appTitle')
  const userName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user.email

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    handleUserMenuClose()
  }

  const handleNavMenuOpen = (event) => {
    setNavMenuAnchor(event.currentTarget)
  }

  const handleNavMenuClose = () => {
    setNavMenuAnchor(null)
  }

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleNav = (path) => {
    navigate(path)
    handleNavMenuClose()
  }

  return (
    <AppBar position='sticky' color='secondary' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton size='large' edge='start' color='inherit' aria-label='menu' onClick={handleNavMenuOpen} sx={{ mr: 2 }}>
          <Icons.Menu />
        </IconButton>
        <Menu anchorEl={navMenuAnchor} open={Boolean(navMenuAnchor)} onClose={handleNavMenuClose}>
          <MenuItem onClick={() => handleNav('/')} selected={location.pathname === '/'}>
            {t('app.home')}
          </MenuItem>
          <MenuItem onClick={() => handleNav('/about')} selected={location.pathname === '/about'}>
            {t('app.about')}
          </MenuItem>
          <MenuItem onClick={() => handleNav('/form')} selected={location.pathname === '/form'}>
            {t('app.form')}
          </MenuItem>
          <MenuItem onClick={() => handleNav('/contentplugins')} selected={location.pathname === '/contentplugins'}>
            {t('app.plugins')}
          </MenuItem>
        </Menu>
        <Typography variant='h6' sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          {appTitle}
        </Typography>
        <Typography variant='body2' sx={{ mr: 1 }}>
          {userName}
        </Typography>
        <IconButton size='large' color='inherit' aria-label='user menu' onClick={handleUserMenuOpen}>
          <Icons.Account />
        </IconButton>
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => { setColorMode('system'); setMode('system') }} selected={colorMode === 'system'}>
            <ListItemIcon><Icons.SystemMode /></ListItemIcon>
            <ListItemText>{t('app.system')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setColorMode('light'); setMode('light') }} selected={colorMode === 'light'}>
            <ListItemIcon><Icons.LightMode /></ListItemIcon>
            <ListItemText>{t('app.lightmode')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setColorMode('dark'); setMode('dark') }} selected={colorMode === 'dark'}>
            <ListItemIcon><Icons.DarkMode /></ListItemIcon>
            <ListItemText>{t('app.darkmode')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Icons.Logout sx={{ mr: 1 }} />
            {t('app.logout')}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

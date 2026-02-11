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
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getConfig } from '../utils/config'
import { t } from '../utils/lang'

export default function NavBar () {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { mode, setMode } = useColorScheme()
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
          <MenuIcon />
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
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => setMode('system')} selected={mode === 'system'}>
            <ListItemIcon><SettingsBrightnessIcon /></ListItemIcon>
            <ListItemText>{t('app.system')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setMode('light')} selected={mode === 'light'}>
            <ListItemIcon><LightModeIcon /></ListItemIcon>
            <ListItemText>{t('app.lightmode')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => setMode('dark')} selected={mode === 'dark'}>
            <ListItemIcon><DarkModeIcon /></ListItemIcon>
            <ListItemText>{t('app.darkmode')}</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            {t('app.logout')}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

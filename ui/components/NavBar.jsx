import { useState } from 'react'
import {
  AppBar,
  FormControl,
  InputLabel,
  Select,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getConfig } from '../utils/config'

export default function NavBar () {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
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

  const [theme, setTheme] = useState(localStorage.getItem('theme'))

  return (
    <AppBar position='sticky' color='secondary' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton size='large' edge='start' color='inherit' aria-label='menu' onClick={handleNavMenuOpen} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={navMenuAnchor} open={Boolean(navMenuAnchor)} onClose={handleNavMenuClose}>
          <MenuItem onClick={() => handleNav('/')} selected={location.pathname === '/'}>
            Home
          </MenuItem>
          <MenuItem onClick={() => handleNav('/about')} selected={location.pathname === '/about'}>
            About
          </MenuItem>
          <MenuItem onClick={() => handleNav('/contentplugins')} selected={location.pathname === '/contentplugins'}>
            Content Plugins
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
          <MenuItem>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Theme mode</InputLabel>
              <Select labelId='demo-simple-select-label' id='demo-simple-select' value={theme} label='Age' onChange={(event) => setTheme(event.target.value)}>
                <MenuItem value='system'>System</MenuItem>
                <MenuItem value='dark'>Dark</MenuItem>
                <MenuItem value='light'>Light</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

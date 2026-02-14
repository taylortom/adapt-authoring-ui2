import {
  AppBar,
  Box,
  Fab,
  IconButton,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { filterRoutes } from '../routes'
import { useApiQuery } from '../utils/api'
import { getConfig } from '../utils/config'
import Icons from '../utils/icons'
import { t } from '../utils/lang'
import { getRoleConfig } from '../utils/roles'

export default function NavBar () {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { mode, setMode } = useColorScheme()
  const [navMenuAnchor, setNavMenuAnchor] = useState(null)
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)

  const { data: rolesData } = useApiQuery('roles', (api) => api.get())
  const userRoles = useMemo(() => {
    const results = Array.isArray(rolesData) ? rolesData : rolesData?.results ?? []
    return (user?.roles || []).map(id => results.find(r => r._id === id)).filter(Boolean)
  }, [rolesData, user?.roles])
  const roleConfig = getRoleConfig(userRoles)
  const RoleIcon = roleConfig.icon

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
          {filterRoutes(r => r.nav).map(r => (
            <MenuItem key={r.path} onClick={() => handleNav(r.path)} selected={location.pathname === r.path}>
              {t(r.label)}
            </MenuItem>
          ))}
        </Menu>
        <Typography variant='h6' sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          {appTitle}
        </Typography>
        <Typography variant='body2' sx={{ mr: 3 }}>
          {userName}
        </Typography>
        <Fab size='small' aria-label='user menu' onClick={handleUserMenuOpen} sx={{ boxShadow: 'none', width: 32, height: 32, minHeight: 0, bgcolor: 'secondary.contrastText', '&:hover': { bgcolor: 'secondary.contrastText' } }}>
          <RoleIcon color='secondary' fontSize='small' />
        </Fab>
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box sx={{ px: 1, py: 0.5 }}>
            <Typography variant='caption' color='text' sx={{ mb: 0.5, display: 'block' }}>
              {t('app.theme')}
            </Typography>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(_, val) => val && setMode(val)}
              size='small'
              fullWidth
              sx={{ '& .MuiToggleButton-root': { color: 'secondary.contrastText', borderColor: 'secondary.contrastText', '&:hover': { bgcolor: 'transparent' }, '&.Mui-selected': { bgcolor: 'secondary.contrastText', color: 'secondary.main', '&:hover': { bgcolor: 'secondary.contrastText' } } } }}
            >
              <ToggleButton value='system'>
                <Tooltip title={t('app.system')}><Icons.SystemMode /></Tooltip>
              </ToggleButton>
              <ToggleButton value='light'>
                <Tooltip title={t('app.lightmode')}><Icons.LightMode /></Tooltip>
              </ToggleButton>
              <ToggleButton value='dark'>
                <Tooltip title={t('app.darkmode')}><Icons.DarkMode /></Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <MenuItem onClick={handleLogout}>
            <Icons.Logout sx={{ mr: 1 }} />
            {t('app.logout')}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

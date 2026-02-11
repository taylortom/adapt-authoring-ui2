import { Navigate, Outlet } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import NavBar from './NavBar'
import { t } from '../utils/lang'

export default function ProtectedRoute ({ children, requiredScopes = null }) {
  const { isAuthenticated, isLoading, hasScopes } = useAuth()

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (requiredScopes && !hasScopes(requiredScopes)) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
        <div>
          <h2>{t('app.accessdenied')}</h2>
          <p>{t('app.nopermissions')}</p>
        </div>
      </Box>
    )
  }

  return (
    <>
      <NavBar />
      {children || <Outlet />}
    </>
  )
}

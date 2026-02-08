import { Navigate, Outlet } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute ({ children, requiredScopes = null }) {
  const { isAuthenticated, isLoading, hasScopes } = useAuth()

  if (isLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (requiredScopes && !hasScopes(requiredScopes)) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <div>
          <h2>Access Denied</h2>
          <p>You do not have permission to access this resource.</p>
        </div>
      </Box>
    )
  }

  return children || <Outlet />
}

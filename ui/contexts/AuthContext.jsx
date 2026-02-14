import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider ({ children }) {
  const [user, setUser] = useState(null)
  const [scopes, setScopes] = useState([])
  const [isSuper, setIsSuper] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const checkAuthStatus = useCallback(async () => {
    try {
      const authData = await authService.checkAuth()
      setUser(authData.user)
      setScopes(authData.scopes || [])
      setIsSuper(authData.isSuper || false)
      setIsAuthenticated(true)
      setError(null)
    } catch (err) {
      setUser(null)
      setScopes([])
      setIsSuper(false)
      setIsAuthenticated(false)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuthStatus()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [checkAuthStatus])

  const login = async (email, password, persistSession = false) => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.login(email, password, persistSession)
      await checkAuthStatus()
      return { success: true }
    } catch (err) {
      setError(err.message || 'Login failed')
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      setScopes([])
      setIsSuper(false)
      setIsAuthenticated(false)
      setError(null)
      setIsLoading(false)
    }
  }

  const hasScopes = (requiredScopes) => {
    if (!requiredScopes) return false
    if (isSuper) return true
    if (!scopes || scopes.length === 0) return false

    const scopeArray = Array.isArray(requiredScopes) ? requiredScopes : [requiredScopes]
    return scopeArray.every(scope => scopes.includes(scope))
  }

  const value = {
    user,
    scopes,
    isSuper,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    hasScopes,
    checkAuthStatus
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth () {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

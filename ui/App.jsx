import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { UserPreferencesProvider } from './contexts/UserPreferencesContext'
import ProtectedRoute from './components/ProtectedRoute'
import { filterRoutes } from './routes'

const mapRoutes = routes => routes.map(r => <Route key={r.path} path={r.path} element={r.element} />)
const unprotectedRoutes = mapRoutes(filterRoutes(r => !r.protected))
const protectedRoutes = mapRoutes(filterRoutes(r => r.protected))

function App () {
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <AuthProvider>
        <UserPreferencesProvider>
          <Routes>
            {unprotectedRoutes}
            <Route element={<ProtectedRoute />}>{protectedRoutes}</Route>
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </UserPreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

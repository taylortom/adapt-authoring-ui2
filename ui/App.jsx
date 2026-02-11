import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { UserPreferencesProvider } from './contexts/UserPreferencesContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import routes from './routes'

function App () {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserPreferencesProvider>
          <Routes>
            {/* Unprotected routes */}
            <Route path='/login' element={<Login />} />
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {routes.map(r => <Route key={r.path} path={r.path} element={r.element} />)}
            </Route>
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </UserPreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

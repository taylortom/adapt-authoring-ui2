import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { UserPreferencesProvider } from './contexts/UserPreferencesContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import AboutPage from './pages/AboutPage'
import ContentPluginsPage from './pages/ContentPluginsPage'
import FormPage from './pages/FormPage'
import HomePage from './pages/HomePage'

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
              <Route path='/' element={<HomePage />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/form' element={<FormPage />} />
              <Route path='/contentplugins' element={<ContentPluginsPage />} />
            </Route>
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </UserPreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

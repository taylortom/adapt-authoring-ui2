import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'

function App () {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Unprotected routes */}
          <Route path='/login' element={<Login />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/about' element={<AboutPage />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

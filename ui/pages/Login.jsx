import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Alert,
  Paper
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { getConfig } from '../utils/config'

import loginBg from '../assets/images/login_bg.jpg'
import logo from '../assets/images/adapt-learning-logo-white.png'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [localError, setLocalError] = useState(null)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)

    if (!email || !password) {
      setLocalError('Please enter both email and password')
      return
    }

    const result = await login(email, password, rememberMe)

    if (result.success) {
      navigate('/')
    } else {
      setLocalError(result.error || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img
              src={getConfig('adapt-authoring-ui2.logoUrl') || logo}
              alt={getConfig('adapt-authoring-ui2.appTitle') || 'Logo'}
              style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain' }}
            />
          </Box>
          <Typography component='h1' variant='h4' align='center' gutterBottom>
            {getConfig('adapt-authoring-ui2.appTitle')}
          </Typography>
          <Typography component='h1' variant='h5' align='center' gutterBottom>
            Sign In
          </Typography>

          {localError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {localError}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit} noValidate>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color='primary'
                  disabled={isLoading}
                />
              }
              label='Remember me'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Alert
} from '@mui/material'
import { getConfig } from '../utils/config'
import { t } from '../utils/lang'

import Assets from '../utils/assets'

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
    const result = await login(email, password, rememberMe)
    if (result.success) {
      navigate('/')
    } else {
      setLocalError(result.error.message)
    }
  }

  const textAreaSx = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.9)' },
      '&.Mui-focused fieldset': { borderColor: 'white' }
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
    '& .MuiOutlinedInput-input': { color: 'white' }
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          background: `url(${Assets.Bg})`,
          backgroundSize: 'cover',
          top: 0,
          left: 0,
          'z-index': -1
        }}
      />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img
            src={getConfig('logoUrl') || Assets.Logo}
            alt={getConfig('appTitle') || 'Logo'}
            style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain' }}
          />
        </Box>
        <Typography component='h1' variant='h4' align='center' gutterBottom color='white'>
          {getConfig('appTitle')}
        </Typography>
        <Typography component='h1' variant='h5' align='center' gutterBottom color='white'>
          {t('app.signin')}
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
            label={t('app.email')}
            name='email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            sx={textAreaSx}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label={t('app.password')}
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            sx={textAreaSx}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                color='primary'
                disabled={isLoading}
                sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-checked': { color: 'white' } }}
              />
              }
            label={<Typography color='white'>{t('app.rememberme')}</Typography>}
            sx={{ '& .MuiFormControlLabel-label': { color: 'white' } }}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            size='large'
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? t('app.signingin') : t('app.signin')}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

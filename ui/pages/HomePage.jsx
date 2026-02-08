import React from 'react'
import { Box, Container, Typography } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

function HomePage () {
  const { user, scopes, isSuper } = useAuth()

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant='h3' gutterBottom>
          Home Page
        </Typography>
        <Typography variant='body1' paragraph>
          Welcome to the application, {user?.email || 'User'}!
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant='h6'>Your Permissions:</Typography>
          {isSuper
            ? (<Typography>🔑 Superuser (full access)</Typography>)
            : (<ul>{scopes?.map((scope) => (<li key={scope}>{scope}</li>))}</ul>)}
        </Box>
      </Box>
    </Container>
  )
}

export default HomePage

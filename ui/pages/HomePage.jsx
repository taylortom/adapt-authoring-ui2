import React from 'react'
import { Typography } from '@mui/material'
import Page from '../components/Page'
import { useAuth } from '../contexts/AuthContext'

function HomePage () {
  const { user, scopes, isSuper } = useAuth()

  return (
    <Page title='About' body={`Welcome to the application, ${user?.email || 'User'}!`}>
      <Typography variant='h6'>Your Permissions:</Typography>
      {isSuper
        ? (<Typography>🔑 Superuser (full access)</Typography>)
        : (<ul>{scopes?.map((scope) => (<li key={scope}>{scope}</li>))}</ul>)}
    </Page>
  )
}

export default HomePage

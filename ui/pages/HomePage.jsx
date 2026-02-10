import { Typography } from '@mui/material'
import Page from '../components/Page'
import { useAuth } from '../contexts/AuthContext'

function HomePage () {
  const { user, scopes, isSuper } = useAuth()
  const links = [
    { label: 'Dashboard', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Content Plugins', href: '/contentplugins' }
  ]
  return (
    <Page title='Home' body={`Welcome to the application, ${user?.email || 'User'}!`} links={links}>
      <Typography variant='h6'>Your Permissions:</Typography>
      {isSuper
        ? (<Typography>🔑 Superuser (full access)</Typography>)
        : (<ul>{scopes?.map((scope) => (<li key={scope}>{scope}</li>))}</ul>)}
    </Page>
  )
}

export default HomePage

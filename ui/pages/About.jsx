import { Paper, Typography } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import Icons from '../utils/icons'
import Page from '../components/Page'

const sidebarItems = [
  { type: 'button', label: 'Overview', handleClick: () => {} },
  { type: 'button', style: 'secondary', label: 'Overview', handleClick: () => {} },
  { type: 'heading', label: 'About' },
  { type: 'link', label: 'Dashboard', href: '/home' },
  { type: 'link', label: 'Help', icon: Icons.Help, handleClick: () => {} },
  { type: 'divider' },
  { type: 'heading', label: 'Developer' },
  { type: 'link', label: 'Source Code', icon: Icons.Code, handleClick: () => {} }
]

function About () {
  const { user, scopes, isSuper } = useAuth()
  return (
    <Page title='About' body={`Welcome to the application, ${user?.email}!`} sidebarItems={sidebarItems}>
      <Paper sx={{ p: 4, mb:4 }}>
        <Typography>Learn more about this application.</Typography>
      </Paper>
      <Paper sx={{ p: 4 }}>
        <Typography variant='h6'>Your Permissions:</Typography>
        {isSuper
          ? (<Typography>🔑 Superuser (full access)</Typography>)
          : (<ul>{scopes?.map((scope) => (<li key={scope}>{scope}</li>))}</ul>)}
      </Paper>
    </Page>
  )
}

export default About

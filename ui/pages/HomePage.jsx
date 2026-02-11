import { Typography } from '@mui/material'
import Page from '../components/Page'
import { useAuth } from '../contexts/AuthContext'
import { t } from '../utils/lang'

function HomePage () {
  const { user, scopes, isSuper } = useAuth()
  const links = [
    { label: t('app.dashboard'), href: '/' },
    { label: t('app.about'), href: '/about' },
    { label: t('app.plugins'), href: '/contentplugins' }
  ]
  return (
    <Page title={t('app.dashboard')} body={`Welcome to the application, ${user?.email}!`} links={links}>
      <Typography variant='h6'>Your Permissions:</Typography>
      {isSuper
        ? (<Typography>🔑 Superuser (full access)</Typography>)
        : (<ul>{scopes?.map((scope) => (<li key={scope}>{scope}</li>))}</ul>)}
    </Page>
  )
}

export default HomePage

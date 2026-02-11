import { Typography } from '@mui/material'
import Icons from '../utils/icons'
import Page from '../components/Page'

const sidebarItems = [
  { type: 'heading', label: 'About' },
  { label: 'Overview', icon: Icons.Info, handleClick: () => {} },
  { label: 'Help', icon: Icons.Help, handleClick: () => {} },
  { type: 'divider' },
  { type: 'heading', label: 'Developer' },
  { label: 'Source Code', icon: Icons.Code, handleClick: () => {} }
]

function AboutPage () {
  return (
    <Page title='About' sidebarItems={sidebarItems}>
      <Typography>Learn more about this application.</Typography>
    </Page>
  )
}

export default AboutPage

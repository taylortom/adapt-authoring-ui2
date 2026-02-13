import {
  Alert,
  Box,
  CircularProgress,
  Container
} from '@mui/material'
import Page from './Page'
import { t } from '../utils/lang'

export default function Collection ({
  items = [],
  isLoading,
  error,
  emptyMessage,
  title,
  crumbs,
  dial,
  sidebarItems,
  fullWidth,
  links,
  actions,
  subtitle,
  headerControls,
  children
}) {
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity='error'>{t('app.errorloadingdata')}: {error.message}</Alert>
      </Container>
    )
  }

  return (
    <Page title={title} subtitle={subtitle} crumbs={crumbs} dial={dial} sidebarItems={sidebarItems} fullWidth={fullWidth} links={links} actions={actions} headerControls={headerControls}>
      {isLoading
        ? (
          <Box display='flex' justifyContent='center' alignItems='center' minHeight='30vh'>
            <CircularProgress />
          </Box>
          )
        : items.length === 0
          ? (<Alert severity='info'>{emptyMessage ?? t('app.noresults')}</Alert>)
          : children}
    </Page>
  )
}

import {
  Alert,
  Box,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TablePagination,
  TextField,
  Tooltip,
  useTheme
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import Page from './Page'
import { usePreferences } from '../contexts/UserPreferencesContext'
import useCollectionState from '../hooks/useCollectionState'
import { t } from '../utils/lang'

export default function Collection ({
  apiRoot,
  queryBody,
  sortOptions = [],
  defaultSort,
  defaultPageSize = 12,
  pageSizeOptions = [12, 24, 48],
  gridMinWidth = 250,
  renderItem,
  transformData,
  emptyMessage,
  searchPlaceholder,
  showSidebarSearch = true,
  title,
  crumbs,
  dial,
  sidebarItems = [],
  fullWidth = true,
  links,
  actions,
  subtitle
}) {
  const theme = useTheme()
  const { sidebarOpen } = usePreferences()
  const sidebarWidth = sidebarOpen ? theme.custom.sidebarWidth : 0

  const {
    items,
    isLoading,
    error,
    page,
    limit,
    sortField,
    sortOrder,
    handleSearchChange,
    handleSortFieldChange,
    handleToggleSortOrder,
    handlePageChange,
    handleRowsPerPageChange
  } = useCollectionState({ apiRoot, queryBody, defaultSort, defaultPageSize, transformData })

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity='error'>{t('app.errorloadingdata')}: {error.message}</Alert>
      </Container>
    )
  }

  const allSidebarItems = [...sidebarItems]
  if (showSidebarSearch) {
    allSidebarItems.push(
      { type: 'spacer' },
      { type: 'heading', label: 'Search' },
      {
        type: 'custom',
        content: (
          <TextField
            size='small'
            fullWidth
            placeholder={searchPlaceholder ?? t('app.search')}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'><SearchIcon /></InputAdornment>
                )
              }
            }}
            color='tertiary.contrastText'
            sx={{
              px: 2,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: (theme) => `${theme.palette.tertiary.contrastText}80` },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'tertiary.contrastText' },
              '& .MuiInputAdornment-root': { color: 'tertiary.contrastText' },
              '& .MuiOutlinedInput-input': { color: 'tertiary.contrastText' },
              '& .MuiOutlinedInput-input::placeholder': { color: 'tertiary.contrastText', opacity: 0.7 }
            }}
          />
        )
      }
    )
  }

  return (
    <>
      <Page title={title} subtitle={subtitle} crumbs={crumbs} dial={dial} sidebarItems={allSidebarItems} fullWidth={fullWidth} links={links} actions={actions}>
        {sortOptions.length > 0 && (
          <Stack direction='row' spacing={0} sx={{ mb: 3, alignItems: 'center', justifyContent: 'flex-end' }}>
            <Select size='small' value={sortField} onChange={handleSortFieldChange}>
              {sortOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
            <Tooltip title={sortOrder === 1 ? t('app.ascending') : t('app.descending')}>
              <IconButton size='small' onClick={handleToggleSortOrder}>
                {sortOrder === 1 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
        )}

        {isLoading
          ? (
            <Box display='flex' justifyContent='center' alignItems='center' minHeight='30vh'>
              <CircularProgress />
            </Box>
            )
          : items.length === 0
            ? (<Alert severity='info'>{emptyMessage ?? t('app.noresults')}</Alert>)
            : (
              <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${gridMinWidth}px, 1fr))`, gap: 3 }}>
                {items.map((item) => (
                  <Box key={item._id}>
                    {renderItem(item)}
                  </Box>
                ))}
              </Box>
              )}
        <Box sx={{ pb: 8 }} />
        <TablePagination
          component='div'
          count={-1}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={limit}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={pageSizeOptions}
          labelDisplayedRows={({ from, to }) => `${from} - ${to}`}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: sidebarWidth,
            right: 0,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            zIndex: 1100,
            transition: 'left 0.3s ease',
            '& .MuiTablePagination-toolbar': { justifyContent: 'center' },
            '& .MuiTablePagination-spacer': { display: 'none' },
            '& .MuiTablePagination-actions button': { color: 'primary.main' },
            '& .MuiTablePagination-actions button.Mui-disabled': { color: 'disabled.main' }
          }}
        />
      </Page>
    </>
  )
}

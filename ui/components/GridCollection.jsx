import {
  Box,
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
import Collection from './Collection'
import { usePreferences } from '../contexts/UserPreferencesContext'
import useCollectionState from '../hooks/useCollectionState'
import { t } from '../utils/lang'

const HEADER_HEIGHT = 64
const PAGE_CHROME_HEIGHT = 200 // appbar + sort controls + padding + pagination bar
const GRID_GAP = 24

function calcPageSize (gridMinWidth, cardHeight, sidebarWidth) {
  const availableWidth = window.innerWidth - sidebarWidth - GRID_GAP * 2
  const cols = Math.max(1, Math.floor(availableWidth / (gridMinWidth + GRID_GAP)))
  const availableHeight = window.innerHeight - HEADER_HEIGHT - PAGE_CHROME_HEIGHT
  const rows = Math.max(1, Math.floor(availableHeight / (cardHeight + GRID_GAP)))
  return cols * rows
}

export default function GridCollection ({
  apiRoot,
  queryBody,
  sortOptions = [],
  defaultSort,
  defaultPageSize,
  pageSizeOptions = [12, 24, 48],
  gridMinWidth = 250,
  cardHeight = 220,
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
  const initialPageSize = defaultPageSize ?? calcPageSize(gridMinWidth, cardHeight, theme.custom.sidebarWidth)

  const {
    items,
    isLoading,
    error,
    totalPages,
    page,
    limit,
    sortField,
    sortOrder,
    handleSearchChange,
    handleSortFieldChange,
    handleToggleSortOrder,
    handlePageChange,
    handleRowsPerPageChange
  } = useCollectionState({ apiRoot, queryBody, defaultSort, defaultPageSize: initialPageSize, transformData })

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
    <Collection
      items={items}
      isLoading={isLoading}
      error={error}
      emptyMessage={emptyMessage}
      title={title}
      subtitle={subtitle}
      crumbs={crumbs}
      dial={dial}
      sidebarItems={allSidebarItems}
      fullWidth={fullWidth}
      links={links}
      actions={actions}
    >
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

      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${gridMinWidth}px, 1fr))`, gap: 3 }}>
        {items.map((item) => (
          <Box key={item._id}>
            {renderItem(item)}
          </Box>
        ))}
      </Box>

      <Box sx={{ pb: 8 }} />
      <TablePagination
        component='div'
        count={totalPages ? totalPages * limit : -1}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={limit}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={pageSizeOptions}
        labelRowsPerPage={t('app.pagesize')}
        labelDisplayedRows={({ page }) => totalPages ? `${t('app.page')} ${page + 1} / ${totalPages}` : `${t('app.page')} ${page + 1}`}
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
    </Collection>
  )
}

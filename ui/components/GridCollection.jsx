import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TablePagination,
  TextField,
  Tooltip,
  useTheme
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useCallback, useEffect, useRef } from 'react'
import Collection from './Collection'
import IconButtonGroup from './IconButtonGroup'
import { usePreferences } from '../contexts/UserPreferencesContext'
import useCollectionState from '../hooks/useCollectionState'
import { t } from '../utils/lang'

const GRID_GAP = 24
const PAGINATION_HEIGHT = 52

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
  const gridRef = useRef(null)
  const measuredRef = useRef(false)

  const calcPageSize = useCallback(() => {
    const el = gridRef.current
    if (!el) return null
    const availableWidth = el.clientWidth
    const availableHeight = window.innerHeight - el.getBoundingClientRect().top - PAGINATION_HEIGHT
    const cols = Math.max(1, Math.floor(availableWidth / (gridMinWidth + GRID_GAP)))
    const rows = Math.max(1, Math.floor(availableHeight / (cardHeight + GRID_GAP)))
    return cols * rows
  }, [gridMinWidth, cardHeight])

  const {
    items,
    isLoading,
    error,
    totalPages,
    page,
    limit,
    setLimit,
    sortField,
    sortOrder,
    handleSearchChange,
    handleSortFieldChange,
    handleToggleSortOrder,
    handlePageChange,
    handleRowsPerPageChange
  } = useCollectionState({ apiRoot, queryBody, defaultSort, defaultPageSize: defaultPageSize ?? 12, transformData })

  const gridCallbackRef = useCallback((node) => {
    gridRef.current = node
    if (node && !defaultPageSize && !measuredRef.current) {
      measuredRef.current = true
      const size = calcPageSize()
      if (size) setLimit(size)
    }
  }, [defaultPageSize, calcPageSize, setLimit])

  useEffect(() => {
    if (defaultPageSize) return
    const recalc = () => {
      const size = calcPageSize()
      if (size) setLimit(prev => prev !== size ? size : prev)
    }
    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [defaultPageSize, calcPageSize, setLimit])

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

  const sortControls = sortOptions.length > 0
    ? (
      <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
        <IconButtonGroup value={sortField} onChange={handleSortFieldChange} options={sortOptions} />
        <Tooltip title={sortOrder === 1 ? t('app.ascending') : t('app.descending')}>
          <IconButton size='large' onClick={handleToggleSortOrder}>
            {sortOrder === 1 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
      )
    : null

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
      headerControls={sortControls}
    >
      <Box ref={gridCallbackRef} sx={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${gridMinWidth}px, 1fr))`, gap: 3 }}>
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
        rowsPerPageOptions={pageSizeOptions.includes(limit) ? pageSizeOptions : [limit, ...pageSizeOptions].sort((a, b) => a - b)}
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

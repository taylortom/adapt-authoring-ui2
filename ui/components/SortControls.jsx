import { Stack, ToggleButton } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import IconButtonGroup from './IconButtonGroup'

export default function SortControls ({ sortField, sortOrder, sortOptions, onSortFieldChange, onToggleSortOrder }) {
  if (!sortOptions?.length) return null
  return (
    <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
      <IconButtonGroup value={sortField} onChange={onSortFieldChange} options={sortOptions} />
      <ToggleButton
        value='direction'
        selected={sortOrder === 1}
        onChange={onToggleSortOrder}
        size='small'
        sx={{
          '&.Mui-selected': { bgcolor: 'secondary.main', color: 'secondary.contrastText' },
          '&.Mui-selected:hover': { bgcolor: 'secondary.dark', color: 'secondary.contrastText' }
        }}
      >
        {sortOrder === 1 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      </ToggleButton>
    </Stack>
  )
}

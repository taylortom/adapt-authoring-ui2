import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

export default function IconButtonGroup ({ value, onChange, options = [], exclusive = true, size = 'small', sx }) {
  return (
    <ToggleButtonGroup value={value} onChange={onChange} exclusive={exclusive} size={size} sx={sx}>
      {options.map((opt) => {
        const Icon = opt.icon
        return (
          <ToggleButton
            key={opt.value}
            value={opt.value}
            sx={{
              '&.Mui-selected': { bgcolor: 'secondary.main', color: 'secondary.contrastText' },
              '&.Mui-selected:hover': { bgcolor: 'secondary.dark', color: 'secondary.contrastText' }
            }}
          >
            <Stack spacing={0.25} sx={{ alignItems: 'center' }}>
              {Icon && <Icon />}
              <Typography variant='caption' sx={{ lineHeight: 1, textTransform: 'none' }}>{opt.label}</Typography>
            </Stack>
          </ToggleButton>
        )
      })}
    </ToggleButtonGroup>
  )
}

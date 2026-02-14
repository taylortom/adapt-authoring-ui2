import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography
} from '@mui/material'

export default function SelectGrid ({ items, value, onChange, multiple }) {
  const selected = multiple ? (value ?? []) : value
  const handleClick = (key) => {
    if (multiple) {
      onChange(selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key])
    } else {
      onChange(key)
    }
  }
  return (
    <Grid container spacing={2}>
      {items.map(item => {
        const isSelected = multiple ? selected.includes(item.key) : selected === item.key
        const Icon = item.icon
        return (
          <Grid key={item.key} size={{ xs: 6, sm: 4 }}>
            <Card sx={{ border: 2, borderColor: isSelected ? 'primary.main' : 'transparent', bgcolor: isSelected ? 'primary.main' : undefined, color: isSelected ? 'primary.contrastText' : undefined, height: '100%' }}>
              <CardActionArea onClick={() => handleClick(item.key)} sx={{ p: 2, height: '100%' }}>
                <CardContent>
                  {Icon && <Icon sx={{ fontSize: 36, color: isSelected ? 'inherit' : 'primary.main', mb: 1 }} />}
                  <Typography variant='subtitle1'>{item.label}</Typography>
                  {item.description && <Typography variant='body2' sx={{ color: isSelected ? 'inherit' : 'text.secondary', textAlign: 'left', opacity: isSelected ? 0.85 : 1 }}>{item.description}</Typography>}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

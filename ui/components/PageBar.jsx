import { Box, Container, Typography } from '@mui/material'

export default function PageBar ({ title, children }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        py: 2
      }}
    >
      <Container>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h5' component='h1'>
            {title}
          </Typography>
          {children && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {children}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

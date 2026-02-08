import React from 'react'
import { Box, Container, Typography } from '@mui/material'

function AboutPage () {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant='h3' gutterBottom>
          About
        </Typography>

        <Box sx={{ mt: 3 }}>
          Learn more about this application.
        </Box>
      </Box>
    </Container>
  )
}

export default AboutPage

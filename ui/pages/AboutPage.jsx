import React from 'react'
import { Box, Container } from '@mui/material'
import PageBar from '../components/PageBar'

function AboutPage () {
  return (
    <>
      <PageBar title='About' />
      <Container>
        <Box sx={{ mt: 4 }}>
          <Box sx={{ mt: 3 }}>
            Learn more about this application.
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default AboutPage

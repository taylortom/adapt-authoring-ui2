import { createTheme } from '@mui/material/styles'

export function createAppTheme ({ primaryColour, secondaryColour } = {}) {
  return createTheme({
    palette: {
      primary: {
        main: primaryColour
      },
      secondary: {
        main: secondaryColour
      }
    },
    cssVariables: true
  })
}

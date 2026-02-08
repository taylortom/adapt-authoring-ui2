import { createTheme } from '@mui/material/styles'
import '@fontsource-variable/raleway'

export function createAppTheme (options = {}) {
  return createTheme({
    palette: {
      primary: {
        main: options.primaryColour,
        contrastText: 'white'
      },
      secondary: {
        main: options.secondaryColour,
        contrastText: 'white'
      },
      error: {
        main: '#ff5567'
      },
      warning: {
        main: '#ffa08d'
      },
      info: {
        main: '#34bee0'
      },
      success: {
        main: '#00dd95'
      }
    },
    typography: {
      fontFamily: 'Raleway Variable'
    },
    cssVariables: true
  })
}

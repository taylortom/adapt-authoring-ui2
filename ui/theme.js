import { createTheme } from '@mui/material/styles'
import '@fontsource-variable/raleway'

export function createAppTheme (options = {}) {
  const defaultPalette = {
    primary: {
      main: options.primaryColour,
      contrastText: 'white'
    },
    secondary: {
      main: options.secondaryColour,
      contrastText: 'white'
    },
    tertiary: {
      main: '#263944',
      contrastText: 'secondary'
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
    },
    background: {
      default: '#f3fcfe'
    },
    disabled: {
      main: '#696969'
    }
  }
  return createTheme({
    colorSchemes: {
      light: { palette: { ...defaultPalette } },
      dark: {
        palette: {
          ...defaultPalette,
          tertiary: {
            main: '#484848',
            contrastText: 'secondary'
          },
          background: {
            default: '#363636'
          }
        }
      }
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true
        }
      }
    },
    typography: {
      fontFamily: 'Raleway Variable'
    },
    cssVariables: true
  })
}

import { createTheme } from '@mui/material/styles'
import '@fontsource-variable/open-sans'
import '@fontsource-variable/raleway'

export function createAppTheme (options = {}) {
  const defaultPalette = {
    primary: {
      main: options.primaryColour,
      contrastText: '#fff'
    },
    secondary: {
      main: options.secondaryColour,
      contrastText: '#fff'
    },
    tertiary: {
      main: '#263944',
      contrastText: options.secondaryColour
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
    white: {
      main: '#fff'
    },
    disabled: {
      main: '#696969'
    }
  }
  const headingFont = {
    fontFamily: 'Raleway Variable, sans-serif'
  }
  return createTheme({
    colorSchemes: {
      light: { palette: { ...defaultPalette } },
      dark: {
        palette: {
          ...defaultPalette,
          tertiary: {
            main: '#484848',
            contrastText: options.secondaryColour
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
      fontFamily: 'Open Sans, sans-serif',
      h1: headingFont,
      h2: headingFont,
      h3: headingFont,
      h4: headingFont,
      h5: headingFont,
      h6: headingFont,
      subtitle1: headingFont,
      subtitle2: headingFont,
      button: {
        fontWeight: 700
      }
    },
    custom: {
      sidebarWidth: 300
    }
  })
}

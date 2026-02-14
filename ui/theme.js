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
      default: '#ebfdff'
    },
    white: {
      main: '#fff'
    },
    disabled: {
      main: '#cbcbcb'
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
          secondary: {
            main: '#484848',
            contrastText: '#fff'
          },
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
        },
        styleOverrides: {
          root: {
            padding: '10px 20px'
          }
        }
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            minWidth: 250,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }),
          list: {
            paddingTop: 0,
            paddingBottom: 0
          }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: '10px 20px',
            '&.Mui-selected': {
              backgroundColor: theme.palette.secondary.contrastText,
              color: theme.palette.secondary.main,
              '&:hover': {
                backgroundColor: theme.palette.secondary.contrastText
              }
            }
          })
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

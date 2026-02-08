import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { queryClient } from './services/queryClient'
import { createAppTheme } from './theme'
import { loadConfig, getConfig } from './utils/config'
import App from './App'
import './index.css'

// Load config from backend before rendering app
loadConfig().then(() => {
  const theme = createAppTheme({
    primaryColour: getConfig('primaryColour'),
    secondaryColour: getConfig('secondaryColour')
  })
  const appTitle = getConfig('appTitle')
  if (appTitle) {
    document.title = appTitle
  }
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
})

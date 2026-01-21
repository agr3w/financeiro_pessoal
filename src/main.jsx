import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './Router' // ou Router
import { ThemeProvider, CssBaseline } from '@mui/material'
import { appTheme } from './theme/theme' // Importe o arquivo que criamos
import { FinanceProvider } from './context/FinanceContext'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <FinanceProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </FinanceProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
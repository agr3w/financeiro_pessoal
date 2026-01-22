import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './Router' 
import { ThemeProvider, CssBaseline } from '@mui/material'
import { appTheme } from './theme/theme' 
import { FinanceProvider } from './context/FinanceContext'
import { AuthProvider } from './context/AuthContext' 
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AuthProvider> 
        <FinanceProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
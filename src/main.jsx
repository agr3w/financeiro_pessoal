import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './Router'
import { CssBaseline } from '@mui/material'
import { appTheme } from './theme/theme'
import { FinanceProvider } from './context/FinanceContext'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { CustomThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <FinanceProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </FinanceProvider>
      </AuthProvider>
    </CustomThemeProvider>
  </React.StrictMode>,
)
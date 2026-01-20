import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router.jsx'
import { FinanceProvider } from './context/FinanceContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FinanceProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </FinanceProvider>
  </StrictMode>,
)

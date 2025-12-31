import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { XMLProvider } from './context/XMLContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <XMLProvider>
      <App />
    </XMLProvider>
  </StrictMode>,
)

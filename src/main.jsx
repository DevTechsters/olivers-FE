import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>, Removed this because of two times api call render

    // We are rendering the App component directly, without StrictMode, to avoid double rendering behavior
  <App />
)
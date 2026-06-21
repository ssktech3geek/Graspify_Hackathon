import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="000000000000-placeholder.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)
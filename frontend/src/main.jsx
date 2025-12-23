import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'
import ChatContext from './context/ChatContext.jsx'
import {registerSW} from 'virtual:pwa-register'

registerSW()


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContext>
      <ChatContext>
      <App />
      <Toaster />
      </ChatContext>
    </AuthContext>
  </BrowserRouter>
)

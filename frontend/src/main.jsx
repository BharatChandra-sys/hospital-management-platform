// Copyright 2024-2026 Bodapati Bharat Chandra
// Licensed under the Apache License, Version 2.0
// https://www.apache.org/licenses/LICENSE-2.0

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import './index.css'

// Keep Render free-tier backend alive — ping every 14 minutes
;(function keepAlive() {
  const url = import.meta.env.VITE_API_URL
  if (!url) return
  const ping = () => fetch(`${url}/health`, { method: 'GET' }).catch(() => {})
  ping() // immediate ping on load
  setInterval(ping, 14 * 60 * 1000) // then every 14 min
})()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

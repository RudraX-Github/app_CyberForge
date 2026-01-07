import React from 'react'
import ReactDOM from 'react-dom/client'
// The import below must match the filename casing EXACTLY.
// If the file is 'app.jsx', this must be './app.jsx'.
// If the file is 'App.jsx', this must be './App.jsx'.
import App from './App.jsx' 
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
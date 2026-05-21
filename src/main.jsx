import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import OrdiniProvider from './context/OrdiniProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OrdiniProvider>
      <App />
    </OrdiniProvider>
  </React.StrictMode>
)
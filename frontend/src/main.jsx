import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Φορτώνουμε το CSS του Bootstrap σε όλη την εφαρμογή
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
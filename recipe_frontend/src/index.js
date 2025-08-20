import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Initialize mock service in development when no API base URL is provided
import './services/mockService';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

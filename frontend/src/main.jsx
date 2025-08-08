import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/App.jsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <ToastContainer position="bottom-right" />
  </React.StrictMode>
);
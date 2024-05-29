import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes/Routes';
import './css/Index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
     <Routes />
  </React.StrictMode>
  
);

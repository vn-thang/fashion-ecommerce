import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AppProviders } from './app/providers';
import {Toaster} from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <App />
       <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </AppProviders>
  </React.StrictMode>
);
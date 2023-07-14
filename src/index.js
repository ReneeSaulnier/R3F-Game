import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Interface from './components/Interface';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Interface />
    <App />
  </React.StrictMode>
);

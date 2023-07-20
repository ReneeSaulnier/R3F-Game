import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
document.getElementById('start-button').addEventListener('click', () => {

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>

  );
  document.getElementById('start-button').remove();
});

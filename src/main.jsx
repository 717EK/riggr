import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// minimal global reset (component styles are injected by App via the CSS string)
const reset = document.createElement('style');
reset.textContent = `
  html, body, #root { margin: 0; padding: 0; height: 100%; }
  body { overscroll-behavior-y: none; background: #e4e3da; }
  * { -webkit-tap-highlight-color: transparent; }
`;
document.head.appendChild(reset);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';

// minimal global reset (component styles are injected by App via the CSS string)
const reset = document.createElement('style');
reset.textContent = `
  html, body, #root { margin: 0; padding: 0; height: 100%; }
  html { background: #f3f2ec; }
  body { overscroll-behavior-y: none; background: #f3f2ec; }
  #root { height: 100dvh; overflow: hidden; }
  * { -webkit-tap-highlight-color: transparent; }
`;
document.head.appendChild(reset);

// iOS home-screen apps don't reliably match @media (display-mode: standalone),
// so detect it in JS and tag the root. CSS keys off .is-standalone.
try {
  const standalone = window.navigator.standalone === true
    || window.matchMedia('(display-mode: standalone)').matches
    || window.matchMedia('(display-mode: fullscreen)').matches;
  if (standalone) document.documentElement.classList.add('is-standalone');
} catch (_) {}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

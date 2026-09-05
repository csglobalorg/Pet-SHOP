// Guard against environments where window.fetch has only a getter
try {
  const _fetch = window.fetch;
  let needsPatch = false;
  try {
    (window as any).fetch = _fetch;
  } catch {
    needsPatch = true;
  }
  if (needsPatch) {
    let currentFetch = _fetch;
    Object.defineProperty(window, 'fetch', {
      get() {
        return currentFetch;
      },
      set(val) {
        currentFetch = val;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch {
  // Ignore
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

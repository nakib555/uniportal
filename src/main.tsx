import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { handleChunkError } from './utils/chunkErrorHandler';

// Automatically recover from stale chunk errors when a new deployment occurs
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  handleChunkError();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

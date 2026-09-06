import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import { handleChunkError } from './utils/chunkErrorHandler';

// Automatically recover from stale chunk errors when a new deployment occurs
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  handleChunkError();
});

// Setup aggressive PWA updating
const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(true);
  },
  onRegisteredSW(swUrl, r) {
    if (r) {
      // Periodically check for PWA updates every 5 minutes
      setInterval(async () => {
        if (!(!r.installing && navigator)) return;
        if ('connection' in navigator && !navigator.onLine) return;
        
        try {
          const resp = await fetch(swUrl, { cache: 'no-store', headers: { 'cache': 'no-store', 'cache-control': 'no-cache' } });
          if (resp?.status === 200) {
            await r.update();
          }
        } catch (err) {
          console.error('Failed to check for PWA update:', err);
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

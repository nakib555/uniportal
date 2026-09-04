export async function handleChunkError() {
  const reloadKey = 'portal_chunk_error_reload';
  const lastReload = sessionStorage.getItem(reloadKey);
  const now = Date.now();
  
  // Prevent infinite reload loops (max 1 reload per 10 seconds)
  if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
    sessionStorage.setItem(reloadKey, now.toString());
    
    console.warn('Chunk load error detected. Unregistering service workers and reloading...');
    
    // Unregister service workers to clear out stale cached index.html
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      } catch (err) {
        console.error('Failed to unregister service worker:', err);
      }
    }
    
    // Force reload from server instead of cache where possible
    window.location.href = window.location.pathname + '?t=' + Date.now();
  } else {
    console.error('Chunk load error loop detected. Halting automatic reload.');
  }
}

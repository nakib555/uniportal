import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    // Some older browsers might not support addEventListener on MediaQueryList
    if (media.addEventListener) {
       media.addEventListener('change', listener);
       return () => media.removeEventListener('change', listener);
    } else {
       // Fallback
       media.addListener(listener);
       return () => media.removeListener(listener);
    }
  }, [query, matches]);

  return matches;
}

import React, { useState, useEffect } from 'react';

type ProxyImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export function ProxyImage({ src, fallbackSrc, alt, ...props }: ProxyImageProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    
    // If it's already a data URL or blob URL, use it directly
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      setObjectUrl(src);
      return;
    }

    let isMounted = true;
    
    const fetchImage = async () => {
      try {
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error('Proxy failed');
        
        const blob = await res.blob();
        if (blob.size < 100) throw new Error('Empty or invalid image');
        
        const url = URL.createObjectURL(blob);
        if (isMounted) {
          setObjectUrl(url);
          setError(false);
        }
      } catch (err) {
        console.error('Failed to proxy image:', err);
        if (isMounted) setError(true);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl && objectUrl.startsWith('blob:') && objectUrl !== src) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  const displaySrc = error || !objectUrl ? fallbackSrc : objectUrl;

  return <img src={displaySrc || fallbackSrc} alt={alt} onError={(e) => { e.currentTarget.src = fallbackSrc || ''; }} {...props} />;
}

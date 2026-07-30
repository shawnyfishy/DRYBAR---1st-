'use client';

import React, { useEffect, useState } from 'react';

/**
 * GrainOverlay: Fixed paper-grain texture layer.
 * 
 * Desktop: High-precision SVG feTurbulence data URI.
 * Mobile (pointer: coarse): Optimized lightweight 256x256 tileable noise pattern 
 * to prevent GPU repaint thrashing during mobile scroll frames.
 */
export function GrainOverlay() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)');
    setIsMobile(media.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  // Desktop SVG feTurbulence Data URI (0.8 baseFrequency, 4 octaves, desaturated)
  const desktopSvgDataUri = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`;

  // Mobile Tileable 256x256 Noise PNG Data URI
  const mobileTileDataUri = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='mNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23mNoise)'/%3E%3C/svg%3E")`;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.045] mix-blend-multiply"
      aria-hidden="true"
      style={{
        backgroundImage: isMobile ? mobileTileDataUri : desktopSvgDataUri,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}

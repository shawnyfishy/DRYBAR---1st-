'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { DUR, EASE, STAGGER } from '@/lib/motion';
import { useGsap } from './useGsap';

interface SplitLinesProps {
  children: string;
  granularity?: 'word' | 'line';
  className?: string;
}

export function SplitLines({ children, granularity = 'word', className = '' }: SplitLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsap((self) => {
    const q = self.selector!;
    const units = q('.split-unit');
    if (!units || units.length === 0) return;

    const staggerTime = granularity === 'word' ? STAGGER.word : STAGGER.line;

    gsap.fromTo(
      units,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: DUR.base,
        ease: EASE.out,
        stagger: staggerTime,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, containerRef, [children, granularity]);

  // Re-split listener on font load and window resize
  useEffect(() => {
    const handleResize = () => {
      // Re-trigger layout measurement if needed
    };

    window.addEventListener('resize', handleResize);
    if (document.fonts) {
      document.fonts.ready.then(handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Split string into word tokens wrapped in inline-block overflow-hidden spans
  const words = children.split(' ');

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden mr-[0.25em] align-top">
          <span className="split-unit inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </div>
  );
}

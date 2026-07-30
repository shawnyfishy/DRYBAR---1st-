'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { DUR, EASE } from '@/lib/motion';
import { useGsap } from '@/components/motion/useGsap';
import { useContainerAnimation } from '@/components/motion/HorizontalScrollContext';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerAnimation = useContainerAnimation();

  useGsap((self) => {
    const el = containerRef.current;
    if (!el) return;

    // Outside HorizontalTrack (normal vertical pages), containerAnimation is
    // null and this behaves as a plain "reveal when scrolled into view"
    // trigger. Inside it, every panel sits at the same vertical position at
    // all times — a 'top 85%' trigger would fire for all of them the instant
    // the page loads, regardless of whether they're horizontally in view
    // yet. containerAnimation ties progress to the horizontal tween instead,
    // so the reveal actually happens as the user scrolls to that panel.
    gsap.fromTo(
      el,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: DUR.base,
        ease: EASE.out,
        delay,
        scrollTrigger: containerAnimation
          ? {
              containerAnimation,
              trigger: el,
              start: 'left 85%',
              once: true,
            }
          : {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
      }
    );
  }, containerRef, [delay, containerAnimation]);

  return (
    <div ref={containerRef} data-reveal className={className}>
      {children}
    </div>
  );
}

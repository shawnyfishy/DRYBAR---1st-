'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { PARALLAX } from '@/lib/motion';
import { useGsap } from './useGsap';
import { useContainerAnimation } from './HorizontalScrollContext';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // Optional speed multiplier
}

export function Parallax({ children, className = '', speed = 1.0 }: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerAnimation = useContainerAnimation();

  useGsap((self) => {
    const el = containerRef.current;
    if (!el) return;

    // HARD RULE: Refuse to apply parallax to text nodes
    const isTextNode = Array.from(el.children).some((child) =>
      ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LABEL', 'A', 'BUTTON'].includes(child.tagName)
    );

    if (isTextNode) {
      console.warn(
        `[Parallax Violation]: Refusing to apply parallax to text element inside <Parallax>. ` +
          `Moving body copy is unreadable and breaks accessibility. Apply <Parallax> only to images and surface fields.`
      );
      return;
    }

    // Determine parallax fraction based on touch vs desktop
    const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const fraction = (isTouch ? PARALLAX.mobile : PARALLAX.desktop) * speed;
    const distance = window.innerHeight * fraction;

    gsap.fromTo(
      el,
      { y: -distance },
      {
        y: distance,
        ease: 'none',
        scrollTrigger: containerAnimation
          ? {
              // Same fix as Reveal: inside HorizontalTrack the
              // element's vertical position never changes, so a 'top
              // bottom'/'bottom top' scrub against the real (vertical)
              // scroller would compute a fixed, frozen progress value
              // instead of animating. Tie it to the horizontal tween instead.
              containerAnimation,
              trigger: el,
              start: 'right right',
              end: 'left left',
              scrub: true,
            }
          : {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
      }
    );
  }, containerRef, [speed, containerAnimation]);

  return (
    <div ref={containerRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

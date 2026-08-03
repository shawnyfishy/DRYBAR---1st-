'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LENIS, registerGsapPlugins } from '@/lib/motion';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    registerGsapPlugins();
    ScrollTrigger.config({ ignoreMobileResize: true });

    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let lenis: Lenis | null = null;
    let tickHandler: ((time: number) => void) | null = null;

    const destroyLenis = () => {
      if (tickHandler) {
        gsap.ticker.remove(tickHandler);
        tickHandler = null;
      }
      if (lenis) {
        lenis.destroy();
        lenis = null;
        lenisRef.current = null;
      }
      if ((window as any).lenisInstance) {
        delete (window as any).lenisInstance;
      }
    };

    const setupLenis = () => {
      const canSmooth = hoverQuery.matches;
      const prefersReducedMotion = motionQuery.matches;

      if (!canSmooth || prefersReducedMotion) {
        destroyLenis();
        return;
      }

      if (lenis) return;

      lenis = new Lenis({
        lerp: LENIS.lerp,
        wheelMultiplier: LENIS.wheelMultiplier,
        touchMultiplier: LENIS.touchMultiplier,
        smoothWheel: LENIS.smoothWheel,
        syncTouch: LENIS.syncTouch,
        autoRaf: LENIS.autoRaf,
      });

      lenisRef.current = lenis;
      (window as any).lenisInstance = lenis;

      lenis.on('scroll', () => {
        ScrollTrigger.update();
      });

      tickHandler = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(tickHandler);
      gsap.ticker.lagSmoothing(500, 33);

      if (typeof document !== 'undefined' && document.fonts) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }
    };

    setupLenis();

    const handleCapabilityChange = () => {
      setupLenis();
    };

    hoverQuery.addEventListener('change', handleCapabilityChange);
    motionQuery.addEventListener('change', handleCapabilityChange);

    return () => {
      hoverQuery.removeEventListener('change', handleCapabilityChange);
      motionQuery.removeEventListener('change', handleCapabilityChange);
      destroyLenis();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}


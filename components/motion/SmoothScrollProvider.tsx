'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { LENIS, registerGsapPlugins } from '@/lib/motion';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    registerGsapPlugins();

    // Check prefers-reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Instantiate Lenis smooth scroll
    const lenis = new Lenis({
      lerp: LENIS.lerp,
      wheelMultiplier: LENIS.wheelMultiplier,
      touchMultiplier: LENIS.touchMultiplier,
      smoothWheel: LENIS.smoothWheel,
      syncTouch: LENIS.syncTouch,
      autoRaf: LENIS.autoRaf,
    });

    lenisRef.current = lenis;
    // Exposed so components outside this provider (e.g. OverlayMenu) can
    // call lenis.stop()/start() — without this, that call was silently a
    // no-op since window.lenisInstance was never assigned, and the menu's
    // scroll-lock never actually engaged.
    (window as any).lenisInstance = lenis;

    // Connect Lenis scroll event to ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Single rAF ticker loop: Drive Lenis via GSAP ticker
    const tickHandler = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickHandler);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after fonts load
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      gsap.ticker.remove(tickHandler);
      lenis.destroy();
      lenisRef.current = null;
      if ((window as any).lenisInstance === lenis) {
        delete (window as any).lenisInstance;
      }
      // Kill all ScrollTriggers to prevent memory & context leaks
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Trigger ScrollTrigger refresh on route change
  useEffect(() => {
    if (lenisRef.current) {
      ScrollTrigger.refresh();
    }
  }, [pathname]);

  return <>{children}</>;
}

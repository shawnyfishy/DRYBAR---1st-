'use client';

import React, { useRef, useEffect, useState } from 'react';

import gsap from 'gsap';
import { Logo } from '@/components/ui/Logo';
import { useMenu } from './MenuProvider';
import { useTranslations } from 'next-intl';
import { TransitionLink } from '@/components/motion/RouteTransition';

export function Header() {
  const { activeDrawer, toggleMenu, toggleContacts } = useMenu();
  const t = useTranslations('nav');
  const [showDot, setShowDot] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const isScrolledRef = useRef<boolean>(false);
  const isHiddenRef = useRef<boolean>(false);
  const prevScrollYRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDismissed = sessionStorage.getItem('db:membership-pill') === 'dismissed';
      setShowDot(!isDismissed);
    }
  }, [activeDrawer]);



  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onScroll = (e?: any) => {
      const scrollY = typeof e?.scroll === 'number' ? e.scroll : window.scrollY;
      const isMobile = !window.matchMedia('(min-width: 768px)').matches;

      // 1. Surface fade in/out past 40px (300ms GSAP tween)
      const isScrolled = scrollY > 40;
      if (isScrolled !== isScrolledRef.current) {
        isScrolledRef.current = isScrolled;
        if (surfaceRef.current) {
          if (isReducedMotion) {
            surfaceRef.current.style.opacity = isScrolled ? '1' : '0';
          } else {
            gsap.to(surfaceRef.current, {
              opacity: isScrolled ? 1 : 0,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        }
      }

      // 2. Mobile Auto-hide (under 768px, skip if reduced motion or drawer open)
      let direction = e?.direction;
      if (direction === undefined) {
        direction = scrollY > prevScrollYRef.current ? 1 : scrollY < prevScrollYRef.current ? -1 : 0;
      }
      prevScrollYRef.current = scrollY;

      if (isMobile && !isReducedMotion && activeDrawer === null) {
        if (scrollY > 120 && direction === 1) {
          // Scroll down past 120px -> Translate header up by -100% over 400ms ease.inOut
          if (!isHiddenRef.current) {
            isHiddenRef.current = true;
            if (headerRef.current) {
              gsap.to(headerRef.current, {
                yPercent: -100,
                duration: 0.4,
                ease: 'power2.inOut',
                overwrite: 'auto',
              });
            }
          }
        } else if (direction === -1 || scrollY <= 120) {
          // Any scroll up or near top -> Bring header back straight away
          if (isHiddenRef.current) {
            isHiddenRef.current = false;
            if (headerRef.current) {
              gsap.to(headerRef.current, {
                yPercent: 0,
                duration: 0.4,
                ease: 'power2.inOut',
                overwrite: 'auto',
              });
            }
          }
        }
      } else {
        // Desktop (>= 768px), drawer active, or reduced motion -> Force header visible
        if (isHiddenRef.current) {
          isHiddenRef.current = false;
          if (headerRef.current) {
            gsap.to(headerRef.current, {
              yPercent: 0,
              duration: 0.4,
              ease: 'power2.inOut',
              overwrite: 'auto',
            });
          }
        }
      }
    };

    // Initial check on mount
    onScroll();

    // Attach listener to Lenis instance if active, plus native scroll fallback
    const lenis = (window as any).lenisInstance;
    if (lenis) {
      lenis.on('scroll', onScroll);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (lenis) {
        lenis.off('scroll', onScroll);
      }
      window.removeEventListener('scroll', onScroll);
    };
  }, [activeDrawer]);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 inset-x-0 z-40 flex h-16 w-full items-center justify-between px-4 sm:px-6 md:px-12 lg:px-20 pointer-events-none"
    >
      {/* Scroll-aware surface background */}
      <div
        ref={surfaceRef}
        className="absolute inset-0 bg-[var(--color-cream)] border-b border-[var(--color-charcoal)]/15 pointer-events-none -z-10 opacity-0"
      />

      <TransitionLink
        href="/"
        className="flex items-center rounded pointer-events-auto transition-transform hover:scale-105"
        aria-label="Drybar Qatar Home"
      >
        <Logo className="h-6 sm:h-7 w-auto" variant="dark" />
      </TransitionLink>

      {/* MOBILE ONLY (Under 768px): Sleek touch navigation triggers */}
      <div className="flex items-center gap-2 pointer-events-auto md:hidden">
        <button
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
          className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-[var(--color-charcoal)] px-3.5 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-white shadow-lg transition-transform active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
        >
          {showDot && (
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[var(--color-yellow)] shrink-0"
            />
          )}
          {activeDrawer === 'menu' ? t('close') : t('menu')}
        </button>


        <button
          onClick={toggleContacts}
          aria-label="Toggle Contacts Drawer"
          className="flex h-9 items-center justify-center rounded-full bg-transparent border border-[var(--color-charcoal)] px-3.5 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[var(--color-charcoal)] shadow-lg transition-transform active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
        >
          {activeDrawer === 'contacts' ? t('close') : 'CONTACTS'}
        </button>
      </div>
    </header>
  );
}


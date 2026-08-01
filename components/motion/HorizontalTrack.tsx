'use client';

import React, { useRef, useState, useLayoutEffect, useSyncExternalStore } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from './useGsap';
import { useMenu } from '@/components/layout/MenuProvider';
import { getCtaDestination } from '@/lib/zenoti';
import { HorizontalScrollProvider } from './HorizontalScrollContext';

interface HorizontalTrackProps {
  children: React.ReactNode;
}

const DESKTOP_QUERY = '(min-width: 768px)';

function subscribeDesktop(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia(DESKTOP_QUERY);

  const handler = () => {
    callback();
    if (typeof window !== 'undefined') {
      ScrollTrigger.refresh();
    }
  };

  mql.addEventListener('change', handler);
  return () => mql.removeEventListener('change', handler);
}

function getDesktopSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(DESKTOP_QUERY).matches;
}

function getDesktopServerSnapshot() {
  return false;
}

export function HorizontalTrack({ children }: HorizontalTrackProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const [containerTween, setContainerTween] = useState<gsap.core.Tween | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { activeDrawer, toggleMenu, toggleContacts } = useMenu();

  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  );

  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  const panelCount = React.Children.count(children);
  const cta = getCtaDestination('book', 'horizontal_track');

  useGsap((self) => {
    if (!isDesktop || !outerRef.current || !innerRef.current) return;

    const outer = outerRef.current;
    const inner = innerRef.current;

    const frame = inner.parentElement as HTMLElement;
    const getDistance = () => inner.scrollWidth - frame.clientWidth;
    if (getDistance() <= 0) return;

    const tween = gsap.to(inner, {
      x: () => -getDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: outer,
        start: 'top top',
        end: () => `+=${getDistance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (!indexRef.current) return;
          const active = Math.min(panelCount, Math.floor(self.progress * panelCount) + 1);
          indexRef.current.textContent = String(active).padStart(2, '0');
        },
      },
    });

    setContainerTween(tween);

    return () => {
      setContainerTween(null);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
    // `isMounted` MUST stay in these deps. The first render returns the
    // non-desktop fallback tree, so outerRef/innerRef are not attached yet and
    // this effect bails on the null ref. Only the post-mount re-render attaches
    // them, so without `isMounted` here the effect never re-runs and the pin is
    // never built. On a full page load that was masked by hydration flipping
    // `isDesktop` false->true (re-running this by accident); on a client-side
    // navigation there is no hydration, so the home page arrived unpinned.
  }, outerRef, [isDesktop, isMounted]);

  if (!isMounted || !isDesktop) {
    return (
      <HorizontalScrollProvider value={null}>
        <div className="flex flex-col w-full min-h-screen overflow-x-hidden bg-[var(--color-cream)]">{children}</div>
      </HorizontalScrollProvider>
    );
  }

  return (
    <HorizontalScrollProvider value={containerTween}>
    <div ref={outerRef} className="relative w-full overflow-hidden bg-[var(--color-cream)]">
      {/* 9TO5STUDIO SITE MENU BUTTON — HOVER EXPANDS & REVEALS YELLOW DOT */}
      <button
        id="site-menu-button"
        onClick={toggleMenu}
        aria-label="Toggle Menu Drawer"
        className="group fixed inset-y-0 left-0 z-50 flex w-[var(--spacing-rail)] hover:w-20 flex-col items-center justify-center bg-[var(--color-charcoal)] text-white shadow-2xl transition-all duration-300 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
      >
        <span className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase [writing-mode:vertical-rl] rotate-180">
          {activeDrawer === 'menu' ? 'Close' : 'Menu'}
        </span>

        {/* 9TO5STUDIO SIGNATURE YELLOW ACTIVE / HOVER INDICATOR DOT */}
        <div className={`absolute bottom-8 size-2.5 rounded-full bg-[var(--color-yellow)] transition-all duration-300 ${
          activeDrawer === 'menu' ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-100 group-hover:scale-110'
        }`} />
      </button>

      {/* 9TO5STUDIO SITE CONTACTS BUTTON — HOVER EXPANDS & REVEALS YELLOW DOT */}
      <button
        id="site-contacts-button"
        onClick={toggleContacts}
        aria-label="Toggle Contacts Drawer"
        className="group fixed inset-y-0 right-0 z-50 flex w-[var(--spacing-rail)] hover:w-20 flex-col items-center justify-center bg-[var(--color-charcoal)] text-white shadow-2xl transition-all duration-300 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
      >
        <span className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase [writing-mode:vertical-rl] rotate-180">
          {activeDrawer === 'contacts' ? 'Close' : 'Contacts'}
        </span>

        {/* 9TO5STUDIO SIGNATURE YELLOW ACTIVE / HOVER INDICATOR DOT */}
        <div className={`absolute bottom-8 size-2.5 rounded-full bg-[var(--color-yellow)] transition-all duration-300 ${
          activeDrawer === 'contacts' ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-100 group-hover:scale-110'
        }`} />
      </button>

      {/* GLOBAL FIXED BOTTOM-CENTER PANEL COUNTER */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-charcoal)] font-mono">
        [<span ref={indexRef}>01</span> / {String(panelCount).padStart(2, '0')}]
      </div>

      {/* FRAMED BOX CONTAINER BOUNDED BETWEEN THE 56PX SIDEBARS */}
      <div className="w-[calc(100vw-(var(--spacing-rail)*2))] mx-auto border-x border-[var(--color-charcoal)]/15">
        <div
          ref={innerRef}
          className="flex h-[100dvh] w-max flex-nowrap will-change-transform"
        >
          {children}
        </div>
      </div>
    </div>
    </HorizontalScrollProvider>
  );
}

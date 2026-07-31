'use client';

import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGsap } from './useGsap';
import { useMenu } from '@/components/layout/MenuProvider';
import { getCtaDestination } from '@/lib/zenoti';
import { HorizontalScrollProvider } from './HorizontalScrollContext';

interface HorizontalTrackProps {
  children: React.ReactNode;
}

export function HorizontalTrack({ children }: HorizontalTrackProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [containerTween, setContainerTween] = useState<gsap.core.Tween | null>(null);
  const { activeDrawer, toggleMenu, toggleContacts } = useMenu();

  const panelCount = React.Children.count(children);
  const cta = getCtaDestination('book', 'horizontal_track');

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useGsap((self) => {
    if (!isDesktop || !outerRef.current || !innerRef.current) return;

    const outer = outerRef.current;
    const inner = innerRef.current;

    const getDistance = () => inner.scrollWidth - window.innerWidth;
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
  }, outerRef, [isDesktop]);

  if (!isDesktop) {
    return (
      <HorizontalScrollProvider value={null}>
        <div className="flex flex-col w-full">{children}</div>
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
        className="group fixed inset-y-0 left-0 z-50 flex w-14 hover:w-20 flex-col items-center justify-center bg-[#111111] text-white shadow-2xl transition-all duration-300 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
      >
        <span className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase [writing-mode:vertical-rl] rotate-180">
          {activeDrawer === 'menu' ? 'Close' : 'Menu'}
        </span>

        {/* 9TO5STUDIO SIGNATURE YELLOW ACTIVE / HOVER INDICATOR DOT */}
        <div className={`absolute bottom-8 size-2.5 rounded-full bg-[#FEDD30] transition-all duration-300 ${
          activeDrawer === 'menu' ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-100 group-hover:scale-110'
        }`} />
      </button>

      {/* 9TO5STUDIO SITE CONTACTS BUTTON — HOVER EXPANDS & REVEALS YELLOW DOT */}
      <button
        id="site-contacts-button"
        onClick={toggleContacts}
        aria-label="Toggle Contacts Drawer"
        className="group fixed inset-y-0 right-0 z-50 flex w-14 hover:w-20 flex-col items-center justify-center bg-[#111111] text-white shadow-2xl transition-all duration-300 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
      >
        <span className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase [writing-mode:vertical-rl] rotate-180">
          {activeDrawer === 'contacts' ? 'Close' : 'Contacts'}
        </span>

        {/* 9TO5STUDIO SIGNATURE YELLOW ACTIVE / HOVER INDICATOR DOT */}
        <div className={`absolute bottom-8 size-2.5 rounded-full bg-[#FEDD30] transition-all duration-300 ${
          activeDrawer === 'contacts' ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-100 group-hover:scale-110'
        }`} />
      </button>

      {/* FRAMED BOX CONTAINER BOUNDED BETWEEN THE 56PX SIDEBARS */}
      <div className="w-[calc(100vw-112px)] mx-auto border-x border-[var(--color-charcoal)]/15">
        <div
          ref={innerRef}
          className="flex h-screen w-max flex-nowrap will-change-transform"
        >
          {children}
        </div>
      </div>
    </div>
    </HorizontalScrollProvider>
  );
}

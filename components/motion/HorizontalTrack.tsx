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
  const { open } = useMenu();

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

    // Re-measured on every ScrollTrigger refresh (not a static snapshot) so the
    // tween target stays correct if the initial layout measurement races the
    // desktop/mobile DOM swap.
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
          // Direct DOM write, not React state — this fires every scroll frame.
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
    // Mobile view: Vertical flex layout preserving native touch momentum scroll.
    // No containerAnimation to hand out here — panels fall back to their own
    // vertical scroll-trigger behavior.
    return (
      <HorizontalScrollProvider value={null}>
        <div className="flex flex-col w-full">{children}</div>
      </HorizontalScrollProvider>
    );
  }

  return (
    <HorizontalScrollProvider value={containerTween}>
    <div ref={outerRef} className="relative w-full overflow-hidden">
      {/* LEFT EDGE — rotated menu trigger. Lives inside the pinned element so
          it's only present in the DOM while the horizontal section owns the
          viewport, and scrolls away naturally with it once un-pinned. */}
      <button
        onClick={open}
        className="absolute inset-y-0 left-0 z-20 flex w-10 items-center justify-center text-[0.6875rem] font-medium tracking-[0.2em] uppercase text-[var(--color-charcoal)] transition-colors hover:text-[var(--color-warmgrey)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
      >
        <span className="[writing-mode:vertical-rl] rotate-180">Menu</span>
      </button>

      {/* RIGHT EDGE — rotated booking CTA, persistent throughout the scroll. */}
      <a
        href={cta.href}
        target={cta.target}
        rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
        className="absolute inset-y-0 right-0 z-20 flex w-10 items-center justify-center text-[0.6875rem] font-medium tracking-[0.2em] uppercase text-[var(--color-charcoal)] transition-colors hover:text-[var(--color-warmgrey)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
      >
        <span className="[writing-mode:vertical-rl] rotate-180">{cta.labelEn}</span>
      </a>

      {/* BOTTOM-LEFT — live panel index, updated per scroll frame above. */}
      <div className="absolute bottom-6 left-6 z-20 flex items-baseline gap-2 text-[0.6875rem] font-medium tracking-[0.15em] text-[var(--color-charcoal)] tabular-nums">
        <span ref={indexRef}>01</span>
        <span className="text-[var(--color-warmgrey)]">/ {String(panelCount).padStart(2, '0')}</span>
      </div>

      <div
        ref={innerRef}
        className="flex h-screen w-max flex-nowrap will-change-transform"
      >
        {children}
      </div>
    </div>
    </HorizontalScrollProvider>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getServicesData } from '@/lib/services';
import { TransitionLink } from '@/components/motion/RouteTransition';
import { useMenu } from './MenuProvider';
import { MEMBERSHIP_PROMO_VARIANT } from '@/lib/promo';
import { PRELOADER_REVEAL_EVENT } from '@/lib/preloaderEvents';
import { DUR, EASE } from '@/lib/motion';
import { gsap } from 'gsap';

function getFiftyPercentOrdinal(): string {
  const memberships = getServicesData().memberships;
  const tier = memberships
    .filter((m) => m.benefit_percent === 50)
    .sort((a, b) => a.sessions - b.sessions)[0];
  const n = tier ? tier.sessions : 6;
  const ordinals: Record<number, string> = {
    1: 'first',
    2: 'second',
    3: 'third',
    4: 'fourth',
    5: 'fifth',
    6: 'sixth',
    7: 'seventh',
    8: 'eighth',
    9: 'ninth',
    10: 'tenth',
  };
  return ordinals[n] || `${n}th`;
}

export function MembershipPill() {
  const pathname = usePathname();
  const { activeDrawer } = useMenu();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [barHeight, setBarHeight] = useState(0);

  const servicesData = getServicesData();
  const memberships = servicesData.memberships;
  const ordinal = getFiftyPercentOrdinal();
  const ordinalCapitalized = ordinal.charAt(0).toUpperCase() + ordinal.slice(1);

  // Check initial dismissal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('db:membership-pill') === 'dismissed';
      if (dismissed) {
        setIsDismissed(true);
      }
    }
  }, []);

  // Measure hero-utility-bar height dynamically
  useEffect(() => {
    if (!isVisible) return;

    const updateBarHeight = () => {
      const bar = document.getElementById('hero-utility-bar');
      const h = bar ? bar.getBoundingClientRect().height : 0;
      setBarHeight(h);
    };

    updateBarHeight();

    window.addEventListener('resize', updateBarHeight, { passive: true });

    const bar = document.getElementById('hero-utility-bar');
    let observer: ResizeObserver | null = null;
    if (bar && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        updateBarHeight();
      });
      observer.observe(bar);
    }

    return () => {
      window.removeEventListener('resize', updateBarHeight);
      if (observer) observer.disconnect();
    };
  }, [pathname, isVisible]);

  // Trigger logic: 12s OR 25% scroll depth (Home route: 25% scroll depth ONLY)
  useEffect(() => {
    if (pathname === '/gifts' || isDismissed || isVisible) {
      return;
    }

    let timer: NodeJS.Timeout | null = null;

    const setupTrigger = () => {
      const triggerShow = () => {
        if (timer) clearTimeout(timer);
        window.removeEventListener('scroll', onScroll);
        setIsVisible(true);
      };

      const onScroll = () => {
        const scrollableHeight = document.body.scrollHeight - window.innerHeight;
        if (scrollableHeight > 0 && window.scrollY / scrollableHeight > 0.25) {
          triggerShow();
        }
      };

      // Drop timer on home page ('/')
      if (pathname !== '/') {
        timer = setTimeout(() => {
          triggerShow();
        }, 12000);
      }

      window.addEventListener('scroll', onScroll, { passive: true });
    };

    const hasSeenIntro =
      typeof window !== 'undefined' && sessionStorage.getItem('db:intro') === 'true';

    if (hasSeenIntro) {
      setupTrigger();
    } else {
      const handlePreloaderReveal = () => {
        setupTrigger();
      };
      window.addEventListener(PRELOADER_REVEAL_EVENT, handlePreloaderReveal, { once: true });
      return () => {
        window.removeEventListener(PRELOADER_REVEAL_EVENT, handlePreloaderReveal);
        if (timer) clearTimeout(timer);
      };
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [pathname, isDismissed, isVisible]);

  // Pulsing dot animation on collapsed pill
  useEffect(() => {
    if (!isVisible || isOpen || !dotRef.current) return;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const tween = gsap.to(dotRef.current, {
      opacity: 0.35,
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    return () => {
      tween.kill();
    };
  }, [isVisible, isOpen]);

  // Entrance & drawer pause animations
  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const container = containerRef.current;

    if (activeDrawer !== null) {
      // Pause: hide container when menu/drawer is active
      gsap.to(container, { opacity: 0, y: 16, duration: DUR.base, ease: EASE.inOut, overwrite: 'auto' });
    } else {
      // Resume / Entrance
      gsap.fromTo(
        container,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: DUR.page, ease: EASE.soft, overwrite: 'auto' }
      );
    }
  }, [isVisible, activeDrawer]);

  // Keyboard Escape listener to collapse card back to pill
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCollapse();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleExpand = () => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (pillRef.current && !isReducedMotion) {
      gsap.to(pillRef.current, {
        opacity: 0,
        duration: 0.18,
        ease: EASE.out,
        onComplete: () => setIsOpen(true),
      });
    } else {
      setIsOpen(true);
    }
  };

  const handleCollapse = () => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (cardRef.current && !isReducedMotion) {
      gsap.to(cardRef.current, {
        opacity: 0,
        y: 12,
        scale: 0.96,
        duration: 0.4,
        ease: EASE.inOut,
        onComplete: () => setIsOpen(false),
      });
    } else {
      setIsOpen(false);
    }
  };

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('db:membership-pill', 'dismissed');
    }
    setIsDismissed(true);

    const activeEl = cardRef.current || pillRef.current || containerRef.current;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (activeEl && !isReducedMotion) {
      gsap.to(activeEl, {
        opacity: 0,
        y: 12,
        scale: 0.96,
        duration: 0.4,
        ease: EASE.inOut,
        onComplete: () => setIsVisible(false),
      });
    } else {
      setIsVisible(false);
    }
  };

  if (pathname === '/gifts' || isDismissed || !isVisible) {
    return null;
  }

  const bottomOffsetStyle = `calc(${barHeight}px + env(safe-area-inset-bottom, 0px) + 16px)`;

  return (
    <div
      ref={containerRef}
      className="fixed z-40 left-4 right-4 md:left-auto md:right-8 flex justify-center md:justify-end pointer-events-none"
      style={{ bottom: bottomOffsetStyle }}
    >
      {isOpen ? (
        /* EXPANDED CARD STATE */
        <div
          ref={cardRef}
          id="membership-card"
          role="region"
          aria-label="Membership"
          className="pointer-events-auto w-[calc(100vw-32px)] max-w-[340px] md:w-[380px] md:max-w-[380px] max-h-[240px] rounded-[24px] bg-[var(--color-charcoal)] border border-[var(--color-yellow)] p-6 origin-bottom-center md:origin-bottom-right flex flex-col justify-between select-none shadow-none"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
              MEMBERSHIP
            </span>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--color-cream)]/50 hover:text-[var(--color-yellow)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)] cursor-pointer -mr-2 -mt-2"
            >
              ✕
            </button>
          </div>

          {/* Headline */}
          <h2 className="text-[clamp(1.125rem,4.5vw,1.375rem)] leading-[1.15] text-[var(--color-cream)] font-normal mb-3">
            We would rather see you often.
          </h2>

          {/* Tier Row */}
          <div className="flex gap-2 mb-4">
            {memberships.map((item, idx) => {
              const isEmphasis = idx === 1;
              return (
                <div
                  key={item.id}
                  className={`flex-1 rounded-full px-3 py-1.5 flex flex-col items-center justify-center ${
                    isEmphasis
                      ? 'border border-[var(--color-yellow)]'
                      : 'border border-[var(--color-warmgrey)]/30'
                  }`}
                >
                  <span className="text-[1.125rem] tabular-nums text-[var(--color-cream)] font-normal leading-tight">
                    {item.sessions}
                  </span>
                  <span className="text-[0.625rem] tracking-[0.1em] uppercase text-[var(--color-warmgrey)] font-medium leading-none mt-0.5">
                    {item.benefit_percent}% OFF
                  </span>
                </div>
              );
            })}
          </div>

          {/* CTA Link */}
          <TransitionLink
            href="/gifts"
            onClick={handleDismiss}
            className="w-full rounded-full bg-[var(--color-yellow)] text-[var(--color-charcoal)] text-[0.6875rem] tracking-[0.15em] uppercase font-bold min-h-[44px] flex items-center justify-center transition-transform hover:scale-[1.02] cursor-pointer"
          >
            SEE ALL MEMBERSHIPS →
          </TransitionLink>
        </div>
      ) : (
        /* COLLAPSED PILL STATE */
        <button
          ref={pillRef}
          type="button"
          aria-expanded={false}
          aria-controls="membership-card"
          onClick={handleExpand}
          className="pointer-events-auto h-11 md:h-12 rounded-full bg-[var(--color-charcoal)] border border-[var(--color-yellow)] pl-4 pr-2 inline-flex items-center gap-3 origin-bottom-center md:origin-bottom-right transition-transform hover:scale-[1.02] cursor-pointer shadow-none"
        >
          {/* Status Dot */}
          <span
            ref={dotRef}
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-[var(--color-yellow)] shrink-0"
          />

          {/* Label */}
          <span className="text-[0.8125rem] text-[var(--color-cream)] font-normal whitespace-nowrap">
            <span className="hidden xs:inline">Your {ordinal} blowout is half price.</span>
            <span className="inline xs:hidden">{ordinalCapitalized} blowout, half price.</span>
          </span>

          {/* Close Button Target (32px visual, 44x44 hit area) */}
          <span
            className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-1"
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
          >
            <span
              role="button"
              aria-label="Dismiss"
              className="h-8 w-8 rounded-full flex items-center justify-center text-[var(--color-cream)]/50 hover:text-[var(--color-yellow)] transition-colors"
            >
              ✕
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

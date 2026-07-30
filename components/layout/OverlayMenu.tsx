'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { EASE, DUR } from '@/lib/motion';
import { Logo } from '@/components/ui/Logo';
import { useMenu } from './MenuProvider';

export function OverlayMenu() {
  const { isOpen, close } = useMenu();
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const t = useTranslations('nav');
  const tBrand = useTranslations('brand');

  useEffect(() => {
    if (!overlayRef.current || !drawerRef.current) return;

    const overlay = overlayRef.current;
    const drawer = drawerRef.current;
    const links = drawer.querySelectorAll('.menu-item-link');
    const sections = drawer.querySelectorAll('.menu-section');
    const pageContent = document.getElementById('page-content');

    const lenisInstance = (window as any).lenisInstance as Lenis | undefined;

    if (isOpen) {
      if (lenisInstance) lenisInstance.stop();
      closeButtonRef.current?.focus();
      gsap.set(overlay, { autoAlpha: 1 });

      // Push transition: the drawer enters while the page content is
      // shoved aside in the same beat — both tweens share one timeline so
      // they read as a single motion, not an overlay fading over static content.
      const tl = gsap.timeline({ defaults: { duration: DUR.page, ease: EASE.soft } });

      tl.fromTo(drawer, { xPercent: -100 }, { xPercent: 0 }, 0);

      if (pageContent) {
        tl.fromTo(pageContent, { x: 0 }, { x: '10vw' }, 0);
      }

      tl.fromTo(links, { y: 25, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, delay: 0.2 }, 0)
        .fromTo(sections, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.3 }, 0);
    } else {
      if (lenisInstance) lenisInstance.start();

      const tl = gsap.timeline({
        defaults: { duration: 0.6, ease: EASE.soft },
        onComplete: () => gsap.set(overlay, { autoAlpha: 0 }),
      });
      tl.to(drawer, { xPercent: -100 }, 0);
      if (pageContent) {
        // clearProps strips the inline transform once settled at rest — a
        // lingering `transform: translate(0,0)` (even a no-op one) turns
        // #page-content into a new containing block for any `position:fixed`
        // descendant, which silently breaks HorizontalTrack's ScrollTrigger
        // pin (it stops tracking the real viewport and scrolls away with
        // #page-content instead).
        tl.to(pageContent, { x: 0, clearProps: 'transform' }, 0);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }

      if (e.key === 'Tab' && overlayRef.current) {
        const focusables = overlayRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  return (
    <div
      id="overlay-menu"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      aria-hidden={!isOpen}
      className="invisible fixed inset-0 z-50 flex"
    >
      {/* LEFT DRAWER PANEL — pushes #page-content aside as it slides in.
          Off-canvas position is set by the GSAP close timeline (which also
          runs once on mount), not a Tailwind translate-x utility: Tailwind v4
          writes translate utilities to the CSS `translate` property, which
          composes on top of (rather than being overridden by) the `transform`
          property GSAP animates — the two would otherwise fight, leaving the
          drawer permanently stuck off-screen even mid-"open" tween. */}
      <div
        ref={drawerRef}
        className="flex h-full w-full max-w-md flex-col justify-between [background-image:var(--backgroundImage-grad-sumi)] p-8 text-[var(--color-cream)] shadow-2xl md:p-12 border-r border-[var(--color-warmgrey)]/20"
      >
        {/* TOP LOGO & CLOSE BUTTON */}
        <div className="flex items-center justify-between border-b border-[var(--color-warmgrey)]/20 pb-6">
          <Logo className="h-6 w-auto" />
          <button
            ref={closeButtonRef}
            onClick={close}
            className="rounded px-3 py-1 text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-cream)] transition-colors hover:text-[var(--color-yellow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]"
          >
            {t('close')}
          </button>
        </div>

        {/* NAVIGATION SECTION */}
        <div className="menu-section flex flex-col gap-8 my-auto py-8">
          <div className="grid grid-cols-[100px_1fr] items-start gap-4">
            <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
              Navigation
            </span>
            <nav className="flex flex-col gap-4 font-normal text-[clamp(1.5rem,4vw,2.5rem)] leading-none tracking-[-0.02em]">
              <a
                href="/"
                className="menu-item-link flex items-center gap-2 transition-colors hover:text-[var(--color-yellow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]"
              >
                <span className="text-[var(--color-yellow)]">•</span> {t('home')}
              </a>
              <a
                href="/prices"
                className="menu-item-link flex items-center gap-2 transition-colors hover:text-[var(--color-yellow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]"
              >
                {t('prices')}
              </a>
              <a
                href="/gifts"
                className="menu-item-link flex items-center gap-2 transition-colors hover:text-[var(--color-yellow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]"
              >
                {t('gifts')}
              </a>
            </nav>
          </div>

          {/* FOLLOW SECTION */}
          <div className="grid grid-cols-[100px_1fr] items-start gap-4 border-t border-[var(--color-warmgrey)]/20 pt-6">
            <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
              Follow
            </span>
            <div className="flex flex-col gap-2">
              <a
                href="https://instagram.com/thedrybar.qatar"
                target="_blank"
                rel="noopener noreferrer"
                className="menu-item-link text-lg font-medium text-[var(--color-cream)] hover:text-[var(--color-yellow)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]"
              >
                INSTAGRAM
              </a>
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="grid grid-cols-[100px_1fr] items-start gap-4 border-t border-[var(--color-warmgrey)]/20 pt-6">
            <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
              Info
            </span>
            <div className="flex flex-col gap-1 text-xs text-[var(--color-warmgrey)]">
              <span className="font-medium text-[var(--color-cream)] uppercase tracking-[0.1em]">{tBrand('name')}</span>
              <span>{tBrand('location')}</span>
              <span>WhatsApp: {tBrand('whatsapp')}</span>
            </div>
          </div>
        </div>

        {/* BOTTOM LEGAL BAR */}
        <div className="border-t border-[var(--color-warmgrey)]/20 pt-4 text-[0.625rem] text-[var(--color-warmgrey)]">
          {tBrand('legal')}
        </div>
      </div>

      {/* RIGHT BACKDROP CLICK TO CLOSE */}
      <div className="hidden flex-1 md:block" onClick={close} />
    </div>
  );
}

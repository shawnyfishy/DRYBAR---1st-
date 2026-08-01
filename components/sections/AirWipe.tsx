'use client';

import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { useGsap } from '@/components/motion/useGsap';
import { useContainerAnimation } from '@/components/motion/HorizontalScrollContext';

export function AirWipe() {
  const t = useTranslations('airWipe');
  const containerRef = useRef<HTMLDivElement>(null);
  const containerAnimation = useContainerAnimation();

  useGsap((self) => {
    const q = self.selector!;
    const sweepOverlay = q('.airwipe-sweep')[0];
    const words = q('.airwipe-word');
    const mediaCard = q('.airwipe-media-card');
    const tracker = q('.airwipe-tracker');

    if (!sweepOverlay) return;

    const tl = gsap.timeline({
      scrollTrigger: containerAnimation
        ? {
            containerAnimation,
            trigger: containerRef.current,
            start: 'left 85%',
            end: 'left 15%',
            toggleActions: 'play none none reverse',
          }
        : {
            trigger: containerRef.current,
            start: 'top 85%',
            once: true,
          },
    });

    tl.fromTo(
      sweepOverlay,
      { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.0, ease: 'power4.inOut' }
    )
      .fromTo(
        tracker,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '<0.2'
      )
      .fromTo(
        words,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out' },
        '<0.1'
      )
      .fromTo(
        mediaCard,
        { scale: 0.85, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        '<0.2'
      );
  }, containerRef, [containerAnimation]);

  const statementWords = t('statement').split(' ');

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[100dvh] w-full md:w-[calc(100vw-(var(--spacing-rail)*2))] md:flex-shrink-0 flex-col justify-between overflow-hidden [background-image:var(--backgroundImage-grad-asagiri)] pt-20 pb-8 px-4 sm:px-6 md:px-12 lg:px-20 md:pt-24 md:pb-12 text-center"
    >
      {/* SWEEP OVERLAY ON --GRAD-YUZU */}
      <div className="airwipe-sweep absolute inset-0 [background-image:var(--backgroundImage-grad-yuzu)]" />

      {/* TOP TRACKING HEADER */}
      <div className="airwipe-tracker relative z-10 flex w-full items-center justify-end text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-[var(--color-charcoal)]">
        <span className="hidden sm:inline">GEWAN ISLAND</span>
      </div>

      {/* CENTER STATEMENT & FEATURE MEDIA CARD */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center gap-8 max-w-5xl mx-auto">
        <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[0.96] tracking-[-0.03em] text-[var(--color-charcoal)]">
          {statementWords.map((word, idx) => (
            <span key={idx} className="inline-block overflow-hidden mr-[0.25em] align-top">
              <span className="airwipe-word inline-block will-change-transform">
                {word}
              </span>
            </span>
          ))}
        </h2>

        {/* EXPANDING SHOWCASE MEDIA CARD MATCHING REFERENCE SITE DYNAMIC FEEDS */}
        <div className="airwipe-media-card overflow-hidden rounded-2xl shadow-2xl border-2 border-[var(--color-charcoal)]/15 w-64 md:w-80 aspect-[16/10] bg-white transition-transform duration-500 hover:scale-105">
          <img
            src="/images/13.webp"
            alt="Drybar Qatar Salon Experience"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* BOTTOM TAGLINE */}
      <div className="relative z-10 flex w-full items-center justify-center text-[0.6875rem] font-medium tracking-[0.2em] uppercase text-[var(--color-charcoal)]/80">
        <span>No Cuts • No Colour • Just Blowouts</span>
      </div>
    </div>
  );
}

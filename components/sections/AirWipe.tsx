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

    if (!sweepOverlay) return;

    // This section lives inside HorizontalTrack's pinned/translated row, so
    // its own scroll position never moves vertically — only its horizontal
    // offset changes as the master tween runs. A plain 'left center' trigger
    // never fires against the page's real (vertical) scroller; GSAP's
    // `containerAnimation` option is the purpose-built fix — it makes
    // ScrollTrigger read progress through that tween instead of real scroll
    // position, so 'left'/'right' keywords become meaningful again. Falls
    // back to a normal vertical reveal when there's no horizontal tween to
    // hook into (mobile's vertical-stack layout).
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
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.8, ease: 'airWipe' }
    ).fromTo(
      words,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, stagger: 0.08, ease: 'power2.out' },
      '<0.1'
    );
  }, containerRef, [containerAnimation]);

  const statementWords = t('statement').split(' ');

  return (
    <div ref={containerRef} className="relative flex h-[100dvh] w-[100vw] flex-shrink-0 items-center justify-center overflow-hidden [background-image:var(--backgroundImage-grad-asagiri)] p-6 md:p-12 text-center">
      {/* SWEEP OVERLAY ON --GRAD-YUZU */}
      <div className="airwipe-sweep absolute inset-0 [background-image:var(--backgroundImage-grad-yuzu)]" />

      {/* COPY STATEMENT */}
      <div className="relative z-10 max-w-4xl">
        <h2 className="text-[clamp(2.5rem,8vw,5.5rem)] font-normal leading-[0.92] tracking-[-0.03em] text-[var(--color-charcoal)]">
          {statementWords.map((word, idx) => (
            <span key={idx} className="inline-block overflow-hidden mr-[0.25em] align-top">
              <span className="airwipe-word inline-block will-change-transform">
                {word}
              </span>
            </span>
          ))}
        </h2>
      </div>
    </div>
  );
}

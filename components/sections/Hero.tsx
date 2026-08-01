'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DUR, EASE, STAGGER } from '@/lib/motion';
import { useGsap } from '@/components/motion/useGsap';
import { useContainerAnimation } from '@/components/motion/HorizontalScrollContext';
import { PRELOADER_REVEAL_EVENT } from '@/lib/preloaderEvents';
import { getCtaDestination, trackCtaClick } from '@/lib/zenoti';

const HERO_IMAGES = [
  '/images/1.webp',
  '/images/6.webp',
  '/images/13.webp',
  '/images/20.webp',
  '/images/24.webp',
];

const HERO_BLUR_DATA_URL =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect width="100%25" height="100%25" fill="%23262523"/%3E%3C/svg%3E';

export function Hero() {
  const t = useTranslations('hero');
  const heroRef = useRef<HTMLElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const containerAnimation = useContainerAnimation();
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const cta = getCtaDestination('book', 'hero');

  const handleCtaClick = () => {
    trackCtaClick('hero', cta.href);
  };

  // Image Slideshow Crossfade
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    let timer: NodeJS.Timeout | null = null;

    const startTimer = () => {
      if (document.visibilityState === 'hidden') return;
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        setActiveImgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
      }, 5000);
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopTimer();
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Ambient Desktop Mouse-Move Parallax (0.02 x, 0.015 y)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isDesktop || isCoarse || isReduced || !imageFrameRef.current) return;

    const frame = imageFrameRef.current;
    const quickToX = gsap.quickTo(frame, 'x', { duration: 0.8, ease: 'power2.out' });
    const quickToY = gsap.quickTo(frame, 'y', { duration: 0.8, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      quickToX(relX * rect.width * 0.02);
      quickToY(relY * rect.height * 0.015);
    };

    const heroEl = heroRef.current;
    heroEl?.addEventListener('mousemove', handleMouseMove);

    return () => {
      heroEl?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Orchestrated Motion Entrance
  useGsap((self) => {
    const q = self.selector!;
    const topHairline = q('.hero-top-hairline');
    const topLabels = q('.hero-top-label');
    const displaySpans = q('.hero-display-span');
    const imageFrame = q('.hero-image-frame');
    const images = q('.hero-img');
    const bottomHairline = q('.hero-bottom-hairline');
    const bottomItems = q('.hero-bottom-item');
    const scrollCueRule = q('.scroll-cue-rule');

    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tl = gsap.timeline({ paused: true });

    if (isReducedMotion) {
      // Immediate final state for prefers-reduced-motion
      gsap.set([topHairline, bottomHairline], { scaleX: 1, transformOrigin: 'left center' });
      gsap.set(topLabels, { opacity: 1, y: 0 });
      gsap.set(displaySpans, { yPercent: 0 });
      gsap.set(imageFrame, { clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(images, { scale: 1 });
      gsap.set(bottomItems, { opacity: 1, y: 0 });
      gsap.set(scrollCueRule, { scaleX: 1, transformOrigin: 'left center' });
      return;
    }

    // Orchestrated Entrance Timeline
    // t=0.00: Top hairline scaleX 0 to 1 from left, 0.9s, EASE.inOut
    tl.fromTo(
      topHairline,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.9, ease: EASE.inOut },
      0.00
    )
      // t=0.15: Top labels fade and rise 12px, stagger 0.06, 0.5s
      .fromTo(
        topLabels,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: EASE.out },
        0.15
      )
      // t=0.30: Display lines mask-reveal yPercent 135 to 0, 1.0s, EASE.out, stagger 0.08
      .fromTo(
        displaySpans,
        { yPercent: 135 },
        { yPercent: 0, duration: 1.0, stagger: 0.08, ease: EASE.out },
        0.30
      )
      // t=0.55: Image frame clip-path inset(100% 0 0 0) to inset(0 0 0 0), 1.1s, EASE.inOut, img scale 1.08 to 1.0
      .fromTo(
        imageFrame,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: EASE.inOut },
        0.55
      )
      .fromTo(
        images,
        { scale: 1.08 },
        { scale: 1.0, duration: 1.1, ease: EASE.inOut },
        0.55
      )
      // t=0.90: Bottom hairline scaleX 0 to 1 from left, 0.7s
      .fromTo(
        bottomHairline,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.7, ease: EASE.inOut },
        0.90
      )
      // t=1.00: Statement, meta, CTA, scroll cue fade and rise 14px, stagger 0.07
      .fromTo(
        bottomItems,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: EASE.out },
        1.00
      )
      // t=1.30: Scroll cue rule 1.6s looping horizontal draw
      .fromTo(
        scrollCueRule,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true },
        1.30
      );

    // Fade out scroll cue when leaving section
    ScrollTrigger.create(
      containerAnimation
        ? {
            containerAnimation,
            trigger: heroRef.current,
            start: 'right 95%',
            onEnter: () => gsap.to(q('.scroll-cue-wrapper'), { opacity: 0, duration: DUR.fast }),
            onLeaveBack: () => gsap.to(q('.scroll-cue-wrapper'), { opacity: 1, duration: DUR.fast }),
          }
        : {
            trigger: heroRef.current,
            start: 'top top+=50',
            onEnter: () => gsap.to(q('.scroll-cue-wrapper'), { opacity: 0, duration: DUR.fast }),
            onLeaveBack: () => gsap.to(q('.scroll-cue-wrapper'), { opacity: 1, duration: DUR.fast }),
          }
    );

    // Preloader reveal gate pattern
    if (document.querySelector('.preloader-container')) {
      window.addEventListener(PRELOADER_REVEAL_EVENT, () => tl.play(), { once: true });
    } else {
      tl.play();
    }
  }, heroRef, [containerAnimation]);

  const nextImgIndex = (activeImgIndex + 1) % HERO_IMAGES.length;

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[100dvh] w-full md:w-[calc(100vw-(var(--spacing-rail)*2))] md:flex-shrink-0 flex-col justify-between bg-[var(--color-yellow)] px-4 pt-16 pb-8 sm:px-6 md:px-12 lg:px-16 md:pt-20 md:pb-10 overflow-hidden"
    >
      {/* ACCESSIBILITY: Primary Page H1 */}
      <h1 className="sr-only">
        {`${t('displayLine1')} ${t('displayLine2')} ${t('displayLine3')}`}
      </h1>

      {/* BAND 1: TOP RULE & LABELS */}
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between text-[0.6875rem] font-bold tracking-[0.18em] uppercase text-[var(--color-charcoal)]">
          <span className="hero-top-label inline-block">Drybar Qatar</span>
          <span className="hero-top-label inline-block">{t('eyebrow')}</span>
          <span className="hero-top-label hidden md:inline-block">Est. Doha</span>
        </div>
        <div className="hero-top-hairline h-[1px] w-full bg-[var(--color-charcoal)] origin-left" />
      </div>

      {/* MIDDLE SECTION: DISPLAY BLOCK & INTERLOCKING IMAGE FRAME */}
      <div className="relative my-auto flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 md:py-8">
        {/* BAND 2: DISPLAY BLOCK (Left 2/3) */}
        <div
          aria-hidden="true"
          className="z-10 w-full md:w-2/3 lg:w-7/12 flex flex-col text-[clamp(2.5rem,13vw,4rem)] md:text-[clamp(3.5rem,11vw,9.5rem)] font-bold leading-[0.86] tracking-[-0.04em] text-[var(--color-charcoal)] select-none"
        >
          <div className="overflow-hidden pb-[0.25em] -mb-[0.25em]">
            <span className="hero-display-span block will-change-transform">
              {t('displayLine1')}
            </span>
          </div>
          <div className="overflow-hidden pb-[0.25em] -mb-[0.25em]">
            <span className="hero-display-span block will-change-transform">
              {t('displayLine2')}
            </span>
          </div>
          <div className="overflow-hidden pb-[0.25em] -mb-[0.25em]">
            <span className="hero-display-span block will-change-transform">
              {t('displayLine3')}
            </span>
          </div>
        </div>

        {/* BAND 3: INTERLOCKING IMAGE FRAME (4:5 Portrait, ~62vh, 2px radius, no shadow/border/blur) */}
        <div
          ref={imageFrameRef}
          className="hero-image-frame relative w-full aspect-[4/5] md:w-auto md:h-[62vh] md:aspect-[4/5] md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 rounded-[2px] overflow-hidden will-change-transform bg-[var(--color-charcoal)]/10"
        >
          {/* Active Current Frame */}
          <div
            key={HERO_IMAGES[activeImgIndex]}
            className="absolute inset-0 h-full w-full opacity-100 scale-100 transition-all duration-700 ease-in-out z-10"
          >
            <Image
              src={HERO_IMAGES[activeImgIndex]}
              alt="Professional hair blowout styling session at Drybar Qatar"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              priority={activeImgIndex === 0}
              placeholder="blur"
              blurDataURL={HERO_BLUR_DATA_URL}
              className="hero-img object-cover h-full w-full"
            />
          </div>

          {/* Preloaded Next Frame */}
          {activeImgIndex !== nextImgIndex && (
            <div
              key={HERO_IMAGES[nextImgIndex]}
              className="absolute inset-0 h-full w-full opacity-0 scale-105 transition-all duration-700 ease-in-out pointer-events-none z-0"
            >
              <Image
                src={HERO_IMAGES[nextImgIndex]}
                alt="Professional hair blowout styling session at Drybar Qatar"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                priority={false}
                placeholder="blur"
                blurDataURL={HERO_BLUR_DATA_URL}
                className="hero-img object-cover h-full w-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* BAND 4: BOTTOM RULE & THREE-COLUMN FOOTER */}
      <div className="flex w-full flex-col gap-4">
        <div className="hero-bottom-hairline h-[1px] w-full bg-[var(--color-charcoal)] origin-left" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end">
          {/* Column 1: Statement */}
          <p className="hero-bottom-item max-w-[38ch] text-[clamp(1rem,1.5vw,1.375rem)] font-normal leading-[1.35] tracking-[-0.015em] text-[var(--color-charcoal)]">
            {t('statement')}
          </p>

          {/* Column 2: Meta */}
          <div className="hero-bottom-item text-[0.6875rem] font-medium tracking-[0.18em] uppercase text-[var(--color-charcoal)] md:text-center">
            {t('meta')}
          </div>

          {/* Column 3: CTA & Scroll Cue */}
          <div className="hero-bottom-item flex items-center justify-between md:justify-end gap-6">
            {/* Inline Text Link CTA */}
            <a
              href={cta.href}
              target={cta.target}
              rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
              onClick={handleCtaClick}
              className="group inline-flex flex-col text-[0.875rem] font-bold tracking-[0.08em] uppercase text-[var(--color-charcoal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
            >
              <span>{t('cta')}</span>
              <span className="h-[1px] w-0 bg-[var(--color-charcoal)] transition-all duration-300 ease-out group-hover:w-full" />
            </a>

            {/* Scroll Cue */}
            <div className="scroll-cue-wrapper flex items-center gap-3 text-[0.6875rem] font-medium tracking-[0.18em] uppercase text-[var(--color-charcoal)]">
              <span>{t('scrollCue')}</span>
              <div className="scroll-cue-rule h-[1px] w-10 bg-[var(--color-charcoal)] origin-left" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DUR, EASE, STAGGER } from '@/lib/motion';
import { useGsap } from '@/components/motion/useGsap';
import { useContainerAnimation } from '@/components/motion/HorizontalScrollContext';
import { PRELOADER_REVEAL_EVENT } from '@/lib/preloaderEvents';
import { getCtaDestination, trackCtaClick } from '@/lib/zenoti';
import { releaseHeroVideo, setHeroVideoVisible } from '@/components/ui/heroVideoRelease';

// Client-only: the video/poster/reduced-motion decision reads matchMedia and
// navigator.connection, neither of which exist during SSR. Loading it via
// next/dynamic with ssr:false avoids a hydration mismatch between the
// server's guess and the browser's actual media-query state.
const HeroVideo = dynamic(() => import('@/components/ui/HeroVideo').then((m) => m.HeroVideo), {
  ssr: false,
});

// Mirrors app/globals.css --color-* tokens. GSAP's color interpolation needs
// concrete values — it can't resolve `var(--color-cream)` at animation time —
// so these are duplicated here rather than read from the cascade.
const COLOR_CREAM = '#FCF9F2';
const COLOR_CHARCOAL = '#262523';
const COLOR_YELLOW = '#FEDD30';
const HAIRLINE_CREAM_35 = 'rgba(252, 249, 242, 0.35)';

function clampPercent(n: number) {
  return Math.max(0, Math.min(100, n));
}

// Reads the anchor's live position against the section's own box and
// expresses it as a CSS inset() clip-path string, so the aperture-open and
// expansion tweens can start from wherever the (invisible) portrait frame
// actually sits at the current viewport size instead of a hardcoded guess.
function measureFrameInset(section: HTMLElement, anchor: HTMLElement): string {
  const s = section.getBoundingClientRect();
  const a = anchor.getBoundingClientRect();
  if (s.width === 0 || s.height === 0) return 'inset(20% 4% 20% 4%)';
  const top = clampPercent(((a.top - s.top) / s.height) * 100);
  const right = clampPercent(((s.right - a.right) / s.width) * 100);
  const bottom = clampPercent(((s.bottom - a.bottom) / s.height) * 100);
  const left = clampPercent(((a.left - s.left) / s.width) * 100);
  return `inset(${top.toFixed(3)}% ${right.toFixed(3)}% ${bottom.toFixed(3)}% ${left.toFixed(3)}%)`;
}

export function Hero() {
  const t = useTranslations('hero');
  const heroRef = useRef<HTMLElement>(null);
  // Now the video's transform wrapper (parallax + settle-scale target), not
  // a visible side panel — kept as `imageFrameRef` since it's the same role
  // (the thing ambient parallax nudges), just pointed at a different element.
  const imageFrameRef = useRef<HTMLDivElement>(null);
  // Invisible geometry anchor, positioned exactly where the portrait frame
  // used to render, used only to measure the aperture's start/mid clip-path.
  const frameAnchorRef = useRef<HTMLDivElement>(null);
  const containerAnimation = useContainerAnimation();
  const frameInsetRef = useRef<string>('inset(50% 0% 50% 0%)');

  const cta = getCtaDestination('book', 'hero');

  const handleCtaClick = () => {
    trackCtaClick('hero', cta.href);
  };

  // Ambient Desktop Mouse-Move Parallax — reduced to 0.008x / 0.006y (from
  // 0.02 / 0.015) now that the target is full-bleed footage rather than a
  // contained side panel; combined with the video's permanent 1.04 scale
  // floor this keeps the translate well inside the overscan buffer so no
  // yellow edge is ever exposed.
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

      quickToX(relX * rect.width * 0.008);
      quickToY(relY * rect.height * 0.006);
    };

    const heroEl = heroRef.current;
    heroEl?.addEventListener('mousemove', handleMouseMove);

    return () => {
      heroEl?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Section-level playback visibility: pause the video off-screen or when
  // the tab is backgrounded, resume on return. Owned here (not inside
  // HeroVideo) because HeroVideo mounts asynchronously and isn't guaranteed
  // to exist yet when this observer needs to be created.
  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;

    let isIntersecting = true;
    let isTabVisible = document.visibilityState === 'visible';
    const update = () => setHeroVideoVisible(isIntersecting && isTabVisible);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        update();
      },
      { threshold: 0 }
    );
    observer.observe(section);

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
      update();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Keep the measured portrait-frame inset current at other viewport sizes.
  // The aperture-open/expansion tweens read frameInsetRef.current through a
  // function-based GSAP value, so a resize before/during the one-time intro
  // is reflected without needing to rebuild the timeline.
  useEffect(() => {
    const section = heroRef.current;
    const anchor = frameAnchorRef.current;
    if (!section || !anchor) return;

    const recompute = () => {
      frameInsetRef.current = measureFrameInset(section, anchor);
    };
    recompute();

    window.addEventListener('resize', recompute);
    return () => window.removeEventListener('resize', recompute);
  }, []);

  // Orchestrated Motion Entrance
  // Orchestrated Motion Entrance
  useGsap((self) => {
    const q = self.selector!;
    const topHairline = q('.hero-top-hairline');
    const topLabels = q('.hero-top-label');
    const displaySpans = q('.hero-display-span');
    const videoLayer = q('.hero-video-layer');
    const videoInner = q('.hero-video-inner');
    const displayBlock = q('.hero-display-block');
    const bottomHairline = q('.hero-bottom-hairline');
    const bottomItems = q('.hero-bottom-item');
    const scrollCueRule = q('.scroll-cue-rule');

    const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tl = gsap.timeline({ paused: true });

    if (isReducedMotion) {
      // Immediate final state
      gsap.set([topHairline, bottomHairline], { scaleX: 1, transformOrigin: 'left center' });
      gsap.set(topLabels, { opacity: 1, y: 0 });
      gsap.set(displaySpans, { yPercent: 0 });
      gsap.set(videoLayer, { clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(videoInner, { scale: 1.01 });
      gsap.set(displayBlock, { color: COLOR_CREAM });
      gsap.set(bottomItems, { opacity: 1, y: 0 });
      gsap.set(scrollCueRule, { scaleX: 1, transformOrigin: 'left center' });
      return;
    }

    // t=0.00 -> 0.55: Hairline draws, labels rise, display lines mask-reveal.
    tl.fromTo(
      topHairline,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.9, ease: EASE.inOut },
      0.00
    )
      .fromTo(
        topLabels,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: EASE.out },
        0.15
      )
      .fromTo(
        displaySpans,
        { yPercent: 135 },
        { yPercent: 0, duration: 1.0, stagger: 0.08, ease: EASE.out },
        0.30
      )
      // t=0.55: video aperture opens inside portrait frame slot
      .fromTo(
        videoLayer,
        { clipPath: 'inset(50% 0% 50% 0%)' },
        {
          clipPath: () => frameInsetRef.current,
          duration: 1.15,
          ease: EASE.inOut,
          onStart: releaseHeroVideo,
        },
        0.55
      )
      // t=0.90 / 1.00: bottom band entrance
      .fromTo(
        bottomHairline,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.7, ease: EASE.inOut },
        0.90
      )
      .fromTo(
        bottomItems,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: EASE.out },
        1.00
      )
      // t=1.30: scroll cue rule looping horizontal draw
      .fromTo(
        scrollCueRule,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true },
        1.30
      )
      // t=1.45: THE EXPANSION — video expands to full central bleed
      .to(
        videoLayer,
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: EASE.inOut },
        1.45
      )
      .fromTo(
        videoInner,
        { scale: 1.15 },
        { scale: 1.01, duration: 1.9, ease: EASE.out },
        1.45
      )
      // t=1.60: Middle display headline crossfades to crisp cream over the video
      .fromTo(displayBlock, { color: COLOR_CHARCOAL }, { color: COLOR_CREAM, duration: 0.8, ease: 'none' }, 1.60);

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

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[100dvh] w-full md:w-[calc(100vw-(var(--spacing-rail)*2))] md:flex-shrink-0 flex-col justify-between bg-[var(--color-yellow)] overflow-hidden"
    >
      {/* ACCESSIBILITY: Primary Page H1 */}
      <h1 className="sr-only">
        {`${t('displayLine1')} ${t('displayLine2')} ${t('displayLine3')}`}
      </h1>

      {/* TOP BAND: Solid Brand Yellow Bar with Hairline & Labels */}
      <div className="relative z-30 w-full bg-[var(--color-yellow)] px-4 pt-16 pb-3 sm:px-6 md:px-12 lg:px-16 md:pt-20 md:pb-4 border-b border-[var(--color-charcoal)]/20">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between text-[0.6875rem] font-bold tracking-[0.18em] uppercase text-[var(--color-charcoal)]">
            <span className="hero-top-label inline-block">Drybar Qatar</span>
            <span className="hero-top-label inline-block">{t('eyebrow')}</span>
            <span className="hero-top-label hidden md:inline-block">Est. Doha</span>
          </div>
          <div className="hero-top-hairline h-[1px] w-full bg-[var(--color-charcoal)] origin-left" />
        </div>
      </div>

      {/* MIDDLE SECTION: Crisp Video Layer & Display Block */}
      <div className="relative z-20 my-auto flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-4 md:py-8 min-h-[50vh]">
        {/* Video layer clipped inside middle area */}
        <div className="hero-video-layer absolute inset-0 z-0 overflow-hidden [will-change:clip-path]">
          <div
            ref={imageFrameRef}
            className="hero-video-inner absolute inset-0 h-full w-full will-change-transform"
          >
            <HeroVideo />
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* BAND 2: DISPLAY BLOCK */}
          <div
            aria-hidden="true"
            className="hero-display-block z-10 w-full md:w-2/3 lg:w-7/12 flex flex-col text-[clamp(2.5rem,13vw,4rem)] md:text-[clamp(3.5rem,11vw,9.5rem)] font-bold leading-[0.86] tracking-[-0.04em] text-[var(--color-charcoal)] motion-reduce:text-[var(--color-cream)] select-none drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)]"
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

          {/* Invisible geometry anchor */}
          <div
            ref={frameAnchorRef}
            aria-hidden="true"
            className="hero-frame-anchor invisible pointer-events-none w-full aspect-[4/5] md:w-auto md:h-[62vh] md:aspect-[4/5] md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2"
          />
        </div>
      </div>

      {/* BOTTOM BAND: Solid Brand Yellow Bar with Hairline & Footer */}
      <div className="relative z-30 w-full bg-[var(--color-yellow)] px-4 pt-3 pb-8 sm:px-6 md:px-12 lg:px-16 md:pt-4 md:pb-10 border-t border-[var(--color-charcoal)]/20">
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
      </div>
    </section>
  );
}

'use client';

import React, { useRef } from 'react';
import { Placeholder } from '@/components/ui/Placeholder';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DUR, EASE, STAGGER } from '@/lib/motion';
import { useGsap } from '@/components/motion/useGsap';
import { useContainerAnimation } from '@/components/motion/HorizontalScrollContext';

export function Hero() {
  const t = useTranslations('hero');
  const heroRef = useRef<HTMLElement>(null);
  const containerAnimation = useContainerAnimation();

  useGsap((self) => {
    const q = self.selector!;
    const words = q('.hero-top-word');
    const centerCard = q('.hero-center-card');
    const paragraph = q('.hero-paragraph');
    const scrollCue = q('.scroll-cue-wrapper');
    const header = document.querySelector('header');

    // Orchestrated Entrance Timeline
    const tl = gsap.timeline({ defaults: { ease: EASE.out } });

    tl.fromTo(
      words,
      { y: 39, opacity: 0 },
      { y: 0, opacity: 1, duration: DUR.slow, stagger: STAGGER.word }
    )
      .fromTo(
        centerCard,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: DUR.base },
        '-=0.6'
      )
      .fromTo(
        paragraph,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: DUR.base },
        '-=0.4'
      )
      .fromTo(
        scrollCue,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: DUR.fast },
        '-=0.3'
      );

    if (header) {
      tl.fromTo(
        header,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: DUR.fast },
        '-=0.3'
      );
    }

    // Scroll Cue Fade — hides once the horizontal track has genuinely
    // started moving away from Hero. Without containerAnimation this would
    // key off real (vertical) scroll position, firing after only ~50px of
    // scroll regardless of how far the horizontal track has actually moved.
    ScrollTrigger.create(
      containerAnimation
        ? {
            containerAnimation,
            trigger: heroRef.current,
            start: 'right 95%',
            onEnter: () => gsap.to(scrollCue, { opacity: 0, duration: DUR.fast }),
            onLeaveBack: () => gsap.to(scrollCue, { opacity: 1, duration: DUR.fast }),
          }
        : {
            trigger: heroRef.current,
            start: 'top top+=50',
            onEnter: () => gsap.to(scrollCue, { opacity: 0, duration: DUR.fast }),
            onLeaveBack: () => gsap.to(scrollCue, { opacity: 1, duration: DUR.fast }),
          }
    );
  }, heroRef, [containerAnimation]);

  return (
    <section 
      ref={heroRef} 
      className="relative flex min-h-[100dvh] w-[100vw] flex-shrink-0 flex-col justify-between bg-[#FEDD30] p-6 pt-20 md:p-12 md:pt-24 overflow-hidden"
    >
      {/* TOP HEADER TRACKING WORDS MATCHING REFERENCE 9to5studio BANNERS */}
      <div className="flex w-full items-center justify-between text-[clamp(1.25rem,4vw,3.5rem)] font-bold tracking-[0.1em] uppercase text-[var(--color-charcoal)]">
        <span className="hero-top-word inline-block">DRYBAR</span>
        <span className="hero-top-word inline-block">QATAR</span>
        <span className="hero-top-word inline-block hidden sm:inline-block">JUST</span>
        <span className="hero-top-word inline-block">BLOWOUTS</span>
      </div>

      {/* CENTER FLOATING HERO IMAGE CARD MATCHING REFERENCE SITE CENTER THUMBNAIL */}
      <div className="hero-center-card my-auto mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <Placeholder 
          ratio="1:1" 
          label="chair-side, mid-blowout, brush in frame" 
          className="shadow-2xl border-2 border-[var(--color-charcoal)]/10"
        />
      </div>

      {/* BOTTOM STATEMENT & SCROLL CUE MATCHING REFERENCE FOOTER LAYOUT */}
      <div className="flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <p className="hero-paragraph max-w-2xl text-[clamp(1.125rem,3vw,2.25rem)] font-normal leading-[1.15] tracking-[-0.015em] text-[var(--color-charcoal)]">
          {t('paragraph')}
        </p>

        <div className="scroll-cue-wrapper flex items-center gap-3 text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-charcoal)]">
          <span>{t('scrollCue')}</span>
          <div className="h-[1px] w-12 bg-[var(--color-charcoal)]" />
        </div>
      </div>
    </section>
  );
}

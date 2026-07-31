'use client';

import React, { useRef } from 'react';
import { Placeholder } from '@/components/ui/Placeholder';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DUR, EASE, STAGGER } from '@/lib/motion';
import { useGsap } from '@/components/motion/useGsap';
import { useContainerAnimation } from '@/components/motion/HorizontalScrollContext';
import { PRELOADER_REVEAL_EVENT } from '@/lib/preloaderEvents';

const HERO_IMAGES = [
  '/images/1.webp',
  '/images/2.webp',
  '/images/3.webp',
  '/images/4.webp',
  '/images/5.webp',
  '/images/6.webp',
  '/images/7.webp',
  '/images/8.webp',
  '/images/9.webp',
  '/images/10.webp',
  '/images/11.webp',
  '/images/12.webp',
  '/images/13.webp',
  '/images/14.webp',
  '/images/15.webp',
  '/images/16.webp',
  '/images/17.webp',
  '/images/18.webp',
];

export function Hero() {
  const t = useTranslations('hero');
  const heroRef = useRef<HTMLElement>(null);
  const containerAnimation = useContainerAnimation();
  const [activeImgIndex, setActiveImgIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  useGsap((self) => {
    const q = self.selector!;
    const words = q('.hero-top-word');
    const centerCard = q('.hero-center-card');
    const paragraph = q('.hero-paragraph');
    const scrollCue = q('.scroll-cue-wrapper');
    const header = document.querySelector('header');

    const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });

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

    if (document.querySelector('.preloader-container')) {
      window.addEventListener(PRELOADER_REVEAL_EVENT, () => tl.play(), { once: true });
    } else {
      tl.play();
    }
  }, heroRef, [containerAnimation]);

  return (
    <section 
      ref={heroRef} 
      className="relative flex min-h-[100dvh] w-[100vw] flex-shrink-0 flex-col justify-between bg-[#FEDD30] px-16 pt-20 pb-8 md:px-20 md:pt-24 md:pb-12 overflow-hidden"
    >
      {/* TOP HEADER TRACKING WORDS MATCHING REFERENCE 9to5studio BANNERS */}
      <div className="flex w-full items-center justify-between text-[clamp(1.25rem,4vw,3.5rem)] font-bold tracking-[0.1em] uppercase text-[var(--color-charcoal)]">
        <span className="hero-top-word inline-block">DRYBAR</span>
        <span className="hero-top-word inline-block">QATAR</span>
        <span className="hero-top-word inline-block hidden sm:inline-block">JUST</span>
        <span className="hero-top-word inline-block">BLOWOUTS</span>
      </div>

      {/* CENTER FLOATING HERO IMAGE SLIDESHOW MATCHING REFERENCE 9to5studio PROJECT THUMBNAILS */}
      <div className="hero-center-card group relative my-auto mx-auto aspect-square w-full max-w-xs sm:max-w-sm lg:max-w-md overflow-hidden rounded-2xl shadow-2xl border-2 border-[var(--color-charcoal)]/10 bg-white/20 backdrop-blur-sm">
        {HERO_IMAGES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Drybar Qatar Showcase ${index + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${
              index === activeImgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
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

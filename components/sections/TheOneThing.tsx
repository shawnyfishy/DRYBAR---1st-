'use client';

import React from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { SplitLines } from '@/components/motion/SplitLines';
import { Parallax } from '@/components/motion/Parallax';
import { useTranslations } from 'next-intl';

export function TheOneThing() {
  const t = useTranslations('theOneThing');

  return (
    <section className="relative flex min-h-screen w-full md:w-[calc(100vw-(var(--spacing-rail)*2))] md:flex-shrink-0 flex-col justify-between [background-image:var(--backgroundImage-grad-asagiri)] pt-20 pb-8 px-4 sm:px-6 md:px-12 lg:px-20 md:pt-24 md:pb-12 overflow-hidden">
      {/* TOP TRACKING HEADER */}
      <Reveal>
        <div className="relative z-10 flex w-full items-center justify-between text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-[var(--color-charcoal)]">
          <span>THE ONE THING • CONCEPT</span>
          <span className="hidden sm:inline">GEWAN ISLAND</span>
        </div>
      </Reveal>

      <div className="mx-auto my-auto flex w-full max-w-[1440px] flex-col items-center gap-8 lg:gap-12 lg:flex-row lg:justify-between py-6 sm:py-0">
        {/* TEXT CONTENT WITH SPLIT LINE REVEALS */}
        <div className="flex flex-1 flex-col gap-4 sm:gap-6 max-w-xl">
          <SplitLines
            granularity="word"
            className="text-[clamp(1.75rem,6vw,4.5rem)] font-normal leading-[0.94] tracking-[-0.022em] text-[var(--color-charcoal)]"
          >
            {t('title')}
          </SplitLines>

          <Reveal delay={0.25}>
            <p className="text-[clamp(0.9375rem,3.2vw,1.125rem)] font-normal leading-[1.55] text-[var(--color-charcoal)]">
              {t('paragraph1')}
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <p className="text-[clamp(0.9375rem,3.2vw,1.125rem)] font-normal leading-[1.55] text-[var(--color-charcoal)]/80">
              {t('paragraph2')}
            </p>
          </Reveal>
        </div>

        {/* 9:16 IMAGE WITH PARALLAX */}
        <div className="w-full max-w-[240px] sm:max-w-sm flex-1">
          <Parallax>
            <div className="overflow-hidden rounded-xl shadow-xl border border-[var(--color-charcoal)]/10 aspect-[9/16] bg-white">
              <img
                src="/images/2.webp"
                alt="Drybar Philosophy Blowout Styling"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}


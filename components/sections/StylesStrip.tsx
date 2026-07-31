'use client';

import React from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { SplitLines } from '@/components/motion/SplitLines';
import { Parallax } from '@/components/motion/Parallax';
import { getServicesData } from '@/lib/services';
import { useTranslations } from 'next-intl';

export function StylesStrip() {
  const t = useTranslations('stylesStrip');
  const services = getServicesData();

  return (
    <section className="flex min-h-[100dvh] w-[100vw] flex-shrink-0 items-center justify-center [background-image:var(--backgroundImage-grad-asagiri)] py-20 px-16 md:px-20 overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
        <div>
          <SplitLines
            granularity="word"
            className="text-[clamp(2rem,7vw,4.5rem)] font-normal leading-[0.94] tracking-[-0.022em] text-[var(--color-charcoal)]"
          >
            {t('title')}
          </SplitLines>
          <Reveal delay={0.2}>
            <p className="mt-2 text-[clamp(1rem,3.5vw,1.125rem)] text-[var(--color-warmgrey)]">
              {t('subtitle')}
            </p>
          </Reveal>
        </div>

        {/* CARDS: HORIZONTAL SCROLL CAROUSEL */}
        <div className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-6 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible">
          {services.hairStyling.slice(0, 4).map((style, idx) => {
            const imageSrc = `/images/${6 + idx}.webp`;

            return (
              <Reveal key={style.id} delay={idx * 0.05}>
                <div className="flex w-[260px] flex-none snap-center flex-col gap-4 rounded-xl border border-[var(--color-warmgrey)]/20 bg-white p-4 shadow-sm md:w-auto">
                  <div className="relative overflow-hidden rounded-lg aspect-[9/16] bg-[var(--color-cream)] border border-[var(--color-warmgrey)]/10">
                    <Parallax speed={0.2}>
                      <img
                        src={imageSrc}
                        alt={style.name_en}
                        className="h-full w-full object-cover scale-110 transition-transform duration-500 hover:scale-115"
                        loading="lazy"
                      />
                    </Parallax>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-[var(--color-charcoal)]">
                      {style.name_en}
                    </h3>
                    <span className="text-sm font-medium tabular-nums text-[var(--color-warmgrey)]">
                      {t('fromLabel')} QAR {style.prices.short}
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

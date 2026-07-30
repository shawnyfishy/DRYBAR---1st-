'use client';

import React from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { Placeholder } from '@/components/ui/Placeholder';
import { useTranslations } from 'next-intl';

export function TheOneThing() {
  const t = useTranslations('theOneThing');

  return (
    <section className="flex min-h-[100dvh] w-[100vw] flex-shrink-0 items-center justify-center [background-image:var(--backgroundImage-grad-asagiri)] py-20 px-6 md:px-12 overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-12 lg:flex-row lg:justify-between">
        {/* TEXT CONTENT IN REVEAL */}
        <Reveal className="flex flex-1 flex-col gap-6 max-w-xl">
          <h2 className="text-[clamp(2rem,7vw,4.5rem)] font-normal leading-[0.94] tracking-[-0.022em] text-[var(--color-charcoal)]">
            {t('title')}
          </h2>
          <p className="text-[clamp(1rem,3.5vw,1.125rem)] font-normal leading-[1.55] text-[var(--color-charcoal)]">
            {t('paragraph1')}
          </p>
          <p className="text-[clamp(1rem,3.5vw,1.125rem)] font-normal leading-[1.55] text-[var(--color-charcoal)]/80">
            {t('paragraph2')}
          </p>
        </Reveal>

        {/* 9:16 IMAGE PLACEHOLDER WITH PARALLAX */}
        <div className="w-full max-w-sm flex-1">
          <Parallax>
            <Placeholder 
              ratio="9:16" 
              label="chair-side, mid-blowout, brush in frame" 
              className="shadow-md"
            />
          </Parallax>
        </div>
      </div>
    </section>
  );
}

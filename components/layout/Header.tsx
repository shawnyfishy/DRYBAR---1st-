'use client';

import React, { useRef } from 'react';
import { Logo } from '@/components/ui/Logo';
import { useMenu } from './MenuProvider';
import { useTranslations } from 'next-intl';

export function Header() {
  const { isOpen, open } = useMenu();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('nav');

  return (
    <header className="fixed top-0 inset-x-0 z-40 flex h-16 w-full items-center justify-between bg-[var(--color-cream)]/90 px-4 backdrop-blur-md md:px-8 border-b border-[var(--color-warmgrey)]/15">
      <a
        href="/"
        className="flex items-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
        aria-label="Drybar Qatar Home"
      >
        <Logo className="h-7 w-auto" />
      </a>

      <button
        ref={triggerRef}
        onClick={open}
        className="rounded px-3 py-1.5 text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-charcoal)] transition-colors hover:text-[var(--color-warmgrey)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
        aria-expanded={isOpen}
        aria-controls="overlay-menu"
      >
        {t('menu')}
      </button>
    </header>
  );
}

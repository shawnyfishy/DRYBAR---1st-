'use client';

import React from 'react';
import { Logo } from '@/components/ui/Logo';
import { useMenu } from './MenuProvider';
import { useTranslations } from 'next-intl';

export function Header() {
  const { activeDrawer, toggleMenu, toggleContacts } = useMenu();
  const t = useTranslations('nav');

  return (
    <header className="fixed top-0 inset-x-0 z-40 flex h-16 w-full items-center justify-between bg-transparent px-4 sm:px-6 md:px-12 lg:px-20 pointer-events-none">
      <a
        href="/"
        className="flex items-center rounded pointer-events-auto transition-transform hover:scale-105"
        aria-label="Drybar Qatar Home"
      >
        <Logo className="h-6 sm:h-7 w-auto" variant="dark" />
      </a>

      {/* MOBILE ONLY (Under 768px): Sleek touch navigation triggers */}
      <div className="flex items-center gap-2 pointer-events-auto md:hidden">
        <button
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
          className="flex h-9 items-center justify-center rounded-full bg-[var(--color-charcoal)] px-3.5 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-white shadow-lg transition-transform active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
        >
          {activeDrawer === 'menu' ? t('close') : t('menu')}
        </button>

        <button
          onClick={toggleContacts}
          aria-label="Toggle Contacts Drawer"
          className="flex h-9 items-center justify-center rounded-full bg-[var(--color-yellow)] px-3.5 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[var(--color-charcoal)] shadow-lg transition-transform active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
        >
          {activeDrawer === 'contacts' ? t('close') : 'CONTACTS'}
        </button>
      </div>
    </header>
  );
}

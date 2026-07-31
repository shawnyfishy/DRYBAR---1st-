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
    <header className="fixed top-0 inset-x-0 z-40 flex h-16 w-full items-center justify-between bg-transparent pl-16 md:pl-20 pr-16 md:pr-20 pointer-events-none">
      <a
        href="/"
        className="flex items-center rounded pointer-events-auto transition-transform hover:scale-105"
        aria-label="Drybar Qatar Home"
      >
        <Logo className="h-7 w-auto" variant="dark" />
      </a>
    </header>
  );
}

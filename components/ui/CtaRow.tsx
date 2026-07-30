'use client';

import React from 'react';
import { getCtaDestination, trackCtaClick } from '@/lib/zenoti';

interface CtaRowProps {
  label?: string;
  destination?: 'book' | 'manage' | 'whatsapp';
  campaign?: string;
}

export function CtaRow({ label, destination = 'book', campaign = 'book_now' }: CtaRowProps) {
  const cta = getCtaDestination(destination, campaign);
  const displayLabel = label || cta.labelEn;

  const handleClick = () => {
    trackCtaClick(destination, cta.href);
  };

  return (
    <div className="flex flex-col gap-2">
      <a
        href={cta.href}
        target={cta.target}
        rel="noopener"
        onClick={handleClick}
        className="inline-flex items-center justify-center rounded-full bg-[var(--color-yellow)] px-8 py-4 text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-charcoal)] transition-transform hover:scale-[1.02] active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
      >
        {displayLabel}
      </a>
      {cta.isFallback && (
        <span className="text-[0.625rem] text-[var(--color-warmgrey)]">
          * Direct online booking opening shortly. Message us on WhatsApp to book a chair.
        </span>
      )}
    </div>
  );
}

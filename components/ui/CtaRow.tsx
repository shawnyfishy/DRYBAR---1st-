'use client';

import React from 'react';
import { getCtaDestination, trackCtaClick } from '@/lib/zenoti';
import { whatsappHref, type WhatsAppIntent } from '@/lib/whatsapp';

interface CtaRowProps {
  label?: string;
  destination?: 'book' | 'manage' | 'whatsapp';
  campaign?: string;
  // Only used when destination="whatsapp" — picks which pre-filled message
  // this specific CTA sends. Defaults to a generic enquiry if omitted.
  whatsappIntent?: WhatsAppIntent;
}

export function CtaRow({ label, destination = 'book', campaign = 'book_now', whatsappIntent }: CtaRowProps) {
  const cta =
    destination === 'whatsapp'
      ? {
          href: whatsappHref(whatsappIntent ?? { kind: 'general' }),
          isFallback: true,
          labelEn: 'Message on WhatsApp',
          target: '_blank' as const,
        }
      : getCtaDestination(destination, campaign);
  const displayLabel = label || cta.labelEn;

  const handleClick = () => {
    trackCtaClick(destination, cta.href);
  };

  return (
    <div className="flex flex-col gap-2">
      <a
        href={cta.href}
        target={cta.target}
        rel={cta.target === '_blank' ? 'noopener noreferrer' : undefined}
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

'use client';

import React from 'react';
import { whatsappHref } from '@/lib/whatsapp';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-cream)] p-6 text-[var(--color-charcoal)] text-center">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-[var(--color-warmgrey)]/20 bg-white p-8 shadow-sm">
        <span className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-[var(--color-warmgrey)]">
          SOMETHING WENT WRONG
        </span>
        <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-normal leading-tight">
          An unexpected error occurred.
        </h1>
        <p className="text-sm text-[var(--color-warmgrey)]">
          We couldn’t render this view. You can try reloading the section or message us directly on WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 rounded-full bg-[var(--color-yellow)] px-6 py-3.5 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[var(--color-charcoal)] transition-transform hover:scale-[1.02] active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)] cursor-pointer"
          >
            Try Again
          </button>
          <a
            href={whatsappHref({ kind: 'general' })}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full border border-[var(--color-charcoal)]/30 px-6 py-3.5 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[var(--color-charcoal)] transition-transform hover:scale-[1.02] active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
}

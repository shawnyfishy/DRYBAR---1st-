import React from 'react';
import { Header } from '@/components/layout/Header';
import { InfoFooter } from '@/components/layout/InfoFooter';
import { TransitionLink } from '@/components/motion/RouteTransition';
import { whatsappHref } from '@/lib/whatsapp';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-cream)] text-[var(--color-charcoal)]">
      <Header />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-start justify-center px-6 py-32 md:p-12 md:pt-40 gap-8">
        <span className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-[var(--color-warmgrey)]">
          404 • PAGE NOT FOUND
        </span>
        <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-normal leading-[0.94] tracking-[-0.022em]">
          This page does not exist.
        </h1>
        <p className="max-w-xl text-[clamp(1rem,3.5vw,1.25rem)] text-[var(--color-warmgrey)]">
          The chair you are looking for isn’t here, but our salon is open. Explore our services or return to the main shop.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-4">
          <TransitionLink
            href="/"
            className="rounded-full bg-[var(--color-yellow)] px-8 py-4 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[var(--color-charcoal)] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
          >
            Return Home
          </TransitionLink>
          <TransitionLink
            href="/prices"
            className="rounded-full border border-[var(--color-charcoal)]/30 px-8 py-4 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[var(--color-charcoal)] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
          >
            Price List
          </TransitionLink>
          <TransitionLink
            href="/gifts"
            className="rounded-full border border-[var(--color-charcoal)]/30 px-8 py-4 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[var(--color-charcoal)] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
          >
            Gifts & Memberships
          </TransitionLink>
          <a
            href={whatsappHref({ kind: 'general' })}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[var(--color-charcoal)]/30 px-8 py-4 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[var(--color-charcoal)] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
          >
            WhatsApp Enquiries ↗
          </a>
        </div>
      </main>
      <InfoFooter />
    </div>
  );
}

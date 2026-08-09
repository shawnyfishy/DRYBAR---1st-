'use client';

import React from 'react';
import { getServicesData } from '@/lib/services';
import { CtaRow } from '@/components/ui/CtaRow';

// ============================================================================
// INLINE SVG ICONS (Verbatim from graphic style: thin stroke, rounded caps)
// ============================================================================

function SmallHeartIcon({ className = 'h-3 w-3 text-[var(--color-yellow)]' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function SingleHeartBadgeIcon() {
  // Charcoal stroke inside filled yellow circle for 11.2:1 contrast (PASS AA/AAA)
  return (
    <svg className="h-6 w-6 text-[var(--color-charcoal)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 000-7.84z" />
    </svg>
  );
}

function DoubleHeartBadgeIcon() {
  return (
    <svg className="h-7 w-7 text-[var(--color-charcoal)]" viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4.5a4.2 4.2 0 00-6-6L7 0l-1-1.5a4.2 4.2 0 00-6 6L1 5.5 7 11.5l6-6L14 4.5z" transform="translate(1, 4) scale(0.85)" />
      <path d="M14 4.5a4.2 4.2 0 00-6-6L7 0l-1-1.5a4.2 4.2 0 00-6 6L1 5.5 7 11.5l6-6L14 4.5z" transform="translate(11, 4) scale(0.85)" />
    </svg>
  );
}

function TagHeartIcon() {
  return (
    <svg className="h-8 w-8 text-[var(--color-yellow)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <path d="M9.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  );
}

function BottleIcon() {
  return (
    <svg className="h-8 w-8 text-[var(--color-yellow)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 3h6v3H9zM8 6h8v3l2 3v9H6v-9l2-3V6z" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-8 w-8 text-[var(--color-yellow)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="8" cy="14" r="1" fill="currentColor" />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
      <circle cx="16" cy="14" r="1" fill="currentColor" />
      <circle cx="8" cy="18" r="1" fill="currentColor" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
      <circle cx="16" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function GiftBoxIcon() {
  return (
    <svg className="h-8 w-8 text-[var(--color-yellow)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function HeartDivider() {
  return (
    <div className="flex items-center justify-center gap-3 w-full my-3">
      <div className="h-[1px] flex-1 bg-[var(--color-warmgrey)]/20" />
      <SmallHeartIcon className="h-2.5 w-2.5 text-[var(--color-yellow)] shrink-0" />
      <div className="h-[1px] flex-1 bg-[var(--color-warmgrey)]/20" />
    </div>
  );
}

export function GirlieClub() {
  const data = getServicesData().girlieClub;

  return (
    <section className="flex flex-col gap-10 w-full" aria-labelledby="girlie-club-heading">
      {/* BAND 1: HEADER BLOCK */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl mx-auto">
        <span className="text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
          {data.eyebrow_en}
        </span>
        <span className="text-[clamp(1.25rem,3.5vw,2rem)] font-normal tracking-[0.08em] uppercase text-[var(--color-charcoal)]">
          {data.brand_line_en}
        </span>

        {/* SECTION D SWAPPABLE WORDMARK SLOT:
            Currently rendered in Inter Tight with distinct styling.
            To swap with a graphic vector, replace <h2 id="girlie-club-heading"...> with:
            <img src="/images/girlie-club-wordmark.svg" alt="Girlie Club" className="..." />
        */}
        <h2 id="girlie-club-heading" className="text-[clamp(2.5rem,7vw,4.5rem)] font-normal tracking-[-0.03em] text-[var(--color-charcoal)] leading-none my-1">
          {data.wordmark_en}
        </h2>

        <span className="text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[var(--color-charcoal)]">
          {data.subtitle_en}
        </span>

        {/* THIN HORIZONTAL RULE WITH CENTERED HEART */}
        <HeartDivider />

        <p className="text-[clamp(0.9375rem,2vw,1.125rem)] text-[var(--color-warmgrey)] font-normal">
          {data.tagline_en}
        </p>
      </div>

      {/* BAND 2: TWO TIERS SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {data.tiers.map((tier) => (
          <div
            key={tier.id}
            className="rounded-2xl border border-[var(--color-warmgrey)]/20 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between text-center transition-all duration-300 hover:shadow-md"
          >
            <div className="flex flex-col items-center">
              {/* YELLOW CIRCULAR BADGE WITH CHARCOAL HEART STROKE (11.2:1 CONTRAST) */}
              <div className="h-14 w-14 rounded-full bg-[var(--color-yellow)] flex items-center justify-center shrink-0">
                {tier.icon === 'single_heart' ? <SingleHeartBadgeIcon /> : <DoubleHeartBadgeIcon />}
              </div>

              {/* TIER NAME */}
              <h3 className="text-[clamp(1.125rem,2.5vw,1.5rem)] font-medium tracking-[0.08em] uppercase text-[var(--color-charcoal)] mt-5">
                {tier.name_en}
              </h3>

              {/* FREQUENCY */}
              <span className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[var(--color-charcoal)] mt-2">
                {tier.frequency_en}
              </span>

              {/* HEART DIVIDER */}
              <HeartDivider />

              {/* QUALIFIER */}
              <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
                {tier.qualifier_en}
              </span>

              {/* PRICE AT DISPLAY SCALE MATCHING EXISTING CARDS */}
              <div className="my-2 flex items-baseline justify-center">
                <span className="text-[clamp(3.5rem,8vw,5.5rem)] font-normal leading-none tabular-nums text-[var(--color-charcoal)]">
                  {tier.price}
                </span>
              </div>

              {/* UNIT LINE */}
              <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
                {tier.currency} / {tier.billing_period_en}
              </span>
            </div>

            {/* PER-TIER CTA BUTTON */}
            <div className="mt-8">
              <CtaRow
                label={`Inquire About ${tier.name_en === 'GIRLIE SINGLE' ? 'Girlie Single' : 'Girlie Double'}`}
                destination="whatsapp"
                campaign={`girlie_${tier.id}_inquire`}
                whatsappIntent={{ kind: 'membership', plan: tier.name_en === 'GIRLIE SINGLE' ? 'Girlie Single' : 'Girlie Double' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* BAND 3: GIRLIE PERKS PANEL */}
      <div className="rounded-2xl border border-[var(--color-warmgrey)]/20 bg-white p-6 sm:p-10 shadow-sm flex flex-col gap-8">
        {/* PERKS HEADING WITH FILLED HEART */}
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-[0.875rem] font-bold tracking-[0.2em] uppercase text-[var(--color-charcoal)]">
            {data.perks_heading_en}
          </h3>
          <SmallHeartIcon className="h-3 w-3 text-[var(--color-yellow)] shrink-0" />
        </div>

        {/* 4 PERKS GRID WITH DESKTOP DIVIDERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[var(--color-warmgrey)]/20">
          {data.perks.map((perk) => (
            <div key={perk.id} className="flex flex-col items-center text-center px-4">
              <div className="mb-4">
                {perk.icon === 'tag_heart' && <TagHeartIcon />}
                {perk.icon === 'bottle' && <BottleIcon />}
                {perk.icon === 'calendar' && <CalendarIcon />}
                {perk.icon === 'gift_box' && <GiftBoxIcon />}
              </div>
              <h4 className="text-[0.6875rem] font-bold tracking-[0.12em] uppercase text-[var(--color-charcoal)] mb-2 min-h-[2rem] flex items-center justify-center">
                {perk.title_en}
              </h4>
              <p className="text-xs text-[var(--color-warmgrey)] leading-relaxed max-w-[200px]">
                {perk.body_en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION CTA */}
      <div className="flex justify-start">
        <CtaRow
          label="Ask About Girlie Club"
          destination="whatsapp"
          campaign="girlie_club_inquire"
          whatsappIntent={{ kind: 'membership', plan: 'Girlie Club' }}
        />
      </div>
    </section>
  );
}

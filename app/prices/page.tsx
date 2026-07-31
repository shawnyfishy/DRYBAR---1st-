import React from 'react';
import { Header } from '@/components/layout/Header';
import { InfoFooter } from '@/components/layout/InfoFooter';
import { PriceTable } from '@/components/ui/PriceTable';
import { CtaRow } from '@/components/ui/CtaRow';
import { getServicesData } from '@/lib/services';
import { Reveal } from '@/components/motion/Reveal';

// STEP 7 Feature Flag: Home Services (default OFF)
const SHOW_HOME_SERVICES = false;

export default function PricesPage() {
  const services = getServicesData();

  return (
    <div className="flex min-h-screen flex-col [background-image:var(--backgroundImage-grad-asagiri)] overflow-x-hidden">
      <Header />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 py-20 sm:px-6 md:p-12 md:pt-28 gap-8 sm:gap-12">
        {/* PAGE TITLE & DYNAMIC SUMMARY PRICE */}
        <Reveal className="flex flex-col gap-3">
          <h1 className="text-[clamp(2rem,7vw,4.5rem)] font-normal leading-[0.94] tracking-[-0.022em] text-[var(--color-charcoal)]">
            {services.hairStylingHeading}
          </h1>
          <p className="text-[clamp(1rem,3.5vw,1.125rem)] text-[var(--color-warmgrey)]">
            Blowouts {services.meta.entry_price_phrase_en} • Pricing follows hair length and style chosen
          </p>
        </Reveal>

        {/* 7 SERVICES x 4 TIERS PRICE TABLE */}
        <Reveal>
          <PriceTable />
        </Reveal>

        {/* ADD-ONS SECTION */}
        <Reveal className="flex flex-col gap-6">
          <h2 className="text-[clamp(1.25rem,4.4vw,1.875rem)] font-medium text-[var(--color-charcoal)]">
            {services.addOnsHeading}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {services.addOns.map((addon) => (
              <div
                key={addon.id}
                className="flex flex-col justify-between rounded-xl border border-[var(--color-warmgrey)]/20 bg-white p-6 shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-charcoal)]">
                    {addon.name_en}
                  </h3>
                  {addon.includes_display_en && (
                    <p className="mt-1 text-xs text-[var(--color-warmgrey)]">
                      {addon.includes_display_en}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-1">
                  <span className="text-lg font-medium tabular-nums text-[var(--color-charcoal)]">
                    QAR {addon.price}
                  </span>
                  {addon.duration_note_en && (
                    <span className="text-xs text-[var(--color-warmgrey)]">
                      {addon.duration_note_en}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* RETAIL STATEMENT (STEP 8) */}
        <Reveal className="rounded-xl border border-[var(--color-warmgrey)]/20 bg-white/60 p-6">
          <p className="text-sm text-[var(--color-warmgrey)]">
            Drybar styling products and professional tools are available for purchase in shop.
          </p>
        </Reveal>

        {/* HOME SERVICES SECTION SHELL (STEP 7 - FEATURE FLAGGED OFF) */}
        {SHOW_HOME_SERVICES && (
          <Reveal className="rounded-xl border border-[var(--color-warmgrey)]/20 bg-white p-6">
            <h3 className="text-lg font-medium text-[var(--color-charcoal)]">Home Services</h3>
            <p className="text-sm text-[var(--color-warmgrey)]">TODO_HOME_SERVICES: Details available upon request.</p>
          </Reveal>
        )}

        {/* CTA TO BOOK */}
        <Reveal className="mt-4 flex justify-start">
          <CtaRow label="Book a Chair" destination="book" campaign="prices_page" />
        </Reveal>
      </main>

      {/* REUSED INFO FOOTER WITH QUIET REVEAL */}
      <Reveal>
        <InfoFooter />
      </Reveal>
    </div>
  );
}

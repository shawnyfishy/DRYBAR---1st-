import React from 'react';
import { Header } from '@/components/layout/Header';
import { InfoFooter } from '@/components/layout/InfoFooter';
import { CtaRow } from '@/components/ui/CtaRow';
import { GiftCardVisual } from '@/components/ui/GiftCardVisual';
import { GiftCardAmount } from '@/components/ui/GiftCardAmount';
import { getServicesData } from '@/lib/services';
import { Reveal } from '@/components/motion/Reveal';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { FAQ_ITEMS, FAQ_HEADING, FAQ_SUBHEADING } from '@/lib/faq';

export const dynamic = 'force-static';

export default function GiftsPage() {
  const services = getServicesData();
  const memberships = services.memberships;

  return (
    <div className="flex min-h-screen flex-col [background-image:var(--backgroundImage-grad-asagiri)]">
      <Header />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 py-20 sm:px-6 md:p-12 md:pt-28 gap-10 sm:gap-16">
        {/* TITLE & SUBTITLE */}
        <Reveal className="flex flex-col gap-3">
          <h1 className="text-[clamp(2rem,7vw,4.5rem)] font-normal leading-[0.94] tracking-[-0.022em] text-[var(--color-charcoal)]">
            {services.membershipHeading} & Gift Cards
          </h1>
          <p className="text-[clamp(1rem,3.5vw,1.125rem)] text-[var(--color-warmgrey)]">
            Blowout series and gift options for regular visits
          </p>
        </Reveal>

        {/* MEMBERSHIPS CARDS (STEP 1) */}
        <Reveal className="flex flex-col gap-6">
          <h2 className="text-[clamp(1.25rem,4.4vw,1.875rem)] font-medium text-[var(--color-charcoal)]">
            {services.membershipHeading} Tiers
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {memberships.map((item, idx) => {
              // Ground middle tier (6 Sessions) on --grad-yuzu per Phase 1 gradient rules (exactly 1 yuzu field per viewport)
              const isAccent = idx === 1;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-between rounded-2xl border border-[var(--color-warmgrey)]/20 p-5 sm:p-8 shadow-sm transition-all duration-300 ${
                    isAccent
                      ? '[background-image:var(--backgroundImage-grad-yuzu)] border-[var(--color-yellow)]'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-6">
                    {/* DOMINANT SESSION COUNT AT DISPLAY SCALE */}
                    <div className="flex items-baseline justify-between">
                      <span className="text-[clamp(3.5rem,8vw,5.5rem)] font-normal leading-none tabular-nums text-[var(--color-charcoal)]">
                        {item.sessions}
                      </span>
                      <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
                        {item.sessions_label_en}
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-xl aspect-[4/5] bg-[var(--color-cream)] border border-[var(--color-warmgrey)]/20">
                      <img
                        src={`/images/${10 + idx}.webp`}
                        alt={`Drybar Membership ${item.sessions} Sessions`}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
                    </div>


                    {/* BENEFIT AS ONE LINE BENEATH */}
                    <p className="text-base font-medium leading-snug text-[var(--color-charcoal)]">
                      {item.benefit_en}
                    </p>

                    {/* EXTRAS (Attached to 8 session tier only per printed price list) */}
                    {item.extras_en && item.extras_en.length > 0 && (
                      <div className="border-t border-[var(--color-warmgrey)]/20 pt-3">
                        {item.extras_en.map((extra, eIdx) => (
                          <span
                            key={eIdx}
                            className="inline-block text-xs font-medium text-[var(--color-charcoal)]"
                          >
                            + {extra}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <CtaRow
                      label="Inquire via WhatsApp"
                      destination="whatsapp"
                      campaign="membership_inquire"
                      whatsappIntent={{ kind: 'membership', plan: item.sessions_label_en }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* GIFT CARDS SECTION SHELL (STEP 4) */}
        <Reveal className="flex flex-col gap-6 rounded-2xl border border-[var(--color-warmgrey)]/20 bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-[clamp(1.25rem,4.4vw,1.875rem)] font-medium text-[var(--color-charcoal)]">
              Digital Gift Cards
            </h2>
            <p className="mt-2 text-[clamp(1rem,3.5vw,1.125rem)] text-[var(--color-warmgrey)]">
              Treat someone to an hour that is theirs. Digital gift card inquiries and purchases are handled directly.
            </p>
          </div>
          <GiftCardVisual />
          <GiftCardAmount />
          <div className="flex justify-start">
            <CtaRow
              label="Ask About Gift Cards"
              destination="whatsapp"
              campaign="gift_card_inquire"
              whatsappIntent={{ kind: 'gift_card' }}
            />
          </div>
        </Reveal>

        {/* FOUNDING MEMBERSHIP FAQ — EXPANDABLE SECTION */}
        <Reveal className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
              Good to know
            </span>
            <h2 className="text-[clamp(1.25rem,4.4vw,1.875rem)] font-medium text-[var(--color-charcoal)]">
              {FAQ_HEADING}
            </h2>
            <p className="max-w-2xl text-[clamp(1rem,3.5vw,1.125rem)] text-[var(--color-warmgrey)]">
              {FAQ_SUBHEADING}
            </p>
          </div>

          <FaqAccordion items={FAQ_ITEMS} />

          <div className="flex justify-start">
            <CtaRow
              label="Ask About Founding Membership"
              destination="whatsapp"
              campaign="founding_membership_inquire"
              whatsappIntent={{ kind: 'membership', plan: 'Founding Barfly' }}
            />
          </div>
        </Reveal>
      </main>

      {/* REUSED INFO FOOTER WITH QUIET REVEAL */}
      <Reveal>
        <InfoFooter />
      </Reveal>
    </div>
  );
}

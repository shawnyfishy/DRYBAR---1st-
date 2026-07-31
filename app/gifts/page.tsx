import React from 'react';
import { Header } from '@/components/layout/Header';
import { InfoFooter } from '@/components/layout/InfoFooter';
import { CtaRow } from '@/components/ui/CtaRow';
import { Placeholder } from '@/components/ui/Placeholder';
import { getServicesData } from '@/lib/services';
import { Reveal } from '@/components/motion/Reveal';

export default function GiftsPage() {
  const services = getServicesData();
  const memberships = services.memberships;

  return (
    <div className="flex min-h-screen flex-col [background-image:var(--backgroundImage-grad-asagiri)] overflow-x-hidden">
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
                    <CtaRow label="Inquire via WhatsApp" destination="whatsapp" campaign="membership_inquire" />
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* MEMBERSHIP TERMS CONTAINER WITH TODO_TERMS MARKER (STEP 3) */}
        <Reveal className="rounded-xl border border-[var(--color-warmgrey)]/20 bg-white/60 p-6">
          <h3 className="text-sm font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
            Membership Terms
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-warmgrey)]">
            TODO_TERMS: Official commercial membership terms (validity, upfront cost, transferability, add-on eligibility, applicable session discount rules, expiration, and refund policy) match written agreement at enrollment.
          </p>
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
          <div className="flex justify-start">
            <CtaRow label="Inquire About Gift Cards" destination="whatsapp" campaign="gift_card_inquire" />
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

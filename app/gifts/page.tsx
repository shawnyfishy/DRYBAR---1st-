import React from 'react';
import { Header } from '@/components/layout/Header';
import { InfoFooter } from '@/components/layout/InfoFooter';
import { CtaRow } from '@/components/ui/CtaRow';
import { GiftCardVisual } from '@/components/ui/GiftCardVisual';
import { GiftCardAmount } from '@/components/ui/GiftCardAmount';
import { Reveal } from '@/components/motion/Reveal';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { FAQ_ITEMS, FAQ_HEADING, FAQ_SUBHEADING } from '@/lib/faq';

import { GirlieClub } from '@/components/sections/GirlieClub';

import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drybar.qa';

export const metadata: Metadata = {
  title: 'Girlie Club Monthly Memberships & Gift Cards',
  description: 'Give the gift of great hair with Drybar Qatar Girlie Club monthly blowout memberships and digital gift vouchers at Gewan Island, Doha.',
  keywords: [
    'Girlie Club Drybar Qatar',
    'Monthly blowout membership Doha',
    'Drybar Qatar gift card',
    'Hair gift card Qatar',
    'Beauty gift voucher Doha',
    'Gewan Island hair gifts'
  ],
  alternates: {
    canonical: `${siteUrl}/gifts`,
  },
  openGraph: {
    title: 'Blowout Memberships & Digital Gift Cards | Drybar Qatar',
    description: 'Give the gift of great hair with Drybar Qatar blowout memberships and digital gift vouchers at Gewan Island, Doha.',
    url: `${siteUrl}/gifts`,
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': siteUrl
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Gifts & Memberships',
      'item': `${siteUrl}/gifts`
    }
  ]
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': FAQ_ITEMS.map((faq) => ({
    '@type': 'Question',
    'name': faq.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.answer
        .map((block) => {
          if (block.type === 'paragraph' || block.type === 'note') return block.text;
          if (block.type === 'list') return (block.label ? `${block.label}: ` : '') + block.items.join(', ');
          return '';
        })
        .join(' '),
    },
  })),
};

export const dynamic = 'force-static';

export default function GiftsPage() {
  return (
    <div className="flex min-h-screen flex-col [background-image:var(--backgroundImage-grad-asagiri)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 py-20 sm:px-6 md:p-12 md:pt-28 gap-10 sm:gap-16">
        {/* TITLE & SUBTITLE */}
        <Reveal className="flex flex-col gap-3">
          <h1 className="text-[clamp(2rem,7vw,4.5rem)] font-normal leading-[0.94] tracking-[-0.022em] text-[var(--color-charcoal)]">
            Memberships & Gift Cards
          </h1>
          <p className="text-[clamp(1rem,3.5vw,1.125rem)] text-[var(--color-warmgrey)]">
            Monthly blowout memberships and gift options for regular visits
          </p>
        </Reveal>

        {/* GIRLIE CLUB MONTHLY MEMBERSHIP SECTION */}
        <Reveal>
          <GirlieClub />
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

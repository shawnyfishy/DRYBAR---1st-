'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { isPlaceholder } from '@/lib/content';
import { whatsappHref } from '@/lib/whatsapp';

export function InfoFooter() {
  const t = useTranslations('footer');
  const tBrand = useTranslations('brand');

  const mapsUrl =
    process.env.NEXT_PUBLIC_MAPS_URL ||
    'https://www.google.com/maps?q=25.3784140,51.5375250&entry=gps&shh=CAE&lucs=,94297699,94231188,94280568,47071704,94218641,94282134,100813464,94286869,100820242&g_ep=CAISEjI2LjI3LjIuOTM5NTc4NzgwMBgAINeCAypTLDk0Mjk3Njk5LDk0MjMxMTg4LDk0MjgwNTY4LDQ30TcxNzA0LDk0MjE4NjQxLDk0MjgyMTM0LDEwMDgxMzQ2NCw5NDI4Njg2OSwxMDA4MjAyNDJCAlFB&skid=fd390b11-57ad-43fc-9b33-919ed4eb01c5&g_st=ii';

  return (
    <footer className="w-full [background-image:var(--backgroundImage-grad-sumi)] py-16 text-[var(--color-cream)]">


      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-6 md:px-12">
        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* LOCATION */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
              {t('locationLabel')}
            </h4>
            <p className="text-[clamp(1rem,3.5vw,1.125rem)] font-normal leading-relaxed text-[var(--color-cream)]">
              {t('address')}
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-yellow)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]"
            >
              {t('mapsLabel')}
            </a>
          </div>

          {/* HOURS */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
              {t('hoursLabel')}
            </h4>
            <p className="text-[clamp(1rem,3.5vw,1.125rem)] font-normal leading-relaxed text-[var(--color-cream)]">
              {t('hours')}
            </p>
            <p className="text-xs text-[var(--color-warmgrey)]">
              {t('ramadanNote')}
            </p>
          </div>

          {/* CONTACT & INSTAGRAM */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
              {t('contactLabel')}
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href={whatsappHref({ kind: 'general' })}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[clamp(1rem,3.5vw,1.125rem)] font-normal text-[var(--color-cream)] hover:text-[var(--color-yellow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]"
              >
                WhatsApp: +974 7773 0600
              </a>
              <a
                href="tel:+97477730600"
                className="text-xs text-[var(--color-warmgrey)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]"
              >
                Phone: +974 7773 0600
              </a>
              <a
                href="https://www.instagram.com/thedrybar.qatar"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-yellow)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]"
              >
                {t('instagramLabel')}
              </a>
            </div>
          </div>

          {/* POLICY MARKER */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
              {t('policyTitle')}
            </h4>
            <p className="text-xs leading-relaxed text-[var(--color-warmgrey)] border-l-2 border-[var(--color-yellow)] pl-3">
              {isPlaceholder(t('policyText'))
                ? 'Booking and cancellation terms are confirmed at the time you book a chair. Message us on WhatsApp if you need to change your visit.'
                : t('policyText')}
            </p>
          </div>
        </div>

        {/* BOTTOM LEGAL BAR */}
        <div className="border-t border-[var(--color-warmgrey)]/20 pt-8 text-xs text-[var(--color-warmgrey)]">
          <p>{tBrand('legal')}</p>
        </div>
      </div>
    </footer>
  );
}

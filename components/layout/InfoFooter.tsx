'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export function InfoFooter() {
  const t = useTranslations('footer');
  const tBrand = useTranslations('brand');

  const mapsUrl = process.env.NEXT_PUBLIC_MAPS_URL || '#';

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
                href="https://wa.me/97477730600"
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
                href="https://instagram.com/thedrybar.qatar"
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
              {t('policyText')}
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

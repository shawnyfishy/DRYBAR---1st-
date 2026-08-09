'use client';

import React, { useState } from 'react';
import { getCtaDestination, trackCtaClick } from '@/lib/zenoti';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';
import { TransitionLink } from '@/components/motion/RouteTransition';

export function CtaIndex() {
  const t = useTranslations('ctaIndex');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const bookCta = getCtaDestination('book', 'cta_index');
  const manageCta = getCtaDestination('manage', 'cta_index');

  const rows = [
    {
      id: 'book',
      label: bookCta.isFallback ? t('fallbackNotice') : t('bookNow'),
      href: bookCta.href,
      target: bookCta.target,
      imageSrc: '/images/3.webp',
      placeholderLabel: 'signature blowout finish, mirror perspective',
      onClick: () => trackCtaClick('book', bookCta.href),
    },
    {
      id: 'prices',
      label: t('priceList'),
      href: '/prices',
      target: '_self' as const,
      imageSrc: '/images/4.webp',
      placeholderLabel: 'style menu cards, product lineup',
      onClick: () => trackCtaClick('prices', '/prices'),
    },
    {
      id: 'gifts',
      label: t('giftsMemberships'),
      href: '/gifts',
      target: '_self' as const,
      imageSrc: '/images/5.webp',
      placeholderLabel: 'gift card packaging, yellow ribbon',
      onClick: () => trackCtaClick('gifts', '/gifts'),
    },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
  };

  return (
    <section className="flex min-h-fit w-full md:w-[calc(100vw-(var(--spacing-rail)*2))] md:flex-shrink-0 flex-col justify-center bg-[var(--color-cream)] py-12 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-b border-[var(--color-warmgrey)]/20 overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-4 sm:gap-6">
        {rows.map((row, idx) => {
          const isHovered = hoveredId === row.id;
          const isDimmed = hoveredId !== null && !isHovered;
          const isExternal = row.target === '_blank' || row.href.startsWith('http');

          const rowContent = (
            <>
              {/* CURSOR-FOLLOWING HOVER CARD THUMBNAIL */}
              <div
                className={`pointer-events-none absolute z-20 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-out hidden lg:block
                  ${isHovered ? 'scale-100 opacity-90' : 'scale-95 opacity-0'}
                `}
                style={{
                  left: `${cursorPos.x}px`,
                  top: `${cursorPos.y}px`,
                }}
              >
                <img src={row.imageSrc} alt={`Drybar Qatar ${row.label} section preview`} className="h-full w-full object-cover border-2 border-[var(--color-charcoal)] rounded-lg" />
              </div>

              {/* ROW LABEL */}
              <span className="z-10 text-start text-[clamp(1.5rem,5vw,4.5rem)] font-normal leading-[0.94] tracking-[-0.022em] text-[var(--color-charcoal)] transition-transform duration-300 group-hover:translate-x-3 rtl:group-hover:-translate-x-3">
                {row.label}
              </span>

              {/* ARROW INDICATOR */}
              <span className="z-10 text-2xl text-[var(--color-warmgrey)] transition-all duration-300 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 group-hover:text-[var(--color-charcoal)] rtl:rotate-180" aria-hidden="true">
                →
              </span>
            </>
          );

          const rowClassName = `group relative flex min-h-[72px] sm:min-h-[88px] w-full items-center justify-between overflow-hidden rounded-xl border border-[var(--color-warmgrey)]/20 p-4 sm:p-6 
            transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]
            active:scale-[0.985] active:transition-transform active:duration-100
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]
            ${isHovered ? '[background-image:var(--backgroundImage-grad-yuzu)] border-[var(--color-yellow)]' : 'bg-white'}
            ${isDimmed ? 'opacity-40' : 'opacity-100'}
          `;

          return (
            <Reveal key={row.id} delay={idx * 0.10}>
              {isExternal ? (
                <a
                  href={row.href}
                  target={row.target}
                  rel="noopener"
                  onClick={row.onClick}
                  onMouseEnter={() => setHoveredId(row.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onMouseMove={handleMouseMove}
                  className={rowClassName}
                >
                  {rowContent}
                </a>
              ) : (
                <TransitionLink
                  href={row.href}
                  onClick={row.onClick}
                  onMouseEnter={() => setHoveredId(row.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onMouseMove={handleMouseMove}
                  className={rowClassName}
                >
                  {rowContent}
                </TransitionLink>
              )}
            </Reveal>
          );
        })}

        {/* QUIET SECONDARY MANAGE/RESCHEDULE LINK NEAR PRIMARY CTA */}
        <div className="mt-4 flex flex-col items-start gap-1 px-2">
          <a
            href={manageCta.href}
            target={manageCta.target}
            rel="noopener"
            onClick={() => trackCtaClick('manage', manageCta.href)}
            className="text-xs text-[var(--color-warmgrey)] transition-colors hover:text-[var(--color-charcoal)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
          >
            {t('managePrompt')}
          </a>
        </div>
      </div>
    </section>
  );
}

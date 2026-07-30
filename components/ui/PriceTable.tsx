'use client';

import React from 'react';
import { getServicesData } from '@/lib/services';

export function PriceTable() {
  const services = getServicesData();
  const tiers = services.lengthTiers;

  return (
    <div className="flex w-full flex-col gap-8">
      {/* MOBILE CARDS (Visible under md: 768px) - NO horizontal scroll, NO accordions */}
      <div className="flex flex-col gap-6 md:hidden">
        {services.hairStyling.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-xl border border-[var(--color-warmgrey)]/20 bg-white p-5 shadow-sm"
          >
            <h4 className="text-lg font-medium text-[var(--color-charcoal)] border-b border-[var(--color-warmgrey)]/15 pb-2 text-start">
              {item.name_en}
            </h4>

            {/* 4 ROWS FOR 4 LENGTH TIERS REACHABLE WITHOUT SCROLLING */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-xs font-medium text-[var(--color-warmgrey)]">
                  {tiers[0].index} {tiers[0].label_en}
                </span>
                <span className="font-medium tabular-nums text-[var(--color-charcoal)]" dir="ltr">
                  QAR {item.prices.short}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-xs font-medium text-[var(--color-warmgrey)]">
                  {tiers[1].index} {tiers[1].label_en}
                </span>
                <span className="font-medium tabular-nums text-[var(--color-charcoal)]" dir="ltr">
                  QAR {item.prices.medium}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-xs font-medium text-[var(--color-warmgrey)]">
                  {tiers[2].index} {tiers[2].label_en}
                </span>
                <span className="font-medium tabular-nums text-[var(--color-charcoal)]" dir="ltr">
                  QAR {item.prices.long}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-xs font-medium text-[var(--color-warmgrey)]">
                  {tiers[3].index} {tiers[3].label_en}
                </span>
                <span className="font-medium tabular-nums text-[var(--color-charcoal)]" dir="ltr">
                  QAR {item.prices.extra_long}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE (Visible 768px and up) */}
      <div className="hidden w-full overflow-x-auto rounded-xl border border-[var(--color-warmgrey)]/20 bg-white p-4 shadow-sm md:block">
        <table className="w-full text-start font-[var(--font-latin)]">
          <thead>
            <tr className="border-b border-[var(--color-warmgrey)]/20 text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
              <th className="py-3 px-4 text-start">Style</th>
              {tiers.map((tier) => (
                <th key={tier.id} className="py-3 px-4 text-end">
                  {tier.index} {tier.label_en}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-warmgrey)]/10 text-sm">
            {services.hairStyling.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-[var(--color-cream)]/50">
                <td className="py-4 px-4 font-medium text-[var(--color-charcoal)] text-start">{item.name_en}</td>
                <td className="py-4 px-4 text-end tabular-nums text-[var(--color-charcoal)]" dir="ltr">QAR {item.prices.short}</td>
                <td className="py-4 px-4 text-end tabular-nums text-[var(--color-charcoal)]" dir="ltr">QAR {item.prices.medium}</td>
                <td className="py-4 px-4 text-end tabular-nums text-[var(--color-charcoal)]" dir="ltr">QAR {item.prices.long}</td>
                <td className="py-4 px-4 text-end tabular-nums text-[var(--color-charcoal)]" dir="ltr">QAR {item.prices.extra_long}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

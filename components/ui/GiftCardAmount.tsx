'use client';

import React, { useState } from 'react';
import { whatsappHref } from '@/lib/whatsapp';
import { trackCtaClick } from '@/lib/zenoti';

export function GiftCardAmount() {
  const [amount, setAmount] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
    setAmount(sanitized);
  };

  const value = parseInt(amount || '0', 10);
  const isValid = value >= 100 && value <= 5000;
  const isOutOfRange = amount !== '' && !isValid;

  const href = isValid
    ? whatsappHref({ kind: 'gift_card_amount', amount: value })
    : '';

  return (
    <div data-lenis-prevent className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* AMOUNT PILL */}
        <label className="inline-flex items-center gap-2 rounded-full bg-white border border-[var(--color-warmgrey)]/30 px-6 py-4 focus-within:border-[var(--color-charcoal)] focus-within:ring-2 focus-within:ring-[var(--color-yellow)]">
          <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)] select-none">
            QAR
          </span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Enter amount"
            maxLength={5}
            aria-label="Gift card amount in Qatari riyal"
            value={amount}
            onChange={handleChange}
            className="bg-transparent outline-none border-none w-full sm:w-[9ch] tabular-nums text-[var(--color-charcoal)] placeholder:text-[var(--color-warmgrey)]"
          />
        </label>

        {/* PROCEED BUTTON */}
        {isValid ? (
          <a
            href={href}
            target="_blank"
            rel="noopener"
            onClick={() => trackCtaClick('whatsapp', href)}
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-yellow)] px-8 py-4 text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-charcoal)] transition-transform hover:scale-[1.02] active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
          >
            Proceed
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-yellow)] px-8 py-4 text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-charcoal)] opacity-40 cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)]"
          >
            Proceed
          </button>
        )}
      </div>

      {/* HELPER LINE */}
      <p className="text-[0.625rem] text-[var(--color-warmgrey)]">
        {isOutOfRange
          ? 'Please enter an amount between QAR 100 and QAR 5,000.'
          : 'Minimum QAR 100. You will be taken to WhatsApp to complete your gift card purchase.'}
      </p>
    </div>
  );
}

import React from 'react';

export function GiftCardVisual() {
  return (
    <div className="relative w-full rounded-xl bg-[var(--color-cream)] px-6 py-10 sm:px-10 sm:py-14 border border-[var(--color-warmgrey)]/15">
      <div className="relative mx-auto w-full max-w-[520px] aspect-[1.45/1] sm:aspect-[1.5/1]">
        {/* Back card */}
        <div className="absolute right-0 top-0 w-[78%] z-0 rotate-[4deg] sm:rotate-[6deg]">
          <img
            src="/giftcard%20images/giftcard-back.webp"
            alt="Drybar Qatar digital blowout gift card reverse side"
            width={1600}
            height={1008}
            className="h-auto w-full"
            style={{
              filter:
                'drop-shadow(0 1px 2px rgba(38,37,35,0.10)) drop-shadow(0 14px 28px rgba(38,37,35,0.13))',
            }}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        </div>

        {/* Front card */}
        <div className="absolute bottom-0 left-0 w-[78%] z-10 rotate-[-3deg] sm:rotate-[-4deg] motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:hover:-translate-y-1.5 motion-safe:hover:rotate-[-2deg]">
          <img
            src="/giftcard%20images/giftcard-front.webp"
            alt="Drybar Qatar signature blowout gift card front"
            width={1600}
            height={1008}
            className="h-auto w-full"
            style={{
              filter:
                'drop-shadow(0 2px 3px rgba(38,37,35,0.16)) drop-shadow(0 20px 38px rgba(38,37,35,0.20))',
            }}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        </div>
      </div>
    </div>
  );
}

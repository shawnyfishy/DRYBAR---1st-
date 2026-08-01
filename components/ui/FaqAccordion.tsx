'use client';

import React, { useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { DUR, EASE } from '@/lib/motion';
import type { FaqItem } from '@/lib/faq';

interface FaqAccordionProps {
  items: FaqItem[];
}

/**
 * Expandable FAQ list.
 *
 * Items toggle independently (rather than a single-open accordion) so a guest
 * comparing, say, the offer against the perks can hold both open at once.
 *
 * The panel is always mounted and hidden via height + visibility rather than
 * unmounted, so in-page find and assistive tech can still reach the content,
 * and so GSAP has a stable element to measure.
 */
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggle = useCallback((id: string) => {
    const panel = panelRefs.current[id];
    const isOpening = !openIds.includes(id);

    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

    if (!panel) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(panel, { height: isOpening ? 'auto' : 0, opacity: isOpening ? 1 : 0 });
      return;
    }

    gsap.killTweensOf(panel);

    if (isOpening) {
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: DUR.base,
          ease: EASE.soft,
          // Leave no inline height behind: a pinned `height: 123px` would not
          // reflow if the viewport width changes while the panel is open.
          onComplete: () => gsap.set(panel, { height: 'auto' }),
        }
      );
    } else {
      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: DUR.fast,
        ease: EASE.soft,
      });
    }
  }, [openIds]);

  return (
    <div className="flex flex-col divide-y divide-[var(--color-warmgrey)]/20 border-y border-[var(--color-warmgrey)]/20">
      {items.map((item, idx) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = `faq-trigger-${item.id}`;
        const panelId = `faq-panel-${item.id}`;

        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group flex w-full min-h-[44px] cursor-pointer items-start gap-4 py-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-charcoal)] sm:gap-6 sm:py-6"
              >
                {/* INDEX — mirrors the [01 / 04] panel counter used site-wide */}
                <span className="mt-1 shrink-0 font-mono text-[0.6875rem] font-medium tracking-[0.15em] tabular-nums text-[var(--color-warmgrey)]">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <span className="flex-1 text-[clamp(1rem,3.2vw,1.375rem)] font-medium leading-snug tracking-[-0.012em] text-[var(--color-charcoal)]">
                  {item.question}
                </span>

                {/* PLUS / MINUS INDICATOR — two rules, the vertical one
                    collapsing to form a minus when open. Yellow is used as a
                    surface fill only; the glyph itself stays charcoal. */}
                <span
                  aria-hidden="true"
                  className={`relative mt-0.5 grid size-7 shrink-0 place-items-center rounded-full transition-colors duration-300 sm:size-8 ${
                    isOpen
                      ? 'bg-[var(--color-yellow)]'
                      : 'bg-transparent border border-[var(--color-warmgrey)]/40 group-hover:border-[var(--color-charcoal)]'
                  }`}
                >
                  <span className="absolute h-px w-3 bg-[var(--color-charcoal)]" />
                  <span
                    className={`absolute h-3 w-px bg-[var(--color-charcoal)] transition-transform duration-300 ease-out ${
                      isOpen ? 'scale-y-0' : 'scale-y-100'
                    }`}
                  />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              ref={(el) => {
                panelRefs.current[item.id] = el;
              }}
              className="h-0 overflow-hidden opacity-0"
            >
              <div className="flex flex-col gap-4 pb-7 pl-[calc(0.6875rem+1rem)] pr-0 sm:pl-[calc(0.6875rem+1.5rem)] sm:pb-8">
                {item.answer.map((block, bIdx) => {
                  if (block.type === 'paragraph') {
                    return (
                      <p
                        key={bIdx}
                        className="max-w-2xl text-[clamp(0.9375rem,3.2vw,1.0625rem)] leading-[1.55] text-[var(--color-charcoal)]/85"
                      >
                        {block.text}
                      </p>
                    );
                  }

                  if (block.type === 'note') {
                    return (
                      <p
                        key={bIdx}
                        className="max-w-2xl text-[0.8125rem] italic leading-[1.5] text-[var(--color-warmgrey)]"
                      >
                        {block.text}
                      </p>
                    );
                  }

                  return (
                    <div key={bIdx} className="flex flex-col gap-2">
                      {block.label && (
                        <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-[var(--color-warmgrey)]">
                          {block.label}
                        </span>
                      )}
                      <ul className="flex flex-col gap-2">
                        {block.items.map((li, liIdx) => (
                          <li
                            key={liIdx}
                            className="flex items-start gap-3 text-[clamp(0.9375rem,3.2vw,1.0625rem)] leading-[1.55] text-[var(--color-charcoal)]/85"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-[var(--color-yellow)]"
                            />
                            <span>{li}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

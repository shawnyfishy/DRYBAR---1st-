'use client';

import React, { useRef } from 'react';
import { useMenu } from './MenuProvider';
import { gsap } from 'gsap';
import { useGsap } from '@/components/motion/useGsap';

export function ContactsDrawer() {
  const { activeDrawer, close } = useMenu();
  const isOpen = activeDrawer === 'contacts';
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGsap(
    () => {
      const overlay = overlayRef.current;
      const content = contentRef.current;
      if (!overlay || !content) return;

      const items = content.querySelectorAll('.contact-item');

      if (isOpen) {
        gsap.set(overlay, { autoAlpha: 1, pointerEvents: 'auto' });
        const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power3.out' } });

        tl.fromTo(content, { xPercent: 100 }, { xPercent: 0 }, 0)
          .fromTo(
            items,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.08, delay: 0.2 },
            0
          );
      } else {
        const tl = gsap.timeline({
          defaults: { duration: 0.5, ease: 'power3.in' },
          onComplete: () => gsap.set(overlay, { autoAlpha: 0, pointerEvents: 'none' }),
        });
        tl.to(content, { xPercent: 100 }, 0);
      }
    },
    overlayRef,
    [isOpen]
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 opacity-0 pointer-events-none flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
    >
      {/* BACKDROP CLICK CLOSES DRAWER */}
      <div className="absolute inset-0" onClick={close} />

      {/* SLEEK 380PX RIGHT DRAWER CURTAIN MATCHING 9TO5STUDIO */}
      <div
        ref={contentRef}
        className="relative z-10 flex h-full w-full max-w-sm flex-col justify-between bg-[var(--color-charcoal)] p-8 text-[var(--color-cream)] shadow-2xl overflow-y-auto"
      >
        {/* HEADER */}
        <div className="contact-item flex items-center justify-between border-b border-[var(--color-cream)]/15 pb-6">
          <span className="text-[0.75rem] font-bold tracking-[0.2em] uppercase text-[var(--color-warmgrey)]">
            CONTACTS & LOCATION
          </span>
          <button
            onClick={close}
            className="rounded px-3 py-1.5 text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-[var(--color-cream)] hover:text-[var(--color-yellow)] transition-colors"
          >
            CLOSE [✕]
          </button>
        </div>

        {/* CONTACT DETAILS */}
        <div className="my-auto flex flex-col gap-10">
          <div className="contact-item">
            <h3 className="text-[0.75rem] font-bold tracking-[0.2em] uppercase text-[var(--color-warmgrey)] mb-2">
              FLAGSHIP SALON
            </h3>
            <p className="text-[clamp(1.25rem,3vw,2rem)] font-light leading-tight">
              GEWAN ISLAND • DOHA, QATAR
            </p>
            <p className="mt-2 text-sm text-[var(--color-cream)]/70">
              Pearl Qatar Archipelago, Doha
            </p>
          </div>

          <div className="contact-item">
            <h3 className="text-[0.75rem] font-bold tracking-[0.2em] uppercase text-[var(--color-warmgrey)] mb-2">
              BOOKING & ENQUIRIES
            </h3>
            <a
              href="https://wa.me/97400000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[clamp(1.125rem,2.5vw,1.75rem)] font-normal text-[var(--color-yellow)] hover:underline block"
            >
              +974 4000 0000 (WhatsApp)
            </a>
            <p className="mt-1 text-sm text-[var(--color-cream)]/70">
              concierge@drybarqatar.qa
            </p>
          </div>

          <div className="contact-item">
            <h3 className="text-[0.75rem] font-bold tracking-[0.2em] uppercase text-[var(--color-warmgrey)] mb-2">
              SALON HOURS
            </h3>
            <p className="text-base text-[var(--color-cream)]">
              Saturday – Thursday: 10:00 AM – 10:00 PM
            </p>
            <p className="text-base text-[var(--color-cream)]/80">
              Friday: 1:00 PM – 10:00 PM
            </p>
          </div>
        </div>

        {/* FOOTER CALL TO ACTION */}
        <div className="contact-item pt-6 border-t border-[var(--color-cream)]/15">
          <a
            href="https://wa.me/97400000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-full bg-[var(--color-yellow)] px-8 py-4 text-center font-bold tracking-[0.15em] text-[var(--color-charcoal)] transition-transform hover:scale-[1.02]"
          >
            <span>BOOK INSTANT APPOINTMENT</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

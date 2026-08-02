'use client';

import React, { useRef } from 'react';
import { useMenu } from './MenuProvider';
import { gsap } from 'gsap';
import { useGsap } from '@/components/motion/useGsap';
import { whatsappHref } from '@/lib/whatsapp';

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
        className="relative z-10 flex h-full w-full max-w-[90vw] sm:max-w-sm flex-col justify-between bg-[var(--color-charcoal)] p-6 sm:p-8 text-[var(--color-cream)] shadow-2xl overflow-y-auto"
      >
        {/* HEADER */}
        <div className="contact-item flex items-center justify-between border-b border-[var(--color-cream)]/15 pb-5">
          <span className="text-[0.75rem] font-bold tracking-[0.2em] uppercase text-[var(--color-warmgrey)]">
            CONTACTS & LOCATION
          </span>
          <button
            onClick={close}
            className="rounded px-3 py-2 text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-[var(--color-cream)] hover:text-[var(--color-yellow)] transition-colors min-h-[44px] flex items-center justify-center cursor-pointer"
          >
            CLOSE [✕]
          </button>
        </div>

        {/* CONTACT DETAILS */}
        <div className="my-auto flex flex-col gap-8 sm:gap-10">
          <div className="contact-item flex flex-col items-start">
            <h3 className="text-[0.75rem] font-bold tracking-[0.2em] uppercase text-[var(--color-warmgrey)] mb-2">
              FLAGSHIP SALON
            </h3>
            <p className="text-[clamp(1.25rem,3vw,2rem)] font-light leading-tight">
              GEWAN ISLAND • DOHA, QATAR
            </p>
            <p className="mt-1 text-sm text-[var(--color-cream)]/70">
              Pearl Qatar Archipelago, Doha
            </p>
            <a
              href="https://www.google.com/maps?q=25.3784140,51.5375250&entry=gps&shh=CAE&lucs=,94297699,94231188,94280568,47071704,94218641,94282134,100813464,94286869,100820242&g_ep=CAISEjI2LjI3LjIuOTM5NTc4NzgwMBgAINeCAypTLDk0Mjk3Njk5LDk0MjMxMTg4LDk0MjgwNTY4LDQ30TcxNzA0LDk0MjE4NjQxLDk0MjgyMTM0LDEwMDgxMzQ2NCw5NDI4Njg2OSwxMDA8MjAyNDJCAlFB&skid=fd390b11-57ad-43fc-9b33-919ed4eb01c5&g_st=ii"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[var(--color-yellow)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]"
            >
              <span>Google Maps</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="contact-item flex flex-col items-start">
            <h3 className="text-[0.75rem] font-bold tracking-[0.2em] uppercase text-[var(--color-warmgrey)] mb-2">
              BOOKING & ENQUIRIES
            </h3>
            <a
              href={whatsappHref({ kind: 'general' })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[clamp(1.125rem,2.5vw,1.75rem)] font-normal text-[var(--color-yellow)] hover:underline block"
            >
              +974 7773 0600 (WhatsApp)
            </a>
            <p className="mt-1 text-sm text-[var(--color-cream)]/70">
              concierge@drybarqatar.qa
            </p>
            <a
              href="https://www.instagram.com/thedrybar.qatar"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[0.6875rem] font-bold tracking-[0.15em] uppercase text-[var(--color-cream)] hover:text-[var(--color-yellow)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]"
            >
              <span>Instagram (@thedrybar.qatar)</span>
              <span aria-hidden="true">↗</span>
            </a>
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
            href={whatsappHref({ kind: 'booking' })}
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

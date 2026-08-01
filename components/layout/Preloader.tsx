'use client';

import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { DUR, EASE, registerGsapPlugins } from '@/lib/motion';
import { Logo } from '@/components/ui/Logo';
import { PRELOADER_REVEAL_EVENT } from '@/lib/preloaderEvents';

const TAGLINE = 'Blowouts Only • No Cuts, No Colour';

export function Preloader() {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    registerGsapPlugins();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenIntro = typeof window !== 'undefined' && sessionStorage.getItem('db:intro') === 'true';

    if (prefersReducedMotion || hasSeenIntro) {
      // Hero (and anything else) waits for this event before animating in —
      // fire it immediately so content just appears, no motion, no stall.
      window.dispatchEvent(new Event(PRELOADER_REVEAL_EVENT));
      setIsComplete(true);
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: EASE.out },
      onComplete: () => {
        // Set intro key for this session
        sessionStorage.setItem('db:intro', 'true');

        // Fired at the exact moment the curtain starts lifting — not after
        // it's gone. Hero's own entrance listens for this and plays
        // underneath as the preloader exits, so the two overlap into one
        // continuous motion instead of "curtain gone, then a second,
        // separate animation nobody's curtain-timed to see."
        window.dispatchEvent(new Event(PRELOADER_REVEAL_EVENT));

        gsap.to('.preloader-container', {
          yPercent: -100,
          duration: 0.6,
          ease: EASE.out,
          onComplete: () => setIsComplete(true),
        });
      },
    });

    // Wordmark rises out of its overflow-hidden mask.
    tl.fromTo(
      '.preloader-logo-wrap',
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: DUR.intro }
    )
      // Tagline reveals word by word, each rising out of its own mask.
      .fromTo(
        '.preloader-tagline-word',
        { yPercent: 135, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: DUR.reveal, ease: EASE.soft, stagger: 0.06 },
        '-=0.8'
      )
      // Brief hold on the fully-built mark before the exit begins.
      .to({}, { duration: 0.3 });

    return () => {
      tl.kill();
    };
  }, []);

  if (isComplete) return null;

  const words = TAGLINE.split(' ');

  return (
    <div className="preloader-container fixed inset-0 z-50 flex flex-col justify-between bg-[var(--color-yellow)] p-8 text-[var(--color-charcoal)] will-change-transform">
      {/* TOP-LEFT CORNER LABEL */}
      <div className="text-xs tracking-[0.2em] uppercase text-[var(--color-charcoal)]/70">
        <span>DRYBAR QATAR</span>
      </div>

      {/* CENTER WORDMARK + TAGLINE REVEAL — same yellow canvas Hero uses, so
          the preloader and the page underneath read as one continuous
          surface instead of two different-colored screens cut together. */}
      <div className="my-auto flex flex-col items-center justify-center text-center">
        <div className="overflow-hidden p-3 -m-3">
          {/* opacity-0 as a persistent CSS default, not just a GSAP fromTo
              value — without it this renders fully visible at first paint
              (SSR/pre-hydration), then snaps to hidden the instant the
              effect runs and reanimates in: a flash-then-reset every load.
              The dark backing plate (not a fill/recolor) gives the
              placeholder SVG's "dry" — whose own fill sits almost on top of
              this yellow — a surface it actually has contrast against,
              without touching its locked-in colors. */}
          <div className="preloader-logo-wrap opacity-0 rounded-2xl bg-[var(--color-charcoal)] px-10 py-7 md:px-14 md:py-10">
            <Logo className="h-12 w-auto md:h-20" />
          </div>
        </div>

        <p className="mt-6 text-xs tracking-[0.25em] uppercase text-[var(--color-charcoal)]/70">
          {words.map((word, idx) => (
            <span key={idx} className="inline-block overflow-hidden pb-[0.25em] -mb-[0.25em] mr-[0.4em] align-top">
              <span className="preloader-tagline-word inline-block will-change-transform opacity-0">
                {word}
              </span>
            </span>
          ))}
        </p>
      </div>


      {/* BOTTOM-RIGHT CORNER LABEL */}
      <div className="flex justify-end text-xs tracking-[0.2em] uppercase text-[var(--color-charcoal)]/70">
        <span>Gewan Island, The Pearl</span>
      </div>
    </div>
  );
}

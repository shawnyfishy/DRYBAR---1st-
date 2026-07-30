'use client';

import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { DUR, EASE, registerGsapPlugins } from '@/lib/motion';
import { Logo } from '@/components/ui/Logo';

const TAGLINE = 'Blowouts Only • No Cuts, No Colour';

export function Preloader() {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    registerGsapPlugins();

    const tl = gsap.timeline({
      defaults: { ease: EASE.out },
      onComplete: () => {
        gsap.to('.preloader-container', {
          clipPath: 'inset(0% 0% 0% 100%)',
          duration: 1,
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
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: DUR.reveal, ease: EASE.soft, stagger: 0.06 },
        '-=0.8'
      );

    return () => {
      tl.kill();
    };
  }, []);

  if (isComplete) return null;

  const words = TAGLINE.split(' ');

  return (
    <div className="preloader-container fixed inset-0 z-50 flex flex-col justify-between bg-[var(--color-charcoal)] p-8 text-[var(--color-cream)] will-change-transform">
      {/* TOP-LEFT CORNER LABEL */}
      <div className="text-xs tracking-[0.2em] uppercase text-[var(--color-warmgrey)]">
        <span>DRYBAR QATAR</span>
      </div>

      {/* CENTER WORDMARK + TAGLINE REVEAL */}
      <div className="my-auto flex flex-col items-center justify-center text-center">
        <div className="overflow-hidden">
          <div className="preloader-logo-wrap flex items-center gap-4">
            <Logo className="h-12 w-auto md:h-20" />
          </div>
        </div>

        <p className="mt-6 text-xs tracking-[0.25em] uppercase text-[var(--color-warmgrey)]">
          {words.map((word, idx) => (
            <span key={idx} className="inline-block overflow-hidden mr-[0.4em] align-top">
              <span className="preloader-tagline-word inline-block will-change-transform">
                {word}
              </span>
            </span>
          ))}
        </p>
      </div>

      {/* BOTTOM-RIGHT CORNER LABEL */}
      <div className="flex justify-end text-xs tracking-[0.2em] uppercase text-[var(--color-warmgrey)]">
        <span>Gewan Island, The Pearl</span>
      </div>
    </div>
  );
}

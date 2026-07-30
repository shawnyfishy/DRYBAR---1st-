'use client';

import React, { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal } from '@/components/motion/Reveal';
import { SplitLines } from '@/components/motion/SplitLines';
import { Parallax } from '@/components/motion/Parallax';
import { ScrubStage } from '@/components/motion/ScrubStage';
import { Logo } from '@/components/ui/Logo';

export default function MotionProvingGroundPage() {
  const [triggerCount, setTriggerCount] = useState<number>(0);

  useEffect(() => {
    // Audit active ScrollTrigger instances
    setTriggerCount(ScrollTrigger.getAll().length);
    const interval = setInterval(() => {
      setTriggerCount(ScrollTrigger.getAll().length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen [background-image:var(--backgroundImage-grad-asagiri)] p-8 text-[var(--color-charcoal)]">
      {/* HEADER */}
      <header className="mb-12 border-b border-[var(--color-warmgrey)]/30 pb-6">
        <Logo className="mb-4 h-10 w-auto" />
        <h1 className="text-3xl font-bold tracking-tight">Motion Infrastructure Proving Ground</h1>
        <p className="mt-2 text-[var(--color-warmgrey)]">
          Phase 2 isolated motion primitives test suite and ScrollTrigger lifecycle audit.
        </p>

        {/* ScrollTrigger Counter Badge */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-warmgrey)]/30 bg-white px-4 py-2 font-mono text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Active ScrollTrigger Instances: <span className="text-emerald-700">{triggerCount}</span>
        </div>
      </header>

      {/* DEMO 1: REVEAL PRIMITIVE */}
      <section className="mb-24 rounded-2xl border border-[var(--color-warmgrey)]/20 bg-white p-8 shadow-sm">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--color-warmgrey)]">
          Primitive 1: &lt;Reveal&gt; (Fade & Rise on Scroll Enter)
        </h2>
        <div className="flex flex-col gap-6">
          <Reveal>
            <div className="rounded-xl bg-[var(--color-butter)] p-6 text-[clamp(1.25rem,4.4vw,1.875rem)] font-medium">
              Reveal Card 1 — Fade in and rise up from y: 24px (Duration 1.1s, Power4.out)
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rounded-xl [background-image:var(--backgroundImage-grad-yuzu)] p-6 text-[clamp(1.25rem,4.4vw,1.875rem)] font-medium">
              Reveal Card 2 — Staggered entry delay (0.2s)
            </div>
          </Reveal>
        </div>
      </section>

      {/* DEMO 2: SPLITLINES PRIMITIVE */}
      <section className="mb-24 rounded-2xl border border-[var(--color-warmgrey)]/20 bg-white p-8 shadow-sm">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--color-warmgrey)]">
          Primitive 2: &lt;SplitLines&gt; (Staggered Word/Line Splitting)
        </h2>
        <div className="flex flex-col gap-8">
          <div>
            <span className="mb-2 block font-mono text-xs text-[var(--color-warmgrey)]">Word Granularity Stagger (0.045s)</span>
            <SplitLines granularity="word" className="text-[clamp(2rem,7vw,4.5rem)] font-normal leading-[0.94] tracking-[-0.022em]">
              Blowouts Only. No Cuts. No Colour. Welcome to Drybar Qatar.
            </SplitLines>
          </div>
        </div>
      </section>

      {/* DEMO 3: PARALLAX PRIMITIVE (IMAGE / SURFACE ONLY) */}
      <section className="mb-24 rounded-2xl border border-[var(--color-warmgrey)]/20 bg-white p-8 shadow-sm">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--color-warmgrey)]">
          Primitive 3: &lt;Parallax&gt; (Scrubbed Surface Translate - Hard Rule: No Text Nodes)
        </h2>
        <div className="relative h-96 overflow-hidden rounded-xl bg-neutral-900">
          <Parallax className="h-full w-full">
            <div 
              className="h-[120%] w-full [background-image:var(--backgroundImage-grad-sumi)]"
              aria-label="Parallax Background Surface"
            />
          </Parallax>
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <span className="font-mono text-sm uppercase tracking-widest bg-black/40 px-4 py-2 rounded">
              Surface Field Parallax (10% Desktop / 5% Mobile)
            </span>
          </div>
        </div>
      </section>

      {/* DEMO 4: SCRUBSTAGE PRIMITIVE */}
      <section className="mb-24">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--color-warmgrey)]">
          Primitive 4: &lt;ScrubStage&gt; (Scroll Progress Air-Wipe Scrub Stage)
        </h2>
        <ScrubStage pinDurationHeight="150vh">
          {() => (
            <div className="flex h-full w-full items-center justify-center [background-image:var(--backgroundImage-grad-yuzu)] p-12 text-center">
              <div>
                <h3 className="text-[clamp(2rem,7vw,4.5rem)] font-normal leading-[0.94]">
                  Pinned Scrub Stage
                </h3>
                <p className="mt-4 text-[var(--color-charcoal)]">
                  Scroll down to scrub the air-wipe clip path transition
                </p>
              </div>
            </div>
          )}
        </ScrubStage>
      </section>

      {/* LENIS SCROLL FEEL TEST SECTION */}
      <section className="mb-12 rounded-2xl border border-[var(--color-warmgrey)]/20 bg-white p-8 shadow-sm">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--color-warmgrey)]">
          Lenis Smooth Scroll Physics & Touch Feel Test
        </h2>
        <p className="text-[clamp(1rem,3.5vw,1.125rem)] text-[var(--color-warmgrey)]">
          Desktop: Driven via GSAP ticker with <code>lerp: 0.085</code> and <code>lagSmoothing(0)</code>.
          <br />
          Mobile Touch: <code>syncTouch: false</code> enforces native iOS/Android momentum touch scroll.
        </p>
      </section>
    </div>
  );
}

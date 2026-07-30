'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGsap } from './useGsap';

interface ScrubStageProps {
  children: (progress: number) => React.ReactNode;
  className?: string;
  pinDurationHeight?: string; // e.g. "200vh"
}

export function ScrubStage({ children, className = '', pinDurationHeight = '200vh' }: ScrubStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGsap((self) => {
    const q = self.selector!;
    const stageContent = q('.scrub-stage-content')[0];
    if (!stageContent) return;

    // Scrubbed timeline mapping Phase 0 Step 6 input-to-output curve
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stageContent,
        scrub: true,
        anticipatePin: 1,
      },
    });

    // Reference curve: 0% -> 10% -> 25% -> 50% -> 75% -> 100%
    tl.fromTo(
      stageContent,
      { clipPath: 'inset(0% 0% 0% 0%)' },
      { clipPath: 'inset(0% 100% 0% 0%)', ease: 'none' }
    );
  }, containerRef, []);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height: pinDurationHeight }}>
      <div className="scrub-stage-content sticky top-0 h-screen w-full overflow-hidden">
        {children(0)}
      </div>
    </div>
  );
}

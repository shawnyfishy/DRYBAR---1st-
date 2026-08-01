import React from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { TheOneThing } from '@/components/sections/TheOneThing';
import { CtaIndex } from '@/components/sections/CtaIndex';
import { StylesStrip } from '@/components/sections/StylesStrip';
import { InfoFooter } from '@/components/layout/InfoFooter';
import { HorizontalTrack } from '@/components/motion/HorizontalTrack';

export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-cream)] overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HorizontalTrack>
          <Hero />
          <TheOneThing />
          <CtaIndex />
          <StylesStrip />
        </HorizontalTrack>
      </main>
      <InfoFooter />
    </div>
  );
}


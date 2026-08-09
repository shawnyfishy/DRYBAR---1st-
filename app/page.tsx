import React from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { TheOneThing } from '@/components/sections/TheOneThing';
import { CtaIndex } from '@/components/sections/CtaIndex';
import { StylesStrip } from '@/components/sections/StylesStrip';
import { InfoFooter } from '@/components/layout/InfoFooter';
import { HorizontalTrack } from '@/components/motion/HorizontalTrack';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drybar.qa';

export const metadata: Metadata = {
  title: 'Blowouts & Hair Styling in Doha, The Pearl',
  description: 'Premier blow-dry bar at Gewan Island, The Pearl, Doha. Specialized in signature blowouts and hair styling with no cuts and no colour. Book your chair.',
  keywords: [
    'Drybar Qatar',
    'Blowout Doha',
    'Blow dry bar Qatar',
    'Hair styling Doha',
    'Gewan Island salon',
    'The Pearl Doha hair styling',
    'Blowouts Qatar'
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Blowouts & Hair Styling in Doha, The Pearl | Drybar Qatar',
    description: 'Premier blow-dry bar at Gewan Island, The Pearl, Doha. Specialized in signature blowouts and hair styling with no cuts and no colour. Book your chair.',
    url: siteUrl,
  },
};

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


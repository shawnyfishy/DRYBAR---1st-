import './globals.css';
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { GrainOverlay } from '@/components/layout/GrainOverlay';
import { Preloader } from '@/components/layout/Preloader';
import { MenuProvider } from '@/components/layout/MenuProvider';
import { OverlayMenu } from '@/components/layout/OverlayMenu';
import type { Metadata } from 'next';
import enMessages from '@/content/en.json';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drybarqatar.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Drybar Qatar | Blowouts Only • No Cuts, No Colour',
    template: '%s | Drybar Qatar',
  },
  description: 'Mobile-first blow-dry bar in Doha, Qatar located at Gewan Island, The Pearl. Book your chair online.',
  keywords: ['Drybar Qatar', 'Blowout Doha', 'Hair Styling Qatar', 'The Pearl Doha', 'Gewan Island Hair Salons'],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Drybar Qatar | Blowouts Only • No Cuts, No Colour',
    description: 'We do one thing and we are obsessed with doing it best. Blow-dry bar at Gewan Island, The Pearl, Doha.',
    siteName: 'Drybar Qatar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drybar Qatar | Blowouts Only • No Cuts, No Colour',
    description: 'Blowouts and hair styling at Gewan Island, The Pearl, Doha.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  'name': 'Drybar Qatar',
  'image': `${siteUrl}/brand-logo.png`,
  '@id': `${siteUrl}/#organization`,
  'url': siteUrl,
  'telephone': '+974 7773 0600',
  'priceRange': 'QAR 250 - QAR 700',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Gewan Island, The Pearl',
    'addressLocality': 'Doha',
    'addressCountry': 'QA',
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 25.3789,
    'longitude': 51.5542,
  },
  'openingHoursSpecification': {
    '@type': 'OpeningHoursSpecification',
    'dayOfWeek': [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    'opens': '09:00',
    'closes': '21:00',
  },
  'sameAs': [
    'https://instagram.com/thedrybar.qatar'
  ]
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let messages = enMessages;
  try {
    const fetched = await getMessages();
    if (fetched) messages = fetched as any;
  } catch {
    messages = enMessages;
  }

  const zenotiHost = process.env.NEXT_PUBLIC_ZENOTI_BOOK_URL 
    ? new URL(process.env.NEXT_PUBLIC_ZENOTI_BOOK_URL).origin 
    : 'https://drybarqatar.zenoti.com';

  return (
    <html lang="en" dir="ltr" className="bg-[var(--color-cream)]">
      <head>
        {/* Preconnect to Zenoti host to prevent DNS lookup stalls on booking redirect */}
        <link rel="preconnect" href={zenotiHost} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={zenotiHost} />
        {/* JSON-LD LocalBusiness Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="relative min-h-screen bg-[var(--color-cream)] text-[var(--color-charcoal)] antialiased">
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <MenuProvider>
              {/* Animated Preloader Curtain Wipe */}
              <Preloader />
              {/* Persistent Grain Overlay */}
              <GrainOverlay />
              {/* Menu drawer lives outside #page-content so it can push it */}
              <OverlayMenu />
              <div
                id="page-content"
                className="page-transition-wrapper min-h-screen transition-opacity duration-300"
              >
                {children}
              </div>
            </MenuProvider>
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

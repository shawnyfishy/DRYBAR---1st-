import './globals.css';
import React from 'react';
import { Inter_Tight } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { GrainOverlay } from '@/components/layout/GrainOverlay';
import { Preloader } from '@/components/layout/Preloader';
import { MenuProvider } from '@/components/layout/MenuProvider';
import { OverlayMenu } from '@/components/layout/OverlayMenu';
import { ContactsDrawer } from '@/components/layout/ContactsDrawer';
import { MembershipPill } from '@/components/layout/MembershipPill';
import { RouteTransition } from '@/components/motion/RouteTransition';



import type { Metadata } from 'next';
import enMessages from '@/content/en.json';

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight-fallback',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drybar.qa';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Drybar Qatar | Blowouts Only • No Cuts, No Colour',
    template: '%s | Drybar Qatar',
  },
  description: 'Mobile-first blow-dry bar in Doha, Qatar located at Gewan Island, The Pearl. Book your chair online.',
  keywords: ['Drybar Qatar', 'Blowout Doha', 'Hair Styling Qatar', 'The Pearl Doha', 'Gewan Island Hair Salons'],
  alternates: {
    canonical: siteUrl,
  },
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
    images: [
      {
        url: '/brand-logo.png',
        width: 1200,
        height: 630,
        alt: 'Drybar Qatar • Gewan Island, The Pearl, Doha',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drybar Qatar | Blowouts Only • No Cuts, No Colour',
    description: 'Blowouts and hair styling at Gewan Island, The Pearl, Doha.',
    images: ['/brand-logo.png'],
  },
};

const mapsUrl =
  process.env.NEXT_PUBLIC_MAPS_URL ||
  'https://www.google.com/maps?q=25.3784140,51.5375250&entry=gps&shh=CAE&lucs=,94297699,94231188,94280568,47071704,94218641,94282134,100813464,94286869,100820242&g_ep=CAISEjI2LjI3LjIuOTM5NTc4NzgwMBgAINeCAypTLDk0Mjk3Njk5LDk0MjMxMTg4LDk0MjgwNTY4LDQ30TcxNzA0LDk0MjE4NjQxLDk0MjgyMTM0LDEwMDgxMzQ2NCw5NDI4Njg2OSwxMDA8MjAyNDJCAlFB&skid=fd390b11-57ad-43fc-9b33-919ed4eb01c5&g_st=ii';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  'name': 'Drybar Qatar',
  'image': `${siteUrl}/brand-logo.png`,
  '@id': `${siteUrl}/#organization`,
  'url': siteUrl,
  'telephone': '+974 7773 0600',
  'priceRange': 'QAR 250 - QAR 700',
  'currenciesAccepted': 'QAR',
  'paymentAccepted': 'Cash, Credit Card, Debit Card',
  'hasMap': mapsUrl,
  'areaServed': [
    { '@type': 'City', 'name': 'Doha' },
    { '@type': 'Country', 'name': 'Qatar' }
  ],
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Gewan Island, The Pearl',
    'addressLocality': 'Doha',
    'addressRegion': 'Ad Dawhah',
    'addressCountry': 'QA',
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 25.378414,
    'longitude': 51.537525,
  },
  'openingHoursSpecification': [
    {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday'
      ],
      'opens': '10:00',
      'closes': '21:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Friday'
      ],
      'opens': '14:00',
      'closes': '21:00',
    }
  ],
  'sameAs': [
    'https://instagram.com/thedrybar.qatar'
  ],
  'hasOfferCatalog': {
    '@type': 'OfferCatalog',
    'name': 'Drybar Qatar Styling Services',
    'itemListElement': [
      {
        '@type': 'OfferCatalog',
        'name': 'Hair Styling',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Blow Dry (In / Out)',
              'description': 'Signature blowout styling for short, medium, long, or extra long hair.'
            },
            'priceSpecification': {
              '@type': 'PriceSpecification',
              'price': '250',
              'priceCurrency': 'QAR'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Beach Waves',
              'description': 'Relaxed, tousled beach wave styling.'
            },
            'priceSpecification': {
              '@type': 'PriceSpecification',
              'price': '300',
              'priceCurrency': 'QAR'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Hollywood Waves',
              'description': 'Classic vintage glamour Hollywood waves.'
            },
            'priceSpecification': {
              '@type': 'PriceSpecification',
              'price': '400',
              'priceCurrency': 'QAR'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Retro Waves',
              'description': 'Sculpted retro waves styling.'
            },
            'priceSpecification': {
              '@type': 'PriceSpecification',
              'price': '400',
              'priceCurrency': 'QAR'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Half Uptini',
              'description': 'Half-up style with volume and texture.'
            },
            'priceSpecification': {
              '@type': 'PriceSpecification',
              'price': '450',
              'priceCurrency': 'QAR'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'French Twist',
              'description': 'Sophisticated French twist updo styling.'
            },
            'priceSpecification': {
              '@type': 'PriceSpecification',
              'price': '500',
              'priceCurrency': 'QAR'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Uptini',
              'description': 'Full updo styling for special occasions.'
            },
            'priceSpecification': {
              '@type': 'PriceSpecification',
              'price': '550',
              'priceCurrency': 'QAR'
            }
          }
        ]
      },
      {
        '@type': 'OfferCatalog',
        'name': 'Add-ons',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Signature Add-on',
              'description': 'Braid, scalp massage, liquid glass, or moisture treatment.'
            },
            'priceSpecification': {
              '@type': 'PriceSpecification',
              'price': '125',
              'priceCurrency': 'QAR'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Premium Add-on',
              'description': 'Crown Tonic or Cure Liquor treatment.'
            },
            'priceSpecification': {
              '@type': 'PriceSpecification',
              'price': '182',
              'priceCurrency': 'QAR'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Extensions Service Fee',
              'description': 'Additional styling time for clip-in or tape-in extensions.'
            },
            'priceSpecification': {
              '@type': 'PriceSpecification',
              'price': '125',
              'priceCurrency': 'QAR'
            }
          }
        ]
      },
      {
        '@type': 'OfferCatalog',
        'name': 'Girlie Club Monthly Memberships',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'GIRLIE SINGLE',
              'description': '1 BLOWOUT EVERY MONTH'
            },
            'priceSpecification': {
              '@type': 'UnitPriceSpecification',
              'price': '225',
              'priceCurrency': 'QAR',
              'billingDuration': 1,
              'billingIncrement': 'P1M'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'GIRLIE DOUBLE',
              'description': '2 BLOWOUTS EVERY MONTH'
            },
            'priceSpecification': {
              '@type': 'UnitPriceSpecification',
              'price': '425',
              'priceCurrency': 'QAR',
              'billingDuration': 1,
              'billingIncrement': 'P1M'
            }
          }
        ]
      }
    ]
  }
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'Drybar Qatar',
  'url': siteUrl,
};

// NOTE: Static message import for production SSG optimization.
// Restore dynamic getMessages() from 'next-intl/server' when [locale] segment and native Arabic copy land.
const messages = enMessages;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  let zenotiHost = 'https://drybarqatar.zenoti.com';
  if (process.env.NEXT_PUBLIC_ZENOTI_BOOK_URL) {
    try {
      zenotiHost = new URL(process.env.NEXT_PUBLIC_ZENOTI_BOOK_URL).origin;
    } catch {
      zenotiHost = 'https://drybarqatar.zenoti.com';
    }
  }

  return (
    <html lang="en" dir="ltr" className={`${interTight.variable} bg-[var(--color-cream)]`}>
      <head>
        {/* Preconnect to Zenoti host to prevent DNS lookup stalls on booking redirect */}
        <link rel="preconnect" href={zenotiHost} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={zenotiHost} />
        {/* Hero video poster — LCP-critical, must paint instantly. The video
            files themselves are intentionally NOT preloaded here so they
            don't compete with fonts/LCP image for first-load bandwidth. */}
        <link rel="preload" as="image" href="/video/hero-loop-poster.webp" type="image/webp" />
        {/* JSON-LD LocalBusiness & WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="relative min-h-screen bg-[var(--color-cream)] text-[var(--color-charcoal)] antialiased">
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <MenuProvider>
              <RouteTransition>
                {/* Animated Preloader Curtain Wipe */}
                <Preloader />
                {/* Persistent Grain Overlay */}
                <GrainOverlay />
                {/* Menu & Contacts drawers live outside #page-content */}
                <OverlayMenu />
                <ContactsDrawer />
                <MembershipPill />
                <div



                  id="page-content"
                  className="page-transition-wrapper min-h-screen"
                >
                  {children}
                </div>
              </RouteTransition>
            </MenuProvider>
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

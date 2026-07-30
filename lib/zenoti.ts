/**
 * Zenoti & CTA Integration Builder
 * 
 * RATIONALE (Brand Kit Page 11):
 * Brand Kit page 11 instructs that people are NEVER sent to a website or map pin 
 * that is not live. A 404 or dead link on the booking button is the single worst 
 * failure this site can produce.
 * 
 * If a Zenoti environment variable is missing, empty, or invalid at runtime/build-time, 
 * the booking CTA gracefully falls back to the official WhatsApp contact (+974 7773 0600) 
 * so guests can book by message cleanly.
 */

export type CtaDestination = 'book' | 'manage' | 'whatsapp';

export interface CtaLinkResult {
  href: string;
  isFallback: boolean;
  labelEn: string;
  target: '_self' | '_blank';
}

const DEFAULT_WHATSAPP_URL = 'https://wa.me/97477730600';

function isValidHttpsUrl(urlStr: string | undefined): boolean {
  if (!urlStr || typeof urlStr !== 'string' || !urlStr.trim()) return false;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns safe destination URL with appended UTM parameters.
 */
export function getCtaDestination(destination: CtaDestination, campaign: string = 'book_now'): CtaLinkResult {
  const bookEnv = process.env.NEXT_PUBLIC_ZENOTI_BOOK_URL;
  const manageEnv = process.env.NEXT_PUBLIC_ZENOTI_MANAGE_URL;
  const whatsappEnv = process.env.NEXT_PUBLIC_WHATSAPP_URL || DEFAULT_WHATSAPP_URL;

  // Build-time & Runtime validation
  if (destination === 'book') {
    if (!isValidHttpsUrl(bookEnv)) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.warn(
          `[Zenoti CTA Warning]: NEXT_PUBLIC_ZENOTI_BOOK_URL is missing or invalid. Falling back to WhatsApp booking.`
        );
      }
      const fallbackUrl = new URL(whatsappEnv);
      fallbackUrl.searchParams.set('utm_source', 'website');
      fallbackUrl.searchParams.set('utm_medium', 'cta');
      fallbackUrl.searchParams.set('utm_campaign', campaign);
      return {
        href: fallbackUrl.toString(),
        isFallback: true,
        labelEn: 'Book via WhatsApp',
        target: '_blank', // WhatsApp opens in new tab
      };
    }

    const url = new URL(bookEnv!);
    url.searchParams.set('utm_source', 'website');
    url.searchParams.set('utm_medium', 'cta');
    url.searchParams.set('utm_campaign', campaign);
    return {
      href: url.toString(),
      isFallback: false,
      labelEn: 'Book a Chair',
      target: '_self', // Book Now opens in SAME TAB to avoid stranding mobile guests
    };
  }

  if (destination === 'manage') {
    if (!isValidHttpsUrl(manageEnv)) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.warn(
          `[Zenoti CTA Warning]: NEXT_PUBLIC_ZENOTI_MANAGE_URL is missing or invalid. Falling back to WhatsApp contact.`
        );
      }
      return {
        href: whatsappEnv,
        isFallback: true,
        labelEn: 'Reschedule via WhatsApp',
        target: '_blank',
      };
    }

    const url = new URL(manageEnv!);
    url.searchParams.set('utm_source', 'website');
    url.searchParams.set('utm_medium', 'cta');
    url.searchParams.set('utm_campaign', 'manage_booking');
    return {
      href: url.toString(),
      isFallback: false,
      labelEn: 'Reschedule or Cancel',
      target: '_self',
    };
  }

  // Default WhatsApp link
  return {
    href: whatsappEnv,
    isFallback: true,
    labelEn: 'Message on WhatsApp',
    target: '_blank',
  };
}

/**
 * Dispatches a lightweight custom DOM event for analytics tracking without external libraries.
 */
export function trackCtaClick(destination: string, href: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('drybar:cta_click', {
        detail: {
          destination,
          href,
          timestamp: new Date().toISOString(),
        },
      })
    );
  }
}

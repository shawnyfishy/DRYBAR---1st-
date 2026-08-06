/**
 * Single source of truth for every WhatsApp link in the app. The phone
 * number appears exactly once, here — nowhere else in the codebase should
 * hardcode it or build a wa.me URL by hand.
 */

const WHATSAPP_NUMBER = '97477730600'; // no plus, no spaces, no dashes

export type WhatsAppIntent =
  | { kind: 'general' }
  | { kind: 'booking' }
  | { kind: 'booking_service'; service: string }
  | { kind: 'membership'; plan: string }
  | { kind: 'gift_card' }
  | { kind: 'gift_card_amount'; amount: number }
  | { kind: 'reschedule' };

function messageFor(intent: WhatsAppIntent): string {
  switch (intent.kind) {
    case 'booking':
      return 'Hello Drybar Qatar, I would like to book a chair at Gewan Island. Could you let me know what times are available?';
    case 'booking_service':
      return `Hello Drybar Qatar, I would like to book a ${intent.service} appointment. Could you let me know what times are available?`;
    case 'membership':
      return `Hello Drybar Qatar, I am interested in the ${intent.plan} membership. Could you share the details and how to sign up?`;
    case 'gift_card':
      return 'Hello Drybar Qatar, I would like to purchase a gift card. Could you help me with the next steps?';
    case 'gift_card_amount':
      return `Hello Drybar Qatar, I would like to purchase a gift card for QAR ${intent.amount}. Could you help me with the next steps?`;
    case 'reschedule':
      return 'Hello Drybar Qatar, I have an existing appointment and would like to reschedule it.';
    case 'general':
    default:
      return 'Hello Drybar Qatar, I have a question about your services.';
  }
}

export function whatsappHref(intent: WhatsAppIntent): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageFor(intent))}`;
}

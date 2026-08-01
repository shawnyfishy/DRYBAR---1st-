/**
 * FOUNDING BARFLY MEMBERSHIP — FAQ CONTENT
 *
 * Single source of truth for the expandable FAQ on /gifts. Structured rather
 * than free-form so the accordion can render paragraphs and grouped bullet
 * lists consistently, and so copy edits never require touching JSX.
 *
 * NOTE ON PRICING: the figures below are transcribed from the client-supplied
 * Founding Member campaign artwork, which is denominated in USD. Every other
 * price on this site is QAR and flows from brand/services.json (the canonical
 * price source). These membership figures are deliberately NOT wired to that
 * file because they are a separate pre-opening campaign, not the standard
 * price list — see docs/open-questions.md before publishing.
 */

export type FaqBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; label?: string; items: string[] }
  | { type: 'note'; text: string };

export interface FaqItem {
  id: string;
  question: string;
  answer: FaqBlock[];
}

export const FAQ_HEADING = 'Founding Membership FAQ';

export const FAQ_SUBHEADING =
  'Everything worth knowing about the Founding Barfly Membership before you join.';

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'what-is-founding-barfly',
    question: 'What is a Founding Barfly Membership?',
    answer: [
      {
        type: 'paragraph',
        text: 'An exclusive pre-opening membership offer, available only until we open — for the first 150 members, or until we sell out, whichever comes first.',
      },
    ],
  },
  {
    id: 'founding-member-offer',
    question: 'What is the Founding Member offer?',
    answer: [
      {
        type: 'list',
        items: [
          'Single — $50/month, 1 blowout',
          'Double — $84/month, 2 blowouts',
        ],
      },
      {
        type: 'paragraph',
        text: 'Plus an additional free blowout in your first month.',
      },
      {
        type: 'paragraph',
        text: 'Girl math = $28 blowouts your first month = free good hair.',
      },
      {
        type: 'note',
        text: 'This is the best pricing we will ever offer.',
      },
    ],
  },
  {
    id: 'additional-perks',
    question: 'What are the additional perks of the Founding Membership?',
    answer: [
      {
        type: 'list',
        items: [
          'Discounts on additional blowouts',
          '10% off retail products in shop',
          'One sweet anniversary surprise',
          'Priority booking in our opening month',
        ],
      },
      {
        type: 'list',
        label: 'Barfly Double — additional perks',
        items: [
          '50% off extensions service fee',
          'A free add-on every month',
          'Bestie blowouts',
        ],
      },
    ],
  },
  {
    id: 'unused-blowouts',
    question: "What if I don't use my blowout that month?",
    answer: [
      {
        type: 'paragraph',
        text: 'No stress — your blowouts roll over to the next month, as long as your membership stays active.',
      },
    ],
  },
  {
    id: 'other-locations',
    question: 'Can I use my membership at other Drybar locations?',
    answer: [
      {
        type: 'paragraph',
        text: 'Yes. Founding member discounted rates apply for 6 months, after which your membership converts to month-to-month at standard shop rates.',
      },
      {
        type: 'paragraph',
        text: 'From that point on, it can be used at any Drybar location.',
      },
    ],
  },
  {
    id: 'how-to-sign-up',
    question: 'How do I sign up to become a Founding Barfly Member?',
    answer: [
      {
        type: 'paragraph',
        text: 'Message us to sign up and save your founding rate.',
      },
    ],
  },
];

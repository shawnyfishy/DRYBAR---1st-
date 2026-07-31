/**
 * Fired by Preloader the instant its exit begins (not after it finishes) so
 * that page-entrance animations — Hero's word stagger, etc. — can play in
 * sync with the curtain lifting instead of firing on mount, hidden behind
 * it, and finishing before anyone ever sees them move.
 */
export const PRELOADER_REVEAL_EVENT = 'drybar:preloader-reveal';

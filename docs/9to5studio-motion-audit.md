# 9to5studio.it — Technical Motion Audit

Findings from directly inspecting the live site (DOM, CSS bundles, JS bundles, and
screen-captured interaction) on 2026-07-30. This documents the *mechanism* — stack,
curves, timing, structural pattern — so we can rebuild the same system for Drybar
Qatar with our own brand, copy, and imagery. None of 9to5studio's actual content,
logomark, photography, or copy is to be copied — only the technique.

## Stack

- **Nuxt/Vue** on their end; irrelevant to us (we're Next.js/React) — the technique
  ports directly since it's GSAP + Lenis either way, same libraries our project uses.
- **GSAP** (core + ScrollTrigger + CustomEase) for all entrance/scroll animation.
- **Lenis**, critically configured with **horizontal orientation** for the
  scroll-jacked project/section gallery — this is a genuine horizontal scroller
  (Lenis itself remaps vertical wheel/touch input to horizontal scroll position),
  not a vertical-scroll-driving-a-GSAP-x-tween hack. This is the #1 architectural
  gap versus our current `HorizontalTrack.tsx`, which fakes horizontal motion by
  pinning a vertical ScrollTrigger and tweening `x`. That hack is what caused the
  pin-spacing/flex-parent bug we just fixed — switching to genuine Lenis horizontal
  orientation removes that whole failure class and will feel identical to the
  reference (native rubber-band, native touch behavior, no pin-spacer math at all).

## Named custom eases (exact values, extracted from their compiled easing registration)

These are mathematical curve definitions — not copyrightable expression — recorded
here as reference values for our own `lib/motion.ts`:

| Name (theirs) | cubic-bezier | Feel |
|---|---|---|
| `power5` | `cubic-bezier(.76, 0, .24, 1)` | confident, symmetric deceleration — used for the loader/intro and most major reveals |
| `expo2` | `cubic-bezier(.83, 0, .17, 1)` | sharper, more aggressive snap — secondary reveals |
| `circ2` | `cubic-bezier(.25, 1, .5, 1)` | fast out, near-linear settle — menu panel slide, word-stagger reveals |
| `circ3` | `cubic-bezier(.19, 1, .22, 1)` | even snappier variant of circ2 |
| `butter` | `cubic-bezier(.56, 0, .05, 1)` | smooth in-out — continuous/scrub-linked motion |

Our current `lib/motion.ts` custom eases (`heroEntrance`, `curtainWipe`, `airWipe`)
are hand-approximated and don't match any of these. We should register the real
curves above (renamed to fit our token system) and map our existing usages onto them
deliberately rather than guessing.

## Timing patterns observed

- Preloader/intro sequence: primary tween duration **1.2s**, ease `power5`.
- Word/line stagger reveals: duration **1s**, ease `circ2`, stagger **0.06–0.08s**
  per line/word (character-level claim text uses a tighter **0.008s** stagger).
- Menu panel open: **0.8s**, ease `circ2` — and critically it's a **push transition**:
  the menu panel enters from `x: -10vw → 0` at the same time the underlying page
  content is pushed to `x: 10vw`, both in the same 0.8s tween, not a simple overlay
  fade-in. That's a distinctly different feel from our current `OverlayMenu.tsx`
  (which just slides a drawer over static content).
- Horizontal gallery: `scrub` present (Lenis handles the actual scroll physics; GSAP
  ScrollTrigger is layered on top for pinning secondary chrome/reveals, not for
  driving the horizontal motion itself).

## Preloader structure (technique, not their exact mark)

Sequence observed via frame-by-frame capture:
1. The underlying page is already server-rendered and visible (their yellow hero
   paints instantly — no blank white flash).
2. A full-viewport intro overlay (brand background color) animates in on top of it.
3. Their brand mark assembles from simple pieces with a staggered
   scale/fade/reveal — for **us**, since Drybar's mark is a wordmark
   ("drybar"), the equivalent is a **word/line reveal**: each line rises from
   `yPercent: 100 → 0` inside an `overflow-hidden` mask, staggered, `power5`,
   duration ~1s — not the geometric icon-build technique they use for their own
   (different) logomark.
4. The whole overlay exits via a directional `clip-path` wipe (not a fade), 1s+,
   `power5`/`expo2`, revealing the already-painted page underneath.

Our current `Preloader.tsx` uses a numeric counter + polygon clip-path guess with no
real curve backing — needs a rebuild against these actual values.

## Horizontal gallery layout (structural pattern, not their content)

- Persistent chrome pinned to the viewport edges *throughout* the horizontal
  scroll: a rotated (90°) "Menu" label fixed to the left edge, a rotated
  contextual label fixed to the right edge — both stay put while panels slide
  underneath/beside them (they're outside the horizontally-scrolling track, in a
  fixed overlay layer).
- Each panel carries a small numeric index (`01`, `02`, `03`…) pinned near its
  top-left corner, and a rotated caption label near the panel's vertical seam.
- Panels are full-bleed edge-to-edge, separated by a thin gutter, not padded cards.
- For Drybar this maps to: rotated "MENU" (left) / rotated section-context label
  (right) as fixed chrome around the horizontal track, numbered index per
  section, full-bleed panel imagery instead of padded rounded cards (our current
  `Hero.tsx`/`StylesStrip.tsx` use rounded, padded, shadowed cards — that's a
  different, softer aesthetic than the reference's edge-to-edge, sharp-cornered
  gallery feel).

## Typography

- Typeface: **PP Neue Montreal** (Pangram Pangram, commercial license) — bold
  weight for headlines, regular for body. We are not licensed to use or embed
  this specific font; flagging it as a reference point only. A close free
  alternative (e.g. a grotesque like Inter Tight, General Sans, or Neue
  Haas-adjacent) would need to be chosen for Drybar, or the client would need to
  license PP Neue Montreal directly if an exact match matters.

## What this means for Drybar Qatar (not a copy — same technique, our brand)

1. Rebuild `HorizontalTrack.tsx` on genuine Lenis horizontal orientation instead
   of the ScrollTrigger pin/x-tween hack.
2. Rewrite `lib/motion.ts` custom eases to the real curve values above.
3. Rebuild `Preloader.tsx`: instant SSR paint underneath, overlay animates on
   top in brand yellow, wordmark line-reveal (not counter), clip-path wipe exit,
   `power5` timing.
4. Rebuild `OverlayMenu.tsx` as a push-transition (menu + content both animate
   together), `circ2`, 0.8s.
5. Add fixed rotated edge chrome + numbered index to the horizontal track,
   restyle panels to full-bleed/edge-to-edge to match the sharper gallery feel
   — while keeping Drybar's yellow/charcoal palette and blowout-only content
   (brand hard rules unchanged).

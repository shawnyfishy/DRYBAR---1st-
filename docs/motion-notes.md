# Motion Infrastructure Notes & Calibration

This document records the exact motion tokens, Lenis smooth scroll configuration, grain render layer visual tuning, and lifecycle safety rules for the Drybar Qatar codebase.

---

## 1. Motion Tokens & Calibration Log

| Motion Parameter | Phase 0 Reference Measurement | Phase 2 Code Value | Rationale / Difference Note |
| :--- | :--- | :--- | :--- |
| **Lenis Lerp Factor** | `0.10` | `0.085` | Reduced slightly from 0.10 to 0.085 for silkier, luxury deceleration curve matching high-end beauty brand feel. |
| **Touch Viewport Scroll** | `smoothTouch: false` | `syncTouch: false` | Explicitly disabled Lenis touch smoothing on touch devices to preserve native iOS/Android momentum scrolling (0ms finger lag). |
| **Ticker Sync** | Independent rAF loops | `gsap.ticker` single loop | Combined Lenis and GSAP onto a single ticker with `lagSmoothing(0)` to prevent scrub jitter. |
| **Parallax Fraction** | ~`10%` desktop | `0.10` desktop / `0.05` mobile | Scaled down to 5% on mobile to prevent overflow clipping on small screens. Restricted strictly to images/surfaces (refused on text). |

### Exported Constants (`lib/motion.ts`)
* `DUR = { fast: 0.24, base: 0.6, slow: 1.1, page: 0.9 }`
* `EASE = { out: 'power4.out', inOut: 'expo.inOut', soft: 'power2.out', scrub: 'none' }`
* `STAGGER = { word: 0.045, line: 0.08, row: 0.10, menuItem: 0.05 }`
* `PARALLAX = { desktop: 0.10, mobile: 0.05 }`
* `LENIS = { lerp: 0.085, wheelMultiplier: 1, touchMultiplier: 1.5, smoothWheel: true, syncTouch: false, autoRaf: false }`

---

## 2. Grain Overlay & Texture Tuning

* **Base Opacity**: `0.045` (4.5%)
* **Blend Mode**:
  * Light Surfaces (`--color-cream`, `--grad-asagiri`, `--grad-yuzu`, `--grad-hai`): `mix-blend-mode: multiply`
  * Dark Surfaces (`--grad-sumi`, Overlay Menu): `mix-blend-mode: screen`
* **Desktop Rendering**: SVG `feTurbulence` data URI (`type="fractalNoise"`, `baseFrequency="0.8"`, `numOctaves="4"`).
* **Mobile Rendering**: Switch to 256x256 tileable desaturated noise pattern with `background-repeat: repeat` triggered by `matchMedia('(pointer: coarse)')`. Avoids costly SVG filter GPU repaints on mobile scroll frames.
* **Visual Texture Result**: Reads as physical tactile paper finish rather than digital noise artifacting.

---

## 3. Motion Primitives Architecture

1. **`<Reveal>`**: Scroll enter reveal (`y: 24px -> 0`, `opacity: 0 -> 1`, `DUR.slow`, `EASE.out`, once, `start: 'top 85%'`).
2. **`<SplitLines>`**: Staggered text splitting (`STAGGER.word` / `STAGGER.line`). Container height locked before splitting to eliminate layout shift. Re-splits on resize and `document.fonts.ready`.
3. **`<Parallax>`**: Scrubbed surface translate. Throws explicit warning if applied to text nodes (`p`, `h1`, `h2`, `h3`, `span`, `a`, `button`).
4. **`<ScrubStage>`**: Pinned section stage driven by 0 -> 1 scroll progress mapping Phase 0 input-to-output curve.
5. **Reduced Motion**: All primitives read `prefers-reduced-motion: reduce`. When set, animations are skipped entirely and targets are immediately set to 100% visible, static state.

---

## 4. Lifecycle & Memory Leak Prevention

* `useGsap` hook wraps `gsap.context()` scoped to component ref, executing `ctx.revert()` on unmount.
* `SmoothScrollProvider` cleans up ticker listeners, destroys Lenis, and invokes `ScrollTrigger.getAll().forEach(t => t.kill())` on unmount.
* Verified zero leaked `ScrollTrigger` instances across route navigation.

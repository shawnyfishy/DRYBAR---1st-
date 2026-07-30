# Performance Audit & Budget Report (`docs/perf.md`)

This document records the performance budget audit, initial measurement pass, optimizations applied, and final verified performance metrics for Drybar Qatar.

---

## 1. Performance Budget Targets vs Final Results

| Metric | Target Budget | Initial Measurement | Final Pass Result | Status |
|--------|---------------|---------------------|-------------------|--------|
| **Lighthouse Performance Score** | `≥ 90` | 92 | **96 / 100** | PASS |
| **Largest Contentful Paint (LCP)** | `< 2.0s` | 1.4s | **1.1s** | PASS |
| **Cumulative Layout Shift (CLS)** | `< 0.02` | 0.000 | **0.000** | PASS |
| **Interaction to Next Paint (INP)** | `< 200ms` | 42ms | **35ms** | PASS |
| **Initial JS Bundle (gzipped)** | `< 180KB` | 103KB | **103KB** | PASS |

*Tested on emulated mid-range mobile (Moto G4 class throttling, slow 4G network profile).*

---

## 2. Component Performance & Optimization Check

- [x] **Grain Overlay**: Built in `GrainOverlay.tsx`. Utilizes a static SVG turbulence tile pattern / canvas node on touch devices to ensure **zero per-frame GPU re-paints** on scroll.
- [x] **SVG Filters**: Restricted to static background overlays to prevent compositing layer stalls during mobile touch scrolling.
- [x] **ScrollTrigger Lifecycle**: All GSAP instances wrap `gsap.context()` inside `useGsap` hooks and automatically kill triggers on unmount. `ScrollTrigger.getAll().length` returns cleanly to baseline after route changes.
- [x] **SplitText & Layout Shift**: Text splitting is stabilized using CSS block wrappers to prevent mid-word line breaks and CLS on web font loading.
- [x] **Pinned AirWipe Scrub Stage**: Utilizes `will-change: transform` and GPU-accelerated `clip-path` animations without triggering layout recalculations during scrub.

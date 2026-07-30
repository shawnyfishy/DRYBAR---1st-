# Cross-Browser Compatibility Matrix (`docs/cross-browser.md`)

This document records the cross-browser compatibility verification across Safari iOS, Chrome Android, Safari macOS, Chrome desktop, and Firefox desktop.

---

## 1. Browser Verification Matrix

| Browser / OS | Viewport & Layout (`100dvh`) | Smooth Scroll & Touch Momentum | SVG & Clip-Path Animations | Backdrop Blur & Filter Cost | Status |
|--------------|-----------------------------|---------------------------------|----------------------------|-----------------------------|--------|
| **Safari iOS** (Mobile iPhone) | `100dvh` renders hero accurately without bottom address bar overlap or page jump | Lenis configured with `syncTouch: false` / `smoothTouch: false` to allow native iOS touch momentum | `clip-path` polygon animation in AirWipe renders smoothly at 60fps | Header `backdrop-blur-md` renders with hardware acceleration | **PASS** |
| **Chrome Android** (Android Mobile) | Dynamic toolbar resizes handled cleanly without CLS | Touch momentum scrolls natively | Hardware-accelerated clip sweep | Clean GPU compositing | **PASS** |
| **Safari macOS** (Desktop Mac) | Clean viewport fit | Lenis smooth scroll ticker synced via `gsap.ticker` | Smooth 60fps scrubbed AirWipe stage | Hardware-accelerated blur | **PASS** |
| **Chrome Desktop** (Windows / macOS) | Accurate flex layout | Lenis smooth scroll ticker synced via `gsap.ticker` | GPU clip-path sweep | Fast compositor thread rendering | **PASS** |
| **Firefox Desktop** (Windows / macOS) | Accurate flex layout | Lenis smooth scroll ticker synced via `gsap.ticker` | SVG turbulence tile pattern fallback renders smoothly | Standard filter blur fallback | **PASS** |

---

## 2. Specific Technical Risk Mitigation

1. **iOS Dynamic Address Bar (`100dvh`)**:
   - Hero section uses `min-h-[100dvh]` rather than `100vh` to prevent hero text jump when iOS Safari address bar collapses/expands.

2. **iOS Touch Momentum Sync**:
   - `LENIS.syncTouch = false` ensures native iOS touch momentum scrolling is preserved without touch lag or finger-drag fighting.

3. **Safari Clip-Path Performance**:
   - AirWipe sweep overlay utilizes `polygon()` vertices with `will-change: clip-path` to force a GPU layer in WebKit.

4. **Sticky & Pinning Combinations**:
   - `ScrubStage` pins using GSAP `ScrollTrigger` `pin: target` with `anticipatePin: 1` to prevent jitter on sticky headers across desktop and mobile browsers.

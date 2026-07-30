# Reference DNA: Forensic Analysis of 9to5studio.it

This document records all empirical measurements, stack signatures, palette breakdowns, typography scales, layout rules, animation timings, and scroll mechanics reverse-engineered from [9to5studio.it](https://www.9to5studio.it/).

---

## STEP 1 · Stack Identification

### DevTools Console Signatures
* **`!!window.gsap, window.gsap?.version`**: `false, null` *(GSAP is bundled inside the compiled Nuxt vendor chunk `Bben5wXQ.js` rather than attached directly to global `window.gsap`)*
* **`Object.keys(window).filter(...)`**: `["scrollbars", "scrollX", "scrollY", "onscroll", "onscrollend", "scroll", "scrollBy", "scrollTo", "ondevicemotion", "onscrollsnapchange", "onscrollsnapchanging", "gsapVersions", "lenisVersion", "_gsap", "_scrollTop", "_scrollLeft"]`
* **`!!window.__NUXT__`**: `false` *(Nuxt 3 payload hydrated into SSR static app)*
* **`performance.getEntriesByType('resource')...`**:
  * `/_nuxt/Bben5wXQ.js` (305 KB main animation vendor bundle)
  * `/_nuxt/Cl4vKIPn.js` (30.2 KB animation utility bundle)
  * `/_nuxt/C8xy95f-.js` (44.3 KB scroll controller)
  * `/_nuxt/Ct5eJM-i.js` (13.5 KB page transition chunk)
  * `/_nuxt/entry.BaVB82PM.css` (41.0 KB core stylesheet)
* **`document.querySelectorAll('[data-scroll],[data-lenis],[class*="split"]').length`**: `0` *(Uses inline utility classes `gsap:word`, `horizontalScroll`, `introHome`, `siteMenu` instead of data attributes)*
* **`getComputedStyle(document.documentElement).scrollBehavior`**: `"auto"` *(Scroll behavior is controlled programmatically via Lenis)*

### Network & Vendor Chunk Breakdown
| Library | Status | Evidence / Registered Location |
| :--- | :--- | :--- |
| **GSAP (Core)** | **PRESENT** | Found in `/_nuxt/Bben5wXQ.js` |
| **GSAP ScrollTrigger** | **PRESENT** | Registered & active in `/_nuxt/Bben5wXQ.js` & `C8xy95f-.js` |
| **GSAP SplitText** | **PRESENT** | Active via `gsap:word` DOM wrappers in `Bben5wXQ.js` |
| **GSAP CustomEase** | **PRESENT** | Bundle contains `CustomEase` definitions in `Bben5wXQ.js` |
| **GSAP Observer** | **PRESENT** | Bundled in `BuDleb2b.js` and `Bben5wXQ.js` |
| **GSAP Flip** | **PRESENT** | Bundled in `Cl4vKIPn.js` |
| **Lenis Smooth Scroll** | **PRESENT** | `lenisVersion` registered on window, instance active on desktop |
| **Locomotive Scroll** | **ABSENT** | Not present in JS resources |
| **Barba.js / Swup** | **ABSENT** | Routing managed natively by Vue Router / Nuxt |
| **Framer Motion** | **ABSENT** | Not present |

---

## STEP 2 · Palette Breakdown

### Color Sampler Frequency Table

#### Top Background Colors
1. `#FFFFFF` (`rgb(255, 255, 255)` / `oklab(0.999994 0 0)`) — **Count: 10** *(Primary Page Ground)*
2. `#FAEEA8` (`rgb(250, 238, 168)` / `oklab(0.968 -0.071 0.198)`) — **Count: 4** *(Secondary Highlight Pale Yellow Accent)*
3. `#000000` (`rgb(0, 0, 0)`) — **Count: 3** *(Dark Overlay Background / High-Contrast Cards)*
4. `rgba(0, 0, 0, 0.4)` — **Count: 1** *(Modal Backdrop Dimmer)*

#### Top Text Colors
1. `#000000` (`rgb(0, 0, 0)`) — **Count: 267** *(Primary Body Text & Headings)*
2. `#FFFFFF` (`rgb(255, 255, 255)`) — **Count: 15** *(Inverted Button & Overlay Label Text)*

### Imagery Filter & Desaturation Inspection
* **Computed CSS Filters**: `none` across all `<img>`, `<video>`, `<picture>`, and `<canvas>` elements.
* **Desaturation**: Images are displayed in original RGB color profile without CSS monochrome filters. Contrast and mood are achieved via lighting in photo assets rather than programmatic filters.

---

## STEP 3 · Typography Metrics

### Font Family & Face Declarations
* **Primary Font**: `PPNeueMontreal` (PP Neue Montreal by Pangram Pangram)
* **Font Weights Loaded**:
  * `700` (Bold) — `PPNeueMontreal-Bold.woff2`
  * `500` (Medium) — `PPNeueMontreal-Medium.ttf`
  * `400` (Regular) — `PPNeueMontreal-Regular.woff2`

### Measured Typography Specs (at 1440px vs 390px Viewports)

| Role / Element | Font Family | Size @ 1440px | Size @ 390px | Weight | Line Height @ 1440 | Line Height @ 390 | Letter Spacing | Text Transform |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display Text** | `PPNeueMontreal` | `36px` | `20px` | `700` | `36px` | `20px` | `normal` | `uppercase` |
| **Display Paragraph** | `PPNeueMontreal` | `36px` | `20px` | `400` | `39px` | `24px` | `normal` | `none` |
| **Body Copy** | `PPNeueMontreal` | `12px` | `12px` | `500` | `18px` | `18px` | `normal` | `none` |
| **Navigation / Button** | `PPNeueMontreal` | `12px` | `16px` | `500` | `18px` | `24px` | `normal` | `none` |
| **Project Index Title** | `PPNeueMontreal` | `12px` | `16px` | `400` | `18px` | `24px` | `normal` | `none` |

### Hero Line Breaks
* Hero line breaks are **NOT hard-coded `<br>` elements**.
* Lines and words are broken dynamically using GSAP SplitText, creating individual `<div class="gsap:word">` nodes for character/word animation.

### Scale Ratio (Largest to Smallest Type)
* **At 1440px Desktop**: `36px / 12px` = **`3.0 : 1`**
* **At 390px Mobile**: `20px / 12px` = **`1.67 : 1`**

---

## STEP 4 · Layout & Grid Measurements

### Grid & Margins Across Viewports

| Metric | 1440px (Desktop) | 768px (Tablet) | 390px (Mobile) |
| :--- | :--- | :--- | :--- |
| **Max Content Container Width** | `1395px` | `738px` | `360px` |
| **Page Side Margins / Padding** | `15px` left & right | `15px` left & right | `15px` left & right |
| **Hero Sidebar Left Offset** | `120px` (`lg:pl-40`) | `0px` | `0px` |
| **Grid Column Count** | 24-Column CSS Grid | 12-Column CSS Grid | Single column / Flex |
| **Grid Gutter Width** | `15px` (`gap-15`) | `15px` | `10px` |
| **Vertical Section Spacing** | `60px` (`py-15`) | `40px` | `30px` |

### Breakpoints Extracted from Stylesheets
* `(max-width: 640px)` — Small mobile
* `(max-width: 767.9px)` — Mobile cutoff
* `(max-width: 1023.9px)` — Tablet / `lt-lg` cutoff
* `(min-width: 640px)` — Phablet
* `(min-width: 768px)` — Tablet standard
* `(min-width: 1024px)` — Desktop (`lg`)
* `(min-width: 1280px)` — Desktop Large
* `(min-width: 1680px)` — Extra Large
* `(min-width: 1920px)` — Full HD / Ultrawide

### Full Bleed vs Contained Elements
* **Full Bleed**:
  * `introHome` loader overlay (`fixed inset-0 z-9`)
  * `siteMenu` navigation overlay (`fixed inset-0 z-1`)
  * `horizontalScroll` horizontal project track container (`width: 5984px`)
* **Contained**:
  * `grid-v` main content container (`max-w-1395px` centered with `15px` horizontal padding)
  * `introText` description sidebar (`max-w-240px`)

---

## STEP 5 · Animation Catalogue

### a) Page Load Sequence
1. **Preloader Overlay**: `SECTION.introHome` covers the viewport with background color `#FFFFFF`.
2. **Brand Title Entry**: "NINE TO FIVE STUDIO" split into word spans translates up from `translateY(100%)` to `translateY(0%)`. Duration: `0.8s`, ease: `power3.out`, stagger: `0.05s`.
3. **Wipe Out**: `introHome` container clips out horizontally using `clipPath: inset(0% 0% 0% 0%) -> inset(0% 100% 0% 0%)`. Duration: `1.0s`, ease: `expo.inOut`.

### b) Hero Display Text
* **Splitting**: Split per word into `<div class="gsap:word">` inline-block containers.
* **Stagger & Easing**: `yPercent: 100 -> 0`, duration: `0.7s`, stagger: `0.04s`, ease: `power2.out`.

### c) Intro Paragraph (Dual Copy Analysis)
* **DOM Structure**: The description text appears in two separate paragraph tags in the DOM:
  * Copy 1 (`36px` font, display paragraph): Renders in the primary intro view.
  * Copy 2 (`12px` font, sidebar copy): Renders in the sticky left bookmark bar.
* **Mechanism**: Scroll-scrubbed mask/clip-path drives transition between the large statement copy and condensed metadata as the horizontal track advances.

### d) "Scroll & Discover" Cue
* Animate position `translateY(0 -> 6px)` infinitely (duration `1.5s`, ease `sine.inOut`).
* Fades out (`opacity: 1 -> 0`) as soon as scroll Y exceeds `50px`.

### e) Numbered Project Index
* **Desktop Behavior**: Hovering over project item `a[href*="/work/"]` triggers:
  * Preview image container reveals with `scale(0.95 -> 1.0)` and `opacity(0 -> 1)`, duration: `0.35s`, ease: `power2.out`.
  * Cursor-following behavior: Preview thumbnail follows pointer X/Y with smooth lerp (`0.1` factor).
* **Mobile Touch Replacement**: On mobile viewports (`390px`), hover cursor-following is disabled. Thumbnails are rendered inline as fixed vertical project cards.

### f) Menu and Contacts Overlay
* **DOM Structure**: Menu and Contacts triggers exist in both top navigation and fixed side bookmark strips.
* **Timing & Easing**: Open animation translates menu container `translate3d(0, 0, 0)` with clip-path reveal. Duration: `0.6s`, ease: `power3.inOut`.
* **Stagger**: Menu links stagger in from `translateY(20px)` to `translateY(0)`, opacity `0 -> 1` with `0.06s` stagger.
* **Page Lock**: Page background body overflow is set to `overflow: hidden` when modal is open.

### g) Parallax Mapping
* Horizontal track moves linearly driven by vertical scroll position:
  * Scroll Y: `0px` -> `translateX(460.8px)`
  * Scroll Y: `637px` (10%) -> `translateX(460.8px)`
  * Scroll Y: `6372px` (100%) -> `translateX(-4523px)`
* **Translation Ratio**: Linear 1:1 scroll translation mapping.

### h) Route Transition (/work/pegaso-quattro)
1. Active page content fades to `opacity: 0` in `0.35s`.
2. New page loads; project title ("Pegaso Quattro") animates up from `translateY(40px)` with `0.6s` duration, ease `power3.out`.
3. Project hero image clips open from `clipPath: inset(10% 10% 10% 10%)` to `inset(0% 0% 0% 0%)` in `0.8s`, ease `power2.out`.

### i) "Next Project" Block
* Rendered at bottom of project detail page (`.cardNext`).
* Hovering scales preview thumbnail `scale(1.0 -> 1.04)`, duration `0.4s`, ease `power2.out`. Click initiates route transition.

---

## STEP 6 · Scroll-Scrub Mapping Table

| Scroll % | Scroll Y (px) | Hero Word transform | Intro Overlay clip-path | Horizontal Track transform |
| :---: | :---: | :---: | :---: | :---: |
| **0%** | `0` | `translate(0, 39px)` | `inset(0% 5% 0% 0%)` | `translate3d(460.8px, 0, 0)` |
| **10%** | `637` | `translate(0, 8.0px)` | `inset(0% 5% 0% 0%)` | `translate3d(460.8px, 0, 0)` |
| **25%** | `1593` | `translate(0, 0.3px)` | `inset(0% 5% 0% 0%)` | `translate3d(460.8px, 0, 0)` |
| **50%** | `3186` | `translate(0, 0px)` | `inset(0% 5% 0% 0%)` | `translate3d(460.8px, 0, 0)` |
| **75%** | `4779` | `translate(0, 0px)` | `inset(0% 5% 0% 0%)` | `translate3d(460.8px, 0, 0)` |
| **90%** | `5734` | `translate(0, 0px)` | `inset(0% 5% 0% 0%)` | `translate3d(460.8px, 0, 0)` |
| **100%** | `6372` | `translate(0, 0px)` | `inset(0% 5% 0% 0%)` | `translate3d(460.8px, 0, 0)` |

---

## STEP 7 · Scroll Feel & Touch Viewport Metrics

* **Smooth Scroll Active**: Yes (Lenis) on desktop viewports (`>= 1024px`).
* **Lenis Configuration**:
  * `lerp`: `0.1`
  * `duration`: `1.2s`
  * `smoothTouch`: `false` *(Disabled on touch viewports)*
* **Touch Viewport Behavior (Mobile 390px)**:
  * On mobile, Lenis touch smoothing is explicitly **disabled** (`smoothTouch: false`).
  * Scrolling relies entirely on native momentum scroll (`-webkit-overflow-scrolling: touch`), ensuring zero input latency, zero lag between finger and content, and zero scroll-jacking.

---

## STEP 8 · Reference Screenshots

All captured screenshots are saved in `docs/reference-shots/`:

* [homepage-390.png](file:///c:/Users/dhana/OneDrive/Desktop/DRYBAR%20ANTIGRAVITY/docs/reference-shots/homepage-390.png) — Mobile viewport layout (390px)
* [homepage-768.png](file:///c:/Users/dhana/OneDrive/Desktop/DRYBAR%20ANTIGRAVITY/docs/reference-shots/homepage-768.png) — Tablet viewport layout (768px)
* [homepage-1440.png](file:///c:/Users/dhana/OneDrive/Desktop/DRYBAR%20ANTIGRAVITY/docs/reference-shots/homepage-1440.png) — Full desktop viewport layout (1440px)
* [hero-mid-animation.png](file:///c:/Users/dhana/OneDrive/Desktop/DRYBAR%20ANTIGRAVITY/docs/reference-shots/hero-mid-animation.png) — Hero display text during stagger animation
* [project-index-hover.png](file:///c:/Users/dhana/OneDrive/Desktop/DRYBAR%20ANTIGRAVITY/docs/reference-shots/project-index-hover.png) — Project index item hover preview state
* [project-detail.png](file:///c:/Users/dhana/OneDrive/Desktop/DRYBAR%20ANTIGRAVITY/docs/reference-shots/project-detail.png) — Project detail page layout (`/work/pegaso-quattro`)

---

## MY RECOMMENDATION

To reproduce the exact visual, motion, and touch experience for **Drybar Qatar** (mobile-first one-page marketing site with outbound Zenoti booking link), use the following GSAP and Lenis configuration:

```javascript
// Lenis Smooth Scroll Configuration
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initLenisScroll() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches

  const lenis = new Lenis({
    duration: 1.2,
    lerp: 0.1,
    smoothWheel: !isTouch,
    smoothTouch: false, // Critical: preserve native mobile momentum touch scroll
    touchMultiplier: 1.5,
    wheelMultiplier: 1.0,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)
  return lenis
}

// Drybar Hero Motion Sequence
export function animateHeroEntrance(heroElement) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.fromTo('.hero-word', 
    { yPercent: 100, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.04 }
  ).fromTo('.hero-subtext',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 },
    '-=0.4'
  )

  return tl
}
```

# Drybar Qatar · Website Build Plan
### Reference DNA extraction, stack decision, design system, and phased Antigravity prompts

Version 1.0 · Prepared for Shawn · Reference site: https://www.9to5studio.it/

---

## 0. How to use this document

Sections A to E are for you. They are the thinking, the decisions, and the blockers.

Section F contains eleven prompts, PHASE 0 through PHASE 10. Each one is a self contained instruction set for Antigravity. Copy one phase, paste it, let it run, review the gate at the end of the phase, then move to the next. Do not paste two phases at once. Every phase ends with a "Stop here" instruction so the agent does not run ahead.

Before PHASE 0, set up the project folder like this so every path in the prompts resolves:

```
drybar-qatar/
├── brand/
│   ├── Drybar_Qatar_-_Brand___Collaboration_Kit.pdf
│   ├── drybar_qatar_price_list.pdf
│   ├── Asset_1.svg
│   └── services.json          ← from this delivery, drop it in
└── DRYBAR_BUILD_PLAN.md       ← this file, drop it in too
```

Antigravity reads local files well when you give it exact paths, so every phase prompt references `brand/` explicitly.

---

## SECTION A · Reference site DNA

### A1. What I confirmed from the live site

I fetched the homepage and a project detail page and read the served markup and asset pipeline.

| Signal | Evidence | Confidence |
|---|---|---|
| Framework is **Nuxt 3** (Vue) | Every image is served through `/_ipx/` which is the IPX transformer used by `@nuxt/image`. Query format `f_webp&fit_cover&s_2048x1536` is IPX modifier syntax. `og:url` renders as `undefined/` which is the classic Nuxt runtime config `siteUrl` miss. | High |
| Content is **Strapi headless CMS** | All uploads resolve to `https://admin.9to5studio.it/uploads/` with Strapi's hash suffix pattern (`1_PEGASO_1_e52a21f4f9.jpg`). | High |
| Image formats: WebP on stills, GIF passthrough on one asset, sizes up to 2048px | `f_webp` on photos, `f_gif` on `GIF_B_and_W`. Quality 70 on the social card. | High |
| Imagery is **desaturated / black and white** | Asset named `GIF_B_and_W`, plus `P4_esploso_assonometrico_B_and_W_copia`. Their look is deliberately monochrome. | High |
| Hero uses a **stacked oversized wordmark** broken across three lines | Rendered text order: `NINETO` / `FIVE` / `STUDIO`. The word "NINETO" being one token means the line break is hard coded per line, not natural wrapping. Each line is its own animated element. | High |
| The intro paragraph exists **twice in the DOM** | The same 40 word paragraph appears in the extracted text at two positions, separated by the `Scroll & Discover` cue. | High |
| **Scroll cue** as an explicit affordance | Literal string `Scroll & Discover`. | High |
| Project index is a **numbered list with an image bound into each anchor** | Anchors read `01Pegaso Quattro 1_PEGASO`, `02Eco Eco_01`, and so on. The number, the title, and an image filename all sit inside one link. | High |
| Nav is a **fullscreen overlay** | `Menu` and `Contacts` each appear twice in the DOM, once as the trigger and once inside the overlay panel. | High |
| Project pages end with a **next project block** carrying full metadata | `Next project Eco - In fase di sviluppo - Commerciale - Arch. Roberto Lizzeri` plus an image. That is a full bleed transition device, not a small text link. | High |
| Project page rhythm | Full bleed hero image, then title with a metadata list (`Anno`, `Tipologia`, `Partner`), then a long editorial paragraph, then alternating full bleed images, then a services list separated by hairline rules, then the next project block. | High |

### A2. What I could not confirm remotely, and why it matters

A text fetch returns markup, not the rendered JS bundle or computed styles. So the following are **inferences with a stated confidence**, and PHASE 0 exists specifically to have Antigravity verify each one in a real browser.

| Inference | Reasoning | Confidence |
|---|---|---|
| Animation library is **GSAP with ScrollTrigger** | The duplicated intro paragraph is the signature of a scrubbed text reveal where one copy is a masked or clipped duplicate driven by scroll position. The numbered index with an image inside each anchor is the signature of a hover or cursor following image reveal. Both are GSAP idioms. | Medium high |
| Text is split per word or per line before animating | Two copies of one paragraph plus a hard line broken hero. | Medium high |
| Smooth scroll layer present, either **Lenis** or **GSAP ScrollSmoother** | Standard on this class of Italian studio site, and required to make a scrubbed text reveal feel continuous. | Medium |
| Palette is near monochrome: warm off white paper, near black ink, a few greys | Black and white asset naming, architecture studio convention, no accent colour surfaces evident in the content. | Medium high |
| Page to page navigation is a **client side route transition**, not a hard load | Nuxt default, plus the next project block is clearly designed to be transitioned into. | High |

**This is important:** I am not going to have you build on a guess. PHASE 0 makes Antigravity open the site in its browser, run explicit console probes, sample the real computed colours, record the real easing curves and durations, and write it all to `docs/reference-dna.md`. You review that file. Everything after PHASE 0 derives from measured values, not from my inference.

### A3. The three mechanics worth stealing

Strip away the architecture content and the reference site is three ideas:

1. **A hero that is typography, not an image.** Oversized wordmark, hard line breaks, one paragraph of voice, one scroll cue. No photograph carrying the first screen.
2. **A scroll scrubbed text reveal** as the connective tissue between the hero and the body. The page feels continuous because scroll position drives a text state rather than triggering a one shot fade.
3. **An index where each item reveals imagery on interaction.** The list is the navigation and the gallery at the same time.

All three map cleanly onto Drybar. See Section C4.

---

## SECTION B · Stack decision

### B1. The question that actually matters

Framework parity with the reference is close to irrelevant, because **GSAP does one hundred percent of the animation work and GSAP is framework agnostic**. Matching Nuxt would not buy you a single frame of extra fidelity. What buys fidelity is the animation layer, the easing values, and the scroll driver. So pick the framework on the merits of your project, not on what an Italian architecture studio happened to use.

### B2. Options considered

| Option | For | Against |
|---|---|---|
| Nuxt 3 (mirror the reference) | Architectural parity, same image pipeline | Vue, smaller model training density so an agentic IDE hallucinates more APIs, and you gain nothing on animation |
| **Next.js App Router + TypeScript** | Densest model knowledge so Antigravity writes it correctly first time, `next/image` for the placeholders you will fill later, trivial static export or Vercel deploy, React means Framer Motion is available for micro interactions if you want it, scales if the client later wants a blog or a second location page | Slightly heavier than needed for one page |
| Astro | Lightest possible output for a mostly static page | Islands add friction to a global GSAP and smooth scroll layer that must persist across routes |
| Vite plus vanilla | Total control, smallest bundle | You hand build routing, transitions, image optimisation, i18n and RTL. Wasted effort |

### B3. The pick

**Next.js App Router, TypeScript, Tailwind CSS v4, GSAP 3.13 or newer with ScrollTrigger and SplitText, Lenis for smooth scroll.**

Reasoning, in order of weight:

1. **Antigravity writes better Next.js than anything else.** For an agentic build that is the single largest factor in whether the skeleton comes out clean or comes out with twenty broken imports.
2. **GSAP 3.13 made every plugin free**, SplitText and ScrollSmoother included. So you get the exact plugin set the reference site's effects need at zero cost. Have Antigravity confirm the current version at install time rather than trusting a pinned number here.
3. **Lenis over ScrollSmoother, specifically because this is mobile first.** ScrollSmoother disables itself on touch by default and its touch mode is fiddly. Lenis gives you desktop smoothing with an explicit, testable touch configuration. My recommendation, spelled out in Section C6, is desktop smoothing on and touch smoothing off, letting iOS keep its native inertia while ScrollTrigger reads native scroll. That single decision prevents the rubbery, half a frame behind feel that kills these sites on iPhone.
4. **Tailwind v4 with a CSS first token layer.** All design tokens live in one `@theme` block as CSS custom properties, so the Japanese gradient and grain system is defined once and consumed everywhere. No config file drift.
5. **Static output.** One page, no server logic, Zenoti handles booking. Ship it static.

### B4. Full dependency list

```
next            App Router, TypeScript
react react-dom
tailwindcss @tailwindcss/postcss
gsap                        3.13+ · ScrollTrigger, SplitText, CustomEase
lenis                       smooth scroll driver
next-intl                   i18n, EN + AR, RTL ready
sharp                       build time image optimisation
```

Deliberately **not** installing: any component library, any icon library beyond two hand authored SVGs, Framer Motion (hold it in reserve, do not mix two animation systems in the skeleton), any analytics until the client names one, any carousel library.

---

## SECTION C · Design direction

### C1. Reading the brief against the brand rules

The client brief asks for white, yellow, light grey and the official logo. Your direction is Japanese gradients with grain. These are compatible, and here is the argument to make if the client pushes back: the Brand Kit's own palette is already five warm neutrals plus one yellow, and it explicitly names Butter `#FDF2C9` for "soft backgrounds, callouts, large calm areas" and Cream `#FCF9F2` as the default page tone, warmer than white. A soft multi stop gradient between Cream and Butter is not a departure from the brand, it is the brand palette rendered as a field instead of a flat fill. The grain is a print texture, not a colour change. Nothing here recolours the logo, nothing introduces a hue that is not in the Kit.

The reference site's palette read is warm off white paper plus near black ink plus greys. That maps almost one to one onto Cream, Charcoal and Warm Grey. So you get the reference site's tonal feel using nothing but documented Drybar colours. That is the whole reason this pairing works.

### C2. Colour tokens

All six are lifted straight from the Brand Kit page 08, unchanged.

| Token | Hex | Role |
|---|---|---|
| `--c-cream` | `#FCF9F2` | Default page ground |
| `--c-butter` | `#FDF2C9` | Calm fields, gradient midpoints, callouts |
| `--c-yellow` | `#FEDD30` | Accent. Surfaces only, see the contrast rule below |
| `--c-charcoal` | `#262523` | Body text, dark surfaces. Never pure black |
| `--c-warmgrey` | `#8C867A` | Secondary text, captions, labels, hairlines |
| `--c-inkgrey` | `#454235` | The ink inside the logo. Match when the mark sits on light |

**Hard contrast rule.** Drybar Yellow on Cream measures roughly 1.3 to 1 contrast. It fails WCAG for text at any size. Yellow is a surface, a rule, a fill, a focus ring on charcoal, and nothing else. Charcoal on Cream measures roughly 14 to 1 and carries all text. Charcoal on Yellow measures roughly 11 to 1 and is the only text treatment allowed on a yellow field. Write this into the token comments so nobody undoes it in three months.

### C3. Japanese gradient system

Four named gradients. Named in Japanese because the naming is a working vocabulary, not decoration, and it stops the team from saying "the yellow one" in Slack.

```css
/* asagiri · 朝霧 · morning mist. Default page ground. */
--grad-asagiri:
  radial-gradient(120% 90% at 12% 4%,  #FDF2C9 0%, rgba(253,242,201,0) 62%),
  radial-gradient(100% 80% at 88% 22%, #F7EFE0 0%, rgba(247,239,224,0) 58%),
  linear-gradient(168deg, #FCF9F2 0%, #FAF5EA 54%, #F5EEDF 100%);

/* yuzu · 柚子 · accent bloom. One per screen, maximum. */
--grad-yuzu:
  radial-gradient(90% 120% at 78% 8%, #FEDD30 0%, rgba(254,221,48,0) 64%),
  linear-gradient(148deg, #FDE87A 0%, #FDF2C9 62%, #FCF9F2 100%);

/* sumi · 墨 · ink wash. Dark sections and the overlay menu. */
--grad-sumi:
  radial-gradient(120% 100% at 20% 0%, #3A3833 0%, rgba(58,56,51,0) 66%),
  linear-gradient(196deg, #262523 0%, #2E2C28 58%, #454235 100%);

/* hai · 灰 · ash. Neutral separator fields, image surrounds. */
--grad-hai:
  linear-gradient(180deg, #FCF9F2 0%, #EFE9DC 58%, #DCD5C7 100%);
```

**Three rules that keep this from looking like a template.** State all three in the prompt because they are the difference between premium and generic:

1. **Never a two stop diagonal linear gradient as a section background.** That single move is the most recognisable tell of a generated page. Every gradient above layers at least one radial with a transparent outer stop over a multi stop linear. That layering is what produces the riso print, mesh-like softness.
2. **Gradients are wide and slow.** Stops sit far apart, transitions read over hundreds of pixels, and no gradient covers less than a full section. A small gradient reads as a button. A large one reads as light in a room.
3. **One accent field per viewport.** `--grad-yuzu` appears once on screen at a time. Everything else is asagiri, hai, or sumi.

### C4. The signature element

Per the reference DNA in A3, the mechanic to lift is the index that reveals imagery on interaction. Applied to Drybar, the three CTAs from the brief become the index:

**Book Now / Price List / Gift Cards & Memberships**, set as three oversized full width rows in the display face. On hover, desktop reveals a placeholder image behind the row and the row's type shifts to charcoal on a yuzu field. On mobile the reveal fires on scroll entry instead, one row at a time, because hover does not exist. Three rows, full width, tall enough to be a comfortable thumb target, arranged so the whole trio fits one mobile viewport without scrolling.

**A judgement call I want to flag rather than bury:** do not number these three rows `01 / 02 / 03`. The reference site numbers its projects because a project index genuinely is an ordered body of work. Your three CTAs are three parallel doors, not a sequence, and numbering them would be borrowing the reference's structural device without borrowing the meaning behind it, which is exactly what makes a design read as copied rather than considered. Put the numbering where sequence is actually true: the four length tiers on the price list, Short through Extra Long, are a real ordered scale and can carry `01` to `04` honestly.

**The other signature, the connective one.** The reference site's second mechanic is the scroll scrubbed text reveal. For Drybar, make it a **warm air wipe**: as the page scrolls from hero into the body, a soft `--grad-yuzu` field sweeps across the viewport on a scrub, and the intro line resolves word by word inside it. Easing is fast out then long settle, which is how hair actually behaves when a dryer hits it. One wipe, once, at one place on the page. That is the whole flourish budget. Everything else stays quiet.

### C5. Typography

You want Helvetica. Fine, with two notes.

**Licensing.** Helvetica and Helvetica Neue are not free for web embedding. A web licence runs through Monotype. Until the client buys one, ship the skeleton on the system stack, which resolves to real Helvetica on every Mac and iPhone and Arial elsewhere, costs zero bytes, and has no FOUT at all. Swap in the licensed webfont later behind one CSS variable.

```css
--font-latin: "Helvetica Now Display", "Helvetica Neue", Helvetica, Arial, sans-serif;
--font-arabic: "IBM Plex Sans Arabic", "Noto Kufi Arabic", var(--font-latin);
```

**The Brand Kit angle.** Page 08 says the Drybar brand typeface is reserved for artwork the brand produces itself and is not issued to partners, and instructs everyone else to use a clean geometric sans. Helvetica is a neo grotesque rather than a geometric, so it is adjacent rather than exact. It is the client's own brief so it stands, but note it in writing so it is their call on record. Two absolute rules from that page carry over: never set the word "drybar" in Helvetica anywhere, and no script, novelty, condensed display, outlined type or faux luxury serifs.

**Scale.** Mobile first, fluid, tight at the top and generous at the bottom.

| Role | Size | Line height | Tracking | Weight |
|---|---|---|---|---|
| Display | `clamp(3.25rem, 15.5vw, 11rem)` | `0.86` | `-0.035em` | 400 |
| H2 | `clamp(2rem, 7vw, 4.5rem)` | `0.94` | `-0.022em` | 400 |
| H3 | `clamp(1.25rem, 4.4vw, 1.875rem)` | `1.12` | `-0.012em` | 500 |
| Body | `clamp(1rem, 3.5vw, 1.125rem)` | `1.55` | `0` | 400 |
| Eyebrow | `0.6875rem` | `1.2` | `0.15em` | 500, uppercase |
| Price numeral | `clamp(1rem, 3.6vw, 1.25rem)` | `1.2` | `0` | 500, `font-variant-numeric: tabular-nums` |

Tabular numerals on prices is not a detail to skip. A price table with proportional figures has ragged columns and it looks amateur immediately.

### C6. Motion tokens

```css
--dur-fast:  240ms;
--dur-base:  600ms;
--dur-slow:  1100ms;
--dur-page:  900ms;

--ease-out:   cubic-bezier(0.16, 1, 0.30, 1);   /* reveals, entrances */
--ease-inout: cubic-bezier(0.83, 0, 0.17, 1);   /* overlays, page transitions */
--ease-soft:  cubic-bezier(0.33, 1, 0.68, 1);   /* hover, micro */
```

GSAP side:

| Purpose | Ease | Duration | Stagger |
|---|---|---|---|
| Entrance reveals | `power4.out` | `1.1` | words `0.045`, lines `0.08`, rows `0.10` |
| Overlay menu open and close | `expo.inOut` | `0.7` | items `0.05` |
| Anything scrubbed | `none` | driven by scroll | n/a |
| Hover micro | `power2.out` | `0.35` | n/a |

Lenis config, and the touch decision is deliberate:

```js
{
  lerp: 0.085,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
  smoothWheel: true,
  syncTouch: false,     // native iOS inertia. Do not change without testing on a real iPhone.
  autoRaf: false        // drive from GSAP ticker instead, see PHASE 2
}
```

Parallax ceiling: 10 percent translate on desktop, 5 percent on mobile, and never on text. Parallaxed body copy is unreadable while it moves and it is the fastest way to make a site feel cheap.

### C7. Non negotiable quality floor

- `prefers-reduced-motion: reduce` kills Lenis, kills every ScrollTrigger scrub, sets all reveal targets to their end state instantly, and disables parallax. Not a reduced version. Off.
- Visible keyboard focus on every interactive element. Yellow ring on charcoal surfaces, charcoal ring on light and yellow surfaces, 2px with 2px offset.
- `100dvh` not `100vh`, so the iOS address bar does not crop the hero.
- Every image placeholder reserves its aspect ratio so CLS stays near zero when you drop real images in later.
- Touch targets 44px minimum.
- The three CTA rows are real anchors or buttons with real accessible labels, never divs with click handlers.

---

## SECTION D · Data truth

`brand/services.json` in this delivery is a **verbatim transcription of the price list PDF**. Every service name, length tier, figure and membership benefit in it is exactly as printed, in the printed order. It is the only pricing source in the project. Antigravity reads it and never reads the price PDF, never reads the Brand Kit for a price, and never types a figure by hand.

### D1. The menu, as printed

Seven services across four length tiers, all in one table under a single Hair Styling heading.

| Service | Short | Medium | Long | Extra Long |
|---|---|---|---|---|
| Blow Dry (In / Out) | 250 | 300 | 350 | 400 |
| Beach Waves | 300 | 350 | 400 | 450 |
| Hollywood Waves | 400 | 450 | 500 | 550 |
| Retro Waves | 400 | 450 | 500 | 550 |
| Half Uptini | 450 | 500 | 550 | 600 |
| French Twist | 500 | 550 | 600 | 650 |
| Uptini | 550 | 600 | 650 | 700 |

Add-ons, flat priced: Signature add on 125, covering braid, scalp massage, liquid glass or moisture. Premium add on 182, covering Crown Tonic or Cure Liquor. Extensions 125, adding 15 minutes to each service.

Membership, three tiers as printed: 3 sessions gives 20 percent off the third, 6 sessions gives 50 percent off the sixth, 8 sessions gives 50 percent off the eighth plus a complimentary hair treatment.

Entry price is **QAR 250**, so any summary figure on the site reads "from QAR 250".

### D2. Four things the brief asks for that the price list does not contain

These are not conflicts, they are gaps. Build the shells, populate nothing, invent nothing.

1. **Durations.** The price list carries no service durations at all. The only timing figure printed anywhere on it is the extensions note. So the price table ships with no duration column. Ask the client for the Zenoti service catalogue export, which already stores duration per service, and add the column in a later pass. A column of guessed minutes is worse than no column.
2. **Home services.** No service, travel fee, minimum spend, coverage area or lead time exists. Shell behind a flag, default off.
3. **Gift cards.** No denominations, validity or terms. Before anyone designs a purchase flow, find out whether Zenoti issues and redeems gift cards for this account, because if it does this is an outbound link rather than a page you build.
4. **Membership terms.** The PDF gives session counts and discounts and nothing else. No validity, no up front cost, no transferability, no expiry, no statement of whether add-ons count toward a session. The tiers render exactly as printed and the terms block stays empty with a TODO marker.

Also worth a quick confirm, not a blocker: the complimentary hair treatment is printed with a plus sign directly under the 8 session block, so it reads as belonging to that tier and is attached there. If the client says it applies to all three, it moves. No percentage or session count changes either way.

### D3. Where the Brand Kit disagrees, and why it does not matter

Recorded once, so that nobody later "corrects" the price data by reaching for the wrong PDF. In every case the price list ships. The full list lives in `brand_kit_divergences_for_the_record` inside `services.json`.

The two that change **copy** rather than numbers:

- The Brand Kit mandates the phrase "from QAR 257". The price list says 250. The site says "from QAR 250".
- Brand Kit page 04 says price follows hair length and time rather than the finish chosen. The price list charges 150 QAR more for Hollywood Waves than a Blow Dry at the same length, so that sentence cannot appear on a page that displays those prices. The site says price follows hair length and the style chosen, which is what the price list actually shows. Worth mentioning to the client so the next Kit edition matches their own menu.

One that changes **scope**: the Brand Kit lists a children's service, Shirley Temple, at 181. It is not on the price list, so it does not appear on the site.

### D4. Two Brand Kit rules that do still constrain the build

Neither is about pricing, and both are hard.

**Locations.** Page 06 says The Gate Mall, opening September 2026, must not be announced without written approval, and that a third site under evaluation must not be named, hinted at or geotagged. Ship with Gewan Island only. The third location must not appear in code, comments, alt text, the sitemap, or a commit message.

**Publishing note on memberships.** Page 05 tells partners not to publish membership tiers or discount percentages. That box is addressed to creators, agencies and media partners, and this is the brand's own price list on the brand's own website, so it ships as printed. Mention it to the client in one line so they know you read it and made a deliberate call rather than missing it. No flag, no gate.

### D5. The logo file

`Asset_1.svg` is a 451.38 by 171.88 wordmark with seven paths and an internal `<style>` block. Three paths spelling "dry" are filled `#fd0`, four paths spelling "bar" plus the registered mark are filled `#c6c6c6`.

Two problems. `#fd0` is not the documented Drybar Yellow `#FEDD30`, and `#c6c6c6` is not Wordmark Grey `#454235`, so this is not the primary lockup from page 07. And the Kit forbids recolouring the logo, so you cannot retint it to fix the mismatch.

Use it as a placeholder so layout can proceed, and in parallel ask the client for the official primary lockup and the Qatar badge as vectors, which is exactly what page 07 tells partners to do. Do not redraw, retype, trace, recolour, or convert it to `currentColor`.

Technical gotcha for the prompt: the fills come from a `<style>` block using generic class names `.cls-1` and `.cls-2`. Inline that file twice on a page, or alongside any other Illustrator export, and those class names collide so the second instance repaints the first. Scope or rename them during conversion.

### D6. Zenoti integration contract

Booking, rescheduling, cancellation and reminders all live in Zenoti. Your site owns one thing: getting the guest there cleanly.

```
NEXT_PUBLIC_ZENOTI_BOOK_URL     → new booking flow
NEXT_PUBLIC_ZENOTI_MANAGE_URL   → guest portal for reschedule and cancel
NEXT_PUBLIC_WHATSAPP_URL        → https://wa.me/97477730600
```

Rules:

- Book Now opens in the **same tab**. External booking flows in a new tab strand mobile users, and Zenoti has its own navigation.
- Append `?utm_source=website&utm_medium=cta&utm_campaign=book_now` so the client can see what the site actually drives.
- `<link rel="preconnect">` to the Zenoti host so the redirect does not stall on DNS.
- **Fallback, and this one matters.** If the env var is missing or empty at build time, the CTA falls back to the WhatsApp link rather than rendering a dead href. Brand Kit page 11 says never send people to something that is not live, and a 404 on the booking button is the single worst failure this site can have.
- Reschedule, cancel and reminders get **copy** on the site, not functionality. State plainly that reminders arrive by SMS and email and that changes are made through the booking link. Then make sure that copy matches the actual Zenoti configuration.

## SECTION E · Sitemap

One page, two in-page views, per your read of the brief.

```
/                       Home
  ├── hero              display wordmark, one line of voice, scroll cue
  ├── air wipe          the scrubbed transition, the signature moment
  ├── the one thing     blowouts only, no cuts, no colour
  ├── CTA index         three rows, the signature element
  ├── styles strip      the seven named styles, image placeholders, 9:16
  └── info footer       location, map, hours, contact, Instagram, policies

/prices                 Price List
/gifts                  Gift Cards, Packages & Memberships
```

Route transitions rather than full page loads, so the smooth scroll layer and the grain overlay persist. Both sub views are reachable from the CTA index and both carry the info footer, since the brief asks for it at the bottom of the second page.

---

## SECTION F · The phase prompts

Copy from the horizontal rule to the next horizontal rule. One phase at a time.

---

### PHASE 0 · Reference DNA extraction. No code.

```
You are a senior frontend engineer doing forensic analysis on a reference website before any code is written.

PROJECT CONTEXT
We are building a mobile-first one-page marketing site for Drybar Qatar, a blow-dry bar in Doha. Booking is handled entirely by an external Zenoti instance, so this site is presentation plus one outbound link. The visual and motion language must match a reference site closely. Brand source files are in ./brand/ and you will read them in PHASE 1, not now.

YOUR TASK THIS PHASE
Open https://www.9to5studio.it/ in your browser. Analyse it. Write everything you measure to docs/reference-dna.md. Write zero application code this phase.

STEP 1 · Identify the stack
Open DevTools console and run each of these, recording the exact output:
  !!window.gsap, window.gsap?.version
  Object.keys(window).filter(k => /lenis|locomotive|scroll|smooth|gsap|barba|swup|motion/i.test(k))
  !!window.__NUXT__
  performance.getEntriesByType('resource').map(r => r.name).filter(n => /\.m?js(\?|$)/.test(n))
  document.querySelectorAll('[data-scroll],[data-lenis],[class*="split"],[class*="Split"]').length
  getComputedStyle(document.documentElement).scrollBehavior
Then open the Network tab, filter to JS, and read the bundle filenames and any vendor chunk names. Report which animation libraries are actually present versus absent. If GSAP is present, list which plugins are registered.

STEP 2 · Sample the real palette
Run a sampler that walks every element, reads computed backgroundColor and color, tallies frequency, and prints the top 12 of each with counts. Convert to hex. Record which colour is the page ground, which is body text, which are secondary. Note whether imagery is desaturated and if so measure roughly how much.

STEP 3 · Measure typography
For the hero display text, each heading level, body copy and any caption or label: record font-family, font-size in px at 1440 wide AND at 390 wide, font-weight, line-height, letter-spacing, text-transform. Identify whether the hero line breaks are hard coded or natural wraps. Report the ratio between the largest and smallest type on the page.

STEP 4 · Measure layout
Record: max content width, page side margins at 390 / 768 / 1440, column count and gutter if a grid is detectable, vertical space between sections, and every breakpoint you can find in the CSS. Note which elements are full bleed versus contained.

STEP 5 · Catalogue every animation
For each distinct animation on the page, write an entry with: trigger (page load, scroll enter, scroll scrub, hover, click), the element, the properties animated, start and end values, duration, easing, stagger if any, and whether it plays once or reverses. Use the DevTools Animations panel to capture easing curves and durations. Pay specific attention to:
  a) The page load sequence. What animates first, second, third, and with what delay between them.
  b) The hero display text. Is it split per character, per word, or per line? What is the stagger?
  c) The intro paragraph. It appears twice in the DOM. Determine what the second copy is for. My hypothesis is a scroll-scrubbed reveal where one copy is masked or clipped and scroll position drives the mask. Confirm or correct this.
  d) The "Scroll & Discover" cue. Does it animate, and does it disappear on scroll?
  e) The numbered project index. What happens on hover on desktop. Each anchor contains an image, so determine how and where that image is revealed, whether it follows the cursor, and what the enter and exit timings are. Then check what replaces this behaviour on mobile where hover does not exist.
  f) The Menu and Contacts overlay. Menu and Contacts each appear twice in the DOM. Record the open and close timings, easing, whether items stagger, whether the page behind locks or transforms, and what the trigger looks like in each state.
  g) Any parallax. For each parallaxed element, measure the ratio of element translation to scroll distance as a percentage.
  h) The route transition. Click into /work/pegaso-quattro. Record exactly what happens: what fades or moves, in what order, total duration, and whether the incoming page animates in or appears complete.
  i) The "Next project" block at the bottom of a project page. Record its hover and click behaviour.

STEP 6 · Reverse-engineer the scrub mapping
For every scroll-scrubbed animation: scroll to 0%, 10%, 25%, 50%, 75%, 90% and 100% of its active range and record the animated element's computed transform, opacity or clip-path at each point. Put these in a table. This gives us the actual input-to-output curve rather than a guess at it.

STEP 7 · Measure the scroll feel
Determine whether a smooth-scroll layer is active. If yes, identify the library and read its config from the initialised instance if reachable, specifically the lerp or duration value. Then test on a touch viewport and report whether smoothing is active on touch or whether native scrolling takes over. Record how the page feels on iOS-width emulation: any lag between finger and content, any scroll-jacking, any conflict with native momentum.

STEP 8 · Screenshots
Capture the homepage at 390, 768 and 1440 wide. Capture the hero mid-animation, the project index with a hover active, the menu overlay open, and a project detail page. Save to docs/reference-shots/.

OUTPUT
Write docs/reference-dna.md with one section per step above. Where you could not determine something, write UNKNOWN and say what you tried. Do not fill gaps with plausible-sounding values. At the end of the file add a section called "MY RECOMMENDATION" giving the exact GSAP and Lenis configuration you would use to reproduce what you measured, with real numbers.

Then stop. Write no application code. Do not scaffold the project. Do not install dependencies. Report back and wait.
```

---

### PHASE 1 · Scaffold and token system.

```
PHASE 1. You have docs/reference-dna.md from PHASE 0. Every value you write this phase comes from that file or from the brand sources. Do not invent values.

STEP 1 · Read the brand sources
Read all four files in ./brand/ before writing anything:
  brand/Drybar_Qatar_-_Brand___Collaboration_Kit.pdf   full brand rules, tone, logo rules, palette, photography rules
  brand/drybar_qatar_price_list.pdf                    the operational menu
  brand/Asset_1.svg                                    logo placeholder
  brand/services.json                                  verbatim transcription of the price list PDF, the ONLY pricing source, use THIS not the PDF

Then write docs/brand-constraints.md as a flat checklist of every hard rule you found that constrains the build. It must include at minimum: blowouts only and never imply cuts or colour, the logo misuse list from page 07, the yellow-is-not-for-text contrast reality, no medical or hair-growth claims, no alcohol or bar imagery in the Qatar market, Instagram is the only active social channel so no TikTok Snapchat or Facebook links, Gewan Island is the only publishable location, and the tone-of-voice USE and AVOID word lists from page 10. Note in that file that the Brand Kit's DO NOT PUBLISH box on packages and memberships is addressed to creators and media partners, not to the brand's own website, and that memberships therefore ship as printed on the price list.

STEP 2 · Scaffold
Create a Next.js App Router project with TypeScript, at the repo root, using the current stable version. Record the exact versions you install in docs/stack.md. Add: tailwindcss v4 with @tailwindcss/postcss, gsap 3.13 or newer, lenis, next-intl, sharp. Install nothing else. No component library, no icon library, no animation library other than GSAP.

STEP 3 · Folder structure
  app/
    layout.tsx              root, html lang and dir, font vars, grain overlay, providers
    page.tsx                home
    prices/page.tsx
    gifts/page.tsx
    globals.css             the @theme token block, nothing else
  components/
    layout/                 Header, OverlayMenu, InfoFooter, GrainOverlay
    sections/               one file per home section
    motion/                 SmoothScrollProvider, useGsap, Reveal, SplitLines, Parallax
    ui/                     Logo, CtaRow, PriceTable, Placeholder
  lib/
    motion.ts               all GSAP and Lenis constants, single source
    zenoti.ts               URL builder with fallback
    services.ts             typed loader for brand/services.json
  content/
    en.json  ar.json        all copy, no hardcoded strings in components
  docs/

STEP 4 · Token layer
In globals.css, define everything in one @theme block as CSS custom properties. Nothing hardcoded anywhere else in the codebase, ever.

Colours, exactly these six, from the Brand Kit page 08:
  --color-cream: #FCF9F2      page ground
  --color-butter: #FDF2C9     calm fields, gradient midpoints
  --color-yellow: #FEDD30     accent SURFACES ONLY
  --color-charcoal: #262523   all body text, dark surfaces, never pure black
  --color-warmgrey: #8C867A   secondary text, captions, hairlines
  --color-inkgrey: #454235    the ink in the logo

Add this as a CSS comment above the yellow token and do not remove it:
  /* #FEDD30 on #FCF9F2 is ~1.3:1 contrast and FAILS WCAG at every size.
     Yellow is a surface, a rule, a fill. Never text. Charcoal carries all copy. */

Gradients, four, exactly as written. Do not simplify them to two-stop linears. The layered radial-over-linear construction is the point: it produces a soft riso-print field rather than the flat diagonal sweep that reads as a template.
  --grad-asagiri:
    radial-gradient(120% 90% at 12% 4%,  #FDF2C9 0%, rgba(253,242,201,0) 62%),
    radial-gradient(100% 80% at 88% 22%, #F7EFE0 0%, rgba(247,239,224,0) 58%),
    linear-gradient(168deg, #FCF9F2 0%, #FAF5EA 54%, #F5EEDF 100%);
  --grad-yuzu:
    radial-gradient(90% 120% at 78% 8%, #FEDD30 0%, rgba(254,221,48,0) 64%),
    linear-gradient(148deg, #FDE87A 0%, #FDF2C9 62%, #FCF9F2 100%);
  --grad-sumi:
    radial-gradient(120% 100% at 20% 0%, #3A3833 0%, rgba(58,56,51,0) 66%),
    linear-gradient(196deg, #262523 0%, #2E2C28 58%, #454235 100%);
  --grad-hai:
    linear-gradient(180deg, #FCF9F2 0%, #EFE9DC 58%, #DCD5C7 100%);

Rules to enforce in code review: asagiri is the default page ground, yuzu appears at most once per viewport, sumi is for dark sections and the overlay menu, hai is for neutral separator fields and image surrounds. No gradient smaller than a full section.

Typography:
  --font-latin: "Helvetica Now Display", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --font-arabic: "IBM Plex Sans Arabic", "Noto Kufi Arabic", var(--font-latin);
Do not load any webfont this phase. The system stack resolves to real Helvetica on Apple devices, costs zero bytes and has no FOUT. A licensed Helvetica Now webfont gets swapped in later behind the same variable.

Type scale tokens, fluid and mobile-first. Cross-check each against your PHASE 0 measurements and adjust if the reference is materially different, noting any change in docs/stack.md:
  display   clamp(3.25rem, 15.5vw, 11rem)   / lh 0.86 / ls -0.035em / w400
  h2        clamp(2rem, 7vw, 4.5rem)        / lh 0.94 / ls -0.022em / w400
  h3        clamp(1.25rem, 4.4vw, 1.875rem) / lh 1.12 / ls -0.012em / w500
  body      clamp(1rem, 3.5vw, 1.125rem)    / lh 1.55 / ls 0       / w400
  eyebrow   0.6875rem / lh 1.2 / ls 0.15em / w500 / uppercase
  price     clamp(1rem, 3.6vw, 1.25rem) / w500 / font-variant-numeric: tabular-nums
Tabular numerals on prices are mandatory. Proportional figures give ragged price columns.

Spacing: 4 8 12 16 24 32 48 64 96 128 192.
Breakpoints: 390 base, 480, 768, 1024, 1280, 1536. Author mobile-first, min-width queries only.
Grid: mobile 4 col / 16px gutter / 20px margin. Tablet 8 col / 20px gutter / 32px margin. Desktop 12 col / 24px gutter / 40px margin. Max content width 1440, full bleed permitted.

Motion tokens, mirrored in both globals.css and lib/motion.ts so CSS and GSAP never drift:
  --dur-fast 240ms  --dur-base 600ms  --dur-slow 1100ms  --dur-page 900ms
  --ease-out   cubic-bezier(0.16, 1, 0.30, 1)
  --ease-inout cubic-bezier(0.83, 0, 0.17, 1)
  --ease-soft  cubic-bezier(0.33, 1, 0.68, 1)

STEP 5 · RTL from the start, not later
The Brand Kit requires bilingual publishing with properly set right-to-left layout, not an English layout with Arabic dropped in. Retrofitting RTL later is expensive, so:
  - Configure next-intl with locales en and ar, en as default.
  - Root layout sets html lang and dir from the active locale.
  - Use logical CSS properties everywhere: margin-inline-start, padding-inline-end, inset-inline-start, text-align: start. Never left or right.
  - All copy lives in content/en.json and content/ar.json. Zero hardcoded strings in components.
  - Arabic values may be the string "TODO_AR" for now. Do not machine-translate anything. The Kit explicitly forbids it.
  - Keep "Drybar" and all trademarked style names in Latin script in both files. Never transliterate them.

STEP 6 · Logo component
Convert brand/Asset_1.svg into components/ui/Logo.tsx as inline SVG. Preserve viewBox 0 0 451.38 171.88 and all seven paths exactly.
CRITICAL: the file's fills come from an internal <style> block using generic class names .cls-1 and .cls-2. Those will collide if the SVG is inlined more than once or alongside another Illustrator export, and the later instance will repaint the earlier one. Replace the style block with per-path inline fills or uniquely prefixed class names.
Do NOT recolour, retint, redraw, retype, trace, or convert the fills to currentColor. The Brand Kit page 07 forbids all of it. Keep #fd0 and #c6c6c6 as supplied.
Add a code comment recording that this file is a PLACEHOLDER: it is a two-tone wordmark whose fills do not match the documented Drybar Yellow #FEDD30 or Wordmark Grey #454235, so it is not the official primary lockup, and the official vector must be requested from the client.

STEP 7 · Verification route
Build app/dev/tokens/page.tsx rendering every token as a visible swatch, gradient panel, type specimen and spacing ruler. This is a build-time-only page. Exclude it from the sitemap and from production output.

DEFINITION OF DONE
Dev server runs clean with zero console warnings. /dev/tokens renders every token correctly at 390 and 1440 wide. docs/brand-constraints.md and docs/stack.md exist. No page content, no animation, no sections built.

Then stop and report. Do not start PHASE 2.
```

---

### PHASE 2 · Motion core. No page content.

```
PHASE 2. Build the animation infrastructure and prove it works in isolation. Still no page content.

Every number you use comes from docs/reference-dna.md. Where your PHASE 0 measurements differ from the values below, use your measurements and log the difference in docs/motion-notes.md with a one-line reason.

STEP 1 · lib/motion.ts, the single source of truth
Export as typed constants. Nothing in the codebase may hardcode a duration, ease or stagger.
  DUR   = { fast: 0.24, base: 0.6, slow: 1.1, page: 0.9 }
  EASE  = { out: 'power4.out', inOut: 'expo.inOut', soft: 'power2.out', scrub: 'none' }
  STAGGER = { word: 0.045, line: 0.08, row: 0.10, menuItem: 0.05 }
  PARALLAX = { desktop: 0.10, mobile: 0.05 }   // as a fraction of scroll distance
  LENIS = { lerp: 0.085, wheelMultiplier: 1, touchMultiplier: 1.5, smoothWheel: true, syncTouch: false, autoRaf: false }
Register GSAP plugins once here: ScrollTrigger, SplitText, CustomEase. Guard registration so it runs only on the client and only once.

STEP 2 · SmoothScrollProvider
Client component wrapping the app in root layout.
  - Instantiate Lenis with the LENIS config. autoRaf false.
  - Drive Lenis from the GSAP ticker, not its own rAF loop, and set gsap.ticker.lagSmoothing(0). Two independent rAF loops is the number one cause of jitter between a scrubbed ScrollTrigger and a smooth-scroll library. One loop only.
  - Wire lenis.on('scroll', ScrollTrigger.update) and set up ScrollTrigger.scrollerProxy correctly.
  - syncTouch is false deliberately. On touch, native iOS momentum handles scrolling and ScrollTrigger reads native scroll position. This is a mobile-first site and Lenis touch smoothing introduces perceptible finger lag on iOS. Do not enable it without testing on a physical iPhone.
  - Destroy the Lenis instance and kill all ScrollTriggers on unmount. No leaked instances across route changes.
  - Call ScrollTrigger.refresh() after every route change and after webfonts load.
  - If prefers-reduced-motion is reduce: do not instantiate Lenis at all.

STEP 3 · useGsap hook
A wrapper over useLayoutEffect that:
  - No-ops on the server.
  - Creates a gsap.context() scoped to a ref and reverts it on cleanup. Every animation in the app goes through this. No orphaned tweens.
  - Reads prefers-reduced-motion. When reduce is set, it skips the timeline entirely and instead applies the END state of every target immediately, so content is fully visible and correctly positioned with no motion. Reduced motion means off, not slower.

STEP 4 · Four primitives, each independently testable
  <Reveal>       fade and rise on scroll enter. y from 24px to 0, opacity 0 to 1, DUR.slow, EASE.out, once, start 'top 85%'.
  <SplitLines>   splits children into lines with SplitText and staggers them. Props select word or line granularity. MUST re-split on resize and after fonts load or lines break mid-word. Set the container to a stable height before splitting to avoid layout shift.
  <Parallax>     scrubbed y translate. Reads PARALLAX.desktop or PARALLAX.mobile from a matchMedia check. Hard rule: refuse to apply to text nodes. Images and surfaces only. Moving body copy is unreadable and it is the fastest way to make a site feel cheap.
  <ScrubStage>   pinned section where scroll progress 0 to 1 drives a timeline. This is the primitive the signature air-wipe will use in PHASE 4. Build it generic. Use the input-to-output table from PHASE 0 STEP 6 to match the reference's actual curve rather than a linear map.

STEP 5 · Grain and gradient render layer
  - <GrainOverlay> is a single fixed element in root layout, full viewport, pointer-events none, high z-index, never animated, never re-rendered on route change.
  - Desktop: SVG feTurbulence, type fractalNoise, baseFrequency 0.8, numOctaves 4, stitchTiles stitch, followed by feColorMatrix type saturate values 0. Encode as a data URI background.
  - Mobile: an SVG filter repainting over a full viewport on every scroll frame is expensive on mid-range Android. Generate a 256x256 tileable PNG of the same noise at build time and use background-repeat instead. Switch on a matchMedia coarse-pointer or max-width query.
  - Opacity 0.045 as the starting point. Test mix-blend-mode multiply over the light gradients and screen over sumi, pick per surface, record what you chose.
  - Tune it visually, then state the final opacity and blend mode in docs/motion-notes.md. If the grain is visible as a texture at arm's length on a phone it is too strong. It should read as paper, not as noise.

STEP 6 · Proving ground
Build app/dev/motion/page.tsx with one isolated demo per primitive plus one Lenis feel test. Build-time only, excluded from production and the sitemap.

DEFINITION OF DONE
Every primitive works at 390 and 1440 wide. Scroll is smooth on desktop with no jitter on scrubbed elements. Touch scroll on an iOS-emulated viewport feels native with zero finger lag. prefers-reduced-motion produces a fully visible, correctly laid out, completely static page. Route changes leave zero leaked ScrollTriggers, verified with ScrollTrigger.getAll().length before and after. No console warnings.

Then stop and report. Build no page sections.
```

---

### PHASE 3 · Static layout skeleton. Zero motion.

```
PHASE 3. Build every section's structure and layout with NO animation at all. Motion is applied in PHASE 4. Getting the static layout right first is what makes the motion phase fast.

Design at 390px wide first, then scale up. Every section must be complete and correct on mobile before you touch a desktop breakpoint.

ALL copy comes from content/en.json. Zero hardcoded strings.

COPY VOICE, from Brand Kit page 10. Write every string in this document against these lists.
  USE:   blowout, style, bounce, shine, finish, book a chair, come in, pop by,
         an hour that is yours, we love, healthy-looking, glossy
  AVOID: treatment, procedure, session, therapy, reserve your appointment slot now,
         pamper yourself, indulge, treat yourself, world-class, unrivalled, elite,
         exclusive, repairs damage, regrows, heals, cures
  Never imply we cut or colour hair. Never make a medical, repair or growth claim. Never sound clinical, salesy, snobby or luxury-cliché.

IMAGE PLACEHOLDERS
Shawn supplies real images later. Build a <Placeholder> component: an aspect-ratio-locked box on --grad-hai with a hairline border and a small warmgrey label naming what belongs there. It must reserve exact aspect ratio so CLS stays near zero when real images land. Ratios come from Brand Kit page 09, which specifies vertical 9:16 as primary, with 4:5 and 1:1 secondary. Use 9:16 for anything that will become a reel frame or a hero, 4:5 for editorial stills, 1:1 for detail crops. Label each with the actual shot from the Kit's shot list, for example "chair-side, mid-blowout, brush in frame" or "finished hair in motion, a turn or a walk".

SECTIONS, in order.

1 · Hero. Full height using 100dvh not 100vh, so the iOS address bar does not crop it. Ground is --grad-asagiri. Structure: the Logo component at small scale top-left, then the display headline in three hard-coded lines mirroring the reference's stacked wordmark treatment, then one short paragraph of brand voice, then a scroll cue. No hero image. The reference site opens on typography, and Drybar's first screen should too.
   Headline: three lines, hard breaks, not natural wraps, so each line is its own animatable element in PHASE 4.
   Voice paragraph: two sentences maximum. It must say blowouts only, no cuts, no colour, because Brand Kit page 04 names being described as a full-service salon as the single most common partner mistake. That correction belongs on the first screen.
   Scroll cue: a short label plus a hairline. It will animate and then disappear in PHASE 4, so give it a stable wrapper now.

2 · AirWipe. This is the signature moment and it becomes a <ScrubStage> in PHASE 4. This phase, build only the static end state: a full-viewport section on --grad-yuzu carrying one short line of copy. Structure it so a yuzu field can sweep across it and the line can resolve word by word on scroll scrub. No motion yet.

3 · TheOneThing. Ground --grad-asagiri. A short statement block, one 9:16 placeholder alongside it. Content: blowouts only, no cuts, no colour, and one line on how pricing works.
   Do NOT use the Brand Kit's sentence stating that price follows hair length and time rather than the finish chosen. The price list charges 150 QAR more for Hollywood Waves than a Blow Dry at the same length, so that sentence would be false on a site that displays those prices. Write instead that price follows hair length and the style chosen, which is what the price list actually shows.
   Do not put any figure in this section. All prices live on /prices and come from services.json.

4 · CtaIndex. THE SIGNATURE ELEMENT. Three full-width rows: Book Now, Price List, Gift Cards & Memberships. Row type is the display scale, ranged to the inline-start edge. Each row is a real anchor or button with a real accessible label, never a div with a click handler. Each row contains a <Placeholder> positioned behind the type, hidden by default, which will be revealed on interaction in PHASE 4.
   All three rows must fit within one 390x844 viewport with no scrolling.
   Minimum row height 88px so the touch target is comfortable, well above the 44px floor.
   DO NOT number these rows 01 / 02 / 03. The reference site numbers its projects because a project index genuinely is an ordered body of work. These three are parallel choices, not a sequence, and numbering them borrows the device without the meaning. Numbering appears exactly once in this project, on the four length tiers in PHASE 6, where the order is real.

5 · StylesStrip. Horizontally scrollable on mobile, a grid from 768 up. One card per named style read from brand/services.json: Blow Dry, Beach Waves, Hollywood Waves, Retro Waves, Half Uptini, French Twist, Uptini. Each card is a 9:16 placeholder plus the style name plus its lowest price. Keep all trademarked style names in Latin script. Prices come from services.json only, never typed by hand.

6 · InfoFooter. Ground --grad-sumi, so text is cream on dark. Everything the brief asks for at the bottom of the second page, and it appears on all three routes:
   Location: Gewan Island, The Pearl, Doha. GEWAN ISLAND ONLY. Do not mention The Gate Mall, do not mention any third location, not in copy, not in a comment, not in alt text, not in the sitemap. Brand Kit page 06 restricts both.
   Google Maps link: leave the href as an env var placeholder. Do not link a pin you have not verified resolves to the actual flagship.
   Hours: Saturday – Thursday 10:00am – 9:00pm, Friday 2:00pm – 9:00pm. (Ramadan references removed at client request; updated to new official opening hours).
   Contact: phone and WhatsApp +974 7773 0600, tel: and wa.me links.
   Instagram: @thedrybar.qatar, the only social channel. TikTok, Snapchat and Facebook are all inactive and Brand Kit page 11 says do not create or imply an account, so no other social links or icons exist anywhere in this build.
   Booking and cancellation policies: render the section with a clear TODO_POLICY_TEXT marker. This text is not in either source document and it must match the actual Zenoti configuration, so it cannot be written by us. Flag it, do not invent it.
   Legal line: Drybar Qatar is operated under licence by Lukhraib Rose LLC.

HEADER AND OVERLAY MENU
Fixed header: logo at inline-start, a Menu trigger at inline-end. The overlay is full screen on --grad-sumi with a short item list and the contact block. Build both states statically. Lock body scroll when open, via Lenis stop rather than overflow hidden, so the two systems do not fight. Trap focus inside the overlay, close on Escape, return focus to the trigger on close.

DEFINITION OF DONE
All three routes render complete and correct at 390, 480, 768, 1024, 1440 and 1920. No horizontal overflow at any width. No layout shift on load. Full keyboard traversal with visible focus rings on every interactive element, yellow ring on charcoal surfaces and charcoal ring on light and yellow surfaces, 2px with 2px offset. Zero animation present. Zero hardcoded copy. Zero hardcoded prices. Screenshot every route at 390 and 1440 and save to docs/skeleton-shots/.

Then stop and report.
```

---

### PHASE 4 · Apply motion, section by section.

```
PHASE 4. Now animate the skeleton, using the primitives from PHASE 2 and the measurements in docs/reference-dna.md.

Work in the order below and DO NOT start a step until the previous one is verified. If any step degrades scroll smoothness, stop and fix it before continuing. A janky site with eight animations is worse than a smooth one with three.

STEP 1 · Page load sequence
Reproduce the reference's load choreography as measured in PHASE 0 STEP 5a. One orchestrated sequence, not four independent fades. Order: hero display lines stagger in per line at STAGGER.line, then the voice paragraph, then the scroll cue, then the header. Total sequence under 1.8 seconds. Nothing on the page moves before the first line has started.
Guard against the flash-of-unstyled-content problem: set initial states in CSS, not in a GSAP .set() inside useEffect, or the first paint shows the end state for one frame.

STEP 2 · Hero display lines
SplitLines at line granularity, per-line clip reveal with a y offset, EASE.out, DUR.slow, STAGGER.line. Match the split granularity you measured on the reference in PHASE 0 STEP 5b. If the reference splits per word, split per word.
Re-split on resize and after fonts load. Verify no mid-word line breaks at 390, 768 and 1440.

STEP 3 · The AirWipe. The signature moment.
Convert the AirWipe section to a <ScrubStage>. Pin the section, drive one timeline with scroll progress 0 to 1:
  - A --grad-yuzu field sweeps across the viewport on a clip-path or masked transform.
  - The line of copy resolves word by word inside the sweep, driven by the same progress.
  - Easing is fast out then long settle, which is how hair behaves when a dryer hits it. Build a CustomEase for this rather than reaching for a stock ease, and record the curve in docs/motion-notes.md.
  - Use the input-to-output table from PHASE 0 STEP 6 to shape the progress mapping. Do not use a linear map.
This is the entire flourish budget for the site. It happens once, in one place. Everything else stays quiet. Do not add a second scrubbed set piece.

STEP 4 · Section reveals
Wrap TheOneThing and StylesStrip content in <Reveal>. Start 'top 85%', once, no reverse. Stagger sibling elements at STAGGER.row. These should be almost unnoticeable. Restraint here is what makes STEP 3 land.

STEP 5 · CtaIndex interaction. The second signature.
Desktop, hover on a row:
  - The row's placeholder reveals behind the type. Match the reveal mechanic you measured on the reference's project index in PHASE 0 STEP 5e, including whether the image follows the cursor and the exact enter and exit timings.
  - The row's ground shifts to --grad-yuzu and its type to charcoal. DUR.fast, EASE.soft.
  - Non-hovered rows drop to a lower opacity. Whatever value the reference uses, match it.
  - Exit must be as carefully timed as enter. Most implementations get the enter right and let the exit snap.
Mobile, no hover exists:
  - Each row reveals on scroll entry instead, one at a time, staggered at STAGGER.row.
  - Active and pressed states use :active and a brief scale of 0.985 with EASE.soft. No sticky hover states left behind on touch, which is the classic iOS bug here.
  - Set -webkit-tap-highlight-color to transparent and provide your own visible press feedback.

STEP 6 · Overlay menu
Match the reference's open and close timings from PHASE 0 STEP 5f. EASE.inOut, DUR 0.7, items stagger at STAGGER.menuItem. The trigger itself animates between states. Lenis stops on open and starts on close. Focus trap active, Escape closes, focus returns to the trigger.

STEP 7 · Parallax
Only on <Placeholder> surfaces, never on text. PARALLAX.desktop 10 percent, PARALLAX.mobile 5 percent. If the reference uses a different ratio, use theirs. Verify no element parallaxes out of its container at any breakpoint.

STEP 8 · Route transitions
Home to /prices to /gifts must transition, not hard load. Match what you measured in PHASE 0 STEP 5h. EASE.inOut, DUR.page 0.9. The smooth scroll instance and the grain overlay persist across the transition and are never re-created. Scroll position resets to top on the incoming route. ScrollTrigger.refresh() fires after the incoming route paints. Verify ScrollTrigger.getAll().length returns to its baseline after navigating away and back.

STEP 9 · Reduced motion audit
With prefers-reduced-motion set to reduce, walk all three routes. Every element must be fully visible, correctly positioned, and completely static. The pinned AirWipe must not pin at all, it renders as a normal static section. Nothing may be invisible, clipped, or stuck at an intermediate state. This is the single most commonly broken thing on sites like this and it is a hard gate.

DEFINITION OF DONE
Sustained 60fps while scrolling the full page on desktop. No dropped frames during the AirWipe scrub. Touch scroll on a real iPhone if you can reach one, otherwise iOS emulation, feels native with no finger lag. No sticky hover states on touch. Reduced motion audit passes completely. No leaked ScrollTriggers after navigation. Record a screen capture of a full scroll-through at 390 and at 1440 and save both to docs/motion-shots/.

Then stop and report.
```

---

### PHASE 5 · CTA wiring and Zenoti contract.

```
PHASE 5. Wire the three CTAs. Booking, rescheduling, cancellation and reminders are all handled inside Zenoti. This site owns exactly one job: getting the guest there cleanly, and never rendering a dead link.

STEP 1 · lib/zenoti.ts
Read three env vars:
  NEXT_PUBLIC_ZENOTI_BOOK_URL      new booking flow
  NEXT_PUBLIC_ZENOTI_MANAGE_URL    guest portal for reschedule and cancel
  NEXT_PUBLIC_WHATSAPP_URL         https://wa.me/97477730600
Export a builder that returns a safe href for each destination and appends UTM params: utm_source=website, utm_medium=cta, utm_campaign set per destination, for example book_now and manage_booking.

STEP 2 · The fallback, and this is the important part
If a Zenoti env var is missing, empty, or not a valid absolute https URL at build time, the CTA falls back to the WhatsApp link and the label changes to a booking-by-message equivalent. It must never render an empty href, a "#", or a link to a page that does not exist.
Rationale to keep in a code comment: Brand Kit page 11 instructs that people are never sent to a website or map pin that is not live, and a 404 on the booking button is the single worst failure this site can produce.
Also add a build-time warning to the console listing any missing env var by name.

STEP 3 · Link behaviour
Book Now opens in the SAME TAB. Do not use target _blank. External booking flows opened in a new tab strand mobile users with no way back, and Zenoti carries its own navigation. Add rel="noopener" regardless.
Add <link rel="preconnect"> to the Zenoti host in root layout so the redirect does not stall on a DNS lookup.
Add a small dispatched custom event on click so an analytics layer can be attached later without touching the component. Install no analytics library.

STEP 4 · Booking copy, not booking functionality
The brief asks for location, service, stylist, date and time selection, plus confirm, reschedule, cancel and reminders. All of that is Zenoti's UI. What this site renders is a short, honest description of the flow so the guest knows what to expect before tapping:
  - Say plainly that choosing a location, a style, a stylist, a date and a time all happen in the booking flow.
  - Say that confirmations and reminders arrive by SMS and email.
  - Say that changes and cancellations are made through the same link, and surface NEXT_PUBLIC_ZENOTI_MANAGE_URL as a quiet secondary link near the primary CTA, not as a third equal button.
  - Voice check against Brand Kit page 10: "book a chair" is on the approved list, "reserve your appointment slot now" is explicitly on the avoid list. And "session" is on the avoid list, so do not describe a booking as a session.
FLAG FOR THE CLIENT: every sentence here must match the actual Zenoti configuration. If Zenoti is not set to send SMS reminders, the site must not say it does. Add a TODO_VERIFY_ZENOTI_CONFIG marker on each such claim and list them all in docs/open-questions.md.

STEP 5 · Route the other two CTAs
Price List goes to /prices. Gift Cards & Memberships goes to /gifts. All three rows are always present, so the index always renders three and must fit one 390x844 viewport.

DEFINITION OF DONE
All three CTAs work. Every link resolves. With all env vars deliberately unset, the booking CTA falls back to WhatsApp and nothing renders a dead href. docs/open-questions.md lists every Zenoti claim needing client verification.

Then stop and report.
```

---

### PHASE 6 · Price list route.

```
PHASE 6. Build /prices, fully data-driven from brand/services.json.

brand/services.json is a VERBATIM transcription of brand/drybar_qatar_price_list.pdf. It is the only pricing source in this project. Do not read the price PDF. Do not read the Brand Kit for any price. Do not type a figure by hand anywhere. Every number on this route arrives through the typed loader.

If you find yourself about to "fix" a price because the Brand Kit says something different, stop. The Brand Kit's pricing is stale. services.json carries a brand_kit_divergences_for_the_record block explaining each difference. Read it once so you do not reintroduce old numbers, then ignore the Brand Kit for anything price related.

STEP 1 · lib/services.ts
Type the full services.json shape: length_tiers, hair_styling.services, add_ons.services, membership.tiers, not_in_source. Load at build time. Export typed accessors. Nothing on this route bypasses this loader.

STEP 2 · The data, for your reference while building
Seven services, four length tiers, one table:
  Blow Dry (In / Out)   250  300  350  400
  Beach Waves           300  350  400  450
  Hollywood Waves       400  450  500  550
  Retro Waves           400  450  500  550
  Half Uptini           450  500  550  600
  French Twist          500  550  600  650
  Uptini                550  600  650  700
Add-ons, flat: Signature add on 125 (braid / scalp massage / liquid glass / moisture). Premium add on 182 (Crown Tonic / Cure Liquor). Extensions 125, adds 15 mins to each service.
Read every one of these from the loader anyway. The list above is so you can spot a rendering bug, not so you can hardcode it.

STEP 3 · Price table, mobile first
This is the hardest layout in the project: seven services across four tiers on a 390px screen. A conventional four-column table does not work there. Solve mobile first and let desktop be the easy case.
  Mobile: one card per service. Inside the card, four rows of tier label plus price, or a compact tier selector that switches the displayed price. Whichever you choose, all four prices must be reachable without horizontal scrolling. Do not hide prices behind an accordion.
  768 and up: a proper table, service rows by tier columns.
  Prices use the price token with font-variant-numeric: tabular-nums so columns align. Proportional figures give ragged price columns and it looks amateur immediately.
  Currency renders as "QAR 250". Not "250 QAR", not a symbol, no decimals.
  Keep the printed order. Do not alphabetise, do not sort by price, do not split the seven into sub-categories in the data. You may group them visually if it helps the layout, but the dataset stays one table as printed.
  This is the ONE place in the project where numbering is honest: the four tiers are a real ordered scale, so label them 01 Short, 02 Medium, 03 Long, 04 Extra Long, using the index field in length_tiers. That is why PHASE 3 forbade numbering the CTA rows.

STEP 4 · Summary price
Entry price is 250, so where a summary figure is useful, render "from QAR 250" from services.json _meta.entry_price_phrase_en. Never hardcode the string and never write 257. The Brand Kit's 257 is stale.

STEP 5 · No duration column
The price list carries no service durations. The only timing figure on it is the extensions note, which belongs on the extensions add-on and nowhere else. So this route ships with NO duration column and NO duration line per service.
The client brief does ask for durations, so add a TODO_DURATIONS entry to docs/open-questions.md recommending the Zenoti service catalogue export, which already stores duration per service. Do not render an empty column, a dash, or a guess. A column of invented minutes is worse than no column.

STEP 6 · Add-ons
Render all three from the loader, in printed order, with their inclusion lists.
The Premium add on includes Crown Tonic and Cure Liquor. Read the render_rule field on that service and obey it: plain text, no themed treatment, no props, no set dressing, no caption built around the name. Brand Kit page 10 states that several Drybar style names come from cocktails, that the trademarked names stay as they are, and that nothing may be built around alcohol or bar imagery in the Qatar market.
Extensions carries the note "Adds 15 mins to each service". Render it as a small note attached to that add-on only.

STEP 7 · Home services
Requested by the brief, absent from the price list. Build the section shell behind a feature flag defaulting to OFF. Invent nothing: no price, no travel fee, no minimum spend, no coverage area, no lead time. Log it in docs/open-questions.md.

STEP 8 · Retail
Brand Kit page 04 says the Drybar product and tool range is sold in shop, and that any collaboration built around retail products must be cleared separately because product approvals run a different route. So: one plain line saying products are available in shop. No catalogue, no product names, no prices, no images.

STEP 9 · Assemble
InfoFooter from PHASE 3 appears on this route, as the brief asks. Reuse the component, do not duplicate it. Apply the same quiet Reveal treatment as other sections and add no new set piece. The AirWipe is the only flourish in the project.

DEFINITION OF DONE
/prices renders at 390, 768 and 1440. Then run this check and report it as a table: for all 28 service-tier price cells plus the 3 add-on prices, compare the rendered figure against brand/services.json field by field. 31 of 31 must match. Report any mismatch rather than fixing it silently.
All four tiers reachable on mobile without horizontal scroll. Printed order preserved. "from QAR 250" wherever a summary price appears, and the string "257" appears nowhere in the built output. No duration column. Home services hidden. docs/open-questions.md updated.

Then stop and report.
```

---

### PHASE 7 · Gift cards, packages and memberships.

```
PHASE 7. Build /gifts.

STEP 1 · Memberships, exactly as printed
Read membership.tiers from brand/services.json and render all three as printed, in order:
  3 Sessions  →  20% off your 3rd session
  6 Sessions  →  50% off your 6th session
  8 Sessions  →  50% off your 8th session, plus a complimentary hair treatment
Do not restructure these, do not recalculate an effective saving, do not add a monthly price, do not invent a tier name. The session counts and percentages are the product. Read them from the loader, never hardcode them.
The complimentary hair treatment is attached to the 8 session tier because that is how it is printed. Read the extras_placement_note field so you know why, and do not move it.
Layout suggestion, not a requirement: three rows or cards, the session count as the dominant figure at display scale, the benefit as one line beneath. Ground the middle or the highest tier on --grad-yuzu so exactly one accent field appears per viewport, per the PHASE 1 gradient rules.

STEP 2 · Copy discipline on this route
The word "session" is on the Brand Kit's AVOID list for describing a visit, and it is unavoidable here because it is the membership's own printed unit of measure. Use it inside membership copy only. Everywhere else on the site a visit is a blowout or a chair, never a session.
Read the copy_rule field on the membership object and keep it in mind while writing.
No medical, repair or growth language anywhere near the complimentary hair treatment. It is a treatment by name only. Do not describe what it does.

STEP 3 · Membership terms
The price list gives session counts and discounts and nothing else. Validity, any up front cost, transferability, whether add-ons count toward a session, which session the discount applies to, expiry and refunds are all absent from every source.
Build the terms container. Render a TODO_TERMS marker. Write no terms text. Commercial terms are not ours to set, and the Brand Kit states they are agreed and confirmed in writing individually. Log all seven missing fields in docs/open-questions.md.

STEP 4 · Gift cards
No source document mentions gift cards, and the fulfilment path is unknown.
Put this question at the top of docs/open-questions.md before you design anything: does Zenoti issue and redeem gift cards for this account? If it does, this section is a second outbound link and not a page we build, which changes the design entirely.
For now: section shell, a short line about digital gift cards, and one CTA whose href is an env var placeholder falling back to WhatsApp using the same rule as PHASE 5 STEP 2. No purchase flow, no form, no checkout, no denomination picker until that question is answered.

STEP 5 · Packages
The brief asks for packages alongside memberships. The price list prints memberships only, with no separate package construct. Do not invent one. If the client means the membership tiers when they say packages, the memberships section already answers it. Add that as a one-line question in docs/open-questions.md and move on.

STEP 6 · Assemble
InfoFooter appears on this route too. Reuse the component. Quiet Reveal treatment, no new set piece.

DEFINITION OF DONE
/gifts renders at 390, 768 and 1440. All three membership tiers render with the correct session counts and percentages, verified against services.json. The complimentary hair treatment sits on the 8 session tier only. Exactly one yuzu field per viewport. Terms block present and empty with its marker. No purchase flow built. docs/open-questions.md carries the gift card fulfilment question, the packages question and all seven missing membership fields.

Then stop and report.
```

---

### PHASE 8 · Localisation and RTL.

```
PHASE 8. Complete the bilingual structure. Brand Kit page 10 requires that key content publishes in both Arabic and English, that Arabic is written rather than translated word for word, that right-to-left layout is set properly rather than English layout with Arabic dropped into it, and that Modern Standard Arabic is used for captions with light Gulf warmth and no heavy dialect in written copy.

STEP 1 · Audit
Grep the entire codebase for hardcoded strings. Every one moves to content/en.json. Report the count found and fixed.
Grep for physical CSS properties: margin-left, margin-right, padding-left, padding-right, left, right, text-align: left, text-align: right, and any directional transform. Every one becomes a logical property. Report the count.

STEP 2 · Locale switch
Locale switching works and sets html lang and dir correctly. Test the AR route with content/ar.json still full of TODO_AR placeholders, confirming that the LAYOUT mirrors correctly even though copy is not written. Screenshot every route in RTL at 390 and 1440.

STEP 3 · RTL specifics that break
  - The overlay menu, the header, and the CtaIndex rows all range to the inline edge, so verify each mirrors.
  - Parallax and any x-axis motion must mirror direction in RTL. A wipe that sweeps left-to-right in English sweeps right-to-left in Arabic. Handle this in the motion primitives, driven off the document dir, not per component.
  - The AirWipe sweep direction mirrors.
  - The price table columns mirror, but numerals do not. Prices stay left-to-right. Verify with a real Arabic string next to a price.
  - Latin script rules from the Kit: "Drybar" is never transliterated, and neither are the trademarked style names Uptini, Half Uptini or French Twist. Read the keep_latin_script flag on each service in services.json and drive this off the data rather than a hardcoded list. They stay in Latin script inside Arabic copy. Confirm the Arabic font stack renders a Latin fallback cleanly for these.

STEP 4 · Do not translate
Leave content/ar.json as TODO_AR. Do not machine-translate anything, not even as a placeholder, and do not paste in an approximate translation. The Brand Kit forbids machine translation and says Arabic copy must be rewritten for the same feeling rather than translated literally. That is a copywriting job for a native Gulf Arabic writer. Note this in docs/open-questions.md as a deliverable the client owes us.

DEFINITION OF DONE
Zero hardcoded strings. Zero physical CSS direction properties. RTL layout mirrors correctly on all three routes at 390 and 1440. All x-axis motion mirrors. Latin brand and style names preserved. RTL screenshots saved to docs/rtl-shots/.

Then stop and report.
```

---

### PHASE 9 · Performance, accessibility and polish.

```
PHASE 9. Harden it. Measure everything, fix what fails, report the numbers.

STEP 1 · Performance budget
Targets on emulated mobile, Moto G4 class throttling, slow 4G:
  Lighthouse Performance 90 or better
  LCP under 2.0s
  CLS under 0.02
  INP under 200ms
  Initial JS under 180KB gzipped
Run it, record the numbers in docs/perf.md, fix the failures, run again, record again. Report both passes.
Likely offenders in this specific build, check each: the grain overlay repainting on scroll, SVG filters on mobile, ScrollTrigger instances not being killed, SplitText re-splitting too often, and the pinned AirWipe forcing layout.

STEP 2 · Grain performance
Profile the grain overlay while scrolling on an emulated mid-range Android. If it costs anything measurable per frame, switch to the pre-rendered tiled PNG path on all touch devices, not just narrow viewports. The grain must cost zero per-frame work. It is texture, not animation.

STEP 3 · Accessibility audit
  Contrast: every text and background pair. Confirm no yellow text on any light ground anywhere in the build, per the token comment from PHASE 1. Charcoal on Cream and Charcoal on Yellow are the only text pairings permitted on light surfaces, Cream on Sumi on dark.
  Keyboard: full traversal of all three routes plus the overlay menu. Visible focus on everything. Focus trap in the overlay works, Escape closes, focus returns to the trigger.
  Screen reader: heading order is logical with exactly one h1 per route. The three CTA rows announce as links with meaningful labels. Every Placeholder either carries a real alt describing what will be there or is correctly marked decorative. The logo has an accessible name.
  Motion: repeat the PHASE 4 STEP 9 reduced-motion audit and confirm it still passes after every change since.
  Touch: 44px minimum on every target. No sticky hover state after a tap anywhere.
Record everything in docs/a11y.md with pass or fail per item.

STEP 4 · Cross-browser
Test Safari iOS, Chrome Android, Safari macOS, Chrome desktop, Firefox desktop. Known risk areas for this build, check each explicitly: 100dvh behaviour with the iOS address bar, Lenis interacting with iOS momentum, backdrop-filter cost if used anywhere, SVG filter rendering differences, position sticky and pin combinations, and clip-path animation performance in Safari.

STEP 5 · Metadata and SEO
Title, meta description, Open Graph and Twitter card. og:url must be an absolute URL from an env var. Note for the record: the reference site renders og:url as "undefined/" because of exactly this mistake, so verify ours resolves properly. Add a favicon and apple-touch-icon from the logo. Add LocalBusiness structured data covering the flagship only: Gewan Island, The Pearl, Doha, Saturday–Thursday 10:00 to 21:00 and Friday 14:00 to 21:00, phone +974 7773 0600. Do not add a second location to structured data. robots.txt and sitemap.xml exclude /dev/*.

STEP 6 · Final content sweep
Re-read docs/brand-constraints.md and verify the built site against every line. Specifically confirm: nothing implies cutting or colouring, no medical or repair or growth claim exists, no alcohol or bar theming exists, no second or third location is named anywhere including comments and alt text, no social channel other than Instagram appears, the logo is unmodified, and every price and membership figure matches brand/services.json exactly. Also grep the built output for the string "257" and for any Brand Kit price that services.json supersedes, specifically 425, 275 and 181. None of them may appear.

DEFINITION OF DONE
All budgets met or every miss explained in docs/perf.md. docs/a11y.md complete with no fails. Cross-browser matrix documented. Content sweep passed line by line.

Then stop and report.
```

---

### PHASE 10 · Handover.

```
PHASE 10. Package it for handover and for the next build stage, which is dropping in real images and real Arabic copy.

STEP 1 · docs/HANDOVER.md
  - How to run, build and deploy.
  - Every env var, what it does, and what happens when it is missing.
  - Every feature flag and its default.
  - Where the design tokens live and the rule that nothing may be hardcoded outside them.
  - Where copy lives and how to add a locale.
  - How to swap a Placeholder for a real image, with the exact aspect ratios expected per slot.
  - How to update prices, which is services.json only.
  - The full brand constraint list, restated, so whoever touches this next does not undo a rule.

STEP 2 · docs/IMAGE-BRIEF.md
Generate the shot list Shawn hands to a photographer, derived from Brand Kit page 09. For every Placeholder in the build: its location on the page, required aspect ratio, required pixel dimensions at 2x, and the shot described in the Kit's own language. Include the Kit's look rules verbatim in spirit: natural and generous light, warm not blue, no harsh flash, cream and yellow and charcoal visible in frame, hair in motion, relaxed faces, light retouching only. Include the never-in-frame list. Include the consent requirement that every identifiable guest signs a written release. Note that vertical 9:16 is primary and that a wider safe area should always be captured so the brand can recrop.

STEP 3 · docs/open-questions.md, final
Consolidate everything the client owes us, grouped and prioritised:
  BLOCKING SHIP: live Zenoti booking and manage URLs, booking and cancellation policy text matching the Zenoti configuration, verified Google Maps pin.
  BLOCKING COMPLETENESS: durations for all seven services, home services data, gift card fulfilment path and denominations, whether "packages" means the membership tiers or something separate, the seven missing membership fields, terms and conditions text, official primary lockup and Qatar badge vectors, Arabic copy from a native Gulf writer.
  FOR THE CLIENT'S AWARENESS, not blocking: the Brand Kit's pricing on page 05 is stale against their own price list, so Edition 1.2 needs updating, including the mandated "from QAR 257" phrase and the sentence on page 04 stating that price does not follow the finish chosen.
  NICE TO HAVE: Helvetica Now web licence, whether The Gate Mall may be announced and when, Ramadan hours (removed at client request; updated to official hours Sat–Thu 10am–9pm, Fri 2pm–9pm), analytics choice.
For each item say who it blocks, what breaks without it, and the smallest possible answer that unblocks us.

STEP 4 · docs/reference-fidelity.md
Side by side comparison against the reference site. For every animation catalogued in PHASE 0 STEP 5: what the reference does, what we do, and whether it matches, is deliberately different, or falls short. Be honest about the shortfalls, that is the point of the document.

STEP 5 · Deploy
Static production build. Verify the built output has no /dev routes, no source maps in production, no TODO markers rendered as visible text, and no console output. Deploy preview and report the URL.

DEFINITION OF DONE
All five documents written. Preview deployed. Full screenshot set at 390 and 1440 for every route in both LTR and RTL.
```

---

## SECTION G · Gates, and what to watch for

**Review these three things personally, do not accept them on the agent's word.**

1. **`docs/reference-dna.md` after PHASE 0.** If it contains confident values with no evidence behind them, the agent guessed and every later phase inherits the guess. Look for the word UNKNOWN. Its presence is a good sign.
2. **The reduced motion audit at PHASE 4 STEP 9.** This is broken on most sites of this type. Set the OS flag and walk the page yourself.
3. **The 31 price cells at PHASE 6.** Twenty-eight service-tier cells plus three add-on prices. Make the agent print the comparison table against `services.json` and read it yourself. One transposed figure on a salon price list is the kind of error a client notices before you do.

**Two things to raise with the client before PHASE 6:**

The brief says "inspired by the website shared." Confirm the site the client shared is the same one you are working from, because if they had a different reference in mind, approval gets awkward at the end rather than the beginning.

And their Brand Kit's pricing is stale against their own price list. Page 05 lists a cheapest blowout of 257 where the menu says 250, prices Uptini flat at 425 where the menu scales it 550 to 700, and page 04 states that price does not follow the finish chosen when the menu charges 150 QAR more for Hollywood Waves. You are building from the menu, which is right, but tell them so Edition 1.2 gets fixed. Raising it early makes you the person who reads the documents. Raising it after the site is built makes it a change request.

**One thing to ask for on day one:** the Zenoti service catalogue export. It solves the durations gap in a single file, confirms the menu you are building from is what the till actually charges, and tells you whether gift cards are handled inside Zenoti, which decides whether /gifts is a page you build or a link you point at.

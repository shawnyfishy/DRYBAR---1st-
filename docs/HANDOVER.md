# Technical Handover Guide (`docs/HANDOVER.md`)

Welcome to the **Drybar Qatar** marketing application codebase. This document details how to run, build, deploy, configure, and maintain the site.

---

## 1. Quick Start & Execution

```bash
# Install dependencies (Node 18+ required)
npm install

# Start local development server (http://localhost:3000)
npm run dev

# Run production build compilation & static page generation
npm run build

# Preview production build locally
npm run start
```

---

## 2. Environment Variables & Fallback Behavior

Create a `.env.local` file in the project root:

```env
# Primary Outbound Zenoti Booking Flow URL
NEXT_PUBLIC_ZENOTI_BOOK_URL=https://drybarqatar.zenoti.com/book

# Guest Portal URL for Rescheduling & Cancellations
NEXT_PUBLIC_ZENOTI_MANAGE_URL=https://drybarqatar.zenoti.com/manage

# Fallback WhatsApp Contact Link
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/97477730600

# Gewan Island Flagship Google Maps Pin
NEXT_PUBLIC_MAPS_URL=https://maps.google.com/?q=Gewan+Island+The+Pearl+Doha

# Canonical Website URL for OpenGraph / Metadata
NEXT_PUBLIC_SITE_URL=https://drybarqatar.com
```

### Missing Environment Variable Fallback Rules:
- If `NEXT_PUBLIC_ZENOTI_BOOK_URL` or `NEXT_PUBLIC_ZENOTI_MANAGE_URL` is missing, empty, or invalid, the CTA automatically falls back to `NEXT_PUBLIC_WHATSAPP_URL` (`https://wa.me/97477730600`) with the label *"Book via WhatsApp"* (`target="_blank"`).
- **Zero Dead Links**: The application will NEVER render `#`, an empty href, or a dead 404 target.

---

## 3. Feature Flags

- `SHOW_HOME_SERVICES` (`app/prices/page.tsx`): Defaults to `false`. Controls rendering of the Home Blowout Services section shell. Do not enable until official home service pricing and coverage terms are provided by the client.

---

## 4. Design System Tokens & Rules

All design tokens live in [app/globals.css](file:///c:/Users/dhana/OneDrive/Desktop/DRYBAR%20ANTIGRAVITY/app/globals.css) under `@theme`:
- **Colors**: `--color-cream` (`#FCF9F2`), `--color-butter` (`#FDF2C9`), `--color-yellow` (`#FEDD30`), `--color-charcoal` (`#262523`), `--color-warmgrey` (`#8C867A`).
- **Gradients**: `--backgroundImage-grad-asagiri`, `--backgroundImage-grad-yuzu`, `--backgroundImage-grad-sumi`, `--backgroundImage-grad-hai`.
- **Yellow Contrast Rule**: `#FEDD30` on `#FCF9F2` is ~1.3:1 contrast and FAILS WCAG. Yellow is strictly a surface, a fill, or a rule line. **NEVER text**. Charcoal carries all text copy on light surfaces.

*CRITICAL RULE*: Nothing in the application may hardcode hex codes or pixel measurements outside `@theme`.

---

## 5. Copy & Localization

- Copy strings live in `content/en.json` (English) and `content/ar.json` (Arabic). Zero hardcoded UI strings exist in components.
- To add a new locale, create `content/[locale].json` and register the locale in `i18n/routing.ts`.

---

## 6. How to Replace Image Placeholders

To swap a `<Placeholder>` component for a real image:
1. Place optimized WebP image files in `public/images/`.
2. Replace `<Placeholder ratio="..." label="..." />` with Next.js `<Image src="..." alt="..." width={...} height={...} sizes="..." />`.
3. Respect required aspect ratios:
   - `9:16` (Vertical Reels / Hero / Styles Cards)
   - `4:5` (Editorial Stills / Memberships)
   - `1:1` (Detail Crops)

### Source Images & Large Asset Storage
High-resolution source JPGs live in the local `pictures/` directory (untracked in git to optimize repository clone speed and Vercel deployment payload size). Production uses the 25 pre-processed, optimized WebP files in `public/images/`. Run `node scripts/process-images.js` to re-generate WebP assets if source JPGs in `pictures/` are updated.

---

## 7. Price Updates

- `brand/services.json` is the **ONLY source of pricing**.
- Never read prices from PDFs or hardcode figures in components. All 28 service-tier prices and 3 add-on prices load dynamically via `lib/services.ts`.

---

## 8. Hard Brand Constraints Checklist

- **Blowouts Only**: Never suggest hair cutting, colouring, highlights, or chemical treatments.
- **No Medical Claims**: Never claim hair growth, damage repair, scalp curing, or therapeutic healing.
- **No Alcohol/Bar Imagery**: While trademarked cocktail style names (*Uptini*, *Half Uptini*) remain, do not build alcohol or barware imagery around them in Qatar.
- **Single Active Location**: Gewan Island, The Pearl, Doha is the ONLY location.
- **Single Social Channel**: Instagram `@thedrybar.qatar` is the ONLY social link.

# Consolidated Open Questions & Client Action Items (`docs/open-questions.md`)

This document consolidates every client action item, configuration dependency, and brand clarification required for final site launch.

---

## 1. BLOCKING SHIP (Must be provided before launching live site)

### 1.1 Live Zenoti Instance URLs
- **Who it blocks**: Primary booking flow & guest portal CTA buttons.
- **What breaks without it**: Guests cannot book online or manage appointments; site falls back to WhatsApp booking.
- **Smallest unblocking answer**: Provide exact HTTPS URLs for `NEXT_PUBLIC_ZENOTI_BOOK_URL` and `NEXT_PUBLIC_ZENOTI_MANAGE_URL`.

### 1.2 Official Booking & Cancellation Policy Text
- **Who it blocks**: Footer policy compliance section (`InfoFooter`).
- **What breaks without it**: Displays `TODO_POLICY_TEXT` placeholder.
- **Smallest unblocking answer**: Provide 2–3 sentences detailing late arrival grace period and cancellation window matching Zenoti settings.

### 1.3 Verified Gewan Island Google Maps Pin URL
- **Who it blocks**: Footer location map link (`NEXT_PUBLIC_MAPS_URL`).
- **What breaks without it**: Map link defaults to `#`.
- **Smallest unblocking answer**: Provide Google Maps share URL for Gewan Island flagship.

---

## 2. BLOCKING COMPLETENESS (Required for full feature parity)

### 2.1 Service Durations Catalogue Export
- **Who it blocks**: `/prices` price table duration column.
- **What breaks without it**: Duration column is omitted to avoid inventing timing figures.
- **Smallest unblocking answer**: Export Zenoti service catalogue CSV showing appointment duration per style.

### 2.2 Native Gulf Arabic Copywriting
- **Who it blocks**: Arabic locale (`content/ar.json`).
- **What breaks without it**: Arabic route displays `TODO_AR` layout placeholders.
- **Smallest unblocking answer**: Client's native Arabic copywriter provides approved Modern Standard Arabic text (preserving *"Drybar"* and style names in Latin script).

### 2.3 7 Missing Membership Commercial Terms
- **Who it blocks**: `/gifts` membership terms block.
- **What breaks without it**: Displays `TODO_TERMS` marker.
- **Smallest unblocking answer**: Confirm in writing: (1) validity period, (2) upfront cost, (3) transferability, (4) add-on eligibility, (5) applicable session discount rule, (6) expiry policy, (7) refund policy.

### 2.4 Digital Gift Card Fulfilment Confirmation
- **Who it blocks**: `/gifts` gift card purchasing section.
- **What breaks without it**: Rendered as a WhatsApp inquiry shell without an inline checkout.
- **Smallest unblocking answer**: Confirm if Zenoti issues digital gift cards online for this account.

### 2.5 "Packages" Clarification
- **Who it blocks**: `/gifts` packages navigation scope.
- **What breaks without it**: Assumes the 3 membership tiers fulfill the package requirement.
- **Smallest unblocking answer**: Confirm if separate bundled packages exist beyond the 3 printed membership tiers.

### 2.6 Home Blowout Services Details
- **Who it blocks**: `/prices` home services section.
- **What breaks without it**: Section remains hidden behind feature flag `SHOW_HOME_SERVICES = false`.
- **Smallest unblocking answer**: Provide home service pricing, travel fee, and coverage area if home blowouts will be offered.

### 2.7 Girlie Club Monthly Membership Deliverables
- **Who it blocks**: High-resolution branding lockup & full terms on `/gifts`.
- **Items required**:
  1. **Script Wordmark Vector**: Provide "Girlie Club" wordmark as an SVG or transparent PNG file to replace the live text lockup.
  2. **"STARTING FROM" Pricing Structure**: Confirm whether "STARTING FROM" reflects hair-length tiering (Short / Medium / Long / Extra Long).
  3. **Terms & Conditions**: Provide full terms and conditions (minimum commitment, auto-renewal, cancellation policy, roll-over expiration rules).

---

## 3. FOR THE CLIENT'S AWARENESS (Brand Kit Edition 1.2 Updates Needed)

### 3.1 Stale Brand Kit Pricing
- **Issue**: Brand Kit Page 05 lists a cheapest blowout of `257` and mandates *"from QAR 257"*. The operational price list PDF lists `250`. The site ships with *"from QAR 250"*.
- **Issue**: Brand Kit Page 04 states price does not follow the finish chosen. The price list PDF prices each finish differently.
- **Recommendation**: Update Brand Kit PDF Edition 1.2 to align with the operational price list PDF.

---

## 4. NICE TO HAVE (Future Enhancements)

- [ ] **Helvetica Now Web License**: Confirm web font licensing for production host.
- [x] **Ramadan Hours Shift**: Resolved — Ramadan references removed at client request; official opening hours confirmed as Saturday–Thursday 10:00 AM – 9:00 PM and Friday 2:00 PM – 9:00 PM.
- [ ] **Analytics Selection**: Select analytics platform (Google Analytics / Plausible) to listen to `drybar:cta_click` events.

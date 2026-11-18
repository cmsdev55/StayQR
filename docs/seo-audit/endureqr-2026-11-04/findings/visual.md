# Visual, mobile and image SEO, endureqr.com (4 Nov 2026 data; report finalised 18 Nov)

Method: Playwright Chromium, 390x844 @2x (mobile) and 1366x768, all 55 URLs in pages.json, DOM metrics via evaluate. Screenshots: /Users/codingcrafts/Downloads/stayqr/docs/seo-audit/endureqr-2026-11-04/screenshots/ (`<page>_<m|d>_atf.png`, `_full.png`). Extra consent probe run with locale de-DE / Europe-Berlin.

## Pass
- Horizontal overflow stays fixed: documentElement.scrollWidth = 390 (mobile) and 1366 (desktop) on all 55 pages. Header hamburger visible (screenshots/guide-expire_m_atf.png).
- CLS 0 on all pages on mobile; desktop max 0.0002 (home 0.003 in the de-DE run, negligible).
- Body text 16px+ on prose; H1 inside first 380px on every page.
- Hero image `hero-qr-m-dark.avif` is eager with width/height set (no shift); other home images lazy and dimensioned.

## Findings

### 1. Medium: all 16 guides, 4 feature pages, plus home/pricing etc. share one OG image
Evidence: og:image is `/opengraph-image` (no hash) on the 20 pages /qr-code-with-logo, /dynamic-qr-code-generator, /app-download-qr-code, /bulk-qr-code-generator and the 16 guides; `/opengraph-image?dca541f45fa11086` on the other 35. All three URLs (and twitter-image) return the same PNG (md5 36ce43b5..., 1200x630, 209 KB). The 4 feature pages lack og:image:alt; guides set alt, but identical.
Fix:
- `/Users/codingcrafts/Downloads/stayqr/src/app/(marketing)/guides/[slug]/opengraph-image.tsx` (new, reuse `scene()`/Mark from `src/app/opengraph-image.tsx`): render `g.h1` as the headline, category label, "EndureQR Guides". Delete the hard-coded `images:` array in `guides/[slug]/page.tsx` line 36 so the file convention is used, and export `alt = g.h1`.
- Same for `src/components/content/feature-landing.tsx` line 26 (remove `images`, add per-route opengraph-image.tsx or a shared generator taking title) and add alt.
- Optionally the same for /industries/[slug] and /alternatives/[slug] and /qr-code-generator/[type] (type name in image).
- Canonicalise the hashed vs unhashed URL: the same image served at two URLs is harmless but inconsistent; stop hard-coding `/opengraph-image`.
Priority: Medium (social CTR, Discover; not rankings).

### 2. High: zero content images on guides, tools, industries, alternatives
Evidence: `<img>` count 0 and `figure` 0 on all 16 guides, /guides, 8 industry pages, 21 generator pages; only /dynamic-qr-code-generator has 1 figure and /alternatives/* 2 (screenshots/guide-expire_m_full.png, guide-expire_d_full.png: text only plus TOC). Home has 6 images, all `alt=""` (decorative hero, globe, CTA mark; acceptable, but the hero QR could carry alt). No `svg role=img` anywhere (svg count 11 to 57 per page are icons). So no image search surface and no visual answers for featured snippets.
Fix: add `<figure>` with inline SVG (`role="img"` + `<title>` + `aria-label`) or static WebP with width/height, in the guide renderer `src/app/(marketing)/guides/[slug]/page.tsx` (add optional `figure` field to the guide data model in the guides content file) so each guide gets 1 to 3 figures. Proposals (alt / caption):
- what-is-a-qr-code: anatomy diagram. Alt "Labelled diagram of a QR code: three finder squares, timing pattern, alignment square, data modules and quiet zone". Caption "The parts of a QR code."
- how-to-scan-a-qr-code: 3-step phone illustration. Alt "Phone camera pointed at a QR code with a link banner appearing". Caption "Open the camera, frame the code, tap the banner."
- how-to-make-a-qr-code: screenshot of /qr-code-generator after entering a URL (WebP, 1200w). Alt "EndureQR generator with a URL entered and a live QR preview". Caption "Enter content, see the code immediately."
- do-qr-codes-expire: flow diagram static vs dynamic. Alt "Diagram: static code encodes the URL directly; dynamic code points to a redirect that can stop if the service lapses". Caption "What actually expires is the redirect, not the code."
- static-vs-dynamic-qr-codes: side-by-side comparison diagram. Alt "Static QR code links straight to a page; dynamic QR code goes via a short redirect you can edit". Caption "Where the data lives."
- qr-code-size-for-printing: scale chart (distance vs minimum size, 10:1 rule). Alt "Chart showing minimum QR code size for scanning distances from 0.5 m to 5 m". Caption "Rule of thumb: distance divided by 10."
- qr-code-for-restaurant-menu: table-tent mock-up. Alt "Table tent with a QR code and the text Scan for menu". Caption "Place codes at eye level, not flat on wet tables."
- wifi-qr-code: screenshot of /qr-code-generator/wifi form. Alt "Wi-Fi QR generator with network name, password and encryption fields". Caption "Fields that become the WIFI: payload."
- qr-code-design-best-practices: do/don't grid (contrast, quiet zone, logo size). Alt "Four QR codes: good contrast, inverted, low contrast and oversized logo, marked pass or fail". Caption "Dark on light, 4-module quiet zone."
- qr-code-not-scanning: troubleshooting decision tree. Alt "Flowchart from QR code will not scan to checks for glare, size, contrast, damaged code and dead link". Caption "Work down the list."
- are-qr-codes-safe: diagram of a "quishing" sticker over a real code. Alt "Fake QR sticker placed over a genuine poster code redirecting to a phishing page". Caption "Check the preview URL before opening."
- qr-code-business-card: card mock-up with vCard QR on back. Alt "Business card back with a QR code linking to a contact card". Caption "Minimum 2 cm square."
- qr-code-error-correction: four-level chart L/M/Q/H with percent recovery on a damaged code. Alt "QR codes at error correction levels L, M, Q and H with recoverable damage of 7, 15, 25 and 30 percent". Caption "Higher levels tolerate logos and scuffs."
- qr-code-for-google-reviews: flow Scan, review page, 5 stars. Alt "Phone scanning a QR code that opens a Google review form". Caption "One scan to the review box."
- track-qr-code-scans: dashboard screenshot (scans by day, device, country). Alt "EndureQR dashboard with scans over time, device split and top countries". Caption "What the analytics show."
- qr-code-for-events: ticket/signage mock-up with check-in flow. Alt "Event poster QR code leading to schedule and registration". Caption "One code, updated per event day."
Also for tool/industry pages: one screenshot figure of the actual generator type (alt "<Type> QR code generator form and preview") and one industry mock-up each. Use `next/image` or `<img width height loading="lazy">`, WebP/AVIF, never lazy on the first figure if above the fold. Add `image` to Article JSON-LD pointing at the same hero figure.
Priority: High (largest gap; also improves dwell and Image/Discover eligibility).

### 3. Medium: tap targets still undersized (not fixed since 2 Nov)
Evidence (identical on all 55 pages, mobile 390; footer also on desktop):
- Footer links 17px tall (e.g. "Dynamic QR codes" 126x17, "FAQ" 27x17, "vs Bitly" 48x17); bottom row About/Contact/Terms/Privacy 36 to 50 x 19; "Privacy settings" 115x19.
- Breadcrumb "Home" 29x19 (41 pages), "Guides" 43x19, "QR code generator" 122x19.
- hello@endureqr.com 157x20 (50 pages); "See every QR code type", "Add your logo" 17px; author link in guide byline 16px.
- Desktop nav: Free generator, Features, Pricing, Guides, Compare all 21px tall.
- Related: "Advanced" disclosure 21px; INPUT range 4px track; hidden "Upload logo" input 1x1 (fine if label is large).
Fix: footer component (`src/components/layout/site-footer.tsx` or equivalent): `className="inline-flex min-h-11 items-center"` on each link, or `py-3`; same for the breadcrumb component and TOC links in `guides/[slug]/page.tsx` (`py-2.5 -my-1`); desktop nav `py-2.5`. WCAG 2.5.8 minimum is 24px; 44px recommended. TOC links look ~36px in screenshots/guide-expire_m_atf.png (improved) and are not in the small list.
Priority: Medium.

### 4. Info/Medium: AdSense auto ads active, no slot reserved, no consent UI seen
Evidence: script `adsbygoogle.js?client=ca-pub-1520133402245003` in head on every public page; requests to googleads.g.doubleclick.net and show_ads_imp fire on load (consent probe, de-DE/Berlin, mobile and desktop). A single `ins.adsbygoogle-noablate` is injected at body level, `display:none`, `data-ad-status=unfilled`, 0x0. No `aside[aria-label=Advertisement]` (the `AdSlot` component in `src/components/ads/ad-slot.tsx` renders null because `NEXT_PUBLIC_ADSENSE_SLOT_TOOL/GUIDE` are unset). No Funding Choices script, no `.fc-consent-root`, no `[role=dialog]` found, although a "Privacy settings" button appears in every footer; it calls `googlefc.showRevocationMessage`, which does nothing if no CMP loaded. CLS 0 in all runs: no shift from consent or ads today.
Risks: (a) AdSense-account not yet serving, so the future filled auto-ad insertion can shift layout (auto ads insert in content with no reserved space); (b) EU/UK/CH visitors need a Google-certified CMP: enable the Funding Choices message in the AdSense dashboard, otherwise ads will not serve and the footer button is dead; (c) the footer "Privacy settings" button is inert.
Fix: when slot IDs are set, `AdSlot` already reserves `minHeight=280`; use it and turn off Auto ads in AdSense (Ads > Site settings) or exclude areas via `data-ad-format`/page-level exclusions so reserved slots are the only placement. Hide the footer button until `window.googlefc` exists. Re-test CLS after enabling the CMP (message is an overlay, normally not shifting).
Priority: Medium before launch of ads; none today.

### 5. Low: above-the-fold CTA on tool and guide pages
Evidence: on mobile, /qr-code-generator and its 20 type pages, /qr-code-with-logo, all guides, /about, /contact have no CTA button in the first 844px; the generator form (the action) starts beneath the H1 (H1 bottom 243px, screenshots/generator_m_atf.png, wifi_m_atf.png) so the primary action is present. Guides show title, TOC, no "Create free QR"; desktop header shows "Create free QR" on all pages. Mobile header has only the hamburger, so no CTA on guides until the menu is opened or the end-of-article block.
Fix: in the guide page add a compact sticky or inline "Make your QR code free" button after the intro on mobile (below the byline, before the TOC), and show a header CTA at 390px (`hidden sm:inline-flex` currently?) in `src/components/layout/site-header.tsx`. The TOC pushes the first section about 1500px down on mobile; collapse it in `<details>` on mobile.
Priority: Low/Medium for conversion.

### 6. Low: page-level observations
- Guide H1 + intro + byline + TOC take roughly 1.8 viewports on mobile before body content (guide-expire_m_full.png); collapsed TOC would help.
- Breadcrumb on guides wraps to two lines with long mono text (guide-expire_m_atf.png); truncate current-page crumb (`truncate`) or hide last crumb on mobile.
- Muted grey mono labels (11 to 12px) on near-black are legible but small; raise to 12 to 13px and check contrast of `text-fg-subtle` (not measured numerically).
- Home images `alt=""`: fine as decorative; the globe could have alt only if it conveys content.
- Image formats: AVIF/WebP in use (hero-qr-m-dark.avif 29 KB; globe-dark.webp 102 KB is the heaviest, lazy). OG PNG 209 KB is above the typical 100 to 150 KB; no Twitter size issue (under 5 MB).

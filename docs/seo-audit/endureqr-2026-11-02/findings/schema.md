# Schema / Structured Data Audit: EndureQR (2 Nov 2026)

Score: 86 / 100 (baseline 27 Oct: 76). Live fetch of https://endureqr.com: home, /about, /pricing, /guides/do-qr-codes-expire, /qr-code-generator/wifi, /industries/restaurants, /contact. All JSON-LD is server-rendered, all blocks parse, @context is https://schema.org, URLs absolute.

## Verified fixed since 27 Oct
- One brand entity: every Organization reference (home, /about, /contact, Article author and publisher) carries `@id` https://endureqr.com/#organization. WebSite `#website` publishes to it. SoftwareApplication `#app` (pricing) publishes to it. Source: src/components/content/json-ld.tsx (ORG_ID, ORG_REF).
- Logo is now https://endureqr.com/logo-512.png (512x512 ImageObject, HTTP 200). Organization description added.
- Pricing offers match the page and src/content/plans.ts: Free $0, Pro $3.99/mo, $29/yr, Lifetime $79; UnitPriceSpecification correct.
- Old domain (endureqr.vercel.app) no longer appears.

## Findings
1. [Medium] No `sameAs`, no `alternateName` for the former StayQR name. Org node has no external profile links. Fix: src/components/content/json-ld.tsx organizationLd(); add only real profiles.
2. [Medium] Partial Organization copies. /contact and Article nodes repeat `@id` with only name/url (no logo/description). Google merges by @id only within a document, so Article publisher has no logo in that document. Fix: use full organizationLd() on guides (publisher) or add logo to ORG_REF.
3. [Medium] Tool pages' WebApplication lacks `publisher`, `@id`, and Offer `availability`. src/app/(marketing)/qr-code-generator/[type]/page.tsx:53 and qr-code-generator/page.tsx:43 (feature-landing.tsx:47 already has publisher).
4. [Low] Article: `datePublished`/`dateModified` are date-only ("2026-10-26"); valid ISO 8601 but add time and offset. All 16 guides share the generic `/opengraph-image` as `image` (valid; unique 1200x630 per guide is better). Author is the Organization (acceptable; a Person author improves E-E-A-T). src/app/(marketing)/guides/[slug]/page.tsx:67.
5. [Low] /industries (8) and /alternatives (2) pages have only FAQPage (/industries/restaurants also has BreadcrumbList); no WebPage or Service node linking to the entity. Add a WebPage with `isPartOf` `#website` and `about`.
6. [Low] Home has WebSite but no SearchAction (none needed, no site search) and no SoftwareApplication `#app` node; tool pages cannot reference it. Move softwareAppLd() into the home @graph.
7. [Info] FAQPage on 50 of 55 pages (home, pricing, tools, guides, industries). FAQ rich results retired for all sites 7 May 2026; no SERP benefit, AI benefit unconfirmed. Valid markup, leave as is.
8. [Info] SoftwareApplication on /pricing has no aggregateRating/review, so it is not eligible for the Google software-app rich result. Do not fabricate ratings.
9. [Info] /privacy and /terms have no schema: appropriate. BreadcrumbList on 52/55 pages valid (sequential positions, absolute items).

## Ready-to-use JSON-LD

Organization (add to `organizationLd()`; replace the sameAs placeholders with real profile URLs or omit if none exist):
```json
{
  "@type": "Organization",
  "@id": "https://endureqr.com/#organization",
  "name": "EndureQR",
  "alternateName": "StayQR",
  "url": "https://endureqr.com",
  "sameAs": ["<REAL_LINKEDIN_URL>", "<REAL_X_URL>"]
}
```

Tool-page WebApplication (src/app/(marketing)/qr-code-generator/[type]/page.tsx):
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "EndureQR WiFi QR code generator",
  "url": "https://endureqr.com/qr-code-generator/wifi",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any (runs in the browser)",
  "publisher": { "@id": "https://endureqr.com/#organization" },
  "isPartOf": { "@id": "https://endureqr.com/#app" },
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
}
```
(Because Google resolves @id only inside one document, also include the full Organization node in an @graph on these pages if the reference must resolve.)

Article dates:
```json
{ "datePublished": "2026-10-26T09:00:00+00:00", "dateModified": "2026-10-26T09:00:00+00:00" }
```
Suggested model change: add an optional `image` per guide in src/content/guides.ts.

Industries WebPage:
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "url": "https://endureqr.com/industries/restaurants",
  "name": "QR codes for restaurants",
  "isPartOf": { "@id": "https://endureqr.com/#website" },
  "about": { "@id": "https://endureqr.com/#app" },
  "publisher": { "@id": "https://endureqr.com/#organization" }
}
```

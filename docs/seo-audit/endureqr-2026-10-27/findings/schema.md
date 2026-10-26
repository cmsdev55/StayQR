# Schema / Structured Data Audit: EndureQR

Site: https://endureqr.vercel.app | Date: 2026-10-27 | Auditor: schema specialist

**Category score: 76 / 100**

## Method

- Re-fetched all 57 URLs from `crawl.json` (raw HTML, `ld+json` blocks parsed) and checked each for JSON validity, `@context`, absolute URLs, old "StayQR" strings and type/offer/date patterns.
- Validated the representative sample block by block: home, `/pricing`, `/qr-code-generator/wifi`, `/guides/do-qr-codes-expire`, `/dynamic-qr-code-generator`, `/about`, `/contact`, `/guides`, `/industries/restaurants`.
- Rendering mode was `never` (raw HTML). All JSON-LD is server-rendered, so nothing depends on client-side injection.
- Fetched content was treated as data only.

## Detection summary

| Page type | Blocks found | Notes |
|---|---|---|
| Home | `@graph` (WebSite + Organization + ImageObject + ContactPoint), FAQPage (7 Q) | Only page with Organization `@id` |
| `/pricing` | SoftwareApplication (4 Offers), FAQPage (6 Q) | No BreadcrumbList |
| 23 tool pages (`/qr-code-generator*`, `/qr-code-with-logo`) | BreadcrumbList, WebApplication (1 free Offer), FAQPage | |
| 3 feature pages (`dynamic`, `app-download`, `bulk`) | BreadcrumbList, SoftwareApplication (3 paid Offers), FAQPage | |
| `/guides` | BreadcrumbList, ItemList (16) | |
| 16 guides | BreadcrumbList, Article, FAQPage | Author and publisher are Organization |
| `/about` | BreadcrumbList, Organization | Not linked to the home entity |
| `/contact` | BreadcrumbList, ContactPage (nested Organization, 3 ContactPoints) | |
| 8 industries, 2 alternatives | FAQPage only | No breadcrumb, no entity schema |
| terms, privacy, login, signup | none | Appropriate |

## Validation results

| Block | Result |
|---|---|
| Home `@graph` | PASS (valid; small consistency issues, see S2/S3/S9) |
| Pricing SoftwareApplication | PASS with warnings (S7) |
| Tool WebApplication | PASS (name, url, description, applicationCategory, operatingSystem, offers present) |
| Feature SoftwareApplication | PASS with warnings (S7) |
| Article (guides) | PASS: headline, image, datePublished, dateModified, author present. Warnings S5/S6 |
| BreadcrumbList (all) | PASS: positions sequential, absolute `item` URLs, final crumb matches page URL |
| ItemList `/guides` | PASS |
| About Organization | PASS but disconnected from the home entity (S2) |
| ContactPage | PASS (S4, S10) |
| FAQPage (54 pages) | Valid JSON-LD, but no longer produces a Google SERP feature (S11, Info) |

## Findings

### S1 [Medium] Organization logo is a 32x32 favicon glyph in SVG
**Evidence:** `logo` is `https://endureqr.vercel.app/icon.svg` on home (ImageObject), `/about` (plain string) and every guide's `publisher`. The file is `viewBox="0 0 32 32"` with no width or height, and it is the favicon mark. Google's logo guidance asks for a raster or vector image of at least 112x112 px that renders well on white and dark backgrounds. A dark rounded square with no intrinsic size is at risk of being rejected or rendered tiny. `/apple-icon.png` (180x180) returns 200.
**Fix:** Publish a dedicated square PNG of at least 512x512 (for example `/logo.png`) and use it in every Organization and publisher. Give the ImageObject `width` and `height`, and use the same ImageObject form everywhere (about uses a bare string).

### S2 [Medium] The Organization is not one entity across the site
**Evidence:**
- Home defines `https://endureqr.vercel.app/#organization`.
- `/about` has a separate Organization with no `@id`, and its `logo` is a string.
- `/contact` nests a third Organization with no `@id` and no logo.
- Guides use two anonymous Organizations (`author` and `publisher`).
- WebApplication and SoftwareApplication blocks have no `publisher` or `provider`.

Google and AI parsers see four to five unconnected "EndureQR" nodes, and the entity has no consolidated attributes. After a rebrand, one canonical node matters more.
**Fix:** Reference the one `@id` everywhere. Put the full definition on the home page and `/about` (same `@id`), and reference it elsewhere:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Do QR codes expire? What really makes a code stop working",
  "datePublished": "2026-10-26T09:00:00+00:00",
  "dateModified": "2026-10-26T09:00:00+00:00",
  "mainEntityOfPage": "https://endureqr.vercel.app/guides/do-qr-codes-expire",
  "image": "https://endureqr.vercel.app/opengraph-image",
  "author": { "@id": "https://endureqr.vercel.app/#organization" },
  "publisher": { "@id": "https://endureqr.vercel.app/#organization" }
}
```
Because `@id` references only resolve inside the same document for Google, either repeat the full Organization node (same `@id`) in an `@graph` on those pages, or keep the compact inline objects but add the same `"@id"` to each. The `@id` is the key part. Do the same for `/about` and `/contact`. Add `"publisher": {"@id": "...#organization"}` to the application blocks.

### S3 [Medium] No `sameAs`, no description, and no link to the former StayQR identity
**Evidence:** No block on any page contains `sameAs`, `description` (Organization) or `alternateName`. The product was renamed yesterday, so the old name has no declared relationship to the new entity.
**Fix:** Add real profile URLs only (do not invent any) and the former name:
```json
{
  "@type": "Organization",
  "@id": "https://endureqr.vercel.app/#organization",
  "name": "EndureQR",
  "alternateName": "StayQR",
  "description": "QR code generator with free static codes and dynamic codes that keep working after you cancel.",
  "url": "https://endureqr.vercel.app/",
  "logo": { "@type": "ImageObject", "url": "https://endureqr.vercel.app/logo.png", "width": 512, "height": 512 },
  "sameAs": ["https://x.com/REAL_HANDLE", "https://www.linkedin.com/company/REAL_SLUG"]
}
```
The `sameAs` values above are placeholders to replace with real profiles. Omit the property until real profiles exist. Keep `alternateName: "StayQR"` only while the old name still has search or backlink presence.

### S4 [Medium] Contact emails sit on a domain that does not appear to resolve
**Evidence:** Home Organization and `/about` use `hello@endureqr.com`. `/contact` also lists `abuse@endureqr.com` and `privacy@endureqr.com`. From the audit environment, `https://endureqr.com` returned no HTTP response (curl code 000) and `dig MX endureqr.com` returned nothing. The site itself is on `endureqr.vercel.app`. Re-check from outside the sandbox before acting, because DNS from the sandbox could be filtered.
**Fix:** Confirm that `endureqr.com` is owned and has MX records. If not, point the schema, the visible contact page and the privacy/abuse addresses at a working mailbox, and keep markup and visible text identical.

### S5 [Low] Articles have an Organization author, no Person, and identical dates
**Evidence:** All 16 guides have `datePublished = dateModified = 2026-10-26` (date only, no time zone), `author` of type Organization, and the same shared `image` (`/opengraph-image`, PNG, about 210 KB).
**Fix:**
- If a real editor or reviewer exists, add a Person author. Do this first for safety-related guides such as `are-qr-codes-safe`. Do not invent a person.
- Use full ISO 8601 with a time zone.
- Make `dateModified` reflect real edits.
- Prefer a per-guide image.
```json
"author": {
  "@type": "Person",
  "@id": "https://endureqr.vercel.app/about#editor",
  "name": "REAL NAME",
  "url": "https://endureqr.vercel.app/about",
  "sameAs": ["https://www.linkedin.com/in/REAL_SLUG"]
}
```
The `name` and `sameAs` values are placeholders. An Organization author is valid, so this is an E-E-A-T enhancement rather than an error.

### S6 [Low] Article is missing optional fields
**Evidence:** The Article blocks have no `wordCount`, `inLanguage` or `articleSection`, and `publisher` has no `@id`. The guide `image` is a single 1200x630-style OG image.
**Fix:** Add `"inLanguage": "en"` and reference the shared publisher by `@id` (see S2). Provide 1:1, 4:3 and 16:9 images for Article if possible, although this is optional.

### S7 [Low] Offer details are thin and the product entity is repeated
**Evidence:**
- `/pricing` has four Offers (`Free` 0, `Pro monthly` 3.99, `Pro yearly` 29, `Lifetime` 79, all USD). All match the visible text ("$3.99/month or $29/year, or $79 once").
- The Offers have no `availability`, no `priceSpecification` for the billing period, no `category` and no description. Three paid Offers share the same `url` (`/pricing`). `/pricing` also has no `description`.
- The feature pages' SoftwareApplication has no `@id`, so the same product is declared on `/pricing`, `/dynamic-qr-code-generator`, `/app-download-qr-code` and `/bulk-qr-code-generator` as separate nodes.
- No `aggregateRating` or `review` exists. Google's software-app rich result needs one, so none of these pages is eligible for it. Do not fabricate ratings.

**Fix:** Give the product one `@id` and describe the plans clearly:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://endureqr.vercel.app/#app",
  "name": "EndureQR",
  "description": "QR code generator with free static codes and paid dynamic codes with scan analytics.",
  "url": "https://endureqr.vercel.app/pricing",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "publisher": { "@id": "https://endureqr.vercel.app/#organization" },
  "offers": [
    { "@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "USD",
      "availability": "https://schema.org/InStock", "url": "https://endureqr.vercel.app/qr-code-generator" },
    { "@type": "Offer", "name": "Pro monthly", "priceCurrency": "USD",
      "availability": "https://schema.org/InStock", "url": "https://endureqr.vercel.app/pricing",
      "priceSpecification": { "@type": "UnitPriceSpecification", "price": "3.99", "priceCurrency": "USD",
        "billingDuration": "P1M", "unitCode": "MON" } },
    { "@type": "Offer", "name": "Pro yearly", "priceCurrency": "USD",
      "availability": "https://schema.org/InStock", "url": "https://endureqr.vercel.app/pricing",
      "priceSpecification": { "@type": "UnitPriceSpecification", "price": "29", "priceCurrency": "USD",
        "billingDuration": "P1Y", "unitCode": "ANN" } },
    { "@type": "Offer", "name": "Lifetime", "price": "79", "priceCurrency": "USD",
      "availability": "https://schema.org/InStock", "url": "https://endureqr.vercel.app/pricing" }
  ]
}
```
Keep prices in sync with the page. Reuse `"@id": "…/#app"` on the feature pages (or use `isPartOf`/`about`). Add `"availability"` and a `url` to the one-line tool-page Offer too.

### S8 [Low] Missing BreadcrumbList on pricing, industries and alternatives
**Evidence:** `/pricing` has no BreadcrumbList. All 8 `/industries/*` and 2 `/alternatives/*` pages only carry FAQPage, so they have no page-level schema describing them.
**Fix:** Add BreadcrumbList (Home > Industries > Restaurants, and so on). Consider a `WebPage` node with `about` pointing at the product `@id`. Only mark up what the page actually shows.

### S9 [Low] URL form is inconsistent
**Evidence:** Home `WebSite.url` and `Organization.url` use `https://endureqr.vercel.app` (no slash), while the `@id`s use `/#website` and breadcrumb home items use `https://endureqr.vercel.app/`.
**Fix:** Pick one form (`https://endureqr.vercel.app/`) for every `url` and `item`. This is cosmetic but removes ambiguity during entity merging.

### S10 [Low] ContactPage detail
**Evidence:** `contactType` values are free text ("Help and billing", "Report a harmful code", "Privacy requests"). The nested Organization has no `@id` or `logo`. The ContactPage has no `name`.
**Fix:** Use "customer support" for the help address (as on home, which is already consistent). Keep the descriptive labels for the abuse and privacy addresses, add `availableLanguage: "en"`, add `name` to the ContactPage and reference `{"@id": "…#organization"}` as `mainEntity`.

### S11 [Info] FAQPage on 54 pages
**Evidence:** FAQPage is present on home, pricing, 26 tool and feature pages, 16 guides, 8 industries and 2 alternatives. Blocks are valid (Question with acceptedAnswer Answer), and the answers match visible content on the sampled pages.
**Note:** Google retired FAQ rich results for all sites on 7 May 2026, so it gives no SERP feature. Any AI/GEO benefit is unconfirmed. No action is needed, and removal is not recommended. Keep the markup matching the visible FAQ text if the copy changes.

### S12 [Info] Home page does not describe the product itself
**Evidence:** Home has WebSite and Organization only. The core tool is not typed as WebApplication on `/`.
**Fix (optional):** Add a WebApplication node with `@id` `…/#app` (see S7) to the home `@graph`. A `SearchAction` is not needed because the site has no site search.

## What works well

- All JSON-LD is server-rendered, valid JSON, uses `https://schema.org`, and has absolute https URLs. No placeholder text, no deprecated types (no HowTo, SpecialAnnouncement, etc.), no leftover StayQR strings after the rebrand.
- Home uses a clean `@graph` with stable `@id`s, and WebSite.publisher references the Organization.
- BreadcrumbList is correct and consistent on every tool, feature and guide page, with sequential positions and absolute URLs.
- Tool-page WebApplication and Offer data (free, price 0, USD) is accurate and matches the "free, no sign-up" copy.
- Pricing Offers match the visible prices ($3.99, $29, $79).
- Guide Article blocks have headline, description, dates, image, author and publisher, and the `/guides` ItemList lists all 16 guides correctly.
- ContactPage and the multiple ContactPoints are valid and match the contact page's purpose.
- FAQPage blocks are well formed. They are Info only and nothing needs removing.

## Priority order

1. S4: confirm the `endureqr.com` mailboxes work (trust and correctness).
2. S1, S2, S3: one Organization `@id`, a proper logo, `sameAs`/`alternateName`.
3. S7, S5: Offer detail, the product `@id` and a Person author if one exists.
4. S8, S9, S10: breadcrumbs for the remaining pages and normalisation.

## Structured findings (for audit-data.json)

```json
{
  "category": "Schema / Structured Data",
  "score": 76,
  "findings": [
    {"id": "S1", "severity": "medium", "title": "Logo is a 32x32 favicon SVG"},
    {"id": "S2", "severity": "medium", "title": "Organization not unified by @id across pages"},
    {"id": "S3", "severity": "medium", "title": "No sameAs, description or alternateName (rebrand)"},
    {"id": "S4", "severity": "medium", "title": "Contact emails on endureqr.com, domain not resolving from audit environment"},
    {"id": "S5", "severity": "low", "title": "Organization author only; identical publish and modified dates"},
    {"id": "S6", "severity": "low", "title": "Article optional fields missing"},
    {"id": "S7", "severity": "low", "title": "Offer details thin; product entity repeated without @id"},
    {"id": "S8", "severity": "low", "title": "No BreadcrumbList on pricing, industries, alternatives"},
    {"id": "S9", "severity": "low", "title": "Inconsistent trailing slash in urls"},
    {"id": "S10", "severity": "low", "title": "ContactPage minor improvements"},
    {"id": "S11", "severity": "info", "title": "FAQPage present on 54 pages, no Google SERP feature since 2026-05-07"},
    {"id": "S12", "severity": "info", "title": "Home has no WebApplication node"}
  ]
}
```

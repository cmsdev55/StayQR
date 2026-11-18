# Schema / Structured Data Audit: EndureQR (4 Nov 2026)

Method: live fetch (curl, raw HTML, all JSON-LD is server-rendered) of 14 pages covering every template: /, /pricing, /qr-code-generator, /qr-code-generator/wifi, /qr-code-with-logo, /dynamic-qr-code-generator, /app-download-qr-code, /bulk-qr-code-generator, /guides, /guides/do-qr-codes-expire, /about, /contact, /industries/restaurants, /alternatives/bitly. All blocks parse; @context is https://schema.org; URLs absolute; logo-512.png and /opengraph-image return 200 image/png. Schema types of the other 41 pages come from pages.json and follow the same templates (one source file each). Score: 82 / 100 (see note on the score at the end).

## Template matrix

| Template (source) | Present | Missing |
|---|---|---|
| Home (`(marketing)/page.tsx:23`) | @graph: WebSite, Organization, FAQPage | WebPage node, SoftwareApplication `#app` (only appears on pricing/feature pages), WebSite `alternateName`, Org `sameAs` plan |
| Pricing (`pricing/page.tsx:29`) | SoftwareApplication + 4 offers, Breadcrumb, FAQPage | Organization node in same document, WebPage node, description, `Offer` for Lifetime lacks priceSpecification (optional) |
| Generator hub (`qr-code-generator/page.tsx:40`) | WebApplication, Breadcrumb, FAQPage | publisher, @id, offer availability, ItemList of the 19 types, WebPage/CollectionPage |
| Type pages (`qr-code-generator/[type]/page.tsx:50`) | WebApplication, Breadcrumb, FAQPage | publisher, availability, isPartOf/@id (finding 3 from 2 Nov still open here) |
| Feature: with-logo (`feature-landing.tsx:47`) | WebApplication + publisher | availability |
| Feature: dynamic / app-download / bulk (`feature-landing.tsx:48`) | Full SoftwareApplication `#app` duplicated, description overridden | see finding 2 |
| Guides hub (`guides/page.tsx:26`) | ItemList (16), Breadcrumb | CollectionPage wrapper; ItemList is standalone, not attached to a page node |
| Guide (`guides/[slug]/page.tsx:65`) | Article (author Person, publisher, image, dates), Breadcrumb, FAQPage | date time+offset, per-guide image, publisher logo in-document, inLanguage, isPartOf |
| About (`about/page.tsx:32`) | AboutPage (mainEntity full Org), Person, Breadcrumb | Person sameAs/image/knowsAbout, WebSite link |
| Contact (`contact/page.tsx:29`) | ContactPage, partial Org, Breadcrumb | contactType consistent with Org, logo, abuse contact on Org |
| Industries (`industries/[slug]/page.tsx:62`) | Breadcrumb, FAQPage | WebPage (+about) |
| Alternatives (`alternatives/[slug]/page.tsx:62`) | Breadcrumb, FAQPage | WebPage (+about) |
| Terms / Privacy | none | none needed |

## Validation per block
- WebSite (home): PASS. `@id #website`, publisher -> `#organization`, inLanguage en. No SearchAction: correct, there is no site search.
- Organization (home, about): PASS on logo (ImageObject 512x512, `#logo`), founder (@id ref), address (locality + country only, no street: acceptable for a home-based founder), contactPoint x2, email, description. WARN: no `sameAs` (none exist yet), no `alternateName` "StayQR".
- Person (/about only): PASS (name, jobTitle, worksFor, homeLocation). Thin: no sameAs, image, description, knowsAbout.
- AboutPage / ContactPage: PASS (valid types, mainEntity). Neither links to `#website` (isPartOf) or carries `@id`.
- BreadcrumbList: PASS on every sampled page (sequential positions, absolute `item`, last crumb is current page).
- Article: PASS on required/recommended (headline, author Person, publisher, image, dates, mainEntityOfPage). WARN: dates are date-only; image is the generic `/opengraph-image` for all 16 guides; publisher node is name/url only.
- SoftwareApplication (pricing): PASS structurally. Offers have price, priceCurrency, availability, url; subscriptions have UnitPriceSpecification with billingDuration and unitCode matching src/content/plans.ts ($0, $3.99/mo, $29/yr, $79). Not eligible for the software-app rich result (needs aggregateRating or review): correct, do not fabricate.
- Product/Offer on pricing: The page uses SoftwareApplication, not Product. That is the right choice for a SaaS (Product rich results need review/rating or merchant data; none apply). Do not add Product.
- ItemList (guides hub): PASS (position, url, name). Carousel rich result needs the list items to be on the same page as full cards; it is a nice-to-have only.
- FAQPage (50 pages): valid. Info only. FAQ rich results retired for all sites 7 May 2026; no SERP benefit, AI/GEO benefit unconfirmed. Leave as is; add no more for Google.

## @id graph consistency (the main problem)
Google resolves `@id` only inside one document (and Search Console/Rich Results Test do not follow cross-page references). Current state:

| @id | Defined in full on | Referenced (not defined) on |
|---|---|---|
| `/#organization` | home, about | every Article (partial copy: name/url), contact (partial copy), pricing `publisher`, dynamic/app/bulk `publisher`, with-logo `publisher` |
| `/#website` | home | nowhere |
| `/#logo` | home, about | nowhere |
| `/about#founder` | about (Person), Article author (full copy) | Org `founder` on home, about |
| `/#app` | pricing, dynamic, app-download, bulk (same @id, four different `description` values, `url` always the home page) | nowhere |

Issues:
1. Dangling references: `publisher: {"@id": ".../#organization"}` on pricing and 3 feature pages and the `founder` ref on home resolve to nothing in those documents. Cross-page @id references are harmless but give consumers no data; the 2 Nov partial copies on guides and contact are the same problem in a different shape.
2. `#app` is defined four times with conflicting descriptions and `url` = home. On /dynamic-qr-code-generator, /app-download-qr-code, /bulk-qr-code-generator the page is a feature page, so declaring the whole product (all four offers, url = home) as that page's entity misdescribes it. Fix: define `#app` once on home and pricing; feature pages emit a WebPage that is `about` `#app`.
3. ContactPoint contradiction on the one Org @id: home/about list "customer support" + "privacy"; /contact lists "help and billing", "report a harmful code", "privacy requests". Merge consumers see both sets.

## Findings (prioritised)

1. [Medium] No Organization node on 52 of 55 pages. Every non-home page that needs a publisher refers to it by @id only. Add a shared graph helper so each page carries the full Org + `#website` (small, ~700 bytes).
2. [Medium] Feature pages (dynamic, app-download, bulk) duplicate `#app` with wrong url/description (above).
3. [Medium] Tool pages (hub + 23 type pages + with-logo partially): WebApplication has no `publisher`, no `availability`, no `@id`/`isPartOf` (carry-over from 2 Nov finding 3; fixed only for /qr-code-with-logo, and that one still lacks availability).
4. [Medium] ContactPoint sets inconsistent between /contact and Org (above); `abuse@` and `privacy@` contacts should be in one definition.
5. [Low] Article dates date-only; publisher is a stub; generic image on all 16 guides (carry-over 2 Nov finding 4). Dates are valid ISO 8601, so this is polish.
6. [Low] Industries (8) and alternatives (2) have no WebPage node (carry-over finding 5).
7. [Low] Guides hub ItemList not attached to a page; generator hub has no ItemList of its 19 types.
8. [Low] Org: no `sameAs`, no `alternateName` StayQR (carry-over finding 1). No social profiles exist, so plan only: add when the profiles are live and linked from the site footer. Person `sameAs` same rule.
9. [Info] FAQPage on 50 pages: valid, no Google benefit.
10. [Info] No AggregateRating/Review anywhere: correct. Keep it that way until real, visible, first-party-collectable reviews exist (and never self-serving ratings on Organization).
11. [Info] HowTo, SpecialAnnouncement not used: good. Do not add HowTo to the guides.

## Fixes: exact JSON-LD, keyed to file/function

### A. `src/components/content/json-ld.tsx`: add `WEBSITE_ID`, `websiteLd()`, `siteGraph()`
Every page that needs the Org then does `<JsonLd data={{ "@context": "https://schema.org", "@graph": [...siteGraph(), pageNode] }} />`. Home already has WebSite + Org; make it reuse these.
```ts
export const WEBSITE_ID = `${SITE}/#website`;
export function websiteLd() {
  return { "@type": "WebSite", "@id": WEBSITE_ID, url: SITE, name: COMPANY.name, alternateName: "StayQR", publisher: { "@id": ORG_ID }, inLanguage: "en" };
  // no potentialAction: there is no site search
}
export function siteGraph() { return [websiteLd(), organizationLd()]; }
export function webPageLd(o: { path: string; name: string; description?: string; type?: "WebPage" | "CollectionPage"; about?: string }) {
  return {
    "@type": o.type ?? "WebPage", "@id": `${SITE}${o.path}#webpage`, url: `${SITE}${o.path}`, name: o.name,
    ...(o.description ? { description: o.description } : {}),
    isPartOf: { "@id": WEBSITE_ID }, publisher: { "@id": ORG_ID }, inLanguage: "en",
    ...(o.about ? { about: { "@id": o.about } } : {}),
  };
}
```

### B. `organizationLd()`: one ContactPoint set, StayQR alias, future sameAs
```json
{
  "@type": "Organization",
  "@id": "https://endureqr.com/#organization",
  "name": "EndureQR",
  "alternateName": "StayQR",
  "url": "https://endureqr.com",
  "contactPoint": [
    { "@type": "ContactPoint", "contactType": "customer support", "email": "hello@endureqr.com", "availableLanguage": "en" },
    { "@type": "ContactPoint", "contactType": "privacy", "email": "privacy@endureqr.com", "availableLanguage": "en" },
    { "@type": "ContactPoint", "contactType": "abuse reports", "email": "abuse@endureqr.com", "availableLanguage": "en" }
  ]
}
```
(plus the existing description, logo, image, email, founder, address.) Only when real profiles exist add `"sameAs": ["https://www.linkedin.com/company/<real>", "https://x.com/<real>"]`: do not ship placeholders. Same rule for the Person node (`sameAs` with his real LinkedIn/GitHub).
/contact (`contact/page.tsx:35`): replace `{...ORG_REF, contactPoint: ...}` with `{ "@id": ORG_ID }` and put `siteGraph()` in the same @graph; delete the per-page contactPoint list (or make its contactTypes identical to the Org list above).

### C. `founderLd()`: richer Person (add only what is true and on /about)
```json
{
  "@type": "Person",
  "@id": "https://endureqr.com/about#founder",
  "name": "Armaghan Abdul Qayyum",
  "jobTitle": "Founder",
  "url": "https://endureqr.com/about",
  "description": "Founder of EndureQR. Builds the product and writes the guides, checking each fact against its primary source.",
  "knowsAbout": ["QR codes", "Dynamic QR codes", "QR code printing"],
  "worksFor": { "@id": "https://endureqr.com/#organization" },
  "homeLocation": { "@type": "Place", "address": { "@type": "PostalAddress", "addressLocality": "Lahore", "addressCountry": "PK" } }
}
```
Add `image` once a real headshot is on /about. On Articles, emit `author: { "@id": FOUNDER_ID }` and put the full Person in the same @graph (avoids the 16 full copies).

### D. Home (`(marketing)/page.tsx:23`): add WebPage + `#app`
Graph = `[websiteLd(), organizationLd(), softwareAppLd(), webPageLd({ path: "/", name: "EndureQR: Dynamic QR codes that never stop working", about: APP_ID })]`. Give the home WebPage `@id` `https://endureqr.com/#webpage` and `"primaryImageOfPage"` not needed.

### E. `softwareAppLd()`: description + featureList, still no rating
```json
{
  "@type": "SoftwareApplication",
  "@id": "https://endureqr.com/#app",
  "name": "EndureQR",
  "url": "https://endureqr.com",
  "description": "QR code generator with free static codes that never expire and dynamic codes you can edit after printing, with unlimited scans and analytics.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "inLanguage": "en",
  "featureList": ["Unlimited free static QR codes", "Dynamic QR codes you can edit after printing", "Scan analytics", "Bulk creation from CSV", "Codes keep redirecting after you cancel"],
  "publisher": { "@id": "https://endureqr.com/#organization" },
  "offers": "<keep the four existing Offer nodes unchanged>"
}
```
Offers already match plans.ts. Optional: give Free and Lifetime `priceValidUntil` is not needed; for Lifetime add `"priceSpecification": {"@type":"UnitPriceSpecification","price":"79","priceCurrency":"USD"}` for symmetry.

### F. Pricing (`pricing/page.tsx:29`): graph with WebPage
Graph = `[...siteGraph(), softwareAppLd(), webPageLd({ path: "/pricing", name: "Pricing", description: "<meta description>", about: APP_ID })]` (WebPage `@type` may be `"WebPage"`; keep Breadcrumb as is, and add `"breadcrumb": {"@id": "https://endureqr.com/pricing#breadcrumb"}` only if you also add that @id to `breadcrumbLd`). No Product, no AggregateRating.

### G. Feature pages (`feature-landing.tsx:47-48`): replace the duplicated `#app`
Dynamic, app-download, bulk: stop spreading `softwareAppLd()`. Emit:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    "<...siteGraph()>",
    {
      "@type": "WebPage",
      "@id": "https://endureqr.com/dynamic-qr-code-generator#webpage",
      "url": "https://endureqr.com/dynamic-qr-code-generator",
      "name": "Dynamic QR codes",
      "description": "Create a dynamic QR code free and edit it after printing. Pro adds unlimited codes, with unlimited scans, analytics and iPhone/Android links.",
      "isPartOf": { "@id": "https://endureqr.com/#website" },
      "about": { "@id": "https://endureqr.com/#app" },
      "publisher": { "@id": "https://endureqr.com/#organization" },
      "inLanguage": "en"
    },
    "<softwareAppLd() once, since the page is about it>"
  ]
}
```
If you prefer one node per page, instead use `SoftwareApplication` with a page-specific `@id` (`https://endureqr.com/dynamic-qr-code-generator#app`), `url` = the page, `isPartOf`/`isBasedOn` -> `#app`; do not reuse `#app` with a different description. /qr-code-with-logo branch: add `availability` (below) and `isPartOf`.

### H. Tool pages: hub (`qr-code-generator/page.tsx:40`), type pages (`[type]/page.tsx:50`), with-logo
```json
{
  "@context": "https://schema.org",
  "@graph": [
    "<...siteGraph()>",
    {
      "@type": "WebApplication",
      "@id": "https://endureqr.com/qr-code-generator/wifi#app",
      "name": "EndureQR WiFi QR code generator",
      "url": "https://endureqr.com/qr-code-generator/wifi",
      "description": "<existing description>",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any (runs in the browser)",
      "browserRequirements": "Requires JavaScript",
      "inLanguage": "en",
      "isAccessibleForFree": true,
      "publisher": { "@id": "https://endureqr.com/#organization" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock", "url": "https://endureqr.com/qr-code-generator/wifi" }
    },
    {
      "@type": "WebPage",
      "@id": "https://endureqr.com/qr-code-generator/wifi#webpage",
      "url": "https://endureqr.com/qr-code-generator/wifi",
      "name": "WiFi QR code generator",
      "isPartOf": { "@id": "https://endureqr.com/#website" },
      "mainEntity": { "@id": "https://endureqr.com/qr-code-generator/wifi#app" }
    }
  ]
}
```
Hub only (`/qr-code-generator`): same shape with `@id` `.../qr-code-generator#app`, and add an ItemList of the type pages:
```json
{
  "@type": "ItemList",
  "@id": "https://endureqr.com/qr-code-generator#types",
  "name": "QR code generators by type",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "URL QR code", "url": "https://endureqr.com/qr-code-generator/url" },
    { "@type": "ListItem", "position": 2, "name": "Text QR code", "url": "https://endureqr.com/qr-code-generator/text" },
    { "@type": "ListItem", "position": 3, "name": "WiFi QR code", "url": "https://endureqr.com/qr-code-generator/wifi" }
  ]
}
```
(generate all 19 from the types list; positions sequential.)

### I. Guide (`guides/[slug]/page.tsx:65`): Article with time, per-guide image, full publisher
```json
{
  "@context": "https://schema.org",
  "@graph": [
    "<...siteGraph()>",
    "<founderLd()>",
    {
      "@type": "Article",
      "@id": "https://endureqr.com/guides/do-qr-codes-expire#article",
      "headline": "Do QR codes expire? What really makes a code stop working",
      "description": "Static QR codes never expire. Dynamic codes can stop working when a trial, subscription or account ends. Learn how to check your codes and avoid dead ones.",
      "datePublished": "2026-10-26T09:00:00+05:00",
      "dateModified": "2026-11-02T09:00:00+05:00",
      "inLanguage": "en",
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://endureqr.com/guides/do-qr-codes-expire" },
      "isPartOf": { "@id": "https://endureqr.com/#website" },
      "image": ["https://endureqr.com/guides/do-qr-codes-expire/opengraph-image"],
      "author": { "@id": "https://endureqr.com/about#founder" },
      "publisher": { "@id": "https://endureqr.com/#organization" }
    }
  ]
}
```
Pakistan is UTC+5; use the real publish times, or `T00:00:00+05:00` if unknown. Store full ISO strings in src/content/guides.ts. Per-guide image: add a `guides/[slug]/opengraph-image.tsx` (1200x630) or an optional `image` field; Google wants image >= 1200 px wide, 16:9/4:3/1:1 variants preferred. Keep the generic image only as fallback. Keep FAQPage as is (Info).

### J. Guides hub (`guides/page.tsx:26`): CollectionPage wrapper
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://endureqr.com/guides#webpage",
      "url": "https://endureqr.com/guides",
      "name": "QR code guides",
      "isPartOf": { "@id": "https://endureqr.com/#website" },
      "publisher": { "@id": "https://endureqr.com/#organization" },
      "mainEntity": { "@id": "https://endureqr.com/guides#list" }
    },
    {
      "@type": "ItemList",
      "@id": "https://endureqr.com/guides#list",
      "numberOfItems": 16,
      "itemListElement": "<existing 16 ListItems>"
    },
    "<...siteGraph()>"
  ]
}
```

### K. About (`about/page.tsx:32-33`): merge into one graph
```json
{
  "@context": "https://schema.org",
  "@graph": [
    "<...siteGraph()>",
    "<founderLd()>",
    {
      "@type": "AboutPage",
      "@id": "https://endureqr.com/about#webpage",
      "url": "https://endureqr.com/about",
      "name": "About EndureQR",
      "isPartOf": { "@id": "https://endureqr.com/#website" },
      "mainEntity": { "@id": "https://endureqr.com/#organization" }
    }
  ]
}
```
Drop the inline full `organizationLd()` as `mainEntity` (it becomes a reference to the graph node).

### L. Contact (`contact/page.tsx:29`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    "<...siteGraph()>",
    {
      "@type": "ContactPage",
      "@id": "https://endureqr.com/contact#webpage",
      "url": "https://endureqr.com/contact",
      "name": "Contact EndureQR",
      "isPartOf": { "@id": "https://endureqr.com/#website" },
      "mainEntity": { "@id": "https://endureqr.com/#organization" }
    }
  ]
}
```

### M. Industries (`industries/[slug]/page.tsx:62`) and Alternatives (`alternatives/[slug]/page.tsx:62`)
Add (keep FAQPage and Breadcrumb):
```json
{
  "@context": "https://schema.org",
  "@graph": [
    "<...siteGraph()>",
    {
      "@type": "WebPage",
      "@id": "https://endureqr.com/industries/restaurants#webpage",
      "url": "https://endureqr.com/industries/restaurants",
      "name": "QR codes for restaurants",
      "description": "<the page meta description>",
      "isPartOf": { "@id": "https://endureqr.com/#website" },
      "about": { "@id": "https://endureqr.com/#app" },
      "publisher": { "@id": "https://endureqr.com/#organization" },
      "inLanguage": "en"
    }
  ]
}
```
For `#app` to resolve in-document either include `softwareAppLd()` in the graph or drop `about`. On /alternatives/* do NOT add Review/AggregateRating or a `Product` node for the competitor; keep `about` pointing at `#app` only.

### N. `breadcrumbLd()` (optional tidy)
Give it an `@id` so WebPage nodes can reference it: `"@id": "<page url>#breadcrumb"`; WebPage then gets `"breadcrumb": {"@id": "<page url>#breadcrumb"}`. Wrapping in the same @graph is cleaner but not required for validity.

## Suggested order
1. Add `siteGraph()`/`webPageLd()`, wire into every template (findings 1, 3, 6).
2. Fix feature-page `#app` duplicates (2) and ContactPoint conflict (4).
3. Article datetime + per-guide image (5).
4. Hub ItemList/CollectionPage (7).
5. sameAs and Person image when real profiles/headshot exist (8).

## Score note
82/100 here is lower than 86 on 2 Nov because this audit scores graph consistency across all templates (duplicate `#app`, contradictory ContactPoints, dangling references) that the 2 Nov pass did not check. No regressions: pricing offers, logo, founder Person and Article author are all verified. Nothing is invalid or at risk of a Search Console error.

No project files were edited.

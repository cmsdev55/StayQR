# EndureQR SEO audit: endureqr.vercel.app

27 October 2026 · Claude SEO v2.5.0 · 57 pages crawled (all 200) · 10 specialist checks

Specialist reports are in `findings/`: technical, content, schema, performance, geo, agentic, sxo, backlinks, sitemap
and visual. Screenshots are in `screenshots/`.

**Not measured:** there was no Search Console, GA4, CrUX field data or keyword-volume source, so rankings, traffic,
real-user Core Web Vitals and search volumes are unknown. Performance is lab data (Lighthouse mobile, 3 runs per page).

## Executive summary

**SEO Health Score: 76 / 100.** Business type: SaaS (free QR tools plus paid dynamic codes), pre-launch.

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 82 |
| Content quality (E-E-A-T) | 23% | 63 |
| On-page SEO | 20% | 86 |
| Schema | 10% | 76 |
| Performance | 10% | 93 |
| AI search readiness (GEO 63, agent readiness 78) | 10% | 67 |
| Images | 5% | 60 |

This is stricter than the earlier single-pass estimate of 85. Eight specialists scored E-E-A-T, brand entity and
search intent in depth, and those areas are where a new, anonymous site is weakest.

**The site is technically sound.** Every page is server-rendered with clean canonicals, titles, descriptions and
headings. The sitemap matches the crawl exactly. Security headers, including a CSP, are on every page. Mobile Lighthouse
scores 95–100, CLS is 0, and AI crawlers get every page.

**What holds it back is trust and identity, not code:**
- **Unregistered domain:** endureqr.com isn't registered, yet all contact emails use it.
- **Anonymous site:** no person or legal entity is named anywhere.
- **Temporary short links:** dynamic codes print a link on a temporary vercel.app host.
- **No outside signals:** the guides cite no sources and contain no images, and there's no presence elsewhere on the
  web.

### Top 5 issues

1. **Critical: endureqr.com is unregistered,** but hello@, privacy@ and abuse@endureqr.com appear on 53 of 57 pages, in
   the structured data and in llms.txt. Mail bounces, and anyone could register the domain and receive it.
2. **High: "keeps working forever" isn't backed up.** Paid codes would print `endureqr.vercel.app/r/…`, a host you don't
   own, and no page says what happens if EndureQR itself closes.
3. **High: the dynamic-code page doesn't match its search intent.** Top results let you make a dynamic code first
   (usually with a free tier); ours is a sales page with only "Start Pro".
4. **High: no named people or legal entity.** That covers guide authors, About, and the data controller in Privacy,
   which hurts E-E-A-T on how-to and safety content.
5. **High: the brand entity is split.** Only the homepage defines the Organization with an `@id`. About, Article
   publisher and the app schema each declare their own unnamed copy, there's no `sameAs`, and the logo is a 32 px icon.

### Fixed during this audit (deployed, commits 44d1730 and 8dc3c15)

- The old address's **homepage** now redirects (308) too. Before, only inner pages did.
- A **homepage claim** that contradicted pricing ("analytics on every plan", "live map") is corrected.
- "a EndureQR" → "an EndureQR" in 8 places, and the reply-time promise is the same everywhere.
- The **H1** reads correctly to text extractors ("never stop", not "neverstop").
- An **accessibility error** on pricing is fixed (`aria-label` on a span).
- The **"Make it dynamic" upsell** no longer appears for WiFi, vCard, text and other codes that can't be dynamic.

### Top 5 quick wins (each under an hour once the inputs exist)

1. Register endureqr.com and point the site, emails and short links at it.
2. Set `NEXT_PUBLIC_CONTACT_EMAIL` to a working inbox today, before the domain is ready.
3. Put the 14-day money-back line directly under every "Start Pro" button.
4. Use one Organization `@id` everywhere, with a 512 px PNG logo.
5. Add BreadcrumbList to `/pricing`, `/industries/*` and `/alternatives/*`.

## Technical SEO (82)

- **Works:** all 57 pages return 200 with a self-canonical. The robots rules are intentional (`/dashboard` and
  `/paused` blocked; auth pages noindex). HSTS, CSP, nosniff, frame options, referrer policy and permissions policy are
  on every page. Rendering is server-side, with full content in the raw HTML. There are no orphan pages.
- **Open:**
  - Short links on the temporary host (High).
  - The new Search Console property isn't verified yet (Medium).
  - No IndexNow (Low).
  - `lastmod` is on only 16 of 55 sitemap URLs (Low).
  - The 404 page reuses the homepage title (Low).
  - HSTS preload is sent on a temporary host; keep that in mind for the move (Low).

## Content quality (63)

- **Works:** accurate, plain writing. Every technical claim checked was correct (ISO/IEC 18004 facts, capacities,
  error-correction levels, RFC 2426, print maths). The 17 tool pages aren't near-duplicates (average overlap 0.19).
  Readability sits at grade 5–10.
- **Open:**
  - No named people (High).
  - Industry pages are short and share 7 identical sentences across all 8 (High).
  - Guides have no outbound sources or images (Medium).
  - The alternatives pages are thin (Medium).

## On-page SEO (86)

- **Works:** unique titles (none over 60 characters) and descriptions (none over 160), one H1 per page, internal links
  rotate across guides, and all 55 sitemap pages are linked.
- **Open:** the `/alternatives/*` titles are short (27–28 characters) and target "bitly alternative", where results
  are link shorteners rather than QR tools (see SXO).

## Schema (76)

- **Works:** all JSON-LD is valid and absolute. Breadcrumbs, Article, WebApplication, pricing Offers and the ItemList
  are correct.
- **Open:**
  - The Organization entity is split, with no `sameAs` (Medium).
  - The logo is a 32 px SVG (Medium).
  - Offers have no billing period (Low).
  - There's no BreadcrumbList on pricing, industry or comparison pages (Low).
  - FAQPage appears on 54 pages. It's valid, but Google retired FAQ rich results on 7 May 2026, so it's Info only:
    keep it, but don't expect a search-result feature.

## Performance (93, lab data only)

| Page | Perf | LCP | TBT | CLS |
|---|---|---|---|---|
| `/` | 95 | 2.81 s | 19 ms | 0 |
| `/qr-code-generator` | 98 | 2.32 s | 3 ms | 0 |
| `/qr-code-with-logo` | 98 | 2.28 s | 8 ms | 0 |
| a guide | 100 | 1.49 s | 2 ms | 0 |
| `/pricing` | 100 | 1.57 s | 9 ms | 0 |

Real TTFB from the edge was about 0.2 s (cache HIT).

- **Homepage LCP** is on the 2.5 s line because about 90 KB of font preloads compete with the hero image (Medium).
- **Smaller items** (Low): an oversized mobile hero image, legacy polyfills (no browserslist), 2,558 DOM nodes on the
  home page, and hero images without long cache headers.
- **INP** can't be measured in the lab. Check it in CrUX once there's traffic.

## AI search readiness (67)

- **Works:** 12 AI and search crawlers all get a 200 server-rendered page. Guides open with 59–100 word direct
  answers. llms.txt is valid. The generator's accessibility tree is clean enough for agents (heuristic score 96).
- **Open:**
  - No sources linked from guides (High).
  - No Bing verification or IndexNow (High, because Bing feeds ChatGPT search and Copilot).
  - No images or video (Medium).
  - No off-site presence (Medium).
  - 35% of guide H2s are phrased as questions (Medium).
  - llms.txt leaves out the 14 feature, industry and comparison pages (Low).

## Images (60)

All 10 images have alt text and every page has a social image. But guides, tool and feature pages contain no images
or diagrams, which matters on visual queries such as "QR code with logo".

## Search experience (SXO gap score 61, 3 queries)

| Query | What ranks | Our page | Match |
|---|---|---|---|
| free qr code generator | generators (about 89%) | generator, tool-first | aligned |
| do qr codes expire | blog posts (about 85%) | guide, answer-first | aligned |
| dynamic qr code generator | generators with a free dynamic tier | sales page, "Start Pro" only | **mismatch** |

- **Mobile layout:** the generator's first input sits about 1,800 px down on a phone.
- **Comparison pages:** "bitly alternative" results are link-shortener lists, so retarget to "Bitly alternative for
  QR codes".

## Backlinks

No link data exists for either hostname in the free sources (Common Crawl), and no paid source is connected. That's
expected before launch. `*.vercel.app` domain metrics belong to Vercel, so don't quote them. The 90-day link plan is in
`findings/backlinks.md`; most of it waits for endureqr.com.

---

Sections follow the claude-seo method (perceive → analyse → validate → act). Each action in `ACTION-PLAN.md` states
what it rests on, what it depends on, how we'd know it failed, and an early signal to watch.

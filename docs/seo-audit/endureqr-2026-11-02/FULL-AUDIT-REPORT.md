# EndureQR SEO audit: endureqr.com

2–3 November 2026 · Claude SEO v2.5.0 · 91 URLs crawled (55 sitemap pages + 36 noindex login/signup variants), all 200 ·
10 specialist checks · baseline: [27 October audit](../endureqr-2026-10-27/FULL-AUDIT-REPORT.md) (76/100)

Specialist reports are in `findings/` (technical, content, schema, sitemap, performance, visual, geo, agentic, sxo,
backlinks), screenshots in `screenshots/`, raw crawl in `crawl.json`.

**Not measured:** no Search Console, GA4, CrUX field data or keyword volumes, so rankings, traffic, real-user Core Web
Vitals and search demand are unknown. Performance is Lighthouse lab data (mobile, median of 3) from Pakistan.

## Executive summary

**SEO Health Score: 81 / 100** (was 76). Business type: SaaS (free QR tools plus paid dynamic codes), just launched on
its own domain.

| Category | Weight | Score | 27 Oct |
|---|---|---|---|
| Technical SEO | 22% | 88 | 82 |
| Content quality (E-E-A-T) | 23% | 69 | 63 |
| On-page SEO | 20% | 88 | 86 |
| Schema | 10% | 86 | 76 |
| Performance (lab) | 10% | 94 | 93 |
| AI search readiness (GEO 69, agent readiness 80) | 10% | 72 | 67 |
| Images | 5% | 62 | 60 |

Technical would be 93 on crawl and indexing alone; it's marked down to 88 for the mobile overflow below.

**What improved since 27 October:** the site moved to endureqr.com, and every old host (stayqr-six.vercel.app,
endureqr.vercel.app, www, http) now 308s there in one hop with paths kept. Short links print on endureqr.com. The brand
schema is one entity (`#organization`) everywhere with a real 512 px logo. Guides cite primary sources and use question
headings. Homepage LCP dropped from 2.8 s to 1.9 s.

**What holds the score back is trust, not code.** The site still names no person, company or address, nothing outside
the site mentions EndureQR yet, and some marketing copy promises more than the Terms do. Separately, one new layout bug
makes 17 pages scroll sideways on phones.

### Top 5 issues

1. **High: 17 pages scroll sideways on phones.** All 16 guides and `/dynamic-qr-code-generator` render 498 px wide on a
   390 px screen, so the menu button sits off-screen. Cause: the "On this page" list and a 480 px table sit in grid
   columns that can't shrink (no `min-w-0`). Confirmed in `screenshots/mobile_guide.png` and `mobile_dynamic_full.png`.
2. **High: no named people or legal entity.** No founder, author, company or address on About, guides or Privacy, and
   no editorial policy. Guides are credited to the Organization. This is the largest E-E-A-T and GEO limiter.
3. **High: "forever" copy goes beyond the Terms.** Comparison and FAQ copy says codes work "forever" / "for life",
   while Terms §6 promises "as long as EndureQR operates" (plus 90 days' notice and export). Make the copy match.
4. **High: no Bing verification, IndexNow not confirmed.** No `msvalidate.01` tag; `scripts/indexnow.mjs` runs only
   by hand. Bing feeds ChatGPT search and Copilot, so this matters for AI visibility too.
5. **Medium: the dynamic-code page still doesn't make a code.** The sample QR beside the link box never changes and
   scans to `endureqr.com/r/yourcode`, which returns 404. "Create" goes straight to the paid plan, while 5 of the top 6
   results offer a free or trial dynamic code.

### Top 5 quick wins

1. Add `min-w-0` to the guide and feature-page grid columns and let TOC links wrap (fixes issue 1).
2. Point the sample QR on the dynamic page at a real demo link, or show it unscannable.
3. Add the Bing verification tag, submit the sitemap in Bing Webmaster Tools, run IndexNow after each deploy.
4. Bump `updated` on the 16 guides revised on 2 November, and give every sitemap URL a real `lastModified`.
5. Fix the template grammar: "How to make a Email QR code" (17 tool pages), "How healthcare use", "Codes your hotels
   business" (8 industry pages).

## Technical SEO (88)

| Check | Result |
|---|---|
| Status, redirects | 91/91 return 200. www, http and both old vercel.app hosts 308 to endureqr.com in one hop, paths and queries kept |
| robots.txt | Allows all; disallows `/dashboard`, `/paused`; sitemap line correct |
| Canonicals | Self-referencing on 55/55 |
| Indexing | 55 sitemap pages indexable; 36 login/signup variants `noindex, follow`; `/auth/check-email` and `/auth/verify` noindex, `no-store` |
| Rendering | All pages prerendered (`x-nextjs-prerender: 1`, cache HIT); content in raw HTML |
| Security headers | HSTS, CSP, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy on every page |
| 404 | Real 404 with noindex, but its `<title>` is the homepage title (Low) |
| IndexNow | Key file live and matches the script; submission not verifiable from outside |
| Bing | No `msvalidate.01` (Medium) |
| Mobile layout | **17 pages overflow horizontally at 390 px** (High, see Visual) |

The 5–6 s response times in the crawl were not slow rendering. Those pages are cached and prerendered; repeat requests
take about 1 s from Pakistan, half of it connection setup to Vercel's Singapore edge.

## Content quality (69)

- **Better:** guides now link to primary sources and use question headings; industry pages grew to 586–643 words.
- **E-E-A-T (High):** no founder, author, company, address or editorial policy anywhere (`src/content/company.ts`).
- **Overclaiming (High):** "forever" / "for life" / "last reprint" copy in `src/content/competitors.ts` and
  `src/content/faq.ts` exceeds Terms §6.
- **Unlabelled demo data (Medium):** the homepage hero shows "Scanned in Lahore · just now · #12,409" and
  "48,291 scans this month" on a site that just launched. Label it as a demo.
- **Template grammar (Medium):** "a Email/SMS/X", "How healthcare use", "Codes your hotels business".
- **Thin or one-sided (Medium):** the two alternatives pages (613/669 words) have no "when the competitor is better"
  section; industry pages share 14 sentences.
- **No visuals (Medium):** 0 images or diagrams across guides, tool and industry pages; no first-hand tests.
- **Dates (Low):** guides revised on 2 November still say "Updated 26 October 2026".

## On-page SEO (88)

Titles 18–60 characters, all unique; descriptions 97–157, all unique; one H1 per page; no orphan pages (least-linked
pages have 4 inbound links). Open Graph image and `summary_large_image` card on 55/55. Gaps: short titles that waste
keyword room (`Pricing · EndureQR`, `Bitly alternative · EndureQR`), no "never expires" wording in the generator
titles even though that's what 4 of 9 top results say, and the 404 title.

## Schema (86)

Fixed: one `Organization` entity (`https://endureqr.com/#organization`) referenced from every page; 512 px logo;
pricing offers match the page ($0, $3.99/mo, $29/yr, $79). All JSON-LD parses.

Open (all Medium/Low): no `sameAs` or `alternateName`; guide and contact pages carry a bare Organization copy without
the logo; tool-page `WebApplication` has no `@id`, publisher or offer availability; Article dates lack a time; all 16
guides share one OG image; the 8 industry and 2 alternatives pages have only FAQPage. FAQPage on 50 pages is valid but
gives no rich result since 7 May 2026 (Info; no change needed).

## Performance (94, lab)

| Page | Perf | LCP | TBT | CLS |
|---|---|---|---|---|
| `/` | 97 | 1.91 s | 37 ms | 0.002 |
| `/qr-code-generator` | 99 | 2.07 s | 18 ms | 0 |
| `/qr-code-generator/wifi` | 92 | 1.38 s | 15 ms | 0 |
| `/guides/how-to-make-a-qr-code` | 100 | 1.54 s | 18 ms | 0 |
| `/pricing` | 98 | 2.32 s | 15 ms | 0 |
| `/industries/restaurants` | 98 | 2.22 s | 10 ms | 0.002 |

No regression. Low-priority gains: the H1 that is the LCP element on pricing and industry pages appears 1.5–2 s after
first paint (entrance animation or font swap); homepage HTML is 608 KB (a 356-`<rect>` hero QR and inlined props);
three font preloads compete with the hero image. TBT stands in for INP; there is no field data.

## Visual and mobile

- **High:** guides and the dynamic page overflow to 498 px on phones (TOC list and table in non-shrinking grid columns).
- **Medium:** home and pricing overflow by 16 px from a decorative glow (`-inset-8`) with no clipping parent.
- **Low:** footer, breadcrumb, TOC and signup legal links are 15–21 px tap targets.
- **Passes:** generator and WiFi pages fit at 390 px with ~44 px tiles; home CTA is above the fold; no ads, cookie
  banners or interstitials; CLS 0.

## AI search readiness (GEO 69, agent readiness 80)

- AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended) are all allowed.
- Guides are citation-friendly: question headings, primary-source links, server-rendered.
- Limiters: no named person, no `sameAs`, zero outside mentions; Bing not verified; `llms.txt` covers guides and tool
  pages but omits 14 pages including the dynamic product page; tool pages have no sourced 40–80 word answer passage.
- Agents: the type picker is a proper radiogroup, and ChatGPT-User and ClaudeBot get 200. The generator has no `<form>`
  element, and there's no Content-Signal line in robots.txt (optional, draft standard).

## Search experience (SXO gap 64, was 61)

| Query | Our page | Match | Main gap |
|---|---|---|---|
| dynamic qr code generator | `/dynamic-qr-code-generator` | Partial | Can't make a code before paying; demo QR scans to a 404 |
| free qr code generator | `/qr-code-generator` | Yes | First input 1,149 px down on phones; preview at 2,519 px |
| wifi qr code generator | `/qr-code-generator/wifi` | Yes | Never says the password stays in the browser |
| qr code generator no expiration | generator / home | Yes | "Never expires" missing from titles; shutdown promise only in Terms |

## Backlinks

No referring domains yet, and endureqr.com isn't in Common Crawl's latest web graph (expected for a new domain). Old
hosts pass their links on through single 308s. First opportunities: Product Hunt, Show HN / Indie Hackers,
AlternativeTo and SaaSHub, relevant subreddits within their rules, and "free QR tools" resource pages.

## Sitemap

Valid, 55 URLs, all indexable and self-canonical, nothing missing. Only 16 URLs (the guides) have `lastmod`; `priority`
is set on all 55 and ignored by Google. The 27 October report's "57" was its crawl count; its sitemap also had 55.

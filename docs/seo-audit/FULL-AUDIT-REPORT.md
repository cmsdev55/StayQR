# StayQR SEO audit: stayqr-six.vercel.app

Audited 26 October 2026 with Claude SEO v2.5.0. Crawl covered 53 of 53 URLs (every sitemap URL; no orphan pages found).
Lighthouse ran in mobile mode from a test machine in Pakistan. No Google Search Console, GA4 or keyword-volume data
was available, so rankings, traffic and search volumes are **not measured** here.

## Executive summary

**SEO Health Score: 75 / 100.** Business type: SaaS (QR code generator with paid dynamic codes), tool-led content site.

The site is well built for search. Every page returns 200 with one H1, a unique title, a meta description and a
canonical tag. 49 of 53 pages carry structured data, and nothing in the crawl was hidden behind JavaScript. Tool and
guide pages score 100 for Lighthouse performance.

The score is held down by one critical problem. Every canonical tag, every sitemap URL and the `robots.txt` sitemap
line point to `https://stayqr.com`. That domain was registered in 2022 at GoDaddy, points to a GoDaddy server and does
not answer over HTTPS. Until this is fixed, Google is told the real copy of every page lives on a site that doesn't
serve it, which can stop the live site being indexed at all.

### Top 5 issues

1. **Critical:** canonicals, sitemap and robots.txt point to `stayqr.com`, which doesn't serve this site (53/53 pages).
2. **High:** the 16 guides have no social preview image (`og:image` missing), so shares on social apps show a blank card.
3. **High:** `/login` and `/signup` are indexable thin pages (25 and 42 words); `/login` reuses the homepage description.
4. **Medium:** no security headers beyond HSTS (no `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`).
5. **Medium:** the guides have no named author or reviewer, which weakens E-E-A-T on how-to and safety content.

### Top 5 quick wins

1. Generate every absolute URL (canonical, sitemap, robots, Open Graph, JSON-LD) from `NEXT_PUBLIC_SITE_URL`.
2. Add `noindex` to `/login`, `/signup` and `/auth/*`.
3. Give the guides their Open Graph image back.
4. Trim the 8 industry descriptions (165–204 characters) to about 155 so Google shows them in full.
5. Add `/llms.txt`, `/favicon.ico`, and `WebSite` + `Organization` schema on the homepage.

## Technical SEO (score 62)

| Check | Result |
|---|---|
| Status codes | 53/53 return 200; no redirect chains |
| robots.txt | Allows all crawlers; blocks `/dashboard` and `/paused` (correct). Sitemap line points to stayqr.com |
| Sitemap | Lists all 53 indexable pages, but every `<loc>` uses stayqr.com |
| Canonicals | Present on 53/53, all pointing to the stayqr.com host |
| Meta robots / X-Robots-Tag | None set on public pages; auth pages should be `noindex` |
| HTTPS / HSTS | HTTPS everywhere; HSTS with preload (from Vercel) |
| Other security headers | Missing: CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| Rendering | Server-rendered HTML; not a client-only app. Content is visible without JavaScript |
| `lang` | `en` on every page |
| favicon.ico | 404 (an SVG icon exists; some crawlers and browsers still request /favicon.ico) |
| HTML weight | Homepage HTML is 577 KB (framework payload plus inline SVG); other pages are smaller |

## Content quality (score 74)

- **Depth:** the median page has 783 words in the main content. The 16 guides run about 1,100 to 1,600 words with
  tables, lists and FAQs; the 17 tool pages each pair the generator with steps, use cases, tips and an FAQ.
- **Thin pages:** `/login` (25 words), `/signup` (42) and `/contact` (99). Login and sign-up should be `noindex`;
  Contact is fine as a utility page.
- **Industry pages:** 329–376 words each. They're useful but shorter than the guides; each could gain a worked example
  and 2–3 more FAQs.
- **E-E-A-T:** content is accurate and specific, and competitor facts cite their sources. Weaknesses: guides are
  credited to "StayQR" rather than a person, there's no editorial or methodology page, and the About page names no
  founder or team.
- **Duplicates:** no duplicate titles or H1s. One duplicate description: `/login` uses the homepage text.

## On-page SEO (score 80)

- Titles: unique, none over 60 characters. Two read "StayQR · StayQR" (`About StayQR · StayQR`, `Contact StayQR · StayQR`).
- Descriptions: present on all pages. Eight industry descriptions run 165–204 characters and will be cut off.
- Headings: exactly one H1 per page; guides use H2/H3 in order with a table of contents.
- Internal links: every page is linked from the header, the footer or the hubs. The least-linked are newer guides
  (1–3 inbound links each), mostly from the guides index.

## Schema / structured data (score 78)

Found: FAQPage (46 pages), BreadcrumbList (37), WebApplication (18), Article (16), ItemList, Organization, ContactPage.
All JSON-LD parsed without errors.

Missing:
- `WebSite` and `Organization` on the homepage (Organization is only on /about).
- `SoftwareApplication` with an `Offer` per plan on `/pricing`.
- A `Person` author on guide `Article` markup, once there is a named author.

## Performance (score 88)

| Page | Perf | LCP | TBT | CLS |
|---|---|---|---|---|
| `/` | 83 | 3.13 s | 412 ms | 0 |
| `/qr-code-generator/wifi` | 100 | 1.49 s | 3 ms | 0 |
| `/guides/what-is-a-qr-code` | 100 | 1.57 s | 5 ms | 0 |

Lab data, one run each, mobile. The homepage cost is the 3D hero's JavaScript (TBT 412 ms) and the hero fallback image
as LCP. TTFB of 670–910 ms is mostly distance from the test machine to Vercel's `sfo1` region. No field (CrUX) data is
available yet.

## AI search readiness (score 70)

- AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) are all allowed by `robots.txt`.
- Pages answer their question in the first paragraph, use FAQ blocks and tables, and are server-rendered: good for
  citation.
- Missing `/llms.txt`, no named authors, and no `sameAs` profile links to establish the brand entity.

## Images (score 85)

10 images across the crawl, all with alt text. Social preview image missing on the 16 guides.

## Content gaps (not measured against live rankings)

Without keyword or SERP data, these come from the standard topic sets of established QR generator sites. They are
pages StayQR could support today and doesn't have:

| Gap | Fit |
|---|---|
| "QR code with logo" / custom QR code landing page | Feature exists, no dedicated page |
| "Dynamic QR code generator" landing page | Core paid feature; only covered by the homepage |
| "App store / app download QR code" | Smart redirects already do this |
| "Bulk QR code generator" | Paid feature, no landing page |
| "Google Form", "Zoom", "Spotify" QR pages | Variants of the URL type with their own search demand |
| "QR code for PDF / file" | Needs file hosting: a product gap, not just content |

Verify demand in Google Search Console or a keyword tool before writing them.

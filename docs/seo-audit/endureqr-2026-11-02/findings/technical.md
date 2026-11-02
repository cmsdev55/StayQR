# Technical SEO audit: https://endureqr.com (2026-11-02)

Method: crawl.json (91 URLs), live curl checks, read-only review of vercel.json, next.config.mjs, src/middleware.ts, scripts/indexnow.mjs. No GSC/CrUX data, so no field-data claims.

## Score: 93 / 100 (baseline 27 Oct: 82 for this category)

| Category | Status | Notes |
|---|---|---|
| Crawlability | Pass | robots.txt allows all, disallows /dashboard and /paused. Sitemap 55 URLs, all 200. |
| Indexability | Pass | 55/55 self-canonical, 36 auth variants noindex, no duplicates. |
| Redirects / migration | Pass | All three old hosts 308 to endureqr.com in one hop, including `/` and `/r/*`. |
| Security headers | Pass | 6 headers incl. CSP. |
| URL structure | Pass | `/Pricing/` and `/pricing/` both 308 to `/pricing`. |
| Mobile | Pass | viewport `width=device-width, initial-scale=1`. |
| Rendering | Pass | Prerendered, content in raw HTML. |
| IndexNow | Pass (not yet confirmed submitted) | Key file live and matches script. |
| Domain / identity | Pass (not re-verified here) | endureqr.com resolves and serves. Mailbox deliverability was not tested. |

## Status vs 27 Oct baseline

| Old finding | Now |
|---|---|
| H1 old-domain homepage returned 200 | FIXED. `stayqr-six.vercel.app/` returns 308 to `https://endureqr.com/`. vercel.json has explicit `/` rules. |
| H2 contact domain unregistered | Domain is live. Not re-tested for MX (dig not run). Verify mail before relying on it. |
| M1 QR host tied to vercel.app | FIXED. Codes now use endureqr.com. `endureqr.vercel.app/r/test` and `stayqr-six.vercel.app/r/abc` 308 straight to `endureqr.com/r/...` (single hop). Keep these rules forever. |
| M3 domain move | DONE. Canonicals, sitemap, og:image, robots all on endureqr.com. Homepage has 0 "stayqr"/"vercel.app" strings. |
| L1 IndexNow absent | FIXED. `/a1c13608465f3a199446374fd4d85e12.txt` returns 200 with the key; `scripts/indexnow.mjs` submits all sitemap URLs. |
| L2 /auth/reset noindex,nofollow | Still open, cosmetic (see L2). |
| L3 titles over 60 chars | FIXED. No crawled title exceeds 60 chars. |
| L4 sitemap lastmod 16/55, priority on all | STILL OPEN (M2). |
| L5 404 title is homepage title | STILL OPEN (L1). |
| M2 Bing verification | STILL OPEN (M1). |

## Findings

### MEDIUM

**M1. No Bing Webmaster verification tag.** Evidence: homepage has `google-site-verification` only, no `msvalidate.01`. Fix: set the Bing verification value in the metadata (`src/app/layout.tsx` verification block, or its env var), or verify Bing by importing from GSC. Also confirm the IndexNow script has actually been run against production (cannot be seen from outside).

**M2. Sitemap lastmod on 16 of 55 URLs; priority on all 55.** Evidence: `curl sitemap.xml | grep -c lastmod` = 16, `priority` = 55. Google ignores priority and only trusts lastmod if accurate. Fix in `src/app/sitemap.ts`: give every URL a real last-change date (not the build date), drop `priority`.

**M3. Slow responses in the crawl are not a rendering problem, but verify from other regions.** Evidence: all four slow pages are static. `/privacy`, `/industries/restaurants`, `/industries/events`, `/industries/retail` return `x-nextjs-prerender: 1`, `x-vercel-cache: HIT`, `age` 124 to 658 s. Repeat curls: `/` TTFB 0.96 s, `/privacy` 0.96 s, of which TCP connect + TLS took 0.54 to 0.66 s (client network latency to the edge). The 4 to 6 s crawl times were one-off (a first `/events`-style miss measured 3.9 s, MISS then HIT 1.7 s). Cause is inferred: crawl concurrency plus client network, plus occasional cache MISS after deploy (`cache-control: public, max-age=0, must-revalidate`, so every deploy invalidates the edge cache). Not dynamic rendering. Median crawl time 2.26 s was also client-side. HTML is 216 to 266 KB uncompressed, compressed ~32 to 60 KB. Fix/ask: nothing required. Optionally warm key pages after deploy, and measure real TTFB with PageSpeed or WebPageTest from a second region. Note `vercel.json` pins `regions: ["sfo1"]`, which matters only for dynamic routes (`/r/*`, API), not static pages.

### LOW

**L1. 404 page title is the homepage title.** Evidence: `/nope-xyz` returns real 404, `<meta name="robots" content="noindex">`, `<title>EndureQR: Dynamic QR codes that never stop working`. Fix: set `metadata.title = "Page not found"` in `src/app/not-found.tsx`.

**L2. `/auth/reset`, `/auth/check-email`, `/auth/verify` are `noindex, nofollow`; `/login` is `noindex, follow`.** Correct for private flow pages, so `/auth/check-email` and `/auth/verify` pass. No action unless parity is wanted.

**L3. 404 responses carry `Access-Control-Allow-Origin: *`** (Vercel static default). Not a ranking issue.

**L4. Old-host redirects are not testable for `/robots.txt` removal.** Keep the three host rules in `vercel.json` indefinitely so printed codes on old hosts keep working.

### INFO

- **Internal URLs named in the brief:** `/events` and `/retail` return 404 (noindex). The real pages are `/industries/events` and `/industries/retail`, both 200. Nothing links to the short paths in the crawl.
- **`/r/*` for crawlers:** `/r/test` (unknown slug) returns 404, `cache-control: no-store`, `x-robots-tag: noindex`, plus meta noindex. Correct. Googlebot UA gets the same.
- **`/dashboard`:** crawled as 200 in crawl.json (4.2 s) and is noindex via login redirect flow; disallowed in robots.txt. Middleware (`src/middleware.ts`, matcher `/dashboard/:path*`) redirects to `/login?next=...` without a session. Fine.
- **CSP:** `script-src 'unsafe-inline'` is intentional (static prerendering). Wildcard Google hosts are the main allow-list.
- **HSTS** includes `preload`. Submit to hstspreload.org only if every subdomain is HTTPS-ready.
- **FAQPage** rich results are restricted by Google; schema is still useful for AI extraction.
- **Rendering:** all indexable pages are prerendered, no CSR dependency. Heavy RSC payload (~270 KB on home) is a performance topic.

## Evidence summary
- `http://endureqr.vercel.app/` 308 to `https://endureqr.vercel.app/`, then 308 to `https://endureqr.com/` (2 hops for http only; https is 1 hop).
- `https://www.endureqr.com/pricing` 308 to `https://endureqr.com/pricing`.
- Sitemap: 55 `<loc>`, matches the 55 indexable crawled pages. 36 noindex auth URLs are not in the sitemap.
- robots meta: 36 crawled pages noindex, 55 indexable. Zero non-200 in the crawl.

## Priority fix list
1. Add real lastmod to all sitemap URLs, drop priority (M2).
2. Bing verification, and confirm IndexNow was submitted (M1).
3. Not-found title (L1).
4. Re-measure TTFB from a second location to close M3.

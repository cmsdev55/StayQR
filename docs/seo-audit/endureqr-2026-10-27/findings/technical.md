# Technical SEO audit: https://endureqr.vercel.app

Date: 2026-10-27. Method: crawl.json (57 pages, this morning) plus live spot checks with curl, read-only inspection of vercel.json, next.config.mjs, src/middleware.ts, robots.ts and the /r and /p routes, and `sitemap_discovery.py`. Core Web Vitals depth is left to the performance specialist.
"Observed" means seen in a response or file. "Inferred" means reasoning from observations.

## Category score: 82 / 100

| Category | Status | Notes |
|---|---|---|
| Crawlability (robots.txt, sitemap) | Pass | Valid robots.txt and sitemap. IndexNow absent (Low). |
| Indexability (canonicals, noindex, duplicates) | Pass | 57/57 self-canonical, unique titles/descriptions/H1. |
| Redirects / old-domain migration | Fail (partial) | Old-domain homepage returns 200, not 308 (High). |
| Security headers | Pass | 6 headers on 57/57 pages. Minor notes only. |
| URL structure | Pass | Clean lowercase paths, trailing slash and http handled. |
| Mobile | Pass | Viewport, theme-color, 0 images missing alt (10 images in crawl). |
| Rendering | Pass | Fully server-rendered or static, content is in raw HTML. |
| Structured data | Pass | Detected on 55/57 pages (not validated in depth). |
| Domain/identity readiness | Fail | Contact emails on an unregistered domain (High). |
| IndexNow | Not implemented | Low. |

## Findings (prioritised)

### HIGH

**H1. The old domain's homepage is not redirected: `https://stayqr-six.vercel.app/` returns 200 and serves the full EndureQR page.**
- Observed: `curl -I https://stayqr-six.vercel.app/` returns `HTTP/2 200`, `x-matched-path: /`, `etag: "e0df4655aa02e79d003667bd31c04e19"`, `content-length: 628569`. These are identical to the new domain's homepage. Repeated 3 times, and with `?a=1`, all 200. `https://stayqr-six.vercel.app` without a slash is also 200.
- Every non-root path I tested redirects correctly: `/about`, `/pricing`, `/login`, `/guides`, `/robots.txt`, `/sitemap.xml`, `/guides/what-is-a-qr-code?x=1` (query preserved), `/dashboard`, `/nonexistent`. All are single-hop 308s to the same path on endureqr.vercel.app, with `Location` and `Refresh: 0;url=...` headers. The old `/dashboard` takes two hops (308, then the middleware 307 to `/login?next=%2Fdashboard`), which is acceptable.
- The old-domain homepage body contains the new canonical (`<link rel="canonical" href="https://endureqr.vercel.app"/>`) and no "stayqr" strings. The canonical limits the damage, but Google has to pick the canonical itself. The homepage is the URL with the most inbound links and the one the verified GSC property is built on.
- vercel.json has `{"source":"/:path*","has":[{"type":"host","value":"stayqr-six.vercel.app"}],"destination":"https://endureqr.vercel.app/:path*","permanent":true}`. Inference: `/:path*` should match `/`, so this is probably a Vercel edge quirk where the prerendered `/` is served ahead of the host-conditioned redirect. I could not confirm the cause from outside.
- Fix: add an explicit root rule above the wildcard in vercel.json: `{"source":"/","has":[{"type":"host","value":"stayqr-six.vercel.app"}],"destination":"https://endureqr.vercel.app/","permanent":true}`. If that still doesn't fire, add a host check in `src/middleware.ts` for `/` (extend the matcher) that returns a 308. Verify afterwards with `curl -sI https://stayqr-six.vercel.app/` and with `/?utm=1`.

**H2. All published contact addresses are on endureqr.com, which isn't registered, so nothing sent to them can be delivered.**
- Observed: `dig +short MX endureqr.com` and `dig +short A endureqr.com` returned nothing, and whois showed no registration data. This matches your note that the domain is unregistered.
- `hello@endureqr.com` appears in the Organization/ContactPoint JSON-LD on the homepage, in `/llms.txt`, and on /about, /contact and /terms. `privacy@endureqr.com` appears on /privacy and /contact (the data-protection contact). `abuse@endureqr.com` appears on /contact and /terms. The abuse address matters because `/r/[slug]` returns 410 for codes "reported as harmful".
- Impact: support, privacy requests and abuse reports bounce. Anyone who registers the domain first receives them. Google may also see an unreachable contact in the Organization entity.
- Fix: register endureqr.com and set up mail routing before this goes any further. If that isn't imminent, temporarily show a working address (a form or an existing mailbox) on /contact, /privacy and /terms, and in the JSON-LD and llms.txt.

### MEDIUM

**M1. Printed dynamic codes are tied to the temporary hostname.**
- Observed: short links live at `https://endureqr.vercel.app/r/<slug>`. A nonexistent slug returns 404 with `x-robots-tag: noindex`, and the 404 for `/p/<slug>` is correct.
- Inferred: any code created now encodes the vercel.app host. The product promise is that "codes keep working forever", so when you move to endureqr.com, `endureqr.vercel.app/r/*` must keep resolving indefinitely. Note that `stayqr-six.vercel.app/r/*` currently 308s to the new host, so that chain also has to survive.
- Fix: decide the permanent QR host before users print codes. Either launch on endureqr.com first, or document and commit to keeping the vercel.app alias live. Keep `/r/*` served (not redirected through a chain) on every historical host, and point the old-domain rule at the final domain directly to avoid a 2-hop chain (stayqr-six, then endureqr.vercel.app, then endureqr.com).

**M2. The new Search Console property isn't set up, and no Bing verification is present.**
- Observed: the homepage has `<meta name="google-site-verification" content="_aQSbDKHQ7P19oXyD1tyi9InwDG8EC0hg4cFmSfRNug"/>`. There is no `msvalidate.01` tag (the Bing verification env var is presumably unset).
- Inferred: the Google HTML-tag token is tied to the Google account, so the existing tag will probably verify a new URL-prefix property for `https://endureqr.vercel.app/` immediately. This is not confirmed.
- Fix: add the property `https://endureqr.vercel.app/` in GSC and verify it. Submit `https://endureqr.vercel.app/sitemap.xml` and request indexing for the homepage and the top money pages. Keep the old property so you can watch the stayqr-six URLs drop out. Change of Address likely isn't available for a vercel.app subdomain (inference), so rely on the 308s and canonicals. Set the Bing env var and verify in Bing Webmaster Tools.

**M3. The permanent-domain move will repeat this whole exercise.**
- Observed: absolute URLs (canonicals, sitemap `<loc>`, og:image, JSON-LD @id, llms.txt) all use `https://endureqr.vercel.app`, and `siteUrl()` is the single source in robots.ts.
- Fix: before the move, confirm the base URL is driven by one env var. At cutover, 308 both vercel.app hosts to endureqr.com (per path, including `/`), change canonicals and the sitemap, add endureqr.com as a Domain property in GSC, and re-check the `Strict-Transport-Security: ...; preload` header on the new domain (see L6).

### LOW

**L1. IndexNow is not implemented.** Observed: no `indexnow` references in src, scripts, public or package.json, and `/api/indexnow` and `/indexnow.txt` return 404. Bing, Yandex and Naver recrawl more slowly without it, and the whole site was renamed yesterday. Fix: generate a key, serve `/<key>.txt`, and POST changed URLs to `https://api.indexnow.org/indexnow` after deploys. A one-off submission of all 55 sitemap URLs now would speed up rename recrawling. Google does not use IndexNow.

**L2. `/auth/reset` is `noindex, nofollow`, not the intended `noindex, follow`.** Observed: `<meta name="robots" content="noindex, nofollow"/>` on `/auth/reset`. `/login` and `/signup` are `noindex, follow` as intended. Impact is nil because the page has no useful links. Fix only if you want exact parity.

**L3. Two titles are over 60 characters including the suffix.** `/guides/how-to-scan-a-qr-code` is 61 ("How to scan a QR code on iPhone, Android or laptop · EndureQR") and `/guides/track-qr-code-scans` is 62. Google truncates by pixel width, so this is cosmetic. Four more titles are 59-60. Trim a word from the two longest if you want a clean 60 limit.

**L4. Sitemap `<lastmod>` is present for only 16 of 55 URLs.** All 16 are guides and all say 2026-10-26, the rebrand date. The Article JSON-LD also has `datePublished` and `dateModified` of 2026-10-26. Impact: Google ignores `priority` (used on every URL), and lastmod is only trusted when accurate. Fix: set lastmod on all URLs from real content-change dates, and don't overwrite it on a rebrand. Drop `priority`. Note that `/login` and `/signup` are correctly not in the sitemap.

**L5. The 404 page's `<title>` is the homepage title.** Observed: `/nonexistent-page` returns a real 404 with `<meta name="robots" content="noindex"/>`, but the title is "EndureQR: Dynamic QR codes that never stop working". Impact is minimal because it is a true 404 with noindex. Optionally set a "Page not found · EndureQR" title in `not-found.tsx`.

**L6. HSTS carries `preload` on a temporary host.** Observed: `strict-transport-security: max-age=63072000; includeSubDomains; preload` on every response. This is harmless on vercel.app. When the permanent domain goes live, only submit it to hstspreload.org once every subdomain is HTTPS-ready, because removal is slow.

**L7. Short commercial-intent titles on comparison pages.** `/alternatives/bitly` ("Bitly alternative · EndureQR", 28 chars) and `/alternatives/qrfy` (27 chars) are short for pages competing on "X alternative" queries. Consider "Bitly alternative for QR codes: $29/year, no expiry · EndureQR".

### INFO

- **I1. ads.txt returns 404.** `src/app/ads.txt/route.ts` returns 404 until `NEXT_PUBLIC_ADSENSE_CLIENT` is set. The CSP already allows Google ad hosts. Set the variable before applying for or enabling AdSense.
- **I2. Every one of the 55 indexable pages links to `/dashboard`.** It is disallowed in robots.txt and 307s to `/login?next=%2Fdashboard` when unauthenticated. This is intentional and harmless. Google can see the link but not fetch it.
- **I3. `Access-Control-Allow-Origin: *` is sent on HTML pages.** Observed on `/`, likely Vercel's static default (inferred). It is not a ranking issue. Missing Cross-Origin-Opener-Policy and Cross-Origin-Resource-Policy headers are optional hardening.
- **I4. FAQPage rich results** are limited by Google to authoritative government and health sites, so the FAQPage JSON-LD on ~50 pages should not be expected to produce visible rich results. It is harmless and still useful for AI and LLM extraction.
- **I5. Homepage canonical has no trailing slash.** It is `https://endureqr.vercel.app` while the page serves at `/`. These are equivalent for a root URL and it matches the sitemap.
- **I6. The CSP `'unsafe-inline'` for scripts** was treated as intentional and not scored. Note it makes the `*.google.com` and `*.gstatic.com` host wildcards the main remaining script-source allow-list.

## Detail by category (evidence)

**Crawlability**
- robots.txt (live): `User-agent: *`, `Allow: /`, `Disallow: /dashboard`, `Disallow: /paused`, `Sitemap: https://endureqr.vercel.app/sitemap.xml`. It points at the new host. No AI crawler is blocked (GPTBot and Googlebot user agents both get 200 on `/pricing`).
- `sitemap_discovery.py`: robots.txt declaration validated. `https://endureqr.vercel.app/sitemap.xml` is HTTP 200, `application/xml`, a valid urlset, no warnings. The fallback paths `/sitemap_index.xml`, `/sitemap-index.xml` and `/wp-sitemap.xml` are 404, which is expected.
- The sitemap has 55 URLs, all absolute on the new host, with no trailing slashes. The crawl and the sitemap match exactly except `/login` and `/signup` (the intended noindex pages). There are no redirecting, 404 or noindex URLs in the sitemap.
- `/paused` is also `noindex, nofollow` and `/p/[slug]` has `robots: {index:false}` in code. `/r/*` error pages send `x-robots-tag: noindex`.
- `/llms.txt` exists (200, text/plain), is current and uses the new brand and host. `llms-full.txt` is 404 (optional).

**Indexability**
- 57/57 pages are 200 with no redirects and no `x-robots-tag` on crawled pages. 55 have no robots meta (indexable) and 2 have `noindex, follow`.
- All 57 have a self-referencing absolute canonical on the new host (checked against the final URL). Query strings are canonicalised: `/pricing?utm_source=x` has canonical `https://endureqr.vercel.app/pricing`, and `/login?next=...` canonicalises to `/login`.
- Titles are unique (57/57), as are descriptions, canonicals and H1s. Each page has exactly one H1.
- No thin pages among indexable content. Word counts are 99 for /contact, 376 for /about, 580 to 750 for the tool and industry pages, and 1,350 to 2,050 for guides, the homepage and the feature pages. The auth pages (25 and 42 words) are noindex.
- Near-duplicate risk: the 18 `/qr-code-generator/<type>` pages are ~750 to 940 words each with unique titles and descriptions. Low risk.
- Descriptions are 97 to 157 characters. No page in the crawl is missing one.
- Internal linking: no broken internal links in the crawl. The least-linked pages (`/qr-code-generator/paypal` and `/x`) each have 4 inlinks, so there are no orphans. No remaining "stayqr" strings in crawled internal links, and 0 occurrences of "stayqr" in the homepage HTML.

**Security headers (all 57 pages, plus sitemap/robots)**
- Present: Strict-Transport-Security (`max-age=63072000; includeSubDomains; preload`), Content-Security-Policy, X-Content-Type-Options `nosniff`, X-Frame-Options `SAMEORIGIN`, Referrer-Policy `strict-origin-when-cross-origin`, Permissions-Policy (`camera=(), microphone=(), geolocation=(), interest-cohort=()`). `server: Vercel`, and no `X-Powered-By` (`poweredByHeader: false`).
- CSP also has `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'self'`. `img-src` allows any `https:`. `unsafe-eval` is dev only.
- `http://endureqr.vercel.app/` returns 308 to `https://endureqr.vercel.app/` in one hop.

**URL structure and redirects**
- Lowercase, hyphenated, shallow paths. `/pricing/` 308s to `/pricing`. `/Pricing` and `/index.html` return 404 (no duplicate paths). `/pricing?utm_source=x` is 200 with a clean canonical.
- Old domain: see H1. Path, query and fragment-less URLs are preserved. 308 is the correct status for a permanent move that keeps the method. The `Refresh: 0` header is redundant but harmless.
- The old host's `/robots.txt` and `/sitemap.xml` 308 to the new host. Googlebot follows this, but a robots.txt that redirects off-host is read as the new host's file. That is fine here.

**Mobile**
- `<meta name="viewport" content="width=device-width, initial-scale=1"/>` on the homepage, `lang="en"` on 57/57, theme-color for light and dark. 10 images in the crawl, 0 missing alt. Separate AVIF and WebP hero images preloaded per breakpoint (`media` queries). I did not render or measure touch targets, which is outside what the HTML source shows.

**Rendering**
- Next.js App Router with static prerendering: the homepage response has `x-nextjs-prerender: 1` and `x-vercel-cache: HIT`. All content, headings, links and JSON-LD are in the raw HTML (that is what the crawl measured), so there is no client-side-rendering indexing risk.
- Homepage HTML is 628,569 bytes uncompressed and ~59.7 KB over Brotli. Of the uncompressed size, ~358 KB is markup (inlined CSS ~66 KB, 151 inline SVGs ~141 KB) and ~270 KB is `self.__next_f` RSC and script payload. This is well under Google's 2 MB per-file fetch limit, but the DOM is heavy (466 `<rect>` and 933 `<span>` nodes). Hand to the performance specialist.

**Structured data (presence only)**
- Homepage: one `@graph` containing WebSite and Organization (with `@id`s and ContactPoint), plus FAQPage. Guides: BreadcrumbList, Article and FAQPage. Tool pages: BreadcrumbList, WebApplication and FAQPage. Feature pages: SoftwareApplication. Pricing: SoftwareApplication and FAQPage. All `@id`, `url` and `item` values use the new host. Only /terms and /privacy (and the noindex auth pages) have none. Run the Rich Results Test or schema validator for property-level validation, which I did not do. The Organization email and logo issues are covered in H2.

**IndexNow:** not implemented (L1).

## What already works well
- Complete rebrand hygiene: zero "stayqr" strings in the homepage HTML or internal links, and canonicals, OG tags, JSON-LD, sitemap, robots and llms.txt all use the new host.
- All paths other than the old homepage 308 in a single hop to the same path with the query preserved, including robots.txt and sitemap.xml, and `/nonexistent` correctly returns 404 after the redirect.
- Sitemap and crawl agree exactly; no non-200, redirecting or noindex URLs in the sitemap; robots.txt declares it and validates.
- Every one of the 57 pages has a unique title, description, H1 and self-canonical, one H1 each, and `lang="en"`.
- Strong security header set on every response (HSTS, CSP, nosniff, frame protection, referrer policy, permissions policy, no X-Powered-By).
- Fully static or server-rendered HTML with complete content and structured data in the raw source. No JS-rendering dependency.
- Correct noindex handling on private and transient pages: auth pages (meta), `/paused` and `/p/*` (meta), `/r/*` errors (`x-robots-tag`), `/dashboard` (robots.txt plus auth redirect).
- Query-string URLs canonicalise correctly, trailing-slash and http variants collapse to one URL, and the 404 page returns a real 404 with noindex.
- Good internal linking: no orphans, minimum 4 inlinks, and a current llms.txt.

## Priority fix list
1. Make `https://stayqr-six.vercel.app/` 308 to the new homepage (H1).
2. Register endureqr.com and its mailboxes, or swap the contact addresses until you do (H2).
3. Verify the new GSC property, submit the sitemap, and set the Bing verification (M2).
4. Decide the permanent QR host before users print codes (M1), and plan the 308 target for the endureqr.com move (M3).
5. Add IndexNow and real sitemap lastmod values (L1, L4).

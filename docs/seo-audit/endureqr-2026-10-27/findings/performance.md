# Performance audit: https://endureqr.vercel.app (2026-10-27)

Category score: **93 / 100** (lab data only)

Method: Lighthouse mobile, simulated (Lantern) throttling, 3 runs per URL, via `scripts/lighthouse.mjs` (reports in `.lighthouse/`). One-off desktop-preset runs on `/`. There is no CrUX field data (new site) and no Google API key. Every number below is lab data and not a Core Web Vitals pass/fail verdict. INP cannot be measured in Lighthouse. TBT is the lab proxy for it.

Test-machine caveat: the machine is in Pakistan and Lighthouse simulates a slow 4G profile. Simulated TTFB was 630-670 ms on every URL. Real curl TTFB from this machine was about 0.20 s, served from the Vercel Mumbai edge (`x-vercel-id: bom1`, `x-vercel-cache: HIT`). So real TTFB is well under the 0.8 s "good" line. The sfo1 origin cost does not show up for cached static pages.

## Results (mobile, median of 3)

| Page | Perf | FCP | LCP | TBT | CLS | LCP element |
|---|---|---|---|---|---|---|
| `/` | 95 (runs 94/95/96) | 1.26 s | **2.81 s** (2.69-3.05) | 19 ms | 0 | hero fallback image `hero-qr-m-dark.avif` |
| `/qr-code-generator` | 98 | 1.05 s | 2.32 s (1.46-2.32) | 3 ms | 0 | text paragraph |
| `/qr-code-with-logo` | 98 | 1.16 s | 2.28 s (1.72-2.43) | 8 ms | 0 | h1 |
| `/guides/how-to-make-a-qr-code` | 100 | 1.02 s | 1.49 s | 2 ms | 0 | paragraph |
| `/pricing` | 100 | 1.02 s | 1.57 s (1.56-2.16) | 9 ms | 0 | h1 |

Other categories on the same runs: accessibility 96-100, best-practices 100, SEO 100.

Homepage desktop preset (single runs): perf 84, 100 and 100. TBT swung between 380, 0 and 20 ms, FCP 0.3-0.4 s, LCP 0.5-0.6 s, CLS 0. Total transfer was 882 KiB, against 442 KiB on mobile. That is the lazy three.js hero loading on idle. Its chunks total about 320 KB: `bd904a5c` 105 KB, `b536a0f1` 92 KB, `f6211eb1` 71 KB and `e49654ac` 54 KB. In the one run with a long task, the 85 ms task was in chunk `1255`.

## Findings

### 1. [Medium] Homepage mobile LCP sits on the 2.5 s boundary (median 2.81 s)
- Evidence: LCP was 3.05, 2.81 and 2.69 s. Run 1 phases were TTFB 648 ms, resource load delay 821 ms, load duration 1409 ms and render delay 170 ms. The LCP element is the static hero `<img class="hero-fallback">`, loaded as `hero-qr-m-dark.avif` (29 KB).
- The LCP discovery audit passes: `fetchpriority=high`, discoverable in the initial HTML, not lazy, and there is a media-scoped `<link rel=preload>`. The image is not the problem. Most of the LCP time is simulated network latency and queueing behind 3 font preloads (about 80 KB) plus about 150 KB of JS, all on the same connection.
- On a real connection with a roughly 0.2 s edge TTFB, field LCP is likely better than the lab number. That is unconfirmed until CrUX data exists.
- Fix: (a) Drop the largest font preload or subset the fonts. `e4af272ccee01ff0` is 49.5 KB and the second chain font `bb3ef058b751a6ad` is 40.7 KB, so about 90 KB of fonts compete with the hero. Keep only the weights used above the fold. (b) Add `sizes`/a smaller variant for the mobile hero (see #2). (c) Re-measure after each change. The expected gain is about 0.2-0.4 s lab.

### 2. [Low] Mobile hero image is oversized for its display size
- Evidence: the `image-delivery-insight` audit flags `/hero-qr-m-dark.avif`, which is 585x479 but displayed at 413x338. It estimates 14 KiB savings of the 29 KB.
- Fix: add an `srcset` (e.g. 414w/828w) so DPR 1-2 phones get the right size. If the 585 px width is intentional for DPR 1.5 screens, the saving is small. Apply the same to the light variant.

### 3. [Low] Legacy JavaScript shipped (about 12 KiB) and a 2,558-element DOM on the homepage
- Evidence: `legacy-javascript-insight` flags chunk `1255-dc3ddf72a1dc71a7.js` (46.6 KB transferred) for `Array.prototype.at`, `flat` and `flatMap` polyfills (11.8 KB wasted). It flags the same chunk on every page tested. `package.json` has no `browserslist`. Chunk `1255` also accounted for 108-242 ms of scripting in desktop runs, and for the only long task seen.
- `dom-size` is 2,558 elements on `/`, flagged at score 0.5. 429 of them come from one `<svg viewBox="0 0 29 29">` QR render in the hero (one child per module). `/qr-code-generator` and `/qr-code-with-logo` also flag `dom-size`.
- Fix: add a modern `browserslist` (e.g. `"chrome >= 111, safari >= 16.4, firefox >= 111, edge >= 111"`) to drop the polyfills. Render the hero QR as a single `<path>` (run-length or merged rects) or a canvas to cut about 430 nodes. Both are low-risk, small wins.

### 4. [Low] Desktop homepage TBT is volatile because the 3D hero loads on idle
- Evidence: desktop TBT was 380 ms (perf 84) in one run and 0 and 20 ms (perf 100) in two others. Mobile is protected because the 3D hero waits for the first touch or scroll. Mobile TBT is 12-66 ms, with a 66 ms outlier on run 1.
- Risk: on desktop, if the idle callback fires while the user is clicking, INP could regress. INP is not measurable without field data.
- Fix: keep the idle load. Consider `requestIdleCallback` with a `timeout`, splitting the WebGL scene init into smaller tasks (`scheduler.yield()`), and gating the load behind `IntersectionObserver` plus a minimum delay (e.g. 1-2 s after `load`). Check INP in CrUX once the site has traffic.

### 5. [Low] Public images are revalidated on every visit
- Evidence: `/hero-qr-m-dark.avif` returns `cache-control: public, max-age=0, must-revalidate`. Static assets under `/_next/static/` are correctly `max-age=31536000, immutable`. Pages are also `max-age=0, must-revalidate` with `x-vercel-cache: HIT`, which is fine for HTML.
- Fix: add `headers()` in `next.config` giving `/hero-*.{webp,avif}`, `/globe-*.webp` and `/cta-mark-*.webp` a long `max-age` (or fingerprint the filenames). This saves a conditional request per repeat view.

### 6. [Info] AdSense is allowed by CSP but not present on the pages tested
- Evidence: the CSP allows `pagead2.googlesyndication.com` and related hosts, and the repo has `ads.txt`. The homepage HTML contained 0 references to `adsbygoogle`/`googlesyndication`. `third-parties-insight` passes.
- Risk: when ads go live, expect CLS and INP regressions unless slots have reserved `min-height` and the ad script loads after interaction or idle. Re-run this audit then.

### 7. [Info] Light-theme hero is not preloaded
- Evidence: `<html data-theme="dark">` is the default and only the dark hero images have `<link rel=preload>`. Light variants are in the markup but unpreloaded, so users with a stored light theme may see a slightly later LCP. Likely minor because the `<img>` is in the HTML and discovered by the preload scanner.

## What works well
- Guides, `/pricing` and the tool pages score 98-100 with LCP 1.5-2.3 s, TBT under 10 ms and CLS 0. Best-practices is 100 and SEO is 100 everywhere.
- CLS is 0.000 on all pages tested. Image dimensions and the hero aspect ratio are reserved (`width`/`height` and `--far`).
- The homepage LCP image is handled correctly: `fetchpriority=high`, `loading=eager`, a media-scoped preload that matches the breakpoint, and AVIF on mobile and WebP on desktop.
- The mobile 3D strategy works: the heavy three.js chunks (about 320 KB) never load on phones until the first touch or scroll. Mobile transfer was 442 KiB with 24 requests.
- Fonts use `font-display` correctly (insight passes) and are preloaded. The render-blocking, unused-JS, cache and third-party insights all pass on `/`.
- Delivery is solid: pages are cached at the Vercel edge (`x-vercel-cache: HIT`, brotli), real TTFB was about 0.2 s from Pakistan, and hashed assets are `immutable`. HTTP/2 is on, HSTS is preloaded and a CSP is set.

## Caveats
- Lab data only. Simulated throttling inflates TTFB (about 650 ms) and LCP on the machine used. The homepage LCP number is the most sensitive to that.
- Re-check LCP, INP and CLS at the 75th percentile with CrUX or PSI field data once the site has enough Chrome traffic.
- This audit's runs overwrote earlier `.lighthouse/` reports for the same paths (`_-N.json` is the homepage).

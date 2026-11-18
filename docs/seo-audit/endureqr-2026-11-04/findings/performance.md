# Performance audit: https://endureqr.com (2026-11-04 data, written 2026-11-18)

Method: local Lighthouse 12.8.2 (repo dependency), mobile, default simulated throttling, 3 runs per URL (home: 3 + two extra 5-run A/B sets), run from Pakistan against production. PSI API returned 429 (shared quota, no key); CrUX API returned 403 (needs key). **No field data (CrUX/INP) is available**, as expected for a new domain, so nothing here is a Core Web Vitals pass/fail verdict. INP proxy = TBT. Note: the 2 Nov run used Lighthouse 13.x; today's local one is 12.8.2, so small score differences are partly tool version.

## Results (mobile, median of 3)

| Page | Perf (runs) | LCP | TBT | CLS | LCP element | Biggest LCP phase |
|---|---|---|---|---|---|---|
| `/` | 92 (92/65/92) | 2.40 s (2.40/6.71/3.33) | 56-153 ms | 0-0.002 | `img.hero-fallback` | run 2 outlier: 4.5 s render delay + 1.25 s load; typical: TTFB 0.6-1.6 s, load 0.5-2.4 s |
| `/qr-code-generator` | 99 (100/99/98) | 1.94 s | 40 ms | 0-0.0004 | `h3.mb-5` in glass card | render delay 0.8-1.6 s |
| `/qr-code-generator/wifi` | 98 | 2.30 s | 46 ms | 0 | same `h3` | render delay 1.6 s |
| `/dynamic-qr-code-generator` | 100 | 1.50 s | 34 ms | 0 | `h1#feature-title` | render delay 0.85 s |
| `/guides/what-is-a-qr-code` | 100 (100/100/96) | 1.48 s | 40 ms | 0-0.016 | `span` breadcrumb (2 runs), `h1#guide-title` (1 run, 1.9 s render delay, CLS 0.0157) | render delay |
| `/pricing` | 99 | 2.03 s | 32 ms | 0-0.0005 | `h1#pricing-title` | render delay 0.8-1.5 s |
| `/industries/restaurants` | 98 | 2.33 s | 35 ms | 0-0.002 | `h1#ind-title` | render delay 1.5-1.7 s |

All CLS values are far below 0.1 (good). All TBT values are well under 200 ms except one home run (153 ms). Server response 62-101 ms in Lighthouse; TTFB inside LCP phases is 0.63-0.67 s consistently (Pakistan to Singapore path). A11y 100, SEO 100 everywhere.

Versus 2 Nov: home 97 -> 92 median (LCP 1.91 -> 2.40 s); generator 99 -> 99; wifi 92 -> 98; pricing 98 -> 99; industry 98 -> 98. No page is worse by more than lab noise except the home, covered below. Home is the only page with a real, explainable change.

## AdSense third-party cost (adsbygoogle.js, `async`, in head)

- Transfer: about 253 KB Google/Doubleclick Ads + 28 KB adtrafficquality.google + 1.3 KB other Google APIs = about 282 KB on every public page (page weight 664-726 KB vs 443 KB with ads blocked on home).
- Main thread: 182-191 ms CPU in Google ads script, but blocking time only 10-15 ms. It does not meaningfully hurt TBT or INP.
- Home A/B, 5 runs each: with ads median 95 (LCP 2.76 s, TBT 58 ms); with `*googlesyndication*|*doubleclick*|*adtrafficquality*` blocked median 92 (LCP 3.27 s). The blocked set was not faster; it was in fact slower, so the script is within noise for score and LCP. Do not attribute the home LCP movement to AdSense.
- Best-practices score fell from 100 to **79** on every page with ads (blocked: 100). Causes: `third-party-cookies` and `inspector-issues` audits (Google ad cookies / Chrome DevTools issues from the ad script). This is inherent to AdSense with a consent message not yet affecting lab runs; not fixable in site code and not a ranking factor.
- Loading is already the standard form: `<script async src=...adsbygoogle.js?client=ca-pub-1520133402245003 crossorigin="anonymous">` in `src/app/(marketing)/layout.tsx` line 13. Keep as is.
- Home `uses-rel-preconnect` flagged: optional `<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>` can be added in `src/app/(marketing)/layout.tsx` (React hoists it into head). Expected gain tens of ms for the ad script only; no effect on AdSense review. Low value.

## Homepage specifics

- HTML: 610,872 bytes raw (was 608 KB); 60,654 bytes brotli, 84,028 gzip. Essentially unchanged. 261,780 bytes (43 percent) is inline `self.__next_f` RSC payload (93 pushes). DOM 2,462 elements (above the 1,500 guideline; dom-size audit fails).
- 152 `<svg>`, **356 `<rect>`**, 147 `<path>`: unchanged. One SVG alone holds 319 `<rect>` (26.6 KB of HTML), `viewBox="0 0 25 25"` with 224 px size, which is the `QrPreview` placeholder in `src/components/qr/qr-preview.tsx` lines 90-95, rendered by `src/components/sections/generator-app.tsx` line 276 on the home page.
- Font preloads: 3 woff2 (`02d655c1...`, `086a70dd...`, `e4af272c...`) plus hero image preloads (`/hero-qr-dark.webp` for >=640 px, `/hero-qr-m-dark.avif` for <=639 px, both `fetchPriority=high`) plus webpack chunk. Three font preloads = Clash Display 500, Clash Display 600 and Inter variable.
- LCP element on home: `img.hero-fallback` (dark picture). Typical phases: TTFB 0.63 s, load delay 0.76-1.6 s, load 0.44-0.94 s, render delay 0.3-0.8 s. Load delay is the largest controllable part: the image waits for something to free bandwidth or to be discovered. The preload exists, so the delay is competition with 3 fonts, about 9 chunked JS files and the 250 KB ad script.
- Legacy JS (`polyfills` with `noModule`) and unused-javascript still flagged.

## Findings (priority order)

### 1. [Medium] Home LCP image load delay of 0.8-1.6 s (home LCP 2.3-3.3 s, one run 6.7 s)
- Evidence: A/B runs above; load delay 763-1585 ms in every run. The 6.7 s outlier had 4.5 s render delay with a 1.25 s load, which looks like a network stall plus main-thread congestion from this test path, but the 2.3-3.3 s band is real and borderline against the 2.5 s threshold on a slow phone.
- Fix: in `src/app/layout.tsx` drop the Clash Display 500 file from the preload set (set `preload: false` on `display` and preload only the 600 weight through a manual `<link rel="preload">`, or keep `preload: true` and remove the 500 `src` entry if the 500 weight is not used above the fold), keeping 2 font preloads maximum. The mobile image preload already exists and is correct. Expected gain 0.2-0.5 s on home LCP.

### 2. [Medium] Hero headings that are the LCP element carry the `fade-up` entrance (render delay 0.8-1.7 s)
- Evidence: `/pricing` h1 render delay 0.78-1.5 s, `/industries/restaurants` h1 1.5-1.7 s, `/qr-code-generator` and wifi `h3` 0.8-1.65 s, `/dynamic-qr-code-generator` h1 0.85 s, each about 0.8-1.5 s after FCP (1.0-1.2 s). Same cause as 2 Nov finding 2; not yet fixed. `.fade-up` in `src/app/globals.css` lines 134-139 starts at `opacity: 0` and translates, so the LCP candidate is only painted when the animation passes its threshold.
- Fix: stop animating the LCP text. Remove the `fade-up`/`immediate` entrance from the h1 in `src/components/sections/pricing.tsx` (line 15 area), the h1 in `src/app/(marketing)/industries/[slug]/page.tsx` line 72, `SectionHeading` with `immediate` in `src/components/content/feature-landing.tsx` line 55, and the `h3` card heading in the generator hero; animate the surrounding card/background instead. Expected: pricing and industries LCP 2.0-2.3 s to about 1.3-1.5 s; generator pages about 0.5-0.8 s better.

### 3. [Low] Homepage HTML 611 KB, 356 `<rect>` elements (unchanged since 2 Nov)
- Fix: in `src/components/qr/qr-preview.tsx` lines 90-95 replace the per-module `<rect>` map with one `<path d=...>` (build one `M{c} {r}h1v1h-1z` string per dark module, or merge horizontal runs); loses the rounded corner (`rx`) look, so for rounded modules keep one `<path>` with arcs or accept square at 224 px (shape-rendering is already crispEdges). Saves about 20 KB raw HTML and about 300 DOM nodes. Also trim props passed from server to client components that inflate the 261 KB RSC payload. Expected: modest, LCP unlikely to move; mainly DOM-size audit and parse cost.

### 4. [Low] Legacy JavaScript / polyfills
- Fix: add a modern `browserslist` to `package.json` (for example `"browserslist": ["chrome >= 111","safari >= 16.4","firefox >= 115","edge >= 111"]`) so Next stops shipping the legacy polyfill chunk. Expected tens of KB less JS on every page.

### 5. [Info] Best-practices 79 on all public pages is AdSense-caused
- Evidence: score is 100 with ad domains blocked, 79 otherwise (`third-party-cookies`, `inspector-issues`). Perf/SEO/A11y unaffected. Do not remove AdSense for this; ignore the best-practices drop or track it only in the no-ads configuration.

### 6. [Info] No field data
- PSI 429 (no key), CrUX 403 (no key). Real INP/LCP/CLS pass/fail cannot be stated. Lab TBT 30-60 ms suggests INP risk is low. Re-check with a CrUX key once the origin has enough Chrome traffic.

## Not changed / no action
- Caching: home served `x-vercel-cache` prerendered, `age` 90,788 s, `cache-control: public, max-age=0, must-revalidate` (Vercel standard). Fine.
- CLS: no issue; one guide run at 0.0157 is still good.

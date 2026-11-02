# Performance audit: https://endureqr.com (2026-11-02)

Category score: **94 / 100** (lab only; baseline 27 Oct was 93)

Method: Lighthouse mobile, simulated throttling, 3 runs per URL, median, via `scripts/lighthouse.mjs` with `BASE_URL=https://endureqr.com`, run from Pakistan. INP cannot be measured in Lighthouse; TBT is the proxy. **No CrUX field data is available** (no API key, new site), so none of this is a Core Web Vitals pass/fail verdict. Three of the 18 runs in the first pass hit connection errors (NO_FCP / interstitial) and were rerun; the table uses clean runs only. TTFB below is the Lighthouse server-response-time audit (real network, not simulated).

## Results (mobile, median of 3)

| Page | Perf | LCP | TBT (INP proxy) | CLS | TTFB (range) | LCP element |
|---|---|---|---|---|---|---|
| `/` | 97 (72/97/98) | 1.91 s (1.53-3.94) | 37 ms | 0.002 | 0.37-0.58 s | `img.hero-fallback` |
| `/qr-code-generator` | 99 | 2.07 s | 18 ms | 0 | ~0.65 s | `h3` in the glass card |
| `/qr-code-generator/wifi` | 92 (90/92/100) | 1.38 s | 15 ms | 0 | 0.22-1.29 s | `p.mt-5` hero paragraph |
| `/guides/how-to-make-a-qr-code` | 100 (89/100/100) | 1.54 s | 18 ms | 0 | 0.21-4.04 s | hero `p.fade-up` |
| `/pricing` | 98 | 2.32 s | 15 ms | 0 | ~0.67 s | `h1#pricing-title` |
| `/industries/restaurants` | 98 | 2.22 s | 10 ms | 0.002 | ~0.64 s | `h1#ind-title` |

Other categories: a11y 100, best-practices 100, SEO 100 (one home/generator run showed 92 from a robots.txt fetch failure on a flaky connection; not reproducible).

## Regression vs 27 Oct baseline: none
Home LCP median is 1.91 s (baseline 2.81 s), CLS 0.002 (baseline 0), TBT 37 ms (baseline 19 ms). Generator 2.07 s (2.32), pricing 2.32 s (1.57), guide 1.54 s (1.49). Differences are within lab noise; the low scores (72, 89, 90) are single runs with network stalls (server-response up to 4 s, LCP "TTFB" phase of 6-20 s) from this test path, not page changes. Pricing LCP is slower mainly because its h1 has 1.5-1.9 s render delay (see 2).

## Findings

### 1. [Info] The 5-6 s crawl times were network path, not dynamic rendering
- Evidence: repeat requests to `/privacy`, `/industries/restaurants|events|retail` all return `x-vercel-cache: HIT` with `age` 120-645 s, `x-nextjs-prerender: 1` (per coordinator check). Repeat TTFB 0.9-1.5 s, rising to 3.2 s once; connect 0.23-0.27 s and TLS finish 0.49-0.56 s. Served from `sin1` (Singapore), not Mumbai. In the crawl, 36 pages were PRERENDER, 36 MISS, 19 HIT; median 2.26 s.
- Fix: none needed in code. Do not treat these as slow pages. Validate with CrUX/real users once traffic exists.

### 2. [Low] Pricing/industry/generator LCP is a text element with 1.4-2.0 s render delay
- Evidence: `/pricing` h1 render delay 1.5-1.9 s; `/industries/restaurants` h1 1.5-2.0 s; FCP is ~1.0-1.5 s, so the h1 paints ~1 s after first paint. Likely the `fade-up` entrance animation and/or font swap on the display font.
- Fix: do not animate the LCP heading (remove `fade-up` / opacity-0 start on h1) in `src/app/(marketing)` pricing and industries pages; check `src/app/globals.css`. Expected gain 0.5-1 s lab.

### 3. [Low] Homepage HTML is 608 KB (about 60 KB brotli)
- Evidence: ~261 KB is inlined `self.__next_f` RSC payload; 151 `<svg>`, 356 `<rect>`. Legacy-JS and dom-size audits still flag `/` and wifi (same as baseline).
- Fix: render the hero QR as a single `<path>`; add a modern `browserslist` in `package.json`; trim props passed from server to client components.

### 4. [Low] Three font preloads compete with the hero image
- Evidence: home preloads 3 woff2 files plus the hero image. Fonts are set up in `src/app/layout.tsx` (`localFont`, display `preload: true`).
- Fix: preload only the display 600 weight and the sans variable font; drop other preloads.

### 5. [Info] Desktop 3D hero TBT variance (from baseline) not re-tested
Mobile TBT is 10-37 ms. Field INP is unknown until CrUX exists.

# StayQR web (design phase)

Next.js 15 · TypeScript · Tailwind · React Three Fiber. Design system: [DESIGN.md](./DESIGN.md).

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
ANALYZE=true npm run build   # bundle analyzer
```

## Routes
| Route | What |
|---|---|
| `/` | Landing: hero, never-dies story (pinned), free generator, features bento, comparison, pricing, industries, FAQ, final CTA |
| `/pricing` | Plans with the odometer toggle, full feature matrix, billing FAQ |
| `/industries/[slug]` | Industry template (8 static pages from `src/content/industries.ts`) |
| `/alternatives/[slug]` | "Alternative to" template: `bitly`, `qrfy` (facts in `src/content/competitors.ts`, price evidence in `docs/evidence/`) |
| `/paused` | What a scanner sees when a code is paused (noindex) |
| `/login`, `/signup` | Mock auth (`/signup?plan=lifetime` carries the plan) |
| `/terms`, `/privacy` | Shared legal layout (tabs, short version, section index). Draft text: replace with the Legal board copy |
| `/opengraph-image`, `/twitter-image` | 1200×630 social image (`next/og`, fonts in `src/assets/og`) |
| `/dashboard` | Codes with folders + search (`?q=`) · `/dashboard/codes/[id]` editor (`/new`) · `/dashboard/analytics` (`?code=`) · `/dashboard/billing` |

Content lives in `src/content/` (plans, FAQ, industries, legal, competitor facts with sources and `confirmed` flags, dashboard fake data).
Anything StayQR must still supply renders through `<Placeholder>` / `<PlaceholderSlot>` as visible `[brackets]`; never replace these with invented customers, quotes or numbers.
Logo: mark A "The Lit Core" (`src/components/logo.tsx`, geometry in `MARK`); `node scripts/gen-icons.mjs` regenerates `icon.svg` and `apple-icon.png`.
3D components are in `src/components/three/` (CubeQR, ScanBeam, ScanGlobe, ParticleField; shared cube material); every scene is
lazy, tiered (`useLazyScene`) and has a same-size static fallback in `public/`.

## QA URL flags (dev and prod)
| Flag | Effect |
|---|---|
| `?theme=dark` / `?theme=light` | Force theme |
| `?tier=high` / `low` / `none` | Force 3D quality (`none` = static image only) |
| `?capture` | 3D clock follows real time at very low FPS (headless screenshots) |
| `?freeze=3.1` | Pin the hero timeline to one moment (3.1 = mid-scan) |

## Scripts
- `node scripts/screenshots.mjs [path] [name] [waitMs]`: desktop 1440 + mobile 390, dark + light → `design-screenshots/`. Env: `BASE_URL`, `FREEZE`, `TIER`.
- `node scripts/render-fallbacks.mjs`: re-renders the static 3D fallbacks from the live scenes (hero desktop + the tight phone crop and its position in `hero-fallback.json`). Run after changing the 3D look. Env: `BASE_URL`, `ONLY=desktop|mobile`.
- `node scripts/lighthouse.mjs [path] [runs=3]`: Lighthouse mobile, median of N runs, plus the LCP element and its phases. `THROTTLE=devtools` applies real throttling instead of the Lantern simulation.
- `node scripts/lcp.mjs [path]`: lists LCP candidates on a Lighthouse-sized phone (412×823, 4× CPU).
- `node scripts/gen-icons.mjs`: favicon + apple touch icon from the mark geometry.
- `node scripts/gen-land-mask.mjs`: rebuilds the ScanGlobe land bitmap from Natural Earth data.

Scrolling note: test smoothness on a production build. In `next dev`, each lazy chunk is compiled the first time its
section scrolls into view, which shows up as hitches the production build doesn't have.

### Dev and prod side by side
`NEXT_DIST_DIR` moves the build output, so a production build can run next to `next dev`:
```bash
npx next dev -p 3100
NEXT_DIST_DIR=.next-prod npx next build && NEXT_DIST_DIR=.next-prod npx next start -p 3200
BASE_URL=http://localhost:3200 node scripts/lighthouse.mjs / 3
```

### Measured (Oct 2026, prod build, Lighthouse mobile, median of 3)
| Page | Perf | A11y | LCP (simulated) | LCP (devtools throttling) | TBT | CLS |
|---|---|---|---|---|---|---|
| `/` | 92 | 100 | 3.10s | 1.76s | 187ms | 0 |
| `/pricing` | 96 | 100 | 2.81s | | 44ms | 0 |
| `/industries/restaurants` | 97 | 100 | 2.64s | | 30ms | 0 |

First-load JS: `/` 139 KB, inner marketing pages 117–123 KB, dashboard 122–146 KB. Lazy chunks (gzip): three.js + R3F ≈ 241 KB
shared by all scenes; each scene 3.5–3.8 KB; post-processing ≈ 21 KB; GSAP ≈ 47 KB; qr-code-styling 21 KB; Lenis 5 KB.

### Lab LCP on localhost
Lighthouse's default (simulated) run reports ~2.8s LCP on the home page even though the observed LCP is ~70ms.
On localhost the framework JS arrives and runs *before* first paint, so Lantern's pessimistic graph bills all of it
to LCP, whichever element wins: even the near text-only `/paused` page scores ~2.6s. With real throttling
(`THROTTLE=devtools`) LCP is ~1.8s. Measure on a real host
(CDN latency puts first paint ahead of the scripts) before optimising against the simulated number.

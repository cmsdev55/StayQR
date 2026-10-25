# StayQR web (design phase)

Next.js 15 · TypeScript · Tailwind · React Three Fiber. Design system: [DESIGN.md](./DESIGN.md).

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
ANALYZE=true npm run build   # bundle analyzer
```

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

### Dev and prod side by side
`NEXT_DIST_DIR` moves the build output, so a production build can run next to `next dev`:
```bash
npx next dev -p 3100
NEXT_DIST_DIR=.next-prod npx next build && NEXT_DIST_DIR=.next-prod npx next start -p 3200
BASE_URL=http://localhost:3200 node scripts/lighthouse.mjs / 3
```

### Lab LCP on localhost
Lighthouse's default (simulated) run reports ~2.8s LCP on the home page even though the observed LCP is ~70ms.
On localhost the framework JS arrives and runs *before* first paint, so Lantern's pessimistic graph bills all of it
to LCP, whichever element wins. With real throttling (`THROTTLE=devtools`) LCP is ~1.8s. Measure on a real host
(CDN latency puts first paint ahead of the scripts) before optimising against the simulated number.

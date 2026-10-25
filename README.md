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
- `node scripts/render-fallbacks.mjs`: re-renders `public/hero-qr-{dark,light}.webp` from the live scene. Run after changing the 3D look.

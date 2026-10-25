# StayQR — Design System (v1, direction)

> Concept: **codes that never die.** A QR code is a grid of modules. On StayQR every module is a small glowing cube. Codes *assemble*, *light up when scanned*, and *stay lit*. Every visual on the marketing site comes from that one idea. Every later build (dashboard, backend-rendered pages, emails) must follow this file.

---

## 1. Colour tokens

Defined as CSS variables on `:root` (dark is the default) and `[data-theme="light"]`. Tailwind reads them as `rgb(var(--token) / <alpha>)`.

### Dark (default)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#07080B` | Page ground |
| `--bg-raised` | `#0D0F14` | Section bands, dashboard sidebar |
| `--bg-overlay` | `#13161D` | Popovers, menus, table header |
| `--glass` | `rgba(255,255,255,0.04)` | Glass card fill (with `backdrop-blur: 16px`) |
| `--glass-strong` | `rgba(255,255,255,0.07)` | Hovered glass, inputs |
| `--border` | `rgba(255,255,255,0.08)` | Default 1px borders |
| `--border-strong` | `rgba(255,255,255,0.14)` | Focused or hovered borders |
| `--grid-line` | `rgba(255,255,255,0.035)` | Background grid (64px cells) |
| `--text` | `#F2F4F7` | Headlines, body |
| `--text-muted` | `#9AA3B2` | Secondary copy (7.4:1 on bg) |
| `--text-subtle` | `#7A8294` | Labels, captions (5.0:1 on bg, the minimum) |
| `--accent` | `#B6FF3B` | The only bright colour: CTAs, lit cubes, ticks, focus ring |
| `--accent-ink` | `#0A0D02` | Text on accent fills |
| `--accent-soft` | `rgba(182,255,59,0.12)` | Badges, selected rows |
| `--depth` | `#6E7BFF` | **Depth glows only**: never text, never buttons |
| `--danger` | `#FF6B6B` | Destructive actions, the "dead competitor code" |
| `--warning` | `#FFB547` | Paused states |

### Light
| Token | Value | Note |
|---|---|---|
| `--bg` | `#F5F6F2` | Slightly warm off-white, so lime doesn't look neon on pure white |
| `--bg-raised` | `#FFFFFF` | |
| `--bg-overlay` | `#FFFFFF` | plus shadow-md |
| `--glass` | `rgba(255,255,255,0.65)` | |
| `--glass-strong` | `rgba(255,255,255,0.85)` | |
| `--border` | `rgba(7,8,11,0.08)` | |
| `--border-strong` | `rgba(7,8,11,0.16)` | |
| `--grid-line` | `rgba(7,8,11,0.045)` | |
| `--text` | `#0B0D12` | |
| `--text-muted` | `#4A5263` | |
| `--text-subtle` | `#5F6777` | 5.4:1 on bg |
| `--accent` | `#B6FF3B` | **Fills only** (buttons, lit cubes) with `--accent-ink` text |
| `--accent-text` | `#3F6B00` | Lime used as text or links in light mode (6.1:1) |
| `--accent-soft` | `rgba(110,170,0,0.12)` | |
| `--depth` | `#4B57E6` | |
| `--danger` | `#D93A3A` | |
| `--warning` | `#B86E00` | |

**Rule:** on any screen, at most **one** accent-filled element should hold the eye at a time (the primary CTA *or* the lit QR, never five lime things fighting).

---

## 2. Typography

| Role | Family | Source |
|---|---|---|
| Display (h1–h3, prices, big numbers) | **Clash Display** 500/600 | Fontshare, self-hosted `woff2` via `next/font/local` |
| UI and body | **Inter** (variable) 400/500/600 | `next/font/google` |
| Labels, data, URLs | **JetBrains Mono** 400/500 | `next/font/google`, subset latin |

Fallback stack for display: `"Clash Display", "Inter", system-ui, sans-serif` with `size-adjust` tuned so the swap causes no CLS.

### Scale (desktop → mobile, implemented with `clamp()`)
| Token | Size / line-height | Tracking | Use |
|---|---|---|---|
| `display-2xl` | 96 → 52 / 0.92 | -0.045em | Hero headline |
| `display-xl` | 80 → 44 / 0.95 | -0.04em | Story line, final CTA |
| `display-lg` | 60 → 36 / 1.0 | -0.035em | Section headings |
| `display-md` | 44 → 30 / 1.05 | -0.03em | Pricing figures, card heroes |
| `h3` | 28 → 22 / 1.2 | -0.02em | Card titles |
| `h4` | 20 / 1.3 | -0.01em | Dashboard headings |
| `body-lg` | 20 → 18 / 1.55 | 0 | Section intros |
| `body` | 16 / 1.6 | 0 | Default |
| `body-sm` | 14 / 1.5 | 0 | Dashboard default, table cells |
| `label` | 12 / 1.4, mono, uppercase | +0.08em | Eyebrows, chips, axis labels |

Headlines are **real HTML text**, never drawn in a canvas. Max line length 64ch for body copy.

---

## 3. Space, layout, radius

- **Spacing** (4px base): `1=4 2=8 3=12 4=16 6=24 8=32 12=48 16=64 24=96 32=128 40=160`.
- **Section rhythm:** `py-40` (160px) on desktop, `py-24` (96px) on mobile. The hero is `min-h-[100svh]`.
- **Container:** `max-w-[1200px]`, wide variant `max-w-[1360px]`, side gutter 24px desktop and 16px mobile.
- **Grid:** 12 columns, 24px gutter. The bento uses 6 columns × auto rows of 280px.
- **Radius:** `xs 8` (chips, inputs inside cards) · `sm 12` (buttons, inputs) · `md 16` (dashboard cards) · `lg 20` (marketing cards) · `xl 24` (hero cards, pricing) · `full` (pills, toggles).

---

## 4. Elevation, glass and glow

| Token | Value |
|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,.4)` |
| `shadow-md` | `0 8px 24px -8px rgba(0,0,0,.5)` |
| `shadow-lg` | `0 24px 64px -16px rgba(0,0,0,.6)` |
| `inner-glow` | `inset 0 1px 0 rgba(255,255,255,.06), inset 0 0 0 1px var(--border)` |
| `glow-accent` | `0 0 0 1px rgba(182,255,59,.35), 0 0 24px rgba(182,255,59,.28), 0 0 64px rgba(182,255,59,.12)` |
| `glow-depth` | radial `#6E7BFF` at 18% opacity, 600px, behind 3D scenes only |

**Glass card** = `bg-[--glass]` + `backdrop-blur-[16px] backdrop-saturate-150` + `inner-glow` + `rounded-lg`. In light mode, add `shadow-md`.
**Background** = `--bg` + a 64px grid of `--grid-line` + a 3% monochrome noise PNG (tiled, 128px, under 4 KB).

---

## 5. Motion

**One curve everywhere:** `--ease: cubic-bezier(0.22, 1, 0.36, 1)` (an "out-expo-ish" curve: fast start, long soft landing). GSAP: `CustomEase.create("stay", "0.22,1,0.36,1")`. Framer: `ease: [0.22, 1, 0.36, 1]`.
Nothing bounces. No spring overshoot, no elastic, no `back` easing.

| Token | Duration | Use |
|---|---|---|
| `dur-micro` | 120ms | Press states, icon swaps |
| `dur-fast` | 200ms | Hover, focus, toggles |
| `dur-base` | 400ms | Card reveals, accordion, menus |
| `dur-slow` | 700ms | Section reveals, headline masks |
| `dur-hero` | 1400ms | Cube assembly (rows stagger 35ms) |
| `stagger-word` | 60ms | Headline word reveal |
| `stagger-item` | 50ms | Bento cards, table rows |

- Reveals: `opacity 0 → 1` + `translateY(24px → 0)` or a mask wipe. Trigger once at 15% visibility.
- Magnetic buttons: follow the cursor up to 8px, return over `dur-base`.
- Tilt: max 8° on cards and 12° on the hero QR, lerped (factor 0.08) so it feels heavy.
- Scan beam: every 4.5s, 1.1s sweep. Cubes it passes pulse to `--accent` for 600ms, then settle at 40% glow (they stay lit).
- **Reduced motion:** no 3D, no pinning, no parallax, no Lenis. Keep 200ms opacity fades only. The static PNG of the QR shows instead.

---

## 6. 3D rules (React Three Fiber)

- **CubeQR:** one `InstancedMesh` of rounded boxes (`RoundedBoxGeometry`, radius 0.08). Base colour `#1A1E27`. Emissive goes to `--accent` when lit. Desktop: 33×33 modules; phones: 25×25.
- Lighting: one key directional light, one `--depth` rim light from behind-left, ambient at 0.15.
- Post-processing (desktop only): Bloom (threshold 0.6, intensity 0.9, mipmap blur), ChromaticAberration offset 0.0006. None on phones.
- `dpr={[1, 1.5]}` on phones, `[1, 2]` on desktop. `frameloop="demand"` when the scene is off screen or the tab is hidden.
- Every scene is `next/dynamic(..., { ssr: false })`, mounted after first paint, with a pre-rendered PNG/AVIF fallback of identical size (no CLS).

---

## 7. Components

| Component | Rules |
|---|---|
| **Button** | Heights 40 / 48 / 56. `primary` = lime fill + `accent-ink` text + `glow-accent` on hover. `secondary` = glass + border. `ghost` = text only. `magnetic` = wrapper prop, marketing site only. Focus: 2px `--accent` ring, 2px offset. |
| **Card** | `glass` (default), `solid` (dashboard: `--bg-raised`, no blur). Opt-in `tilt` and `spotlight` (a radial highlight following the cursor, 400px, 6% white). Never tilt in the dashboard. |
| **Badge** | Mono label, 24px tall, `rounded-full`. Variants: `accent`, `neutral`, `warning`, `danger`. |
| **Input** | 48px (marketing) / 40px (dashboard). Glass-strong fill, border becomes accent on focus. Label always visible above; no placeholder-only labels. |
| **Toggle** | Pill track; thumb slides on `dur-fast`. The pricing toggle variant drives the odometer. |
| **Accordion** | Height animates with `dur-base`; the plus icon rotates 45° into a ×. One open at a time on the FAQ. |
| **SectionHeading** | Mono eyebrow + display heading + optional intro; words mask in on enter. |
| **Marquee** | CSS-transform loop, duplicated track, slows to 25% speed on hover, pauses when off screen. |
| **AnimatedCounter** | Odometer digits (each digit is a vertical strip); `tabular-nums`. |
| **3D:** `CubeQR`, `ScanBeam`, `ScanGlobe`, `ParticleField` | See §6. All accept `quality: "high" | "low"` and `paused`. |

---

## 8. Dashboard rules

Calm and fast. No 3D, no blur-heavy glass (solid cards), no pinning. Transitions only on hover, focus, route change (150ms fade) and data loading (skeletons). The same tokens apply, with `body-sm` as the default size and 40px controls. Lime is reserved for the primary action and "active / scanning" states.

---

## 9. Do / Don't

**Do**
- Let the lit QR be the hero; keep everything else quiet and dark.
- Use real numbers and realistic fake data (dashboard).
- Keep all copy as real, crawlable text.
- Check contrast in both themes (4.5:1 for body, 3:1 for 24px+).

**Don't**
- Use `--depth` blue-violet for text, buttons or icons.
- Use gradient washes behind sections, emoji, or left-border "callout" cards.
- Add bounce, spring overshoot or parallax on body text.
- Use lime as text on light backgrounds (use `--accent-text`).
- Ship any 3D in the initial JS bundle.

# Visual and mobile (score 92)

Production screenshots (desktop 1440×900, mobile 390×844) in `../screenshots/` for `/`, `/qr-code-generator`
and `/qr-code-with-logo`.

## What works
- The H1 is above the fold on every page and viewport; the generator appears directly under the H1 on tool pages.
- No horizontal overflow on mobile (scrollWidth equals viewport width); body text is 16 px.
- Phones see the static hero immediately; the 3D scene loads only after the first touch or scroll.

## Findings
### Low: compact footer and breadcrumb tap targets
On mobile, footer list links are 17–19 px tall and the breadcrumb link is 29×19 px. They are spaced about 12 px apart,
which meets the WCAG 2.2 spacing exception, but larger targets are easier to tap.

**Fix:** add `py-1` (or `min-h-6 inline-flex items-center`) to footer and breadcrumb links.

### Info: logo-size slider track is 4 px tall
The range input's track is 129×4 px; its thumb is larger, so it remains usable.

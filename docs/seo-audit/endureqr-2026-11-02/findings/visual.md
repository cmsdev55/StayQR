# Visual / mobile audit, 2 Nov 2026 (desktop 1350, mobile 390x844 @2x)

Screenshots: ../screenshots/ (desktop_*, mobile_*; *_full = full page; home_first = 0.6 s paint).
Pages: /, /qr-code-generator, /qr-code-generator/wifi, /pricing, /guides/how-to-make-a-qr-code, /signup, plus /dynamic-qr-code-generator (mobile only).
Note: the first mobile_dynamic.png capture was of a 404 (/dynamic-qr-codes); it was re-taken from the real URL /dynamic-qr-code-generator.

## Findings
### High: horizontal overflow on guide and dynamic pages at 390 px; header menu pushed off-screen
- Pages: /dynamic-qr-code-generator and every guide (checked /guides/how-to-make-a-qr-code). Layout viewport widens to 498 px (the 390/498 scrollbar).
- Cause: the "On this page" table of contents (`NAV.lg:sticky lg:top-28 lg:self-start` > `OL`, 16 to 498 px) is a grid item that will not shrink below its longest unwrapped line ("Steps 2 and 3: choose a type and enter your content"). Fixed header becomes 498 wide, so the theme toggle and hamburger sit at x 438-482 and are not visible in mobile_guide.png / mobile_dynamic.png. Mobile users on these pages have no nav menu.
- Fix: add `min-w-0` to the grid column/nav (or `grid-cols-[minmax(0,1fr)]`), let TOC links wrap (`break-words`), and `overflow-x-clip` on body as a backstop.
### Medium: smaller overflow on / and /pricing (406 px, 16 px over)
- Cause: decorative glow `DIV.pointer-events-none absolute -inset-8 -z-10 rounded-[40px]` (-16 to 406) with no clipping ancestor. Header is shifted 16 px, so hamburger is clipped at right edge (mobile_home.png, mobile_pricing.png). Pricing table (min-w 640) is inside a scroller, which is fine.
- Fix: `inset-0` on small screens or `overflow-hidden` on the wrapper; `overflow-x-clip` on body.
### Low: tap targets
Footer/breadcrumb/guide-TOC links are 17-21 px tall (breadcrumb Home 29x19, "Terms of Service" 97x15 on signup). Spacing helps but add `py-2`/`min-h-11`. Range slider track 4 px tall. Desktop nav links 21 px tall.
### Pass
- /qr-code-generator and /wifi on mobile: 390 = 390, no overflow; H1 and type picker at top, 16 px body text, tiles ~44 px tall. Generator usable.
- Above-the-fold: home shows H1, value line and bright "Create free QR" CTA plus "See pricing" at both sizes; pricing and signup clear. Dynamic page shows form + "Create this dynamic code".
- No AdSense slots (no ins.adsbygoogle), no cookie/consent banner, no interstitials on any page tested. CLS 0 on all pages (home first paint vs settled identical layout; 3D hero loads below the CTA).
- Contrast: muted grey subtext and mono labels on near-black are lower contrast but legible; not measured numerically.

## vs 27 Oct baseline
Baseline reported "no horizontal overflow" but did not test guides or dynamic page; home/pricing 16 px overflow is new or unmeasured. Footer tap-target issue unchanged.

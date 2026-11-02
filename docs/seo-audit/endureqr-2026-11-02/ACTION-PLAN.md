# EndureQR action plan (from the 2–3 November 2026 audit)

Ordered by impact and dependency. Each item says how to check it worked and what to watch afterwards.

## Do now (this week)

1. **Fix the sideways scroll on phones** (High · 17 pages).
   Add `min-w-0` to the grid children holding the guide TOC and the feature-page table
   (`src/components/content/feature-landing.tsx:105`, the guide layout under `src/app/(marketing)/guides/[slug]/`);
   let TOC links wrap; clip the `-inset-8` glow on home and pricing.
   *Check:* `document.documentElement.scrollWidth === 390` at a 390 px viewport on every guide, the dynamic page, home
   and pricing; the menu button is visible. *Watch:* Search Console → Mobile usability (once connected).

2. **Verify in Bing and send IndexNow** (High).
   Add the `msvalidate.01` tag in `src/app/layout.tsx` metadata, submit `sitemap.xml` in Bing Webmaster Tools, run
   `npm run indexnow`, and add that to the deploy routine. Do Google Search Console at the same time (the Google tag is
   already there).
   *Check:* Bing WMT shows the sitemap as processed. *Watch:* pages indexed in Bing and Google, weekly.

3. **Make the copy match the Terms** (High).
   Replace "forever" / "for life" / "last reprint" in `src/content/competitors.ts` and `src/content/faq.ts` with what
   Terms §6 actually promises (works while EndureQR operates, 90 days' notice, export every destination).
   *Check:* `grep -riE "forever|for life|last reprint" src/content` returns only intended uses.

4. **Stop the dynamic page's demo QR leading to a 404** (Medium).
   Point it at a working demo link or render it visibly as a sample. *Check:* scanning it opens a 200 page.

5. **Label demo numbers** (Medium). Mark the homepage "Scanned in Lahore · #12,409" and "48,291 scans" as an example.

## Next (within a month)

6. **Name who runs EndureQR** (High · biggest E-E-A-T and GEO lever; unblocks 7 and 8).
   A founder or team on /about with a short bio, a legal name and contact address in `src/content/company.ts` and
   Privacy, an editorial policy page, and a `Person` author on guides (`src/app/(marketing)/guides/[slug]/page.tsx`).
   *Check:* the Article JSON-LD `author` is a Person with a URL.

7. **Create real outside profiles, then add `sameAs`** (Medium · depends on 6).
   LinkedIn company page, Product Hunt, AlternativeTo / SaaSHub, X. Add only live URLs to `organizationLd()` in
   `src/components/content/json-ld.tsx`, plus `alternateName: "StayQR"`.
   *Watch:* web mentions of "EndureQR"; Common Crawl inclusion in the next release.

8. **Let people make a dynamic code before paying** (Medium · SXO).
   One free dynamic code or a trial, live preview with the full generator, payment asked at "Save".
   *Watch:* signup-to-first-code rate; position for "dynamic qr code generator".

9. **Fix template grammar and dates** (Medium).
   "a/an" and plural agreement in `src/app/(marketing)/qr-code-generator/[type]/page.tsx:78` and
   `src/app/(marketing)/industries/[slug]/page.tsx:118,203`; bump `updated` on the 16 guides; real `lastModified`
   on every URL in `src/app/sitemap.ts` (drop `priority`).

10. **Answer the "never expires" and privacy intents** (Medium · SXO).
    "Never expires" in generator titles, a "Will my code ever stop working?" block on generator, dynamic and pricing
    pages; "Your password never leaves your browser" under the WiFi field.

11. **Get the generator input higher on phones** (Medium). Fold the type list on `/qr-code-generator` and add a sticky
    mini-preview with Download. *Check:* first input above 700 px on a 390 × 844 screen.

## Backlog

- Diagrams with alt text and captions in the 4 most visual guides; per-guide OG images.
- Sourced 40–80 word definition passage on each tool page; extend `llms.txt` to the 14 missing pages
  (`src/app/llms.txt/route.ts`).
- Fuller Organization as Article publisher; `@id`, publisher and availability on tool-page `WebApplication`;
  `SoftwareApplication` node on the homepage; WebPage nodes on industry and alternatives pages.
- "When the competitor is better" sections on the two alternatives pages; reduce shared sentences on industry pages.
- 404 page title; larger tap targets for footer, breadcrumb and TOC links.
- Drop the H1 entrance animation on pricing and industry pages; render the hero QR as one `<path>`; fewer font preloads.
- Optional: `Content-Signal` in robots.txt, a `<form>` around the generator fields.
- First links: Product Hunt, Show HN / Indie Hackers, AlternativeTo, SaaSHub, "free QR tools" resource pages.

# Sitemap audit, https://endureqr.com (2 November 2026)

Verdict: healthy. 55 URLs, all 200, self-canonical, indexable. No critical or high issues.

## Checks
- XML validity: PASS. Valid urlset, correct namespace, 55 `<url>` entries, no duplicates.
- Status/indexability: PASS (per crawl). No noindex, redirected or 404 URLs listed. /dashboard, /paused and the 36 login/signup query variants are correctly absent.
- Coverage vs crawl: PASS. 91 crawled = 55 sitemap + 36 noindex variants (incl. /dashboard redirect). No indexable page is missing.
- robots.txt: PASS. `Sitemap: https://endureqr.com/sitemap.xml`; disallows /dashboard and /paused.
- Size limits: PASS (55 of 50,000 URLs).
- 57 to 55: the sitemap did not shrink. The 27 Oct baseline sitemap also had 55 URLs; "57" was the crawl page count then (55 + 2 non-sitemap pages). Only change since: host moved from endureqr.vercel.app to endureqr.com (all locs on the new host).

## Findings
### Low: lastmod on only 16 of 55 URLs, all the same date
All 16 guides carry `2026-10-26` (from `g.updated`); the other 39 have none. Real dates, not build-time "now", which is good. Google uses lastmod only if consistently accurate, so omission is safe, but coverage is partial.
Fix: in /Users/codingcrafts/Downloads/stayqr/src/app/sitemap.ts add `lastModified` from a content "updated" field for industries, alternatives, type and feature pages. Never use `new Date()`.

### Info: priority is emitted on every URL
Google ignores priority (changefreq is not emitted). Harmless.
Fix (optional): remove `priority` in /Users/codingcrafts/Downloads/stayqr/src/app/sitemap.ts.

## Quality gates (programmatic pages)
- 17 type pages (/qr-code-generator/[type]): under the 30-page warning threshold.
- 8 industry pages: under threshold. Alternatives (competitors) are a separate family.
- Combined templated set is roughly 25 plus alternatives, still below 30 per family; no warning or hard stop. Not re-measured for 60% unique content this pass; keep per-page unique copy as pages are added, and re-gate at 30.

## Images / hreflang
- Image sitemap: not needed (no image-led content; guide OG images are handled by meta tags).
- hreflang: not needed (single language, no alternates).

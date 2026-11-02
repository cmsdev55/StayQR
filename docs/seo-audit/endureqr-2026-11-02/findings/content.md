# Content Quality and E-E-A-T: EndureQR

- Audit date: 2026-11-02 (baseline 2026-10-27, scored 63)
- Site: https://endureqr.com
- Method:
  - All 55 public content pages were fetched live (curl, server HTML). Main text was taken from `<main>` with header, nav and footer stripped. A spot check with `render_page.py --mode never` on /about matched exactly: 369 words, `is_spa: false`.
  - The source in `src/content/` was read but not edited.
  - Pages read in full: home, /about, /contact, /pricing, /privacy, /terms, /alternatives/bitly, /industries/hotels, /industries/healthcare, /qr-code-generator/wifi and /qr-code-generator/email, and the guides are-qr-codes-safe, qr-code-size-for-printing and do-qr-codes-expire. The other pages were measured programmatically.
- Limitation: the audit sandbox blocks third-party hosts, so the 43 outbound source links could not be checked for liveness. Commit `e39f44b` states that each one was opened. Each was checked against known primary sources instead (see "Sources check").

## Category score: 69 / 100 (baseline 63, +6)

| Component | Weight | Score | Baseline | Notes |
|---|---|---|---|---|
| E-E-A-T (see breakdown) | 30% | 52 | 42 | Working mailboxes, an owned short-link domain and cited sources; still nobody named |
| Depth and thin content | 15% | 72 | 65 | Industry pages are deeper; alternatives pages are still thin |
| Accuracy of claims | 15% | 68 | 55 | Analytics and placeholder issues fixed; "forever" copy and mock live data remain |
| Readability | 10% | 90 | 90 | Flesch 69-84, FKGL 3.8-6.7 |
| Duplication | 10% | 75 | 75 | Template share unchanged; not near-duplicates |
| AI citation readiness | 10% | 78 | 70 | Primary-source links and question H2s; no Person author, no images, stale `dateModified` |
| Metadata and freshness | 10% | 80 | 85 | Metadata clean; guide dates were not bumped after a substantive edit |

### E-E-A-T breakdown (this skill's internal weights, not Google's)

| Factor | Weight | Score | Evidence |
|---|---|---|---|
| Experience | 20% | 38 | The industry pages now have 5-step "Worked example" sections, e.g. hotels: CSV of room numbers, a lift poster switched from spa to rooftop bar, weekday-by-hour heatmap. There are still 0 images on all 16 guides, 17 tool pages and 8 industry pages, no photographed or tested results, and no customer evidence. |
| Expertise | 25% | 66 | Technical accuracy is high, and the guides now cite the standards they rely on (RFC 2426/6350/5545, Denso Wave's qrcode.com pages). There is still no named author or credential: Article `author` is `Organization: EndureQR` on all 16 guides. |
| Authoritativeness | 25% | 40 | 43 outbound links to primary sources across the 16 guides (2-4 each), where the baseline had 0. No named people and no external recognition. About has no `Person` or `founder` in its JSON-LD. |
| Trustworthiness | 30% | 58 | Fixed: endureqr.com resolves (A 216.198.79.65, MX mx1/mx2.improvmx.com); dynamic short links now use the owned domain (`shortHost()` = site host, `src/lib/server/env.ts:36`); the analytics contradiction is gone; "a EndureQR" is gone; the reply-time promise is consistent ("one business day" on every page). Still missing: legal entity and address, and the "forever / for life" copy goes beyond Terms §6. Mock "live" scan data appears on home. |
| **Weighted E-E-A-T** | | **52** | |

### AI citation readiness: 78 / 100

Strengths:
- Every guide opens with a self-contained answer. For example, size-for-printing: "The minimum practical size for a printed QR code is about 2 x 2 cm (0.8 x 0.8 in)… A poster read from 2 metres needs a code about 20 cm wide."
- Question H2s are answered in their first sentence, e.g. "How much blank space does a QR code need around it? A QR code needs a quiet zone of 4 modules on every side, as the standard calls for…".
- Real data tables, FAQ content in the server HTML, and Article, FAQPage and BreadcrumbList schema.
- Claims are now linked to their primary sources.

Gaps:
- No `Person` author.
- No diagrams. A quiet-zone or logo-size figure would be highly quotable.
- `dateModified` is `2026-10-26` although the content changed on 2 Nov (L1).

## Measurements

**Templated metadata** (`metadata_template.py --pairs-file`, 55 content pages): `site_risk: low`, `templated_ratio: 0.0`, `templated_count: 0`, `shared_cta_phrases: {}`, `site_flags: []`. No `templated_metadata`, `description_echoes_title`, `brand_suffix_in_description` or `description_duplicates_title`.

**Main-content words** (`<main>` minus chrome, FAQ included):

| Group | Words | Floor (this skill) | Verdict |
|---|---|---|---|
| Home | 1,618 | 500 | OK |
| Pricing | 572 | n/a | OK |
| About | 369 | n/a | Thin on people and facts (H1) |
| Contact | 90 | n/a | Fine for its purpose; no entity or address (H1) |
| Feature pages (4) | 1,328-1,745 | 800 | OK |
| Tool pages (17) | 692-889 | n/a (tool) | OK. 22-28% shared template |
| Guides (16) | 1,317-1,793 (body before "More guides": 1,153-1,639) | 1,500 | Tightly scoped; do not pad |
| Industry pages (8) | 586-643 | 500-800 | Up from 458-517; about 26-29% shared template (M4) |
| Alternatives (2) | 613 / 669 | n/a | Thin for comparison pages (M5) |

**Readability** (Flesch / FKGL):
- Guides: 70.3-84.1 / 4.0-6.7.
- Tool pages: 75.7-82.3 / 3.8-4.7.
- Industry pages: 69.0-81.1 / 4.5-6.1.
- Alternatives pages: 64.7-72.1.

Plain British English with no filler. None of the QRG's low-quality-AI markers apply: the copy is specific, carries type-specific gotchas and makes no generic claims.

**Near-duplication** (5-word shingle Jaccard on main text):

| Group | Mean | Max | Shared by all pages | Verdict |
|---|---|---|---|---|
| Tool pages (17) | 0.165 | 0.220 (facebook vs x) | 11 sentences on all 17: generator UI labels plus the identical "Need to change it after printing?" upsell | Templated but **not** near-duplicates |
| Industry pages (8) | 0.171 | 0.207 (hotels vs restaurants) | 14 sentences on all 8: 3-step block, stat suffix, 2 global FAQs, CTA band | Templated shell with unique use cases, examples and FAQs; not near-duplicates, but the shell is heavy |
| Guides (16) | 0.009 | n/a | n/a | Distinct |
| Alternatives (2) | 0.322 | n/a | 18 sentences shared | Same layout |

**Freshness:** all guides show "Updated 26 October 2026", and `datePublished = dateModified = 2026-10-26`. Commit `e39f44b` (2 Nov 2026) added the sources and restructured the H2s, but the dates were not updated (L1). Competitor facts are dated "Checked 26 Oct 2026" and are backed by `docs/evidence/2026-10-26-*-pricing.png`.

## Resolved since the 27 Oct baseline

| Baseline | Status | Evidence |
|---|---|---|
| C1 Contact domain NXDOMAIN | **Fixed** | `dig endureqr.com` returns 216.198.79.65; MX is mx1/mx2.improvmx.com |
| H2 (part) Short links on vercel.app | **Fixed** | Site and short host are endureqr.com |
| H3 "Analytics on every plan", "Live map" | **Fixed** | Home now reads "Scans by day, city, device and time of day, for every dynamic code on a paid plan." |
| H4 (part) Industry pages: no breadcrumbs, about 260 body words | **Improved** | BreadcrumbList present; 586-643 words; worked examples and guide links added |
| M1 Guides cite no sources | **Fixed** | 43 outbound links: qrcode.com (Denso Wave), RFC 2426/6350/5545, FTC, IC3, Apple and Google help, GA4 UTM docs, WCAG reflow, FSA allergen guidance, UK GDPR |
| M4 Placeholder plan limits | **Fixed** | `src/content/plans.ts:1` now says the limits are enforced (500 rows, 12-month retention) |
| M5 "a EndureQR" | **Fixed** | 0 occurrences on live pages; Contact reads "An EndureQR code…" |
| M6 Reply-time mismatch | **Fixed** | "within one business day" on every page |
| L4 "$2.42 per month/mo" | **False positive** | "per month" is `sr-only` text for screen readers (`pricing-cards.tsx:62`) and is not shown on screen |

## Findings

### H1. High: still no identifiable people or legal entity

- **Evidence:**
  - /about (369 words) names no founder or team and gives no founding date or location. Its JSON-LD has no `Person` or `founder`.
  - All 16 guides use `author: {"@type":"Organization","name":"EndureQR"}`.
  - Privacy says only "EndureQR is the controller of the personal data described here". There is no legal name or address.
  - Terms §01 "Who we are" names no operating entity, although it applies "the laws of Pakistan".
  - Contact lists three email addresses and no postal address.
  - There is no editorial policy.
  - `src/content/company.ts` has no `legalName` or `address` fields.
- **Why it matters:** The QRG asks raters to find out who is responsible for a site. This site takes payments, sells a "lifetime" plan, and publishes scam and payments guidance (are-qr-codes-safe, the PayPal tool), so that question matters more than usual. This is now the largest single E-E-A-T gap.
- **Fix:**
  1. Add `legalName`, `address` and (if registered) a company number to `src/content/company.ts`. Render them in Privacy ("controller"), Terms §01, Contact and the Organization JSON-LD.
  2. Add a founder section to /about: name, photo, role, relevant background and a LinkedIn or GitHub link. Add `founder: Person` to the schema.
  3. Show a named author or reviewer byline on the guides (data in `src/content/guides*.ts`), linked to a bio. Switch Article `author` to `Person`.
  4. Publish /editorial-policy covering how guides are sourced, the use of AI tools, the review cadence and a corrections address. The "every URL opened first" process and `competitors.ts` CHECKED dates are good material for it.

### H2. High: "forever / for life / last reprint" copy still goes beyond Terms §6

- **Evidence:** The short-link half of this finding is fixed. The copy is unchanged:
  - Home: "LIFETIME One payment of $79. Codes live forever.", "Cancel anytime. Your codes keep working. Forever." and "for life".
  - Comparison row: "Keep working, for life" (`src/content/competitors.ts`, `ENDUREQR_ROW.cancel`), on home and both alternatives pages.
  - Pricing H2: "Codes for life." and "Every plan: … codes never expire".
  - FAQ: "keeps redirecting to its last destination, forever" (`src/content/faq.ts`), repeated on home, pricing, 8 industry pages and 2 alternatives pages.
  - Site-wide CTA band: "Print it once. Keep it forever." on every guide and industry page.
  - Alternatives: "It's the last reprint you'll need." and "After that, you never need to reprint again."
  - Home FAQ: "never have to reprint again".
  - Terms §6, by contrast, says: "This commitment lasts for as long as EndureQR operates the Service… If we ever have to close the Service, we will give at least 90 days' notice… and let you export every code's destination".
- **Why it matters:** The headline promise is unconditional, but the binding text is conditional. It is the one row in a "sourced" comparison table without a source. This is a consumer-protection risk on a lifetime plan.
- **Fix:**
  - Use "keep working after you cancel, for as long as EndureQR runs (Terms §6)" or similar.
  - Change `ENDUREQR_ROW.cancel` to "Keep working after you cancel".
  - In `faq.ts`, replace "forever" with "for as long as EndureQR runs, and we'll give 90 days' notice if that ever changes".
  - Delete the two "never reprint again" lines (`competitors.ts` and the alternatives page template).
  - Publish a continuity plan (who keeps `endureqr.com/r/*` running if the business closes). It turns this claim from a liability into a trust asset.

### M1. Medium (new): template grammar errors on 25 pages

- **Evidence:**
  - All 17 tool pages use the H2 "How to make a {name} QR code", rendered as "How to make a Email QR code", "a Instagram", "a SMS", "a X (Twitter)", plus mid-sentence capitals in "a Calendar event / Phone call / Contact card / Link QR code". Source: `src/app/(marketing)/qr-code-generator/[type]/page.tsx:78`.
  - All 8 industry pages:
    - H2 "How healthcare use EndureQR." (also education, retail, real estate), from `src/app/(marketing)/industries/[slug]/page.tsx:118`.
    - CTA "Codes your hotels business can print once." (also restaurants, agencies, events…), from `:203`.
- **Why it matters:** These are visible H2s and CTAs on commercial pages. The errors look like unreviewed, mass-produced output, which is the very signal the rest of the copy avoids.
- **Fix:**
  - Add fields so the templates read naturally:
    - `stepsTitle` (or an article plus lower-case name) to `src/content/qr-type-pages.ts`, e.g. "How to make an email QR code";
    - `audience` (plural noun) to `src/content/industries.ts`, giving e.g. "How clinics use EndureQR", "How schools use EndureQR", "How retailers use EndureQR";
    - `ctaTitle` to `src/content/industries.ts`, e.g. "Room cards your hotel prints once."
  - Read all 25 headings aloud once.

### M2. Medium: still no images or first-hand evidence in guides

- **Evidence:** 0 `<img>` or `<figure>` elements on all 16 guides, 17 tool pages and 8 industry pages. Quiet zone, logo size, print size and error correction are visual topics. No guide reports a test.
- **Fix:** Add annotated diagrams or photos with descriptive alt text to the 5 highest-intent guides first: not-scanning, size-for-printing, design-best-practices, error-correction, what-is-a-qr-code. Add one "We tested this" box per guide (device, distance, light and result, with a photo). This is the cheapest Experience signal available.

### M3. Medium (new): mock "live" activity reads as real usage on a pre-launch site

- **Evidence:**
  - Home hero: "Scanned in Lahore, PK · iPhone · just now · #12,409". The span is not `aria-hidden` and has no "example" label.
  - Feature cards: "Toronto · Android · now", "Lagos · iPhone · now" and "48,291 scans this month".
  - Industry heroes: "Printed March 2026 · Live".
  - Alternatives pages: "All 14 codes redirecting".
- **Why it matters:** Raters and users can read these as traction or social proof that does not exist. That is a trust and misleading-claims risk under the QRG, and it undercuts the site's otherwise careful sourcing.
- **Fix:** Label these UI mock-ups as examples (e.g. a small "Example" tag or caption "Illustration: what you see in the dashboard"), or use obviously sample values. Mark purely decorative copies `aria-hidden`.

### M4. Medium (was H4): industry pages improved but still template-heavy

- **Evidence:**
  - 586-643 words each, about 26-29% shared with all 8 pages (14 identical sentences). The shared text includes the generic 3-step block "Download print-ready SVG, PDF or PNG for menus, signs or packaging" and 2 global FAQs (cancel, scan limits).
  - The stat tiles are still rhetorical (`src/content/industries.ts` `stat` lines 30-246), e.g. "1 card per room, kept current all year", "Always: the current form", "Unlimited codes across every client".
  - Titles are generic: "Dynamic QR codes for hotels · EndureQR" (38-43 characters).
  - Good additions: worked examples, "Guides for {industry}" links, industry FAQs (the healthcare HIPAA and patient-data answers are exemplary) and BreadcrumbList.
- **Fix:**
  - Replace the 3-step block with industry-specific placement and size guidance (e.g. sign riders and the 10:1 rule for real estate, laminated room cards for hotels).
  - Swap the 2 copied global FAQs for 2 industry-specific ones.
  - Remove the stat tile or put a true, verifiable number in it.
  - Label worked examples "Example scenario".
  - Use keyword titles (e.g. "Hotel QR Codes: Room Cards You Can Update · EndureQR").
  - Defer to `seo-programmatic` before adding more industries.

### M5. Medium: alternatives pages remain thin and one-sided

- **Evidence:** /alternatives/bitly has 613 words and /qrfy 669 words. Jaccard between them is 0.32 (18 shared sentences). The comparison covers only price, codes, scans, edits and cancellation. There is no "when Bitly or QRFY is the better choice" section. Titles are 27-28 characters ("Bitly alternative · EndureQR").
- **Accuracy:** Competitor facts are accurate to their cited sources:
  - Bitly's downgrade help is quoted verbatim, and the "complimentary-domain links stop" caveat is included.
  - QRFY's FAQ is quoted, with the honest note "It doesn't say whether dynamic codes keep redirecting".
  - Prices match `docs/evidence/` screenshots dated 26 Oct.
  - The home table is fair: it states Bitly codes "Keep working".
- **Fix:**
  - Add rows for analytics depth, design options, bulk limits, API and custom domains.
  - Add a fair "Choose Bitly if you need a full link-management suite / branded domains" section.
  - Lengthen the titles.
  - Re-check prices by late January 2027, as `src/content/competitors.ts` reminds.

### L1. Low (new): guide `dateModified` not updated after a substantive revision

- **Evidence:** Commit `e39f44b` (2026-11-02) added 2-4 sources per guide and split and rephrased 51 of 98 H2s. All 16 guides still show "Updated 26 October 2026" and `dateModified: 2026-10-26`.
- **Fix:** Set `dateModified` (and the visible "Updated" line) to 2026-11-02 for the edited guides in `src/content/guides*.ts`. This is an honest freshness signal, not a date bump.

### L2. Low: Denso Wave patent still described in the present tense

- **Evidence:** `src/content/guides-basics.ts:130` ("Denso Wave holds a patent on the format but chose not to enforce it") and `:164`.
- **Fix:** Change the wording to "Denso Wave patented the format but chose not to exercise its patent rights for standard codes…", and link https://www.qrcode.com/en/faq.html (already cited in the same paragraph).

### L3. Low: identical dynamic-code upsell on all 17 tool pages

- **Evidence:** "A dynamic code can point somewhere new any time, shows you who scans it, and keeps working even if you cancel." appears on all 17 pages. Max Jaccard is 0.22, so this is not a near-duplicate risk.
- **Fix:** Optional. Add one type-specific line per type in `src/content/qr-type-pages.ts` (e.g. WiFi: "Change the password without reprinting the card").

### Info

- **Ads disclosure:** Privacy discloses AdSense on the free generator and guide pages, with consent handling. No AdSense script loads on the guide sampled today. When ads go live on YMYL-adjacent guides (are-qr-codes-safe, the PayPal tool), keep them clearly separated from content.
- **Source quality:** The "ISO/IEC 18004" links go to Denso Wave's standards page rather than the ISO catalogue. That is acceptable, but adding iso.org/standard/62021 strengthens the citation.

## Sources check

The cited sources match what each sentence claims:
- FTC consumer alert, Dec 2023, on QR scams, including parking meters.
- FBI IC3 PSA 220118 (Jan 2022) on tampered QR codes.
- FTC final rule on fake reviews (Aug 2024).
- Google contribution policy 7400114 (prohibited content: incentives and gating).
- RFC 2426 (vCard 3.0), RFC 6350 (vCard 4.0) and RFC 5545 (iCalendar VEVENT).
- Denso Wave pages for error correction, versions, quiet zone (4 modules), history (1994) and trademark.

Factual figures verified again:
- 2 cm and 25 modules give 0.8 mm modules, and a 3.2 mm quiet zone.
- 10:1 distance rule; 21×21 to 177×177 across 40 versions.
- L/M/Q/H recover about 7/15/25/30%.
- 300 DPI at a 2 in code means 600 px.
- $79 is less than 3 × $29.
- 39% yearly saving; $91 (Bitly) and $199 (QRFY) savings.

## What works well

- Writing quality: specific, plain and practical, e.g. WiFi SSID case sensitivity, symbol escaping and guest-network advice.
- Answer-first guides with question H2s and, now, primary sources.
- Competitor facts that are quoted, linked, dated and screenshot-backed.
- Honest limits: no HIPAA claim, team seats labelled as roadmap, and static codes explained as untrackable.
- Specific legal pages: named sub-processors, IP discard, 14-day refund, 90 days' notice on shutdown, and California/GPC language.
- Clean metadata (`site_risk: low`).

## Priority order

1. **H2:** align the "forever / last reprint" copy with Terms §6 (about 1 hour).
2. **M1, M3:** fix the template grammar and label the mock data (about 1 hour).
3. **H1:** legal entity, founder, guide authors and editorial policy.
4. **M2:** diagrams and "we tested" boxes on the top 5 guides.
5. **M4, M5:** de-template the industry pages; deepen the alternatives pages.
6. **L1, L2:** update dates; fix the patent tense.

## Structured findings (for audit-data.json, category "Content Quality")

```json
{
  "category": "Content Quality",
  "score": 69,
  "baseline_score": 63,
  "eeat": {"experience": 38, "expertise": 66, "authoritativeness": 40, "trustworthiness": 58, "weighted": 52},
  "ai_citation_readiness": 78,
  "metadata_template": {"site_risk": "low", "templated_ratio": 0.0, "templated_count": 0, "shared_cta_phrases": {}, "pages_checked": 55},
  "duplication": {"tool_pages_mean_jaccard5": 0.165, "tool_pages_max_jaccard5": 0.220, "industry_pages_mean_jaccard5": 0.171, "industry_pages_max_jaccard5": 0.207, "guides_mean_jaccard5": 0.009, "alternatives_jaccard5": 0.322},
  "resolved": ["C1 contact domain", "H2 short-link host", "H3 analytics claim", "M1 guide sources", "M4 placeholder limits", "M5 'a EndureQR'", "M6 reply time", "L4 false positive"],
  "findings": [
    {"id": "H1", "severity": "high", "title": "No named founder, authors, legal entity or address; no editorial policy", "file": "src/content/company.ts"},
    {"id": "H2", "severity": "high", "title": "'Forever/for life/last reprint' copy exceeds Terms §6 ('as long as EndureQR operates')", "file": "src/content/competitors.ts, src/content/faq.ts"},
    {"id": "M1", "severity": "medium", "title": "Template grammar: 'How to make a Email/SMS/X QR code' (17 pages), 'How healthcare use', 'Codes your hotels business' (8 pages)", "file": "src/app/(marketing)/qr-code-generator/[type]/page.tsx:78; src/app/(marketing)/industries/[slug]/page.tsx:118,203"},
    {"id": "M2", "severity": "medium", "title": "0 images/diagrams and no first-hand tests across guides, tool and industry pages"},
    {"id": "M3", "severity": "medium", "title": "Unlabelled mock live data ('Scanned in Lahore · just now · #12,409', '48,291 scans this month') on pre-launch site"},
    {"id": "M4", "severity": "medium", "title": "Industry pages improved (586-643 words) but 14 shared sentences, rhetorical stat tiles, generic titles", "file": "src/content/industries.ts", "pages": 8},
    {"id": "M5", "severity": "medium", "title": "Alternatives pages thin (613/669 words), no fair 'when competitor is better' section, short titles", "pages": 2},
    {"id": "L1", "severity": "low", "title": "Guide dateModified still 2026-10-26 after substantive 2 Nov revision", "file": "src/content/guides*.ts"},
    {"id": "L2", "severity": "low", "title": "Denso Wave patent described in present tense", "file": "src/content/guides-basics.ts:130,164"},
    {"id": "L3", "severity": "low", "title": "Identical dynamic-code upsell on all 17 tool pages", "file": "src/content/qr-type-pages.ts"}
  ]
}
```

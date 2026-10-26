# Content Quality and E-E-A-T: EndureQR

- Audit date: 2026-10-27
- Site: https://endureqr.vercel.app
- Pages: 57 crawled. All 57 were fetched with `render_page.py --mode never` (none are SPA shells), and the source in `src/content/` was read.
- Pages read in full: home, /pricing, /about, /contact, /privacy, /terms, /alternatives/bitly, /alternatives/qrfy, /industries/hotels, /industries/healthcare (source), /qr-code-generator/url, text and wifi, and the guides do-qr-codes-expire, what-is-a-qr-code, qr-code-error-correction, qr-code-size-for-printing, are-qr-codes-safe, how-to-scan-a-qr-code and qr-code-business-card. The remaining pages were measured programmatically.

## Category score: 63 / 100

| Component | Weight | Score | Notes |
|---|---|---|---|
| E-E-A-T (see breakdown) | 30% | 42 | Accurate copy, but nobody stands behind it and the contact route is broken |
| Depth and thin content | 15% | 65 | Guides and feature pages are solid; industry and alternatives pages are thin |
| Accuracy of claims | 15% | 55 | Guide facts check out; marketing claims overreach (C1, H2, H3, M4) |
| Readability | 10% | 90 | Flesch 60-81, FKGL 5-10, plain British English |
| Duplication | 10% | 75 | Tool pages are templated but distinct; industry pages share a lot of boilerplate |
| AI citation readiness | 10% | 70 | Answer-first openings, tables and schema; no sources, no person, no images |
| Metadata and freshness | 10% | 85 | No templated metadata; guide dates are accurate |

### E-E-A-T breakdown (this skill's internal weights, not Google's)

| Factor | Weight | Score | Evidence |
|---|---|---|---|
| Experience | 20% | 35 | No first-hand signals: no photos of printed codes, no screenshots, no test results ("we scanned X on Y phones"), and 0 images across all 16 guides. The worked examples on industry pages are hypothetical scenarios. The practical tips (WiFi password escaping, testing on both iPhone and Android, 15-25 cm card-scan distance) suggest real hands-on knowledge, but none of it is shown. |
| Expertise | 25% | 62 | Technical accuracy is high (see "What works well"), but there is no named author or credential anywhere. Article schema `author` is `Organization: EndureQR`. |
| Authoritativeness | 25% | 30 | Pre-launch with no external recognition. The guides contain 0 outbound links, even though they cite ISO/IEC 18004, RFC 2426, Denso Wave and Google review policy by name. No people are named on About or Contact. |
| Trustworthiness | 30% | 40 | The legal pages are strong, and there are honest disclosures (no HIPAA, competitor facts sourced and dated, 14-day refund, abuse route). These are undercut by C1: every published mailbox is on an unregistered domain. There is also no legal entity or address, and the "forever" marketing goes beyond what the Terms promise. |
| **Weighted E-E-A-T** | | **42** | |

### AI citation readiness: 70 / 100

Strengths: each guide opens with a direct, self-contained answer, e.g. do-qr-codes-expire: "No, a QR code itself never expires. A static QR code stores your link…". The guides also have question-style H1s, about 10 H2s each and real data tables. FAQ answers are present in the server-rendered HTML (not only in JSON-LD). Every guide carries Article, FAQPage and BreadcrumbList schema, and `/llms.txt` lists every tool and guide.

Gaps: no primary-source links, no Person author, no diagrams (for example, a quiet-zone or logo-size illustration would be highly quotable), and no "last reviewed by" line.

## Measurements

**Templated metadata** (`metadata_template.py --pairs-file`, 57 pairs): `site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`, no page flags. There is no `templated_metadata`, `description_echoes_title`, `brand_suffix_in_description` or `description_duplicates_title`. (A softer pattern, which the heuristic does not flag, is covered in L3.)

**Main-content words.** These counts use extracted text plus the FAQ answers, which render as accordions. The crawl's `words` field counts more of the page chrome, so it is higher.

| Group | Words | Floor (this skill) | Verdict |
|---|---|---|---|
| Home | about 1,250 | 500 | OK |
| Pricing | about 835 | n/a | OK |
| About | 369 | n/a | Thin on people and facts (H1) |
| Contact | 93 | n/a | Fine for its purpose, but no entity or address (C1, H1) |
| Feature pages (4) | 1,330-1,350 (logo page about 1,480) | 800 | OK |
| Generator hub | about 575 | n/a | OK for a tool hub |
| Tool pages (17) | 634-768 | n/a (tool) | OK. About 30% template, so 440-540 unique words each |
| Guides (16) | 1,110-1,656 | 1,500 | 12 of 16 are under 1,500, but the topics are tightly scoped and should not be padded (L2) |
| Industry pages (8) | 458-517, about 250-290 of which are body copy | 500-800 (landing) | Thin (H4) |
| Alternatives (2) | 507-545 | n/a | Thin for comparison pages (M2) |

**Readability** (main-content text): guides average Flesch 74 (range 60-81) and FKGL 5.3-9.9. Tool pages score Flesch 71-78. The hardest pages are /pricing (Flesch 48, but this is skewed by the feature matrix labels) and what-is-a-qr-code (FKGL 9.9, average sentence length 20.6 words). Both are fine.

**Near-duplication** (5-word shingle Jaccard on extracted text):

- 17 tool pages: mean 0.187, max 0.264 (facebook vs x), and 27-37% of each page's shingles are shared template. Eleven sentences appear on all 17 pages (generator UI labels and the "Need to change it after printing?" upsell). These pages are not near-duplicates.
- 8 industry pages: mean 0.156. Seven body sentences appear on all 8 pages, and 2 of each page's 6-7 FAQs are copied from the global FAQ.
- 2 alternatives pages: 0.287 (a shared layout).
- 4 feature pages: max 0.058. These are distinct.

**Freshness:** all 16 guides show "Updated 26 October 2026", and `datePublished = dateModified = 2026-10-26`. Git history (`fb698f7`, `3eb680b`) confirms the guides were written that day, so the dates are accurate and were not bumped by the rebrand. Non-guide pages carry no date. That is fine for tool pages; the `2026-01-01` that `render_page.py` reports for them is a parser default, not a signal on the page.

## Findings

### C1. Critical: every published contact address is on a domain that does not exist

- **Evidence:** `dig endureqr.com` returns `NXDOMAIN`. Verisign whois returns `No match for domain "ENDUREQR.COM"`. Despite this:
  - `hello@endureqr.com` appears on 53 of 57 pages, in the header FAQ line "a person will reply within a day", on Contact, in Terms and in `/llms.txt`.
  - `privacy@endureqr.com` is the only route for GDPR access and deletion requests in the Privacy Policy, which says "You can export or delete your account data any time by emailing privacy@endureqr.com".
  - `abuse@endureqr.com` is the only route for phishing reports.
  - These come from the fallbacks in `src/content/company.ts`, because `NEXT_PUBLIC_CONTACT_EMAIL` is unset in production.
- **Why it matters:**
  - Every "talk to a person" promise currently bounces.
  - The privacy and abuse channels fail silently.
  - Because the domain is unregistered, anyone can register it and start receiving privacy requests and abuse reports.
  - Under the QRG this is a core trust failure: there is no working contact for a site that takes payments.
- **Fix:** Register endureqr.com now and set up MX for hello@, privacy@ and abuse@ before launch. Until then, set `NEXT_PUBLIC_CONTACT_EMAIL` in the Vercel production environment to a mailbox you control and redeploy. Then send a test message to each address.

### H1. High: no identifiable people or legal entity anywhere (known gap, confirmed and wider than listed)

- **Evidence:**
  - The guides credit the Organization (`author: {"@type":"Organization","name":"EndureQR"}`).
  - About names no founder or team and gives no founding date or location.
  - Contact has only email addresses, with no postal address.
  - Privacy names "EndureQR" as the data controller, with no legal name or address.
  - Terms reveal the jurisdiction (Pakistan) but no operating entity.
  - There is no editorial policy page.
- **Why it matters:** The QRG asks raters to find out who is responsible for a website and its content. A paid SaaS with a "keeps working forever" promise needs to show who is making that promise. YMYL-adjacent topics (payments via PayPal codes, scam guidance) raise the bar further.
- **Fix:**
  1. Add a founder section to /about: name, photo, role, a short background relevant to QR, print or SaaS, and links to LinkedIn or GitHub. Add a `Person` with `founder` to the `Organization` JSON-LD.
  2. Add a named author (or "Written by X, reviewed by Y") to each guide, with a /about#team or /authors/[slug] bio page, and switch Article `author` to `Person`.
  3. Name the controller in Privacy (legal or trading name plus postal or registered address), and repeat it on Contact and Terms §01.
  4. Publish /editorial-policy covering who writes the guides, how facts are checked (the `competitors.ts` "confirmed plus sources plus CHECKED date" process is already a good one to describe), the review cadence, how AI tools are used, and a corrections address. Link it from the guide footer and from About.

### H2. High: "forever / for life / last reprint" marketing goes beyond what the Terms commit to, and rests on a host you don't own

- **Evidence:**
  - Marketing copy says:
    - Home: "Cancel anytime. Your codes keep working. Forever." and "Print it once. Keep it forever."
    - The comparison row reads "Keep working, for life".
    - The pricing H1 is "Codes for life."
    - /alternatives/bitly says "It's the last reprint you'll need."
  - The Terms say: "This commitment lasts for as long as EndureQR operates the Service… If we ever have to close the Service, we will give at least 90 days' notice… and let you export every code". Exporting does not help a code that is already printed.
  - Dynamic codes encode `${shortHost()}/r/<slug>` (`src/lib/server/codes.ts:71`, `env.ts:36`), which is currently `endureqr.vercel.app`. That is a Vercel subdomain, not a domain you own. The product has already changed its hostname once (stayqr-six.vercel.app to endureqr.vercel.app).
- **Why it matters:** This is the site's central claim, and as written it is unsupported. On a comparison table that advertises "every fact comes from that company's own pages", your own "for life" cell is the one row without a source. It is also a consumer-protection risk.
- **Fix:**
  1. Before any paying customer prints a code, move short links to a domain you own (for example `endureqr.com/r/…` or a dedicated short domain) and freeze it.
  2. Bring the marketing in line with the Terms. Replace "forever / for life" with "keep working after you cancel, for as long as EndureQR runs", and link to Terms §6.
  3. Add a short "What happens if EndureQR shuts down" section to About or the FAQ. Say whether you will hand the redirect domain over, publish a static redirect map, or keep a funded redirect-only service running. Once a real continuity mechanism exists, the claim becomes a trust asset.
  4. Delete "It's the last reprint you'll need."

### H3. High: the homepage says analytics are on every plan, but pricing says Free has none

- **Evidence:** `src/components/sections/features.tsx:97` reads: "Live map of scans by city, device and time of day. Analytics on every plan, for every code." The /pricing matrix lists Scan analytics as **Not included** on Free. Static codes cannot be tracked, as the site's own guides and FAQ explain.
- **Also overstated:** "Live map". The dashboard (`analytics-view.tsx`) has a "Top cities" bar list and a weekday-by-hour heatmap, but no map.
- **Fix:** Change it to: "Scans by city, device and time of day on every paid plan. Static codes can be tracked with UTM links ([guide](/guides/track-qr-code-scans))." Remove "live map" until a map exists.

### H4. High: industry pages are thin and largely boilerplate

- **Evidence:**
  - The 8 pages under /industries/* have about 250-290 words of body copy each (458-517 including FAQs).
  - Seven body sentences are identical on all 8 pages, e.g. "Make a dynamic code and point it at today's page." and "Download print-ready SVG, PDF or PNG for menus, signs or packaging."
  - Two of the 6-7 FAQs on each page are copies of the global FAQ.
  - The "stat" slots are rhetorical rather than data ("1 print for every menu change this year", "1 card per room").
  - These pages have no BreadcrumbList (all other content groups do), and their titles are generic ("Dynamic QR codes for hotels · EndureQR", 38-43 characters).
- **Why it matters:** These are commercial landing pages for competitive terms. At this depth, with no proof (customers, photos or numbers), they read as scaled pages.
- **Fix:** Bring each page to at least 600-800 unique words:
  - industry-specific placement and size guidance (e.g. hotel room cards versus lift posters, real-estate sign riders at 10:1 distance);
  - industry constraints (healthcare's HIPAA note is the model to follow);
  - 2-3 FAQs unique to the industry in place of the copied global ones;
  - a link to the matching guide.

  Replace the rhetorical "stat" with a concrete, true number or remove the slot. Label worked examples as "Example scenario". Add BreadcrumbList, and write keyword titles such as "Hotel QR Codes: Room Cards You Can Update · EndureQR". Defer to `seo-programmatic` if more industries are planned.

### M1. Medium: guides cite no sources

- **Evidence:** 0 outbound links across all 16 guides. They name ISO/IEC 18004, RFC 2426, Denso Wave, Google's review-incentive and review-gating policies, and "Councils, police and consumer bodies in several countries have warned about fake codes on parking meters" (are-qr-codes-safe), all without links.
- **Fix:** Link each named standard or policy to its primary source:
  - the ISO catalogue page for 18004;
  - RFC 2426 at rfc-editor.org;
  - Denso Wave's QR history and patent page;
  - Google's "Prohibited and restricted content" policy for reviews;
  - at least two dated official quishing warnings, such as the US FTC consumer alert and the UK Action Fraud or a council notice.

  This is the cheapest authority and AI-citation upgrade available.

### M2. Medium: the alternatives pages are thin, and the comparison is narrow

- **Evidence:** /alternatives/bitly and /qrfy have about 330 words of body copy (about 510-545 with FAQ). The comparison covers price, codes, scans, edits and cancellation only. Titles are 27-28 characters ("Bitly alternative · EndureQR"). There is no BreadcrumbList.
- **What works:** Every competitor fact is sourced, dated ("Checked 26 Oct 2026") and backed by screenshots in `docs/evidence/`. That is exemplary, so keep it.
- **Fix:** Add analytics depth, design options, bulk limits, custom domains and API, plus an honest "when Bitly or QRFY is the better choice" section. Fairness raises trust on comparison pages. Use a longer title (for example "Bitly Alternative for QR Codes: $29/yr, Unlimited Edits"), add BreadcrumbList, and see `seo-competitor-pages`. Re-check prices quarterly, as `competitors.ts` already reminds you.

### M3. Medium: the guides have no visuals and no first-hand evidence

- **Evidence:** 0 `<img>` or `<figure>` elements on all 16 guides, the guides hub, the 17 tool pages and the industry pages (the crawl reports `imgs: 0`). Topics like quiet zone, logo sizing, print size and error correction are inherently visual. No guide reports a test you ran.
- **Fix:** For the 5 highest-intent guides (not-scanning, size-for-printing, design-best-practices, error-correction, what-is-a-qr-code), add annotated diagrams or photos with descriptive alt text. Add one "We tested this" box per guide, e.g. the minimum scannable size at 2 cm on iPhone 15 and Pixel 8 under office light, with a photo. This is the most direct Experience signal you can add.

### M4. Medium: published plan limits are marked as placeholders in the source

- **Evidence:** `src/content/plans.ts:1` says: "Prices are the brief's; limits are placeholders until the product team confirms them." /pricing publishes those limits as facts: "Scan analytics: 12 months" (Pro), "Forever" (Lifetime), and "Bulk create from CSV: 500 rows". "Up to 500" is repeated on /bulk-qr-code-generator.
- **Fix:** Confirm each limit against the code (e.g. the bulk row cap in `codes.ts`, analytics retention in the DB job) before launch, then remove the placeholder comment. If retention is not enforced, say "unlimited" or stop publishing a number.

### M5. Medium: rebrand grammar artefact ("a EndureQR")

- **Evidence:** 8 instances, 7 of them on public pages:
  - `contact/page.tsx:21` "A EndureQR code that leads to phishing…"
  - `signup/page.tsx:9` meta description "Create a EndureQR account…"
  - `qr-code-generator/page.tsx:29` (FAQ)
  - `industries.ts:262`
  - `legal.ts:56` (Terms)
  - `feature-pages.ts:387` and `:446`
  - `lib/server/email.ts:40`
- **Why it matters:** Small, but this sloppiness shows on the Contact and Terms pages, which raters read for trust.
- **Fix:** Replace each with "an EndureQR".

### M6. Medium: reply-time promise is inconsistent

- **Evidence:** Contact and Privacy say "within one business day" (`COMPANY.replyWithin`). The FAQ footer on 53 pages says "a person will reply within a day". That footer is not generated from `COMPANY`.
- **Fix:** Render the footer line from `COMPANY.replyWithin` so there is one promise. This only matters once C1 is fixed.

### L1. Low: tool pages share about 30% template text, including an identical upsell block

- **Evidence:** "Change where this code points after it's printed, see every scan, and keep it working even if you cancel." and "A dynamic code can point somewhere new any time…" appear on all 17 pages. Four of the tool pages' related-links blocks are identical. Pairwise Jaccard is at most 0.26, so this is below near-duplicate territory.
- **Fix:** No urgent action. Vary the upsell by type, which costs one line per type. For example, WiFi: "Change the password without reprinting the card." PayPal: "Swap the PayPal.Me link when your account changes."

### L2. Low: 12 of 16 guides are under the 1,500-word blog floor

- **Evidence:** Several guides fall short, e.g. wifi-qr-code (about 1,110 words), do-qr-codes-expire (about 1,143), restaurant-menu (about 1,168), design-best-practices (about 1,180).
- **Fix:** Do **not** pad. Word count is not a ranking factor, and these guides answer their questions fully. Grow them only with M1 (sources), M3 (tests and diagrams), and, for restaurant-menu, accessibility guidance (offer a printed menu alongside the QR code).

### L3. Low: the tool-page descriptions share a closing phrase

- **Evidence:** "Free, no sign-up, no watermark…" closes 15 of the 17 tool-page descriptions (16 of 17 contain "no sign-up"). The templated-metadata heuristic did not flag it, because each description leads with a unique, specific sentence. Note it now so a future bulk job does not make it worse.
- **Fix:** Optional. Rotate 2-3 phrasings.

### L4. Low: pricing unit glitch

- **Evidence:** /pricing shows "$2.42 per month/mo".
- **Fix:** Drop one of the two unit labels.

### L5. Low: the "Denso Wave holds a patent" claim is in the present tense

- **Evidence:** `guides-basics.ts:129` and `:163` say Denso Wave "holds a patent on the format but chose not to enforce it". Denso Wave's own wording is that its patent rights "are not exercised", and the original 1994-era patents have long since expired in most jurisdictions.
- **Fix:** Rephrase as "Denso Wave patented the format but chose not to exercise its rights for standard codes…" and link Denso Wave's page.

## Factual claims checked

**Verified correct:**
- Denso Wave, 1994, Masahiro Hara.
- Versions 1-40, from 21×21 to 177×177, adding 4 modules per version.
- Version 40 capacity: 7,089 numeric digits and 2,953 bytes at L; 1,273 bytes at H.
- Error-correction levels L/M/Q/H recover about 7/15/25/30%, with the correct caveat that the percentages are codewords, not area.
- The 50-character URL table: L=v3, M=v4, Q=v5, H=v6.
- "Modules at H are about 30% smaller than at L" (29/41 = 0.71).
- vCard 3.0 is RFC 2426.
- 2,048 px at 300 ppi is about 17 cm, and 1,024 px is about 8.7 cm.
- A 2 cm code with 25 modules gives 0.8 mm modules.
- Uploading a logo forces level H, as the code does: `effectiveEcl` in `src/lib/qr-design.ts:41`.
- The free generator works client-side: there are no fetch calls in `src/components/qr`.
- Google prohibits review incentives and review gating.
- 39% yearly saving: 29 ÷ 47.88.
- $91 and $199 yearly savings.
- Competitor prices match `docs/evidence/` screenshots.

**Unsupported or overstated:** C1 (contact domain), H2 ("forever"), H3 ("analytics on every plan", "live map"), M4 (placeholder limits), L5 (patent tense). The industry "stat" tiles (H4) are rhetorical, not data.

## What works well

- **Writing quality.** The copy is specific, plain and useful. Readability sits at Flesch 70-80 with no filler, and none of the generic-AI markers the QRG flags. Each tool page has type-specific steps and gotchas, e.g. WiFi SSID case sensitivity and symbol escaping, or the 300-character text cap and why.
- **Answer-first guides.** Each guide opens with a quotable direct answer, and the H1s and FAQ entries are framed as questions. They include real tables (error-correction versions, event code plan, scan-tracking fields) and Article, FAQPage and BreadcrumbList schema. The FAQ content is in the server HTML.
- **Comparison pages.** Competitor facts are sourced, dated and screenshotted. The `confirmed` flag renders a visible `[verify]` tag on unconfirmed facts. Vendors' own words are quoted with links. This is a model for comparison pages.
- **Honest limits.** The healthcare page says "EndureQR holds no compliance certification, such as HIPAA". Team seats are labelled as roadmap. The guides explain that static codes cannot be tracked, even though that argues against the free tier.
- **Legal pages.** Privacy and Terms are plain-English and specific:
  - named sub-processors;
  - the IP-discard policy;
  - a 14-day refund window;
  - 30 days' notice before material changes;
  - 90 days' notice and data export on shutdown;
  - an abuse-reporting process with 7 days to respond.
- **Metadata.** All 57 title and description pairs are unique and non-templated (`site_risk: low`). Descriptions are 140-157 characters and lead with the page's specific value.
- **Dates and tool-page structure.** Guide dates are accurate, `/llms.txt` is present and complete, and the 17 tool pages avoid the near-duplicate trap.

## Priority order

1. **C1:** register endureqr.com and set up the mailboxes, or set `NEXT_PUBLIC_CONTACT_EMAIL`. This is a blocker before launch.
2. **H2:** move short links to an owned domain before customers print, and align the "forever" copy with the Terms.
3. **H3, M4, M5:** fix the contradictory, placeholder and ungrammatical copy (about an hour).
4. **H1:** add a named founder, guide authors, the controller identity and an editorial policy.
5. **M1, M3:** add sources and first-hand tests or diagrams to the guides.
6. **H4, M2:** deepen the industry and alternatives pages.

## Structured findings (for audit-data.json, category "Content Quality")

```json
{
  "category": "Content Quality",
  "score": 63,
  "eeat": {"experience": 35, "expertise": 62, "authoritativeness": 30, "trustworthiness": 40, "weighted": 42},
  "ai_citation_readiness": 70,
  "metadata_template": {"site_risk": "low", "templated_ratio": 0.0, "shared_cta_phrases": {}, "pages_checked": 57},
  "duplication": {"tool_pages_mean_jaccard5": 0.187, "tool_pages_max_jaccard5": 0.264, "industry_pages_mean_jaccard5": 0.156, "alternatives_jaccard5": 0.287},
  "findings": [
    {"id": "C1", "severity": "critical", "title": "Published contact emails on unregistered domain endureqr.com (NXDOMAIN)", "pages": 53, "fix": "Register domain + MX, or set NEXT_PUBLIC_CONTACT_EMAIL in production"},
    {"id": "H1", "severity": "high", "title": "No named founder, authors, legal entity or address; no editorial policy", "fix": "Founder on About, Person authors on guides, controller identity in Privacy, /editorial-policy"},
    {"id": "H2", "severity": "high", "title": "'Forever/for life' claims exceed Terms; short links on unowned vercel.app host", "fix": "Owned short-link domain before launch; align copy with Terms; publish continuity plan"},
    {"id": "H3", "severity": "high", "title": "'Analytics on every plan' and 'live map' contradict pricing and product", "file": "src/components/sections/features.tsx:97"},
    {"id": "H4", "severity": "high", "title": "Industry pages thin (~250-290 body words) with 7 shared sentences, rhetorical stats, no breadcrumbs", "pages": 8},
    {"id": "M1", "severity": "medium", "title": "0 outbound citations across 16 guides"},
    {"id": "M2", "severity": "medium", "title": "Alternatives pages thin; short titles; no breadcrumbs", "pages": 2},
    {"id": "M3", "severity": "medium", "title": "No images/diagrams or first-hand test evidence in guides"},
    {"id": "M4", "severity": "medium", "title": "Pricing limits (12-month analytics, 500 rows) flagged as placeholders in plans.ts"},
    {"id": "M5", "severity": "medium", "title": "'a EndureQR' grammar artefact x8 incl. Contact, Terms, signup meta"},
    {"id": "M6", "severity": "medium", "title": "Reply-time promise inconsistent ('one business day' vs 'within a day')"},
    {"id": "L1", "severity": "low", "title": "Tool pages ~30% shared template incl. identical upsell"},
    {"id": "L2", "severity": "low", "title": "12/16 guides under 1,500 words; do not pad"},
    {"id": "L3", "severity": "low", "title": "15/17 tool descriptions end with 'no watermark' tail"},
    {"id": "L4", "severity": "low", "title": "'$2.42 per month/mo' on pricing"},
    {"id": "L5", "severity": "low", "title": "Denso Wave patent claim phrased in present tense"}
  ]
}
```

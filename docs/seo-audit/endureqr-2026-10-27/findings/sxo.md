# SXO findings: EndureQR

Date: 2026-10-27 · Site: https://endureqr.vercel.app (pre-launch, renamed from StayQR on 2026-10-26)
Scope (narrowed by the coordinator): 3 queries and pages.

| Query | Page |
|---|---|
| "free qr code generator" | /qr-code-generator |
| "dynamic qr code generator" | /dynamic-qr-code-generator |
| "do qr codes expire" | /guides/do-qr-codes-expire |

Method: pages were rendered with `render_page.py --mode always` (Playwright) and parsed with `parse_html.py`. Above-the-fold positions were measured in Playwright Chromium at 390×844 (mobile) and 1440×900 (desktop). SERPs came from WebSearch in standard and extended mode, US only. Page types follow `page-type-taxonomy.md`.

**This SXO Gap Score is separate from the SEO Health Score.**

## SXO Gap Score: 61 / 100

The score is the unweighted average of the three page scores.

| Page | SERP dominant type | Our type | Mismatch | SXO Gap Score |
|---|---|---|---|---|
| /dynamic-qr-code-generator | Tool with a free dynamic tier (about 55%) | Landing page with no generator and a paid-only CTA | **HIGH** | **54** |
| /qr-code-generator | Tool (about 89%) | Tool | ALIGNED | 64 |
| /guides/do-qr-codes-expire | Blog post / guide (about 85%) | Blog post (Article) | ALIGNED | 66 |

**Primary finding:** /dynamic-qr-code-generator has the wrong page type for its query. The SERP rewards generators you can try before paying, and most of them have a free dynamic tier. Our page is a sales landing page with no generator, and its only CTA is the paid "Start Pro".

---

## 1. "free qr code generator" → /qr-code-generator

### SERP (extended set, 9 results)

| # | Result | Type | Notes |
|---|---|---|---|
| 1 | adobe.com/express/feature/image/qr-code-generator | Tool | "Custom, Branded"; logo; "never expire" |
| 2 | wix.com/wixel/qr-code-generator | Tool | Big-brand tool |
| 3 | qrcode-monkey.com | Tool | Homepage is the tool; "with Logo"; free for commercial use |
| 4 | qrplanet.com | Tool | "don't expire", no registration |
| 5 | hovercode.com/qr-code-generator-with-logo | Tool | "Free, No Sign Up"; no watermark |
| 6 | qr-code-generator.com/solutions/text-qr-code | Tool | Free static; paid tracking |
| 7 | the-qrcode-generator.com | Tool | 2 free dynamic codes |
| 8 | app.flowcode.com/free-qr-code-generator | Tool | Free codes are dynamic |
| 9 | alternativeto.net | Directory/Comparison | |

The standard-mode set added more tools (landerlab, formnx), a "4 best free" listicle (qrplus) and noise (Bandcamp, GitHub, G2).

- **Consensus:** Tool, about 89% (8 of 9).
- **Format:** the generator sits above the fold with minimal copy. Titles repeat "No Sign Up", "no watermark", "never expire", "with Logo" and "custom/branded".
- **Domains:** brand-heavy (Adobe, Wix, QRCode Monkey).
- **Mismatch: ALIGNED.** Our page is a Tool. The title "Free QR Code Generator: No Sign-Up, No Watermark" uses the SERP's own vocabulary.

### User stories
1. As a **no-strings one-off maker**, I want a code I can download right now that will never expire or carry a watermark, because I've heard free generators "trap you into dynamic links that expire". But I'm blocked by a **trust gap**: I can't tell which tools are truly static.
   *(Signals: "No Sign Up", "never expire" and "free for commercial use" across 5 of 8 tool titles and snippets; the "no-signup unlimited" query results.)*
2. As a **brand-conscious small business**, I want my logo and colours on the code, because a plain code looks generic on my print. But I'm blocked by **technical confusion** about whether a logo breaks scanning.
   *(Signals: Adobe "Custom, Branded", QRCode Monkey "custom QR Codes with Logo", Hovercode's logo tool ranking for this head term.)*

### Persona scores
| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Brand-conscious SMB | 20 | 13 | 15 | 19 | **67** | Good |
| No-strings one-off maker | 23 | 18 | 19 | 22 | **82** | Excellent |

- **Brand-conscious SMB (weakest).** "Upload logo" is step 4 of 4, at 1,851 px on desktop and 2,782 px on mobile. The default preview has no logo. There are no example outputs (0 `<img>` on the page).
- **One-off maker.** The promise is above the fold, and "static · never expires · no watermark" appears under the preview. The FAQ answers "Is my data stored anywhere?". But the first input field is at 1,806 px on mobile, because the preview renders before the form.

### Gap score: 64 / 100
| Dimension | Score | Evidence |
|---|---|---|
| Page type | 15/15 | Working tool with no login wall; WebApplication schema |
| Content depth | 11/15 | 748 words (thinnest of the three); FAQ is good; no how-to steps or use cases |
| UX signals | 10/15 | Type picker above the fold on desktop; first input at 971 px desktop and 1,806 px mobile; logo upload far down |
| Schema | 12/15 | BreadcrumbList, WebApplication (price 0), FAQPage (6); no featureList or screenshot |
| Media | 6/15 | 0 images; the live preview is the only visual |
| Authority | 3/15 | New site on a vercel.app subdomain against Adobe, Wix and QRCode Monkey; no reviews |
| Freshness | 7/10 | Updated this week; no visible date (normal for tools) |

---

## 2. "dynamic qr code generator" → /dynamic-qr-code-generator

### SERP (extended set, 9 results)

| # | Result | Type | Notes |
|---|---|---|---|
| 1 | hovercode.com | Tool (homepage) | Title: "QR Code Generator: **Free Dynamic** QR Codes, **No Expiry**"; 3 free dynamic codes |
| 2 | hovercode.com/blog/best-dynamic-qr-generators | Comparison listicle | "We tried the 14 best" |
| 3 | play.google.com DynamicQR | App listing | |
| 4 | kobedigital.com top dynamic tools | Comparison listicle | |
| 5 | qr-code-generator.com/solutions/dynamic-url-qr-code | Hybrid (tool plus sales copy) | Bitly-owned QRCG PRO |
| 6 | the-qrcode-generator.com | Tool | 2 free lifetime dynamic codes |
| 7 | qrcodedynamic.com | Tool | "Free & Dynamic" |
| 8 | imqrscan.com/dynamic-qr-code-generator | Tool | "Free Dynamic QR Code Generator" |
| 9 | alternativeto.net | Directory | |

The standard-mode set was all WordPress plugins and Google Workspace add-ons, which also act as installable tools.

Related free-tier evidence:
- Hovercode: 3 free dynamic codes.
- TQRCG: 2.
- QR Tiger: 3, capped at 500 scans.
- Bitly Free: 2 QR codes a month.
- QRFlow: free codes expire after 7 days.

- **Consensus:** Tool with a free entry point, about 55% (5 of 9). Comparison listicles are about 25% and apps about 20%.
- **"Free" in titles:** 4 of the 6 tool results put "Free" in the title for a paid feature.
- **Mismatch: HIGH.** Our page is a landing page with no interactive element. The taxonomy rates "Landing Page without interactive element" on a tool SERP as HIGH. The page has no generator, no free dynamic code and no trial. The only primary CTA is "Start Pro", which goes to `/signup?plan=pro-yearly`.

### User stories
1. As a **free-tier evaluator**, I want to create and test a dynamic code before paying, because every other result lets me start free. But I'm blocked by **price sensitivity** and commitment: EndureQR asks for $29 before I've seen the editor.
   *(Signals: "Free Dynamic" in Hovercode, qrcodedynamic and imqrscan titles; TQRCG "2 lifetime free dynamic"; Bitly Free 2 QR codes a month.)*
2. As a **switcher burned by deactivated codes**, I want a provider whose printed codes survive cancellation, because my last trial switched my menus off. But I'm blocked by a **trust gap**: every vendor says "no expiry".
   *(Signals: Hovercode "No Expiry" in its title; QRFlow 7-day free-code expiry; "trap you into dynamic links that expire" in results for the "truly free" query.)*

### Persona scores
| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Free-tier evaluator | 14 | 18 | 14 | 6 | **52** | Needs work |
| Switcher burned by deactivation | 23 | 20 | 12 | 18 | **73** | Good |

- **Free-tier evaluator (weakest).**
  - Pricing is clear above the fold: "Start Pro" sits at 520 px on desktop.
  - The only path is a paid signup.
  - The 14-day refund appears only in the pricing section near the bottom.
  - The page has no competitor price comparison. The homepage has one ("Same codes, for a fraction of the price"), but this page doesn't.
- **Switcher.** "Codes outlive your plan" is in the first card row, and "What happens if you cancel" is a full section. But nothing answers "what if EndureQR itself shuts down?". The guide warns about exactly this risk ("If the company behind the short domain stops operating, every code using that domain stops forwarding"). Short links are shown on `endureqr.vercel.app/r/…`.

### Gap score: 54 / 100
| Dimension | Score | Evidence |
|---|---|---|
| Page type | 6/15 | Landing page on a tool SERP; no generator |
| Content depth | 13/15 | 1,317 words; static vs dynamic table; how it works; pricing table; use cases |
| UX signals | 9/15 | Clear price and CTA above the fold; no low-commitment path; refund buried |
| Schema | 13/15 | SoftwareApplication with 3 Offers ($3.99 / $29 / $79), FAQPage, BreadcrumbList |
| Media | 3/15 | 0 images; no dashboard or analytics screenshots, which competitor tools show |
| Authority | 3/15 | No reviews or ratings; vercel.app domain; no continuity commitment |
| Freshness | 7/10 | Current pricing; no visible date |

---

## 3. "do qr codes expire" → /guides/do-qr-codes-expire

### SERP (extended set plus standard set, 19 URLs)

- **Blog posts / guides from QR vendors:**
  - qrstuff (two URLs)
  - qr-code-generator.com, also on dk.
  - scanova ("How Long Does QR Code Last? 2026 Guide")
  - the-qrcode-generator.com
  - qrnow ("How to Choose One That Doesn't")
  - me-qr
  - uniqode
  - linklyhq
  - rocketlink ("Static vs. dynamic, explained")
  - qrcodechimp
  - tritonstore
  - allblogs.in
- **Forums:** Quora and the Adobe community ("qr code expires").
- **Help-centre article:** qrcodechimp help.

- **Consensus:** Blog post, about 85%; forums about 10%; help docs about 5%.
- **Answer format:** every result opens with a short "No, but…" answer, then splits static from dynamic. Several add scan caps, free-trial expiry and physical durability (Scanova: "10+ years").
- **Mismatch: ALIGNED.** Our page is a blog post with Article schema, and its first paragraph is a snippet-ready answer at 195 px on desktop.

### User stories
1. As a **quick-answer seeker**, I want a yes-or-no answer in one sentence, because I'm about to print. But I'm blocked by an **information gap** when vendor posts bury the answer under sales copy.
   *(Signals: uniform "Do QR codes expire?" H1s; the AI-style synthesis opens with "Generally, no".)*
2. As a **risk-averse buyer about to print in volume**, I want to know which providers switch codes off and how to choose one that won't, because a reprint is expensive. But I'm blocked by **comparison fatigue** and a **trust gap**: every source is a vendor.
   *(Signals: qrnow "How to Choose One That Doesn't"; QR Tiger "Best QR Code Generators with No Expiration Limit"; the Adobe community thread about free-tool codes that stopped working.)*

### Persona scores
| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Risk-averse volume buyer | 21 | 17 | 11 | 14 | **63** | Good |
| Quick-answer seeker | 24 | 24 | 17 | 15 | **80** | Excellent |

- **Risk-averse buyer (weakest).**
  - Gaps:
    - No provider-by-provider policy table.
    - The author is "EndureQR" (an Organization), not a person.
    - Only one external link, plus a mention of ISO/IEC 18004 with no link.
    - No answer to what happens if EndureQR shuts down.
  - CTAs:
    - The end CTA "Start free" goes to /signup.
    - The signup page doesn't say what a free account includes.
    - The Free tier is "no account" anyway.
- **Quick-answer seeker.** A direct answer at 195 px, a table of contents, and a visible "Updated 26 October 2026".

### Gap score: 66 / 100
| Dimension | Score | Evidence |
|---|---|---|
| Page type | 15/15 | Blog post on a blog SERP |
| Content depth | 12/15 | 1,332 words; causes, check steps and avoidance covered; no provider table; physical lifespan thin |
| UX signals | 12/15 | Answer first, TOC; "Start free" CTA leads to a signup with no stated free value |
| Schema | 11/15 | Article, FAQPage (4), BreadcrumbList; author is an Organization; image is the generic OG image |
| Media | 3/15 | 0 images; no static vs dynamic diagram |
| Authority | 4/15 | No named author; no outbound citations |
| Freshness | 9/10 | datePublished and dateModified 2026-10-26, shown on the page |

---

## Findings (ordered by severity)

### F1. HIGH: /dynamic-qr-code-generator is a landing page on a tool SERP, with a paid-only entry point
- **Evidence:**
  - About 55% of top results are tools with a free dynamic tier: Hovercode "Free Dynamic QR Codes, No Expiry", TQRCG 2 free, qrcodedynamic, imqrscan.
  - Our page has no generator.
  - Its only primary CTA is "Start Pro" (`/signup?plan=pro-yearly`).
  - The 14-day refund appears only in the bottom pricing section.
  - The free-tier evaluator persona scores 52 (Action 6/25).
- **Fix:**
  - Embed the existing generator at the top of the page, opened in dynamic mode. Let people build and style a dynamic code and see the preview and short link, and ask for a plan only at "Save & download".
  - If possible, add a low-commitment entry: 1 free dynamic code, or a 14-day trial.
  - At minimum, put "14-day money-back guarantee" directly under "Start Pro".
  - Move the homepage's competitor price table onto this page, below "Static and dynamic codes compared".

### F2. HIGH: the "codes keep working forever" promise has no business-continuity answer, and codes are minted on a vercel.app subdomain
- **Evidence:**
  - The guide says: "If the company behind the short domain stops operating, every code using that domain stops forwarding."
  - No page answers "What if EndureQR shuts down?" (grep across all six inventoried pages).
  - The dynamic page and the Bitly page mockup show short links as `endureqr.vercel.app/r/…`, which is a free-host subdomain.
  - Trust scores 12/25 for the switcher persona and 11/25 for the risk-averse buyer.
- **Fix:**
  - Before the first paid code is minted, move to an owned domain (the contact address already uses endureqr.com) and use a dedicated short-link domain.
  - Publish a concrete continuity commitment as an FAQ on the dynamic, pricing and guide pages. For example: CSV export of all destinations at any time; the domain renewed X years ahead; redirects kept running for N years after shutdown.
  - Link the footer's "All codes redirecting" badge to a public status page.

### F3. MEDIUM: tool inputs sit below the fold on mobile, and the logo uploader is buried
- **Evidence (390×844):**
  - On /qr-code-generator the first input is at 1,806 px (about 2.1 screens down), because H1, intro and preview render before the form.
  - "Upload logo" is step 4, at 2,782 px on mobile and 1,851 px on desktop.
  - The brand-conscious SMB persona's Clarity is 13/25.
  - Ads are planned for these pages and would push the inputs down further.
- **Fix:**
  - On mobile, render the input step before the preview, or use a sticky mini-preview.
  - Shorten the intro to one line.
  - Add an "Add logo" shortcut button next to the type picker in step 1.
  - When ads launch, never place a slot in the first mobile viewport or between the inputs and "Download".

### F4. MEDIUM: the guide lacks the information gain and authorship a volume buyer needs, and its CTA misleads
- **Evidence:**
  - No provider policy table.
  - Article `author` is an Organization.
  - One external link.
  - 0 images.
  - "Start free" goes to /signup, which lists no free features. The Free tier on the homepage is "Free forever, no account".
- **Fix:**
  - Add a sourced, dated table titled "What happens to your codes when you cancel", covering QRCG PRO, QR Tiger, Bitly, Hovercode, Flowcode, Uniqode and EndureQR. Use the same citation pattern as /alternatives/bitly. No current top result offers this in one table.
  - Credit a named author with a short bio and Person schema.
  - Add a static vs dynamic diagram with alt text.
  - Link ISO/IEC 18004 and the vendor help pages.
  - Change the CTA to "Make a free QR code" → /qr-code-generator, and add a secondary "See dynamic codes" → /dynamic-qr-code-generator.

### F5. MEDIUM: no media on a visual category
- **Evidence:** 0 `<img>` on all three pages. The dynamic page shows no dashboard or analytics screenshot, and the free generator shows no example outputs.
- **Fix:**
  - Add 3–4 example output images to /qr-code-generator: plain, branded colour, with logo, with frame.
  - Add 2 dashboard screenshots to /dynamic-qr-code-generator: editing a destination, and the scan heatmap.
  - Give every image descriptive alt text and an ImageObject entry.

### F6. LOW: the homepage overlaps both commercial targets
- **Evidence:** The homepage embeds the full generator (H2 "Make a QR code in seconds") and its title is "EndureQR: Dynamic QR codes that never stop working". It can compete with both /qr-code-generator and /dynamic-qr-code-generator.
- **Fix:**
  - Keep the homepage on brand plus "keeps working if you cancel".
  - Add exact-match internal links ("free QR code generator", "dynamic QR code generator") from the homepage to the two target pages.
  - After launch, watch Search Console for queries split between pages.

### F7. LOW: no social proof (expected before launch)
- **Evidence:** No reviews, ratings or user counts. Competitors cite G2 and AlternativeTo listings.
- **Fix:**
  - After launch, add AggregateRating only from genuine first-party reviews.
  - Until then, use a founder/About block and the status page from F2.

## What works well
- **Tool-first on the tool query:**
  - The generator needs no login and adds no watermark.
  - Downloads are PNG, SVG, JPEG and PDF up to 4096 px.
  - The title uses the SERP's own trust vocabulary ("No Sign-Up, No Watermark").
  - The FAQ answers the "is it really free / does it expire / is my data stored" doubts directly.
- **Snippet-ready guide:** the guide answers in its first paragraph ("No, a QR code itself never expires…"). It has a TOC, a visible updated date, and Article, FAQ and Breadcrumb schema.
- **Dynamic page content:**
  - Transparent pricing appears above the fold.
  - A static vs dynamic table and a 3-plan pricing table.
  - A clear cancellation policy, which is a real differentiator against trial-deactivation providers.
  - SoftwareApplication schema with all three Offers.
- **Honest competitor claims:** we checked the /alternatives/bitly figures against bitly.com/pages/pricing on 2026-10-27. Core is $120 a year with 5 QR codes and 5 redirects a month; Free has 2 QR codes and no redirects. This matches the page.

## Limitations
- **SERP data:** WebSearch is not a live Google SERP. It has no rank positions, PAA boxes, ads, AI Overview, featured snippet or image pack. Results are US-only. The standard-mode sets contained noise (Bandcamp, GitHub, WordPress plugins), so consensus percentages are based on the extended-mode sets of 9 results plus the standard-mode sets.
- **Other data:** we had no search volume or Search Console data, so persona weighting is judgment. The site is on a vercel.app subdomain and not yet ranking, so the authority scores are inferred.
- **Not tested:** we did not test downloads or scanning, and the signup flow only as far as rendering /signup.
- **Mobile measurements:** taken in Chromium emulation, not on a real device.
- **Parser artifact:** `parse_html.py` shows headings run together (for example "FreeQRcodegenerator."), but the HTML contains real spaces between the per-word spans. This is not a page defect.
- **Out of scope:** /qr-code-generator/wifi, /qr-code-with-logo and /alternatives/bitly were dropped when the scope narrowed. Observations already gathered, unscored:
  - **"bitly alternative":** the head-term SERP is about 90% link-shortener listicles (Rebrandly, TinyURL, Short.io, Dub), so our QR-only, single-vendor page is a likely CRITICAL mismatch. The "bitly alternative for qr codes" SERP does match our format; retitle the page to target it.
  - **WiFi page:** never says the WiFi password stays in the browser, although competitors lead with "100% private". It also shows a "Make it dynamic" upsell that can't apply to WiFi codes.
  - **Logo page:** no example images on a visual query, and the uploader is at 2,911 px on mobile.

## Structured findings (audit-data.json, Search Experience)
```json
{
  "category": "Search Experience",
  "sxo_gap_score": 61,
  "pages": [
    {"url": "/qr-code-generator", "query": "free qr code generator", "serp_type": "Tool", "serp_confidence": 0.89, "page_type": "Tool", "mismatch": "ALIGNED", "score": 64},
    {"url": "/dynamic-qr-code-generator", "query": "dynamic qr code generator", "serp_type": "Tool (free tier)", "serp_confidence": 0.55, "page_type": "Landing Page", "mismatch": "HIGH", "score": 54},
    {"url": "/guides/do-qr-codes-expire", "query": "do qr codes expire", "serp_type": "Blog Post", "serp_confidence": 0.85, "page_type": "Blog Post", "mismatch": "ALIGNED", "score": 66}
  ],
  "findings": [
    {"id": "F1", "severity": "high", "title": "Dynamic page is a paid-only landing page on a tool SERP"},
    {"id": "F2", "severity": "high", "title": "No business-continuity answer; short links on vercel.app subdomain"},
    {"id": "F3", "severity": "medium", "title": "Tool inputs below the mobile fold; logo upload buried at step 4"},
    {"id": "F4", "severity": "medium", "title": "Guide lacks provider table, named author; Start free CTA misleads"},
    {"id": "F5", "severity": "medium", "title": "Zero images on all three pages"},
    {"id": "F6", "severity": "low", "title": "Homepage overlaps both commercial targets"},
    {"id": "F7", "severity": "low", "title": "No social proof (pre-launch)"}
  ]
}
```

*Generate a PDF report? Use `/seo google report`.*

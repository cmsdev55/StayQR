# GEO / AI Search Readiness: endureqr.com

Audit date: 2026-11-02. Baseline: 2026-10-27 (score 63, on endureqr.vercel.app). Scope: Google AI Overviews and AI Mode, ChatGPT search, Perplexity and Microsoft Copilot.

Method:
- Fetched robots.txt, llms.txt, sitemap.xml and the IndexNow key file live.
- Sent requests to a guide URL with 13 crawler user-agents.
- Raw-fetched all 16 guides, /qr-code-generator/wifi, /dynamic-qr-code-generator, /about, /pricing and the home page, then parsed headings, section lengths, outbound links and JSON-LD with a stdlib parser.
- Confirmed SSR with `render_page.py --mode auto`: `is_spa=false`, and 1,494 words were extracted from what-is-a-qr-code.
- Ran whois and dig on the domain, scraped Bing for brand mentions and grepped `src/` read-only.

No DataForSEO tools were available, so live ChatGPT visibility and LLM mention tracking were not run.

## Category score: 69 / 100 (up from 63)

| Dimension | Weight | Score (27 Oct to 2 Nov) | Weighted | Basis |
|---|---|---|---|---|
| Citability | 25% | 78 to 84 | 21.0 | 43 outbound primary-source links across 16 guides (was 0). Question-shaped H2s rose to 50 of 95 (53%, was 35%), and every guide now has at least 2. Section leads are 31-76 words and answer first. Remaining gaps: 20 sections still run over 200 words (counting lists and tables), and tool pages have no sources and few passages over 40 words. |
| Structural readability | 20% | 85 to 88 | 17.6 | Clean H1 > H2 > H3 order, tables and lists, and visible FAQs that match the JSON-LD. The home H1 now extracts correctly as "QR codes that never stop working." |
| Multi-modal | 15% | 30 to 32 | 4.8 | Still 0 `<img>` on all 16 guides and the tool pages. /dynamic-qr-code-generator has 1 `<figure>`. |
| Authority and brand | 20% | 20 to 35 | 7.0 | The domain is registered, with working MX, and there is now one `#organization` @id with a description and a 512 px PNG logo. Guides cite primary sources. Still missing: a named person, `sameAs`, `foundingDate`, and any third-party mentions. The domain is 0 days old. |
| Technical accessibility | 20% | 90 to 95 | 19.0 | Every crawler gets 200 SSR. vercel.app and www return 308 to the apex domain. The IndexNow key is live. Gaps: IndexNow submission is manual only, there is no `msvalidate.01` meta, and llms.txt is incomplete. |
| **Total** | | | **69** | |

### Platform readiness (estimates, not measured visibility)

| Platform | Score | Main limiter |
|---|---|---|
| Google AI Overviews / AI Mode | 55 | Inclusion follows Googlebot indexing and ranking. The domain was registered today, so the site has no history or links. |
| ChatGPT search | 45 | ChatGPT search relies largely on Bing's index. A Bing scrape for `site:endureqr.com` returned nothing, Bing verification is unconfirmed and IndexNow has not been confirmed as submitted. |
| Perplexity | 60 | PerplexityBot is allowed, pages are SSR, and the guides now have direct answers, numbers and linked primary sources. |
| Bing Copilot | 45 | Same Bing index gap as ChatGPT search. |

## AI crawler access

robots.txt (live, 105 bytes) contains `User-Agent: *`, `Allow: /`, `Disallow: /dashboard`, `Disallow: /paused` and a Sitemap line. There are no bot-specific groups. Every UA below got HTTP 200 with an identical 234,195-byte SSR body containing the H1, and none was challenged by a bot check.

| Crawler | What it governs | Status |
|---|---|---|
| OAI-SearchBot | ChatGPT search results and citations | Allowed (200) |
| ChatGPT-User | User-triggered fetches in ChatGPT | Allowed (200) |
| GPTBot | OpenAI model training only, not ChatGPT search | Allowed (200) |
| Claude-SearchBot | Claude search citations | Allowed (200) |
| Claude-User | User-triggered fetches in Claude | Allowed (200) |
| ClaudeBot | Anthropic model training only | Allowed (200) |
| PerplexityBot | Perplexity index and citations | Allowed (200) |
| Perplexity-User | User-triggered fetches | Allowed (200) |
| Bingbot | Bing index, which feeds Copilot and much of ChatGPT search | Allowed (200) |
| Googlebot | Google Search, AI Overviews and AI Mode inclusion | Allowed (200) |
| Google-Extended | Gemini/Vertex training and grounding, plus training of Search gen-AI models. It does not control AI Overviews inclusion. | Allowed (inherits `*`) |
| Applebot-Extended | Apple Intelligence training only, not Siri, Spotlight or Safari | Allowed (inherits `*`) |
| CCBot | Common Crawl, which is used for training | Allowed (200) |

Verdict: access is optimal and nothing needs to change. Allowing the training bots is a business choice, and it is reasonable for a new brand that wants to appear in model knowledge.

## llms.txt

- **Status:** present and well-formed. It returns 200 `text/plain; charset=utf-8` at 9,034 bytes. It has an H1, a blockquote summary, a pricing line, and H2 sections for Free generators (18 links), Guides (16) and Product. `/llms-full.txt` returns 404, which is fine because it is optional.
- **Accuracy:**
  - Prices match the plans module and /dynamic-qr-code-generator ($3.99/month, $29/year, $79 Lifetime).
  - "17 types" is consistent with /about.
  - The contact address hello@endureqr.com now resolves (MX: mx1/mx2.improvmx.com). That fixes the baseline's dead-domain problem.
- **Effect on search:** Google ignores llms.txt, and no major AI search engine has confirmed using it at retrieval time. Treat it as low-cost insurance, not a ranking lever.
- **Remaining gap:** `src/app/llms.txt/route.ts` still builds the file only from `GUIDES` and `QR_TYPE_PAGES`. It omits 14 indexable pages:
  - 4 feature pages: /dynamic-qr-code-generator (the main paid page), /qr-code-with-logo, /app-download-qr-code and /bulk-qr-code-generator.
  - 8 /industries/* pages.
  - 2 /alternatives/* pages.

  The 17 tool descriptions also each repeat "Free, no sign-up, no watermark".

## Brand and entity

| Signal | Status |
|---|---|
| Domain | endureqr.com was registered at Name.com on 2026-11-02 13:23 UTC. The baseline's critical risk is resolved: endureqr.vercel.app and www both 308 to the apex, path preserved. |
| Organization JSON-LD | There is one `https://endureqr.com/#organization` node with a description, a 512x512 PNG logo and contactPoints. Article `author` and `publisher` reference it by @id (`src/components/content/json-ld.tsx:15`), and /about uses it as `mainEntity`. Still missing: `sameAs`, `foundingDate`, `founder`, and any Person. |
| /about | Contains a mission and four principles. It names no person, founding year or location. The Terms name Pakistan as the jurisdiction, but /about does not say where the company is based. |
| Wikipedia / Wikidata | None. That is expected for a brand that is days old. |
| Reddit, YouTube, LinkedIn, X | None found. There are no profiles, so there is nothing to put in `sameAs`. YouTube is the strongest observed correlate of AI citation (about 0.74). |
| Review and listing sites | None (Product Hunt, AlternativeTo, G2, Capterra). |
| Web search | A Bing scrape for `"EndureQR"` returned only unrelated results, and `site:endureqr.com` returned no endureqr.com pages. DuckDuckGo showed a bot challenge and Reddit was not fetchable. Scraped SERPs are unreliable, so confirm in Bing Webmaster Tools and GSC. |

## Passage-level citability (sampled pages)

| Page | Answer-first lead | Question H2s | Outbound sources | Notes |
|---|---|---|---|---|
| /guides/do-qr-codes-expire | 58 words: "A QR code stores its data inside the pattern itself..." | 3/5 | 2 (qrcode.com standards, ZXing barcode contents) | "What happens to EndureQR codes if you cancel" opens with "EndureQR was built around this problem", which refers back to earlier text. "How to avoid QR codes that stop working" has a 19-word lead. |
| /guides/qr-code-size-for-printing | 76 words (10:1 rule), 60 (versions), 61 (quiet zone, 4 modules = 3.2 mm on 2 cm) | 3/5 | 3 (qrcode.com version, error correction and code pages) | Strongest page: specific numbers, a table and sources. "Resolution, DPI and file formats" is declarative with a 21-word lead, and the 10:1 section runs to 250 words. |
| /guides/are-qr-codes-safe | 45-81 words per section, for example "Quishing is phishing with a QR code..." | 4/6 | 2 unique (FTC consumer alert 2023-12, IC3 PSA220118) | "Councils, police and consumer bodies in several countries" is still vague apart from the FTC. "How to check a QR code before you open it" has no lead paragraph. |
| /qr-code-generator/wifi | H1 lead 41 words, self-contained | 0 in body (FAQ H3s 6/6) | 0 | Body passages are 14-24 word steps. FAQ answers are 21-29 words. There is no section that explains the `WIFI:` format or security with a citation. |
| /dynamic-qr-code-generator | H1 lead 49 words, which states the price and the cancel policy | 0/8 | 0 | "What happens if you cancel" is a 60-word self-contained block, which is ideal. Headings like "How a dynamic QR code works" are declarative. FAQ answers are 13-34 words. |

Site-wide guide stats:
- 43 outbound links across 16 guides, 2-4 per guide.
- Question H2s: 50 of 95.
- 20 sections are over 200 words. The longest are what-is-a-qr-code (288), size-for-printing (250) and track-qr-code-scans (245).
- 0 images.

FAQPage JSON-LD is present on guides and tool pages, and the visible Q&A matches it. No AI platform has confirmed that FAQPage markup affects citation, so it is judged here only as on-page Q&A content.

## Findings

### GEO-1. HIGH: brand entity has no person and no off-site corroboration
- **Evidence:**
  - Organization has no `sameAs`, `foundingDate` or `founder`.
  - Article `author` is the Organization (`ORG_REF`) on all 16 guides.
  - /about names no person, year or location.
  - Web searches found 0 third-party mentions, and the domain is 0 days old.
- **Fix:**
  - In `src/components/content/json-ld.tsx`, add `foundingDate: "2026"`, a `founder` Person and `sameAs` (once the profiles exist).
  - In `src/app/(marketing)/about/page.tsx`, add a named founder section with a short bio and an `#founder` anchor.
  - In `src/app/(marketing)/guides/[slug]/page.tsx:74`, make that Person the Article `author`, and keep the Organization as `publisher`.
  - Then create LinkedIn, YouTube and X profiles. List on Product Hunt and AlternativeTo, publish 3-5 short YouTube how-tos that mirror the top guides, and give disclosed answers on Reddit.
- **Effort:** 2 hours for the code, 1 day to set up the off-site presence, then ongoing.

### GEO-2. HIGH: Bing pipeline is not confirmed (it feeds ChatGPT search and Copilot)
- **What works:**
  - IndexNow key file `public/a1c13608465f3a199446374fd4d85e12.txt` returns 200 live.
  - `scripts/indexnow.mjs` (run with `npm run indexnow`) submits every sitemap URL.
- **Evidence of the gap:**
  - The script is manual, and nothing runs it on deploy.
  - The home page has `google-site-verification` but no `msvalidate.01` meta.
  - Bing returned no `site:endureqr.com` results.
- **Fix:**
  - Run `npm run indexnow` now, against the new domain.
  - Verify endureqr.com in Bing Webmaster Tools, either by setting the Bing verification env var read since commit bb4dd27 or by importing from GSC, and submit the sitemap.
  - Automate the IndexNow ping after each production deploy, for example with a GitHub Action on Vercel `deployment_status`. Submit only the URLs that changed.
- **Effort:** 1 hour.

### GEO-3. MEDIUM: guides were revised on 2 Nov but still say updated 2026-10-26
- **Evidence:**
  - Commit e39f44b (2 Nov) rewrote headings and sections and added sources to all 16 guides.
  - Yet all 16 pages show `datePublished = dateModified = 2026-10-26`, and so does the visible "Updated 26 October 2026".
  - The sitemap has `<lastmod>` on only 16 of 55 URLs.
- **Fix:**
  - Set `updated: "2026-11-02"` for each revised guide in `src/content/guides-basics.ts` and `src/content/guides-uses.ts`.
  - Emit `lastmod` for every URL in `src/app/sitemap.ts`, using real change dates.
- **Effort:** 30 minutes.

### GEO-4. MEDIUM: llms.txt omits 14 pages, including the main paid page
- **Evidence:** see the llms.txt section above.
- **Fix:** in `src/app/llms.txt/route.ts`, add these sections, built from `src/content/feature-pages.ts`, `industries.ts` and `competitors.ts` so they cannot drift:
  - "## Features" (4 pages)
  - "## Industries" (8 pages)
  - "## Comparisons" (2 pages)
  - "## Key facts": cancellation behaviour, 14-day refund, unlimited codes and scans, formats up to 4096 px, and that the free generator runs in the browser
  - Also replace the repeated "Free, no sign-up, no watermark" phrase with one shared line.
- **Effort:** 1 hour.

### GEO-5. MEDIUM: tool pages carry little quotable, sourced content
- **Evidence:**
  - /qr-code-generator/wifi and /dynamic-qr-code-generator have 0 outbound links.
  - Their body headings are not question-shaped (0/8 on the dynamic page), and the body is mostly 14-24 word steps.
- **Fix:**
  - On the type pages (`src/content/qr-type-pages.ts`), add one 40-80 word "What is a WiFi QR code?" style passage that states the format (for example the `WIFI:T:WPA;S:...;P:...;;` syntax, with the ZXing Barcode-Contents link the guides already use).
  - On `src/content/feature-pages.ts`, rephrase 2-3 H2s as questions, for example "How does a dynamic QR code work?" and "What happens to dynamic QR codes if you cancel?"
- **Effort:** 2-3 hours across 17 type pages.

### GEO-6. MEDIUM: no images or diagrams on guides
- **Evidence:** 0 `<img>` and 0 `<figure>` across all 16 guides.
- **Fix:** add 1-2 original SVG diagrams per visual guide in `<figure>` with `alt` text and a `<figcaption>` that states the fact in words. Start with QR anatomy, quiet zone and size, logo coverage, and the static vs dynamic redirect flow.
- **Effort:** 1 day.

### GEO-7. LOW: long sections and a few non-standalone openers remain
- **Evidence:**
  - 20 guide sections exceed 200 words.
  - Some openers refer back to earlier text or start with context instead of the answer:
    - "EndureQR was built around this problem" (do-qr-codes-expire)
    - "Blurry edges confuse scanners..." (size-for-printing)
    - "A review link is an ordinary web address, so it needs a URL code." (google-reviews)
  - google-reviews has 2/7 question H2s.
  - are-qr-codes-safe still says "Councils, police and consumer bodies in several countries" while naming only the FTC.
- **Fix:**
  - In `src/content/guides-*.ts`, split sections over 200 words with an H3.
  - Make each section's first sentence the standalone answer.
  - Name and link one non-US authority for the parking-meter claim, such as a named UK council or Action Fraud.
- **Effort:** 2 hours.

## Top 5 highest-impact changes

| # | Change | Impact | Effort |
|---|---|---|---|
| 1 | Bing Webmaster verification, sitemap submission, run IndexNow now and automate it (GEO-2) | High for ChatGPT search and Copilot | 1 hour |
| 2 | Named founder Person, `foundingDate` and `sameAs`, plus profiles and listings (GEO-1) | High for entity clarity and off-site signals | 2 hours plus 1 day |
| 3 | Bump `updated` to 2026-11-02 and add full sitemap lastmod (GEO-3) | Medium: freshness signal for re-crawl | 30 minutes |
| 4 | Complete llms.txt with Features, Industries, Comparisons and Key facts (GEO-4) | Medium-low, low-cost insurance | 1 hour |
| 5 | Sourced 40-80 word definition passages on tool pages, plus guide diagrams (GEO-5, GEO-6) | Medium for Perplexity and AIO passage selection | 1-2 days |

## Resolved since 27 Oct

- GEO-1 (critical): endureqr.com is registered and canonical. The old hosts 308 to it, and MX is live through ImprovMX.
- GEO-2: guides now link 2-4 primary sources each (43 in total): qrcode.com, ZXing, FTC, IC3 and Google support pages.
- GEO-3 (partly): there is now a single @id Organization with a description and a PNG logo, and Article author and publisher reference it.
- GEO-7 (partly): question H2s rose from 35% to 53%, and no guide has zero.
- GEO-9: the home H1 extracts correctly.

## Structured findings (for audit-data.json, category "AI Search Readiness")

```json
{
  "category": "AI Search Readiness",
  "score": 69,
  "previous_score": 63,
  "dimensions": {"citability": 84, "structural_readability": 88, "multi_modal": 32, "authority_brand": 35, "technical_accessibility": 95},
  "platform_scores": {"google_aio": 55, "chatgpt": 45, "perplexity": 60, "bing_copilot": 45},
  "crawler_access": {"OAI-SearchBot": "allowed", "ChatGPT-User": "allowed", "GPTBot": "allowed", "Claude-SearchBot": "allowed", "Claude-User": "allowed", "ClaudeBot": "allowed", "PerplexityBot": "allowed", "Perplexity-User": "allowed", "Bingbot": "allowed", "Googlebot": "allowed", "Google-Extended": "allowed", "Applebot-Extended": "allowed", "CCBot": "allowed"},
  "llms_txt": "present_incomplete",
  "findings": [
    {"id": "GEO-1", "severity": "high", "title": "No named person, sameAs or outside mentions", "evidence": "Organization lacks sameAs/foundingDate/founder; Article author = Organization; 0 web mentions; domain registered 2026-11-02", "fix": "Founder Person on /about and as Article author (json-ld.tsx, guides/[slug]/page.tsx:74); profiles + sameAs; listings; YouTube how-tos"},
    {"id": "GEO-2", "severity": "high", "title": "Bing verification and IndexNow submission unconfirmed", "evidence": "No msvalidate.01 meta; scripts/indexnow.mjs is manual only; Bing site: query empty", "fix": "Verify in Bing WMT, submit sitemap, run npm run indexnow, automate post-deploy"},
    {"id": "GEO-3", "severity": "medium", "title": "Revised guides still dated 2026-10-26", "evidence": "Commit e39f44b (2 Nov) changed all guides; dateModified 2026-10-26 on 16/16; lastmod on 16/55 sitemap URLs", "fix": "Bump updated in guides-basics.ts/guides-uses.ts; full lastmod in sitemap.ts"},
    {"id": "GEO-4", "severity": "medium", "title": "llms.txt omits 14 pages incl. dynamic product page", "evidence": "route.ts maps only GUIDES and QR_TYPE_PAGES", "fix": "Add Features/Industries/Comparisons/Key facts from content modules"},
    {"id": "GEO-5", "severity": "medium", "title": "Tool pages lack sourced 40-80 word answer passages", "evidence": "wifi and dynamic pages: 0 outbound links, 0 question body H2s, 14-24 word steps", "fix": "Add sourced definition passage per type page; question-shaped H2s in feature-pages.ts"},
    {"id": "GEO-6", "severity": "medium", "title": "No images or diagrams in guides", "evidence": "0 img / 0 figure on 16 guides", "fix": "SVG diagrams with alt and figcaption on 4 visual guides"},
    {"id": "GEO-7", "severity": "low", "title": "Long sections and some non-standalone openers", "evidence": "20 sections >200 words; google-reviews 2/7 question H2s; vague 'councils, police...' claim", "fix": "Split with H3s, answer-first sentences, cite a named non-US authority"}
  ]
}
```

# GEO / AI Search Readiness: endureqr.vercel.app

Audit date: 2026-10-27. Scope: Google AI Overviews and AI Mode, ChatGPT search, Perplexity and Microsoft Copilot.
Method: I fetched robots.txt, llms.txt and the sitemap live, and tested 12 crawler user-agents against a guide URL. I rendered 8 pages with `render_page.py --mode auto` (home, about, pricing, /dynamic-qr-code-generator and 4 guides) and fetched 23 guide, feature, industry and alternatives pages raw for passage metrics. I also used the 57-page crawl.json, ran whois/DNS on the brand domain and grepped `src/` (read-only).

## Category score: 63 / 100 (AI Search Readiness)

| Dimension | Weight | Score | Weighted | Basis |
|---|---|---|---|---|
| Citability | 25% | 78 | 19.5 | Every guide opens with a 59-100 word direct answer, uses concrete numbers (10:1 rule, 2 cm minimum, L/M/Q/H = 7/15/25/30%) and has tables and visible FAQs. Weaknesses: no outbound source links, only about 35% of guide H2s are phrased as questions, and some sections run over 200 words. |
| Structural readability | 20% | 85 | 17.0 | Clean H1 > H2 > H3 order, 1-3 tables per guide, lists, and FAQ text that matches the FAQPage JSON-LD. Small defect: the home H1 text reads "neverstop". |
| Multi-modal | 15% | 30 | 4.5 | 0 `<img>` on all 16 guides and all feature pages (crawl.json `imgs: 0`). There are no diagrams, figures or video. The only visuals are UI icon SVGs. |
| Authority and brand | 20% | 20 | 4.0 | No named author and no outbound citations. The contact email uses an unregistered domain. No sameAs, the entity is split across schema blocks, it sits on a vercel.app subdomain, and there are 0 third-party mentions. |
| Technical accessibility | 20% | 90 | 18.0 | All AI crawlers are allowed and get SSR HTML (200). Pages are cache HITs at about 200 ms, and llms.txt and the sitemap are present. Gaps: no Bing verification meta found and no IndexNow. |
| **Total** | | | **63** | |

### Platform-specific readiness (estimates, not measured visibility)

No DataForSEO tools were available, so live ChatGPT and LLM mention tracking were not run.

| Platform | Score | Main limiter |
|---|---|---|
| Google AI Overviews / AI Mode | 50 | Selection follows Googlebot indexing and ranking. The content quality is there, but a new site with no links and an unestablished entity rarely gets picked as a grounding source for competitive QR queries. Search Console is verified (google-site-verification meta present). |
| ChatGPT search | 40 | ChatGPT search leans heavily on Bing's index plus OAI-SearchBot. I found no `msvalidate.01` meta, so the Bing Webmaster setup is unconfirmed, and the brand has no mentions. |
| Perplexity | 50 | PerplexityBot is allowed and pages are SSR. Perplexity favors pages with direct answers, specific numbers and cited sources, and this site has the first two but not the third. |
| Bing Copilot | 40 | It depends on the Bing index, which has the same Bing Webmaster and IndexNow gap as ChatGPT. |

## AI crawler access

robots.txt has one group: `User-agent: *`, `Allow: /`, `Disallow: /dashboard`, `Disallow: /paused`, plus a Sitemap line. There are no bot-specific groups. In the live test, every UA below got HTTP 200 with an identical 232,677-byte SSR body containing the H1. Vercel's firewall does not challenge any of them.

| Crawler | What it governs | Status |
|---|---|---|
| OAI-SearchBot | ChatGPT search results and citations | Allowed (200) |
| ChatGPT-User | User-triggered fetches in ChatGPT | Allowed (200) |
| GPTBot | OpenAI model training only, not ChatGPT search | Allowed (200) |
| Claude-SearchBot | Claude search citations | Allowed (200) |
| Claude-User | User-triggered fetches in Claude | Allowed (200) |
| ClaudeBot | Anthropic model training only | Allowed (200) |
| PerplexityBot | Perplexity search index and citations | Allowed (200) |
| Perplexity-User | User-triggered fetches | Allowed (200) |
| Bingbot | Bing index, which feeds Copilot and much of ChatGPT search | Allowed (200) |
| Googlebot | Google Search, AI Overviews and AI Mode inclusion | Allowed (200) |
| Google-Extended | Gemini/Vertex training and grounding, plus training of Search gen-AI models. It does not control AI Overviews inclusion. | Allowed (inherits `*`) |
| Applebot-Extended | Apple Intelligence training only, not Siri/Spotlight | Allowed (inherits `*`) |
| CCBot | Common Crawl, which many LLM training sets draw on | Allowed (200) |

Verdict: access is optimal for visibility. Nothing needs to change. Allowing the training bots is a business choice. For a new brand that wants to exist in model knowledge, keeping them allowed is reasonable.

## llms.txt

- Status: present and well-formed. It returns 200 `text/plain; charset=utf-8` at 9.3 KB. It has an H1, a blockquote summary, a pricing line and H2 sections for 17 tools and 16 guides plus Product. `/llms-full.txt` returns 404, which is fine because it is optional.
- Google Search ignores llms.txt and no major AI search engine has confirmed using it at retrieval time. Treat it as cheap insurance, not a ranking lever.
- Quality issues:
  1. It omits 14 indexable pages: 4 feature pages (/dynamic-qr-code-generator, /qr-code-with-logo, /app-download-qr-code, /bulk-qr-code-generator), 8 /industries/* pages and 2 /alternatives/* pages. The dynamic-codes page is the main commercial page and it is missing.
  2. "Contact: hello@endureqr.com" points to an unregistered domain (see F1).
  3. The 17 tool descriptions all repeat "Free, no sign-up, no watermark". A one-line description per tool plus a single shared "All free tools: ..." sentence would cut the noise.

## Brand and entity presence

| Signal | Status |
|---|---|
| Wikipedia / Wikidata | None. That is expected and not achievable pre-launch. |
| Reddit | None found. |
| YouTube | None. YouTube mentions are the strongest single correlate of AI citation (about 0.74). |
| LinkedIn / X / other social | None, so there is no `sameAs`. |
| Review and listing sites (G2, Capterra, Product Hunt, AlternativeTo) | None. |
| Search index | Bing scrapes for `"EndureQR"` and `site:endureqr.vercel.app` returned only unrelated results, which is consistent with not being indexed yet. Scraped SERPs are unreliable, so confirm in GSC and Bing Webmaster Tools. |
| Name collision | The old name "StayQR" is used by an unrelated live product at stayqr.vercel.app ("Scan the story. Own the experience."), so the rebrand was the right call. A sweep of all 55 sitemap URLs plus llms.txt found 0 leftover "StayQR" strings. |

## Findings

### F1. CRITICAL: the brand domain endureqr.com is unregistered but used as the official contact and entity domain
- Evidence: `whois endureqr.com` returns "No match for domain ENDUREQR.COM", and there are no A, MX or NS records. Yet hello@endureqr.com appears in Organization JSON-LD (`email`, `contactPoint`) on / and /about, in llms.txt, on the dynamic-codes page ("Email hello@endureqr.com and a person will reply within a day") and in `src/content/company.ts` (lines 19-21, hello/privacy/abuse fallbacks). `src/lib/server/env.ts:8` also uses it as `EMAIL_FROM`, and `.env.example` sets it as `NEXT_PUBLIC_SITE_URL` and the short-link host.
- Why it matters for GEO: the entity's stated contact point cannot be reached, and anyone can register the domain and pose as the brand. You will need to move from `endureqr.vercel.app` to a real domain eventually. Doing it after AI systems and links have attached the entity to the vercel.app host throws that equity away. For a product that promises "codes that never stop working", printed short links must never depend on a host you might abandon.
- Fix: register endureqr.com today. Point production `NEXT_PUBLIC_SITE_URL` at it before launch, and 301 every `endureqr.vercel.app/*` path to the same path on the new domain. Update canonicals, the sitemap, the llms.txt URLs and the JSON-LD `url`/`@id`. Set up MX for the hello@, privacy@ and abuse@ addresses. Do this before any outreach or listings so every mention points to the final domain. Effort: about 2 hours plus DNS propagation.

### F2. HIGH: no outbound citations to primary sources in any guide
- Evidence: all 16 guides and 4 feature pages have 0 external links. Guides name sources without linking them: "ISO/IEC 18004" (what-is, do-qr-codes-expire, static-vs-dynamic), "Denso Wave ... Masahiro Hara" (what-is), "Google's policies prohibit offering incentives..." (google-reviews, repeated 4 times), and "Councils, police and consumer bodies in several countries have warned about fake codes on parking meters" (are-qr-codes-safe, with no named body). By contrast, /alternatives/* and the home comparison already link and date their competitor sources.
- Fix: link each claim to its primary source inline with a "checked" date, the same way the alternatives pages do. Sources: ISO's page for ISO/IEC 18004:2024; Denso Wave's qrcode.com history and capacity pages (7,089 digits and 2,953 bytes); Google Business Profile's prohibited-content policy on review incentives and gating; and a named quishing advisory (for example the FBI IC3 or FTC consumer alert, or a named UK council). Aim for 2-4 citations per guide. Effort: 3 hours.

### F3. HIGH: weak entity definition with no person behind the brand
- Evidence: Article `author` is `{"@type":"Organization","name":"EndureQR"}` on every guide. Organization has an `@id` (`/#organization`) only on the home page. /about repeats a separate Organization without the `@id`, and Article publisher and SoftwareApplication do not reference it either. SoftwareApplication is named "EndureQR" on /pricing but "EndureQR: Dynamic QR codes" on /dynamic-qr-code-generator. Organization has no `description`, `foundingDate`, `founder`, `sameAs` or `logo` raster (logo is `/icon.svg`). /about (369 words) names no person, location or founding year.
- Fix:
  - Make `https://<domain>/#organization` the single Organization node and reference it by `@id` from Article `publisher`/`author`, SoftwareApplication `publisher`/`provider` and the /about page.
  - Add `description`, `foundingDate: "2026"`, a `founder` Person and a PNG logo of at least 112 px.
  - Use one SoftwareApplication name, "EndureQR", with `@id: /#software`.
  - Name a real person on /about with a short bio covering who they are and why they built this. Use them as Article `author` (Person with `url` pointing to /about#founder).
  - Add `sameAs` once profiles exist (see F6).
- Effort: 2 hours.

### F4. HIGH: Bing pipeline unconfirmed, and it feeds ChatGPT search and Copilot
- Evidence: the home HTML has `google-site-verification` but no `msvalidate.01` meta. Commit bb4dd27 reads verification from env, so the Bing variable is probably unset in production. `src/` and `public/` contain no IndexNow implementation.
- Fix: verify the site in Bing Webmaster Tools, either by setting the msvalidate env var or by importing from GSC. Submit the sitemap. Add an IndexNow key file and ping on deploy for changed URLs. Repeat both after the domain move in F1. Effort: 1 hour.

### F5. MEDIUM: no visual or multi-modal content in guides
- Evidence: crawl.json reports `imgs: 0` for all 16 guides and all feature pages, and there are no `<figure>`, video or iframe elements. Guides that describe inherently visual things (QR anatomy in what-is-a-qr-code, the quiet zone and size table in qr-code-size-for-printing, logo coverage in design-best-practices, the redirect flow in static-vs-dynamic) are text-only.
- Fix: add 1-2 original diagrams per guide as SVG or PNG inside `<figure>` with a descriptive `alt` and a `<figcaption>` that states the fact in words. Example caption: "A 2 cm code with 25 modules needs a 3.2 mm quiet zone." Start with the 4 guides above. A 30-60 second demo video for /dynamic-qr-code-generator, hosted on YouTube and embedded, also builds the YouTube signal in F6. Effort: 1 day for 4-6 diagrams, half a day for a video.

### F6. MEDIUM: zero off-site brand footprint
- Evidence: see Brand and entity presence above. Every brand-correlated signal is missing: YouTube, Reddit, review sites and social profiles. AI answers to "best QR code generator that doesn't expire" are built from third-party lists and discussions, not vendor pages.
- Fix: after F1, do these in order.
  1. Create LinkedIn company, YouTube and X profiles and add them to `sameAs`.
  2. Publish 3-5 short YouTube how-tos that mirror the top guides (do QR codes expire, size for printing, WiFi QR).
  3. List on Product Hunt, AlternativeTo (as an alternative to QR Code Generator Pro, QRFY and Bitly), G2 and Capterra.
  4. Answer real questions in r/smallbusiness, r/restaurateur and r/graphic_design where dead dynamic codes come up. Disclose the affiliation.
  5. Pitch the "codes keep working after cancel" angle to "best QR generator" roundup authors.
- Effort: ongoing, about 1 day to set up.

### F7. MEDIUM: answer-first sections are good but headings are often not query-shaped
- Evidence: 33 of 94 content H2s across the 16 guides (35%) are phrased as questions. Four guides have none: how-to-make-a-qr-code (0/7), qr-code-design-best-practices (0/6), qr-code-for-google-reviews (0/6) and qr-code-not-scanning (0/6). Section bodies range from 22 to 270 words, and several run past 200 (business-card 270, qr-code-not-scanning 244, track-qr-code-scans 250, what-is-a-qr-code 238). Some sections open with context rather than the answer. For example, in size-for-printing, "The 10:1 rule for scan distance" starts with "Phone cameras need each module..." and the rule itself comes later.
- Fix: rephrase about half the declarative H2s as the question a user would type, for example "What is the 10:1 rule for QR code scan distance?" or "Why is my QR code not scanning?" Open each section with a one-sentence answer that stands alone (no "it" or "this" pointing back). Split sections over 200 words with an H3. Effort: 3 hours across 16 guides.

### F8. LOW: llms.txt is incomplete and points at the dead domain
- Evidence: see the llms.txt section. 14 indexable pages are missing, including the main paid-product page, and the contact line uses hello@endureqr.com.
- Fix: add a "## Features" section (4 pages), a "## Industries" section (8) and a "## Comparisons" section (2, each with a one-line factual summary). Add a "## Key facts" list covering the cancellation policy, pricing, refund window (14 days), scan and code limits and supported formats. These are the facts an LLM should quote verbatim. Generate the file from the same content modules as the sitemap so it cannot drift. Effort: 1 hour.

### F9. LOW: home H1 reads "neverstop" in text extraction
- Evidence: the home H1 is built from per-word `<span>`s split into two `display:block` lines. "never" ends the first block and "stop" begins the second with no whitespace text node between them, so `textContent` and non-CSS parsers read "QR codes that neverstop working." That is the version an extractor or LLM snippet sees.
- Fix: emit a trailing space after the last word of each line block (or a `{" "}` between the two blocks). Effort: 5 minutes.

### F10. LOW: freshness signals are thin
- Evidence: the sitemap has `<lastmod>` on only 16 of 55 URLs (the guides). All 16 guides show `datePublished = dateModified = 2026-10-26`. That is accurate today but gives no update history.
- Fix: emit `lastmod` for every sitemap URL from real content-change dates. When a guide is materially revised, bump `updated`, `dateModified` and the visible "Updated" `<time>` together. Effort: 1 hour.

## Top 5 highest-impact changes

| # | Change | Impact | Effort |
|---|---|---|---|
| 1 | Register endureqr.com, make it canonical with 301s from vercel.app, and fix the emails and JSON-LD (F1) | Critical. Every later signal accrues to the final domain, and it closes an impersonation hole. | About 2 hours plus DNS |
| 2 | Bing Webmaster verification, sitemap submission and IndexNow (F4) | High for ChatGPT search and Copilot | 1 hour |
| 3 | Inline primary-source citations with checked dates in all guides (F2) | High for Perplexity and AIO source selection | 3 hours |
| 4 | Single `@id` Organization graph, named founder/author Person, complete /about (F3) | High for entity clarity | 2 hours |
| 5 | Off-site footprint: profiles plus `sameAs`, YouTube how-tos, listings, genuine Reddit answers (F6), plus diagrams and video (F5) | Highest long-term correlation with being cited | 1-2 days, then ongoing |

## What works well

- Crawler access is ideal. All search, user-fetch and training bots get 200 SSR HTML with no bot challenges, and the robots.txt disallows are limited to app-only paths.
- Server rendering is complete. `is_spa=false` on every sampled page, the full article body is in the initial HTML, and pages come from the Vercel cache (about 200 ms).
- Guides are answer-first. Every guide has a standalone lead of 59-100 words that answers the H1 question directly. Example: "No, a QR code itself never expires. A static QR code stores your link or text directly in the pattern..." That is close to the ideal extractable block.
- Guides contain specific, quotable facts: the 10:1 distance rule with a 7-row table, a 2 cm minimum, a 4-module quiet zone, L/M/Q/H = 7/15/25/30%, version 1 = 21x21 up to 177x177, 7,089 digits, and 300 DPI.
- 50 pages carry FAQPage JSON-LD. On the pages I checked, the questions are also visible on the page as H3s and phrased as real user questions.
- Pricing facts ($3.99/month, $29/year, $79 lifetime, 14-day refund) and the cancellation policy are identical across the page copy, Offer schema, FAQ and llms.txt. Consistent facts are what LLMs repeat.
- The comparison pages link and date competitor sources. That is the right pattern, and the guides should copy it.
- The rebrand is clean: 0 "StayQR" strings remain in the 55 sitemap URLs or llms.txt.

## Structured findings (for audit-data.json, category "AI Search Readiness")

```json
{
  "category": "AI Search Readiness",
  "score": 63,
  "dimensions": {"citability": 78, "structural_readability": 85, "multi_modal": 30, "authority_brand": 20, "technical_accessibility": 90},
  "platform_scores": {"google_aio": 50, "chatgpt": 40, "perplexity": 50, "bing_copilot": 40},
  "crawler_access": {"OAI-SearchBot": "allowed", "ChatGPT-User": "allowed", "GPTBot": "allowed", "Claude-SearchBot": "allowed", "ClaudeBot": "allowed", "PerplexityBot": "allowed", "Bingbot": "allowed", "Googlebot": "allowed", "Google-Extended": "allowed", "Applebot-Extended": "allowed", "CCBot": "allowed"},
  "llms_txt": "present_incomplete",
  "findings": [
    {"id": "GEO-1", "severity": "critical", "title": "Brand domain endureqr.com unregistered but used as contact/entity domain", "evidence": "whois: No match; hello@endureqr.com in Organization JSON-LD, llms.txt, company.ts:19-21, env.ts:8", "fix": "Register domain, make canonical with 301s from vercel.app, set MX, update JSON-LD/llms.txt/sitemap"},
    {"id": "GEO-2", "severity": "high", "title": "No outbound primary-source citations in guides", "evidence": "0 external links on all 16 guides; ISO/IEC 18004, Denso Wave, Google review policy, quishing warnings unlinked", "fix": "Link 2-4 primary sources per guide with checked dates"},
    {"id": "GEO-3", "severity": "high", "title": "Fragmented Organization entity, no named author", "evidence": "@id only on home; Article author = Organization; no description/foundingDate/founder/sameAs; two SoftwareApplication names", "fix": "Single @id graph, founder Person as author, enrich /about"},
    {"id": "GEO-4", "severity": "high", "title": "Bing verification and IndexNow not detected", "evidence": "No msvalidate.01 meta; no IndexNow in src/public", "fix": "Verify in Bing Webmaster Tools, submit sitemap, add IndexNow"},
    {"id": "GEO-5", "severity": "medium", "title": "No images, diagrams or video in guides or feature pages", "evidence": "crawl.json imgs=0 on all guides and feature pages", "fix": "Add figure+alt+figcaption diagrams to 4 visual guides; YouTube demo"},
    {"id": "GEO-6", "severity": "medium", "title": "Zero off-site brand footprint", "evidence": "No YouTube, Reddit, LinkedIn, review-site or listing presence", "fix": "Profiles plus sameAs, YouTube how-tos, PH/AlternativeTo/G2/Capterra, Reddit answers"},
    {"id": "GEO-7", "severity": "medium", "title": "Only 35% of guide H2s are question-shaped; some sections over 200 words", "evidence": "33/94 H2s; 4 guides with 0 question H2s; sections up to 270 words", "fix": "Rephrase H2s as queries, answer in first sentence, split long sections"},
    {"id": "GEO-8", "severity": "low", "title": "llms.txt omits 14 pages and lists dead-domain email", "evidence": "Feature, industry and alternatives pages missing", "fix": "Add Features/Industries/Comparisons/Key facts sections, generate from content modules"},
    {"id": "GEO-9", "severity": "low", "title": "Home H1 extracts as 'neverstop'", "evidence": "No whitespace between block spans 'never' and 'stop'", "fix": "Emit trailing space between line blocks"},
    {"id": "GEO-10", "severity": "low", "title": "Sparse freshness signals", "evidence": "lastmod on 16/55 sitemap URLs; all guides dated 2026-10-26", "fix": "lastmod for all URLs from real change dates"}
  ]
}
```

# Keyword clusters, cannibalisation and content gaps: endureqr.com

Audit set: endureqr-2026-11-04 (SERP sampling done 4 Nov 2026, report written 18 Nov 2026)
Inputs: `pages.json` (55 URLs), `src/content/*.ts` (in-body links), `src/components/site-footer.tsx` / `site-header.tsx` (global links), 47 WebSearch result sets.
No project files were edited.

---

## 0. Method and data limits (read first)

- **SERP source.** The skill uses WebSearch, not Google's live top 10, and has no keyword-volume source. Results for head terms ("qr code generator", "dynamic qr code generator") were noisy, full of marketplace duplicates and junk domains. Treat those overlap scores as unreliable. Long-tail result sets were clean and consistent, and those are the ones this plan relies on.
- **Scoring.** Overlap is the number of identical normalised URLs shared by two result sets. Shared *domains* are given in brackets as a tiebreaker. Thresholds: 7–10 same page, 4–6 same cluster, 2–3 interlink, 0–1 separate.
- **No volumes.** Priority comes from (a) how weak the pages that currently rank are, (b) business fit, and (c) effort. No volume numbers are invented. Before building pages 9–15, check volumes in GSC or DataForSEO.
- **Competitor facts.** Every claim about a competitor below comes from a search snippet. Each one must be checked on the vendor's own pricing or help page and shown with a "checked on <date>" note before it is published. Specific flags: QRCode Monkey's ownership (single, competitor-written source), Bitly free-plan numbers (sources disagree), QR TIGER's 500-scan cap, Canva plan tiers.

---

## 1. Headline findings

1. **The best-fitting gap is lock-in and expiry, and the pages ranking for it are weak.** "qr code stopped working after free trial", "codes stop working when I cancel" and "is qr-code-generator.com a scam" return Trustpilot pages, syndicated press releases (northpennnow, observer-reporter) and vendor help docs. No single editorial page answers the question. This is EndureQR's whole positioning, and no page targets it today.
2. **"Never expires" is split three ways.** The home title, the `/qr-code-generator` title ("Free QR Code Generator That Never Expires: No Sign-Up") and `/guides/do-qr-codes-expire` all aim at it. The SERPs disagree with that setup. "free qr code generator no sign up" and "qr code generator that never expires" share **0 URLs**. "never expires" and "do qr codes expire" also share **0 URLs**. Three different intents need three different owners (§3, Cluster C).
3. **Guides never link to the paid feature pages in body text.** In `src/content/guides*.ts`, no guide links in-body to `/dynamic-qr-code-generator` or `/qr-code-with-logo`. Dynamic-themed guides link to `/pricing`, and the logo, error-correction and design guides never link to the logo tool. Feature pages get links only from the footer. This is the cheapest fix in the report (§6.2).
4. **Easy-win long tails with very weak SERPs:** lifetime / one-time-payment QR generators (only directories and deal sites rank), "do canva qr codes expire" (Canva help plus spam pages), QR codes for real-estate sign riders (product listings and forums), QR tracking in GA4 with UTM (small agency blogs), SVG vs PNG for QR codes (pages.dev tools).
5. **Alternative pages are worth writing, but the space is crowded.** Low-authority vibe-coded sites already rank for "uniqode alternative" and "qr code that never expires" with the same "pay once, codes keep working" pitch (netlify.app, vercel.app, lovable.app). Being honest is how EndureQR stands out: quote the competitor's own help-centre text, say when the competitor is the better choice, and point to the /terms continuity commitment (90 days' notice plus export).
6. **Two hubs are missing.** There is no `/alternatives` index and no `/industries` index or "QR codes for business" hub. The footer shows only 6 of the 8 industries, so `/industries/education` and `/industries/agencies` get links only from sibling industry pages.

---

## 2. SERP overlap matrix (measured pairs)

| # | Keyword A | Keyword B | Shared URLs (domains) | Verdict |
|---|---|---|---|---|
| 1 | qr code generator that never expires | free qr code generator with tracking no expiration | **5** (qrcodesunlimited best-place…, link.morphe, qr-code-generator.com/blog/free-qr-code-generator-no-expiration, fixedqrcodegenerator.lovable.app, linkbreakers) | Same cluster, one page |
| 2 | free qr code generator no sign up | qr code generator that never expires | 0 (1: techcommunity) | Separate |
| 3 | free qr code generator no sign up | free qr code generator with tracking no expiration | 2 (hunted.space/qrtor, uforocks) | Interlink |
| 4 | qr code generator that never expires | do qr codes expire | 0 (2) | Separate |
| 5 | do qr codes expire | qr code stopped working after free trial | 0–1 (1: qr-code-generator.com, different locale) | Separate, interlink |
| 6 | qr code stopped working after free trial | qr-code-generator.com … codes stop working when cancelled | **3** (northpennnow, observer-reporter, uk.trustpilot qrcodecreator p4) (5 domains) | Same cluster. Tiebreak: same intent and high domain overlap, so one page |
| 7 | is qr-code-generator.com a scam | #6 B | **4** (trustpilot p8 ×2, ca p10, smartcustomer) | Same cluster. Alternative page links to the problem page |
| 8 | static vs dynamic qr code | editable qr code change link after printing | 0 (1: scanova) | Separate |
| 9 | editable qr code change link after printing | how to change qr code destination without reprinting | **4** (scanova how-to-change…, uniqode how-to-edit…, qrstuff post-update…, rocketlink can-you-change…) | One page |
| 10 | static vs dynamic qr code | what is a dynamic qr code | 0 (2: tritonstore, qrcodechimp) | Interlink. Assign to the existing guide for now |
| 11 | dynamic qr code generator | free dynamic qr code generator no subscription | 0 (head SERP was noisy) | Same owner page, low confidence |
| 12 | qr code with logo free | how to add logo to qr code | 1 (uniqode ?p=25132) (2) | Tool page plus design guide, interlinked |
| 13 | wifi qr code generator | how to make a wifi qr code | 2 (inventivehq, mintlify) (4) | Interlink. Keeping the tool page and guide separate is correct |
| 14 | qr code menu for restaurant free | how to make a qr code for a pdf menu | 1 (buonmenu) (3) | Interlink |
| 15 | how to make a qr code for a pdf menu | pdf to qr code generator free | 0 (2) | Separate |
| 16 | pdf to qr code generator free | qr code for google drive file | 0 (2: uniqode, linkbreakers) | Interlink. Merged into one how-to (judgement call, see N12) |
| 17 | qr code size minimum print | qr code svg vs png for print | 0 (2) | Separate page |
| 18 | qr code not working why | qr code not scanning | 1 (qrcode-tiger mistakes…) (3) | Interlink. Same guide owns both today; see §4 |
| 19 | qr code not working why | qr code stopped working after free trial | 0 (0) | Separate |
| 20 | qr code tracking how to track scans | qr code utm google analytics | 0 (1) | Separate page |
| 21 | bitly alternative qr code | bitly free plan qr code limit | 0 (1–2) | Separate. Fold into /alternatives/bitly as an H2 |
| 22 | qr code monkey alternative | uniqode alternative cheaper | 0 (3: pageloot, visu.network, capterra) | Separate pages, both under /alternatives |
| 23 | qr code monkey alternative | qr code tiger alternative | 0 (1–2) | Separate |
| 24 | free qr code generator | qr code generator | 3 (noisy) | Same page (/qr-code-generator) |
| 25 | free qr code generator | url to qr code generator | 0 (1) | Separate owners |
| 26 | create qr code for website link free | url to qr code generator | 2 (solobizkit url-qr…, calpoly link-website…) | URL page owns the link/website variants |
| 27 | free qr code generator | how to make a qr code | 0 | No cannibalisation between hub and guide |
| 28 | canva qr code dynamic expire | do qr codes expire | 1 (uniqode qr-codes-expiry) | Separate Canva page |
| 29 | lifetime qr code generator one time payment | free dynamic qr code generator no subscription | 0 (3: producthunt, alternativeto, sourceforge) | Interlink |

**Who ranks (winnability evidence).**
- *Weak:* lifetime/one-time (GetApp/Capterra listings, lifetimo deals, Trustpilot); stopped-working (Trustpilot, press-release syndication, help docs); never-expires (kode.link, lovable.app, MS forum threads); Canva expiry (Canva help, websitebuilderinsider, two spam .edu/.lk pages); real-estate rider (Lowen product pages, a forum, u2l.ai); GA4/UTM (monsterinsights, lovesdata, krmdigital, ssw); SVG vs PNG (pages.dev tools, vendor help docs); Google Form (Jotform x3, Fotor, Workspace listing).
- *Medium:* change after printing (scanova, uniqode, replug, rocketlink); alternatives (aggregators plus small vendor compare pages).
- *Hard, don't target the head term:* "qr code generator", "free qr code generator", "qr code menu for restaurant" (menu-software platforms), "qr code for business" (smallbiztrends), "pdf to qr code generator" (upload tools EndureQR doesn't offer).

---

## 3. Clusters, intent and owner page

This is a site-wide map, so it has 8 topic groups. The skill's 2–5 clusters × 2–4 posts rule is applied to the editorial spokes under each hub. The 17 type pages are a flat tool grid and are excluded. T = transactional, C = commercial investigation, I = informational.

### Cluster A: Free generator (T). Hub: `/qr-code-generator`
| Keyword(s) | Intent | Owner | Note |
|---|---|---|---|
| qr code generator, free qr code generator, free qr code generator no sign up, qr code generator no watermark | T | `/qr-code-generator` | #24, #2: keep "no sign-up / no watermark". Drop "That Never Expires" from the title (see C) |
| url to qr code, qr code for a link, website qr code, create qr code for website link | T | `/qr-code-generator/url` | #25/#26. Retitle so it stops copying the hub (§4-1) |
| wifi / vcard / whatsapp / … qr code generator | T | 17 type pages | Fine as they are |
| qr code with logo, free qr code generator with logo, custom qr code with logo, **qr code logo size** | T | `/qr-code-with-logo` | #12. Owns the logo-size question (§4-4) |
| how to make / create a qr code | I | `/guides/how-to-make-a-qr-code` | #27: 0 overlap with the hub, so no conflict |

### Cluster B: Dynamic and editing (T + I). Hub: `/dynamic-qr-code-generator`
| Keyword(s) | Intent | Owner |
|---|---|---|
| dynamic qr code generator, editable qr code generator, free dynamic qr code generator (no subscription) | T | `/dynamic-qr-code-generator` |
| static vs dynamic qr code, difference between static and dynamic, **what is a dynamic qr code** | I | `/guides/static-vs-dynamic-qr-codes` (#10: interlink level. Revisit a separate explainer only if GSC shows impressions without clicks) |
| how to change a qr code after printing, edit qr code, change qr code destination, can you change a qr code link | I | **NEW** `/guides/change-qr-code-after-printing` (#8 = 0 against static-vs-dynamic, #9 = 4 within the group) |
| bulk qr code generator, qr codes from csv | T | `/bulk-qr-code-generator` |
| app store qr code, one qr code for iphone and android | T | `/app-download-qr-code` |

### Cluster C: Expiry and lock-in (C + I). Hub: `/guides/do-qr-codes-expire`. Strongest brand fit.
| Keyword(s) | Intent | Owner |
|---|---|---|
| do qr codes expire, how long do qr codes last, do free qr codes expire | I | `/guides/do-qr-codes-expire` |
| qr code stopped working (after free trial / after cancelling), qr code deactivated, qr code inactive | I (problem) | **NEW** `/guides/qr-code-stopped-working` (#5, #6, #7) |
| qr code generator that never expires, free qr code generator no expiration, qr code that never expires | C | **NEW** `/free-qr-code-generator-no-expiration` (#1 = 5 inside the group, #2 = 0 against the hub) |
| lifetime qr code generator, qr code generator one time payment, qr code generator no subscription | T | **NEW** `/lifetime-qr-code-generator` (#29) |
| endureqr pricing, qr code generator pricing | T | `/pricing` |
| endureqr, qr codes that never stop working (brand) | Nav | `/` |

### Cluster D: Alternatives (C). Hub: **NEW** `/alternatives` index
| Keyword(s) | Owner |
|---|---|
| bitly alternative, bitly qr code alternative, bitly free plan qr limit (add as H2) | `/alternatives/bitly` |
| qrfy alternative | `/alternatives/qrfy` |
| qrcode monkey alternative, is qr code monkey free, qr code monkey dynamic | **NEW** `/alternatives/qr-code-monkey` |
| qr code generator pro alternative, qr-code-generator.com alternative, qrcg alternative | **NEW** `/alternatives/qr-code-generator-pro` |
| uniqode alternative, beaconstac alternative | **NEW** `/alternatives/uniqode` |
| qr tiger alternative | **NEW** `/alternatives/qr-tiger` |
| do canva qr codes expire, canva dynamic qr code, edit canva qr code | **NEW** `/guides/canva-qr-codes` (a guide, because the SERP is informational. It bridges C and D) |

### Cluster E: Print, design and troubleshooting (I). Hub: `/guides/qr-code-design-best-practices`. Tool: `/qr-code-with-logo`
| Keyword(s) | Owner |
|---|---|
| qr code design, custom qr code colours, qr code frame | `/guides/qr-code-design-best-practices` |
| qr code size, minimum qr code size, qr code size for printing, qr code dpi | `/guides/qr-code-size-for-printing` |
| qr code svg vs png, best file format to print a qr code, qr code eps | **NEW** `/guides/qr-code-svg-vs-png` (#17) |
| qr code error correction, L M Q H | `/guides/qr-code-error-correction` |
| qr code not working, qr code not scanning | `/guides/qr-code-not-scanning` (#18: creator-side causes. Phone-side causes are in how-to-scan) |

### Cluster F: Tracking (I). Hub: `/guides/track-qr-code-scans`
| Keyword(s) | Owner |
|---|---|
| qr code tracking, how to track qr code scans | `/guides/track-qr-code-scans` |
| qr code google analytics, qr code utm, track qr code in ga4 | **NEW** `/guides/qr-code-google-analytics` (#20 = 0) |
| qr code analytics (commercial) | `/dynamic-qr-code-generator` (analytics section) |

### Cluster G: Business uses and industries (I + C). Hub: **NEW** `/qr-codes-for-business`
- **Hospitality:** `/guides/qr-code-for-restaurant-menu` (how to make a qr code menu; add a "PDF menu" H2), `/guides/wifi-qr-code`, `/guides/qr-code-for-google-reviews`, `/industries/restaurants`, `/industries/hotels`.
- **Print and contact:** `/guides/qr-code-business-card`, `/guides/qr-code-for-events` (owns "qr codes for events"; `/industries/events` owns "dynamic qr codes for events"), **NEW** `/guides/qr-code-real-estate-sign` (feeds `/industries/real-estate`).
- **Files and forms:** **NEW** `/guides/qr-code-for-pdf` (PDF and Google Drive), **NEW** `/guides/qr-code-for-google-form`.

### Cluster H: Basics (I). Hub: `/guides`
`/guides/what-is-a-qr-code`, `/guides/how-to-scan-a-qr-code`, `/guides/are-qr-codes-safe`. No ownership changes, only the links in §6.

---

## 4. Cannibalisation check

| # | Pages | Severity | Evidence | Fix |
|---|---|---|---|---|
| 4-1 | `/qr-code-generator` vs `/qr-code-generator/url` | **High** | The titles are near copies: "Free QR Code Generator That Never Expires: No Sign-Up" and "URL QR Code Generator: Free, Never Expires, No Sign-Up". The generator defaults to a link, so Google can swap one page for the other on "free qr code generator". The SERPs are separate (#25 = 0, #26 = 2). | Hub title: "Free QR Code Generator: No Sign-Up, No Watermark · EndureQR". URL page title: "Link to QR Code: Turn Any URL or Website into a QR Code". URL page H1: "Turn a link into a QR code". Remove "never expires / no sign-up" from the URL page title and keep it in the body. The URL page links up to the hub with the anchor "all 17 free QR code types". |
| 4-2 | `/guides/static-vs-dynamic-qr-codes` vs `/dynamic-qr-code-generator` | Medium | Both have a comparison section ("Static and dynamic codes compared" / "Static vs dynamic at a glance") and both explain how dynamic codes work. The SERPs differ, but repeated sections blur which page should rank. | The tool page keeps a 3-row table, then links: "full static vs dynamic comparison". The guide owns "what is a dynamic QR code". The guide's "When is a dynamic QR code worth paying for?" links to the tool page with "create a dynamic QR code" (it links to /pricing today). The tool page's "How a dynamic QR code works" stays at 2 short paragraphs. |
| 4-3 | `/` vs `/qr-code-generator` vs `/guides/do-qr-codes-expire` (and new N3) on "never expires" | **High** | Three pages share the phrase. #2 and #4 show three separate intents. | Home: brand plus "QR codes that keep working after you cancel". Hub: "no sign-up". Guide: "do QR codes expire". New N3: "generator that never expires". Each page links to the others with the owner's keyword as anchor. |
| 4-4 | `/qr-code-with-logo` vs `/guides/qr-code-design-best-practices` vs `/guides/qr-code-error-correction` on "logo size" | Medium | Three H2s answer the same question: "How big should the logo be?", "How big can a logo in a QR code be?", "Logos and why they need level H". | `/qr-code-with-logo` owns it. The design guide cuts its section to 2 sentences plus a link to `/qr-code-with-logo` ("how big your logo can be"). The error-correction guide keeps the level-H explanation and links to the tool. |
| 4-5 | `/guides/do-qr-codes-expire` vs new `/guides/qr-code-stopped-working` | Low (planned) | The existing guide has the H2s "Why do dynamic QR codes stop working?" and "How can you tell if a QR code will stop working?". | The existing guide looks ahead ("will mine expire?"). The new page diagnoses and recovers ("it already stopped, what now?"). Cut the existing H2 to a summary plus a link. |
| 4-6 | `/guides/qr-code-not-scanning` vs new `/guides/qr-code-stopped-working` | Low | The existing H2 "Why does a QR code scan but the page not work?" covers expired codes. | Keep one paragraph there and link "stopped working after a trial or cancellation". |
| 4-7 | `/guides/wifi-qr-code` vs `/qr-code-generator/wifi` | Low | #13 = 2, so separate pages are right. But the guide title says "(free, no app needed)", which pulls it toward the tool's intent. | Guide title: "How to make a WiFi QR code: iPhone, Android and printed signs". Add an H2 on sharing WiFi natively from iPhone and Android, since iphonelife and slashgear rank for this. |
| 4-8 | `/guides/track-qr-code-scans` vs new GA4 page | Low (planned) | The existing H2 is "Option 1: UTM parameters and web analytics". | Cut it to a summary plus a link to N8. |
| 4-9 | `/guides/qr-code-for-events` vs `/industries/events` | Low | Same topic, different intents. | The industry page title already says "Dynamic QR codes for events". Make sure the two pages link to each other. |
| 4-10 | `/` vs `/dynamic-qr-code-generator` on "dynamic qr codes" | Medium | The home title is "Dynamic QR codes that never stop working" and home has the most internal links (54). | Home title: "EndureQR: QR codes that keep working, even after you cancel". Home body links to `/dynamic-qr-code-generator` with "dynamic QR code generator". |

**Primary-keyword uniqueness:** after these fixes, every existing page and every new page has its own primary keyword (see JSON §8).

---

## 5. New pages, prioritised (15)

Templates follow the intent mapping. Word targets: spokes 1,200–1,800. Schema: guides use Article + BreadcrumbList + FAQPage. Alternatives use WebPage + BreadcrumbList + FAQPage, with no Review or AggregateRating markup about competitors. The lifetime page uses SoftwareApplication + Offer.

### Priority 1: build first (weakest SERPs, closest brand fit)

**N1. `/guides/qr-code-stopped-working`**
- Keyword: *qr code stopped working*. Secondary: stopped working after free trial, after cancelling subscription, qr code deactivated, qr code inactive.
- Intent I (problem) → how-to. ~1,600 words.
- Why winnable: the SERP is Trustpilot reviews, press-release syndication and help docs (#5–7), with no editorial answer. It is also the exact pain EndureQR exists to solve.
- Outline:
  1. Is it the code, the phone or the provider? A 60-second test
  2. How to tell whether your code is static or dynamic (decode it: a provider short link means dynamic)
  3. Why dynamic codes get switched off: trial ended, plan lapsed, scan cap, account deleted, provider closed
  4. Can you get it back? Reactivate, pay, or reprint (a dynamic code can't be turned into a static one)
  5. Already printed 500 flyers? Stickers, reprint priorities, and owning the next redirect
  6. Questions to ask any provider before you print
  7. FAQ
- Rule for this page: quote each vendor's own help-centre text (for example, QRCG's support page says trial dynamic codes are deactivated after 14 days). Use no "scam" language.

**N2. `/lifetime-qr-code-generator`**
- Keyword: *lifetime qr code generator*. Secondary: qr code generator one time payment, no subscription, pay once dynamic qr code.
- Intent T → landing page. ~1,300 words.
- Why winnable: only GetApp/Capterra listings, deal sites (lifetimo, AppSumo-style) and Trustpilot rank, with no strong landing page. EndureQR sells a $79 Lifetime plan.
- Outline:
  1. Pay once: what "lifetime" covers here
  2. Lifetime vs $29/year vs $3.99/month: cost over 1, 3 and 5 years
  3. What happens if you stop using it, and if EndureQR ever closes (quote /terms: 90 days' notice plus export of every destination. Say plainly that printed codes on EndureQR's short domain would stop forwarding after closure)
  4. Per-code lifetime fees vs a lifetime plan (the market pattern, with no named prices unless verified)
  5. What isn't included
  6. FAQ
- Must not duplicate `/pricing`: link to it for the plan table.

**N3. `/free-qr-code-generator-no-expiration`**
- Keyword: *qr code generator that never expires*. Secondary: free qr code generator no expiration, qr code that never expires, free dynamic qr code no subscription.
- Intent C → comparison (best-of with stated criteria). ~1,800 words.
- Why winnable: the pages ranking are kode.link, a lovable.app page, link.morphe, MS forum threads and qrcodesunlimited (#1). The SERP format is listicles, so a tool page can't rank here, which is why this is not the hub.
- Outline:
  1. Short answer: static codes never expire on any generator, so what are you really checking?
  2. How we checked: static free? dynamic on the free plan? what happens at trial end or on cancel? scan caps? watermark or sign-up?
  3. Table with a "checked on" date: QRCode Monkey, QR Code Generator PRO, QR TIGER, Canva, Bitly, Hovercode, Flowcode, EndureQR
  4. When a free static code is all you need
  5. When you need dynamic: picking a provider that won't hold the code hostage
  6. Disclosure: EndureQR publishes this page
  7. FAQ

**N4. `/alternatives/qr-code-generator-pro`**
- Keyword: *qr code generator pro alternative*. Secondary: qr-code-generator.com alternative, QRCG alternative.
- Intent C → comparison. ~1,400 words.
- Why winnable: the pain is heavily documented (Trustpilot pages, BBB user reports). Rival pages are Capterra/GetApp compare pages, and the vendor's own help page confirms the key fact. Honest comparison is possible.
- Outline:
  1. What QR Code Generator PRO is (Egoditor, owned by Bitly)
  2. How its free trial works, in its own words
  3. What happens to codes when you cancel, on both services
  4. Price over a year (verify on the vendor's site)
  5. Where QRCG is stronger (more content types, landing pages, team seats: verify)
  6. Switching: a QRCG short link can't be moved, so plan a staged reprint
  7. FAQ

**N5. `/alternatives/qr-code-monkey`**
- Keyword: *qrcode monkey alternative*. Secondary: is qr code monkey free, qr code monkey dynamic qr code.
- Intent C → comparison. ~1,300 words.
- Why winnable: aggregators plus vendor compare pages (pageloot, visu.network) rank. Honest angle: Monkey is genuinely good for free static codes.
- Outline:
  1. Quick verdict (if you only need a static code, either tool is fine)
  2. What QRCode Monkey does well
  3. Where it stops: no editing or tracking, and the hand-off to a paid PRO trial (verify the ownership link before stating it)
  4. Side-by-side: types, logo, SVG/PDF, sign-up, dynamic, what happens on cancel
  5. Can you edit a printed Monkey code? (No, it's static)
  6. FAQ

**N6. `/guides/change-qr-code-after-printing`**
- Keyword: *change qr code after printing*. Secondary: edit qr code, change qr code destination, can you change a qr code link.
- Intent I → how-to. ~1,500 words.
- Why winnable: medium competition (scanova, uniqode, replug, rocketlink), but the long-tail variants are thin. Unique, honest angle: a static code pointing to **your own domain** can be redirected with a 301, no reprint needed.
- Outline:
  1. Step 1: find out which type you have
  2. Dynamic: edit it in the account that created it
  3. Static, pointing at your own domain: redirect the URL (301)
  4. Static, pointing at someone else's URL: reprint (sticker tips)
  5. Code made in an agency's or ex-employee's account
  6. Future-proofing: a dynamic code you control
  7. FAQ

**N7. `/guides/canva-qr-codes`**
- Keyword: *do canva qr codes expire*. Secondary: canva dynamic qr code, edit canva qr code, canva qr code tracking.
- Intent I → explainer. ~1,300 words.
- Why winnable: Canva's help pages plus spam/scraper pages (websitebuilderinsider, upenn and pdn.ac.lk mirrors) and one rocketlink post (#28).
- Outline:
  1. Short answer, from Canva's own help centre
  2. Static vs dynamic in Canva and which plans include them (verify)
  3. Can you change a Canva QR code after printing?
  4. Tracking scans from a Canva design
  5. Using your own QR code (SVG) in a Canva design, step by step
  6. Design checks inside Canva (contrast, quiet zone, size)
  7. FAQ

### Priority 2

**N8. `/guides/qr-code-google-analytics`**
- Keyword: *qr code google analytics*. Secondary: qr code utm, track qr code in ga4, qr code campaign url.
- Intent I → how-to. ~1,500 words.
- Why winnable: monsterinsights, lovesdata, krmdigital and ssw rank, mostly small sites (#20 = 0 against the tracking guide).
- Outline:
  1. Why QR scans show as "(direct)" in GA4
  2. Building a UTM link for print (naming source, medium and campaign)
  3. Making the code from the tagged URL
  4. Finding QR traffic in GA4
  5. One code per placement
  6. UTMs plus dynamic codes (short code, long tagged destination)
  7. Common mistakes
  8. FAQ

**N9. `/guides/qr-code-svg-vs-png`**
- Keyword: *qr code svg vs png*. Secondary: best file format to print a qr code, qr code eps, qr code pdf for print.
- Intent I → explainer. ~1,300 words.
- Why winnable: pages.dev tools and vendor help docs rank (#17).
- Outline:
  1. Short answer
  2. SVG: when, and its logo/editor quirks
  3. PNG: pixel sizes at 300 DPI (table: 2 cm ≈ 236 px, 5 cm ≈ 591 px)
  4. PDF/EPS for print shops
  5. Why to avoid JPEG
  6. Colour for print (CMYK, contrast)
  7. Pre-print checklist

**N10. `/alternatives/uniqode`**
- Keyword: *uniqode alternative*. Secondary: beaconstac alternative, uniqode pricing alternative.
- Intent C → comparison. ~1,300 words.
- Why winnable: netlify.app, vercel.app and pages.dev compare pages rank alongside review sites.
- Outline:
  1. Uniqode (formerly Beaconstac) in one paragraph
  2. Who should stay on Uniqode (SSO, roles, API, digital business cards, compliance). State that EndureQR doesn't offer these
  3. Price and billing terms compared (verify: reported as annual-only)
  4. What happens to codes on cancel
  5. Feature table
  6. FAQ

**N11. `/guides/qr-code-real-estate-sign`**
- Keyword: *qr code for real estate sign*. Secondary: real estate qr code sign rider, qr code yard sign.
- Intent I → how-to. ~1,300 words.
- Why winnable: Lowen product pages, a forum, Bramlett support and u2l.ai rank. It also feeds `/industries/real-estate`.
- Outline:
  1. What the code should open
  2. One reusable rider for every listing (dynamic)
  3. Size for drive-by distance (≈4 in and up; the 10:1 rule)
  4. Call-to-action wording
  5. Weather, glare and lamination
  6. Measuring which signs bring buyers
  7. FAQ

**N12. `/guides/qr-code-for-pdf`**
- Keyword: *how to make a qr code for a pdf*. Secondary: google drive qr code, qr code for pdf menu, qr code for a document.
- Intent I → how-to. ~1,400 words.
- Why winnable: the how-to SERP is dev.to, just-scan-it and pages.dev. The transactional "pdf to qr code generator" SERP (upload tools) is deliberately not targeted, because EndureQR doesn't host files (#15, #16).
- Outline:
  1. You can't put a PDF inside a QR code
  2. Host it: Google Drive (sharing settings), Dropbox, your website
  3. Make the code from the share link
  4. Replacing the PDF without breaking the link (Drive "Manage versions" vs a dynamic code)
  5. Test in a private window
  6. PDF menus
  7. FAQ

### Priority 3

**N13. `/alternatives/qr-tiger`**
- Keyword: *qr tiger alternative*.
- Intent C → comparison. ~1,200 words.
- Why winnable: medium. GetApp and a vercel.app blog rank.
- Outline:
  1. Verdict
  2. QR TIGER's free plan: static vs dynamic and the reported scan cap (verify)
  3. What happens when the plan ends
  4. Features table
  5. When QR TIGER is the better choice (design templates, integrations: verify)
  6. FAQ

**N14. `/guides/qr-code-for-google-form`**
- Keyword: *qr code for google form*.
- Intent I → how-to. ~1,200 words.
- Why winnable: thin SERP (Jotform x3, Fotor, a Workspace add-on).
- Outline:
  1. Get the form link (Send → link → shorten)
  2. Make the code
  3. Pre-filled form links
  4. Closing or replacing a form after printing
  5. Classroom and event uses
  6. FAQ

**N15. `/qr-codes-for-business`** (hub; can double as the `/industries` index)
- Keyword: *qr codes for small business*. Secondary: qr code for business, business uses of qr codes.
- Intent I/C → ultimate guide. ~2,500 words.
- Why winnable: the head term is hard (smallbiztrends), so treat this mainly as a structural hub. It fixes the missing industries index and passes authority to 8 industry pages and 8+ use-case guides.
- Outline:
  1. Static or dynamic: one rule for business use
  2. By industry (8 short sections, each linking out)
  3. By job: menus, reviews, WiFi, business cards, packaging, signage
  4. Measuring results
  5. Printing checklist
  6. Avoiding lock-in
  7. FAQ

**Also (not counted, small):**
- `/alternatives` index page: about 300 words plus a card per comparison.
- An H2 "Bitly's free plan and QR codes" on `/alternatives/bitly`, after verifying limits on bitly.com.
- An H2 "Making a QR code for a PDF menu" in the restaurant-menu guide, linking to N12.

---

## 6. Internal-link matrix

Mandatory = hub↔spoke. Recommended = spoke↔spoke or guide→tool. Optional = cross-cluster. Anchor rule: no anchor used for more than 40% of a page's incoming links. Place links in body paragraphs, not only in "More guides" or "Related" blocks.

### 6.1 Structural (global and hub)
| From | To | Anchor | Type |
|---|---|---|---|
| Footer "Product" column | `/lifetime-qr-code-generator` | Lifetime plan | mandatory |
| Footer "Alternatives" column | `/alternatives` | All comparisons | mandatory |
| Footer "Industries" column | `/qr-codes-for-business` | All industries | mandatory (fixes education/agencies only being reachable from sibling pages) |
| `/guides` hub | every new guide (N1, N6–N9, N11, N12, N14) | guide title | mandatory |
| `/alternatives` | N4, N5, N10, N13, `/alternatives/bitly`, `/alternatives/qrfy`, N3 | "EndureQR vs QR Code Monkey" etc. | mandatory |
| Each alternatives page | `/alternatives`, N3, `/pricing`, 1–2 sibling alternatives | "how free generators handle expiry", "see all plans" | mandatory / recommended |
| `/qr-codes-for-business` | 8 industry pages, restaurant-menu, wifi, google-reviews, business-card, events, N11, N12, N14 | "QR codes for restaurants", "Google review QR code" … | mandatory |
| Each industry page | `/qr-codes-for-business` | "QR codes for business" | mandatory |

### 6.2 Guide → tool (the main missing layer)
| From | To | Anchor | Where |
|---|---|---|---|
| `/guides/static-vs-dynamic-qr-codes` | `/dynamic-qr-code-generator` | create a dynamic QR code | "When is a dynamic QR code worth paying for?" (replaces the /pricing-only link) |
| `/guides/static-vs-dynamic-qr-codes` | `/qr-code-generator` | make a free static QR code | "When a static code is the right choice" |
| `/guides/do-qr-codes-expire` | `/dynamic-qr-code-generator` | dynamic codes that keep working after you cancel | "How to avoid QR codes that stop working" |
| `/guides/do-qr-codes-expire` | N1, N3, N2 | "already stopped working?", "free generators whose codes never expire", "pay once instead" | body |
| `/guides/qr-code-design-best-practices` | `/qr-code-with-logo` | add your logo to a QR code | logo H2 (after cutting it, §4-4) |
| `/guides/qr-code-error-correction` | `/qr-code-with-logo` | QR code with a logo | "Logos and why they need level H" |
| `/guides/qr-code-size-for-printing` | N9; `/qr-code-generator` | SVG or PNG for print; download an SVG QR code | "Resolution, DPI and file formats" |
| `/guides/track-qr-code-scans` | `/dynamic-qr-code-generator`; N8; `/bulk-qr-code-generator` | dynamic QR code with scan analytics; tracking QR scans in GA4; one code per placement, in bulk | Options 1 and 2; organising section |
| `/guides/qr-code-for-restaurant-menu` | `/dynamic-qr-code-generator`; N12 | a menu QR code you can update; QR code for a PDF menu | "static or dynamic?"; step 1 |
| `/guides/qr-code-for-events` | `/bulk-qr-code-generator`; `/dynamic-qr-code-generator` | badge QR codes in bulk; update the agenda after printing | badges H2; "schedule changes" H2 |
| `/guides/qr-code-business-card` | `/qr-code-with-logo` | business card QR code with your logo | "Tell people what the code does" |
| `/guides/how-to-make-a-qr-code` | `/qr-code-with-logo`; `/dynamic-qr-code-generator` | add a logo; a code you can edit later | steps 4–6; step 1 |
| `/guides/what-is-a-qr-code` | `/dynamic-qr-code-generator` | dynamic QR code generator | "Static and dynamic QR codes" |
| `/guides/qr-code-not-scanning` | N1 | stopped working after a trial or cancellation | "Why does a QR code scan but the page not work?" |
| `/guides/wifi-qr-code` | `/industries/hotels` | WiFi cards for hotel rooms | printing H2 (optional) |
| `/guides/are-qr-codes-safe` | `/qr-code-generator/paypal` | payment QR codes | parking/payment H2 (optional) |

### 6.3 Tool → guide and tool → tool
| From | To | Anchor |
|---|---|---|
| `/qr-code-generator` | `/guides/how-to-make-a-qr-code`; `/guides/qr-code-size-for-printing`; N3 | step-by-step guide; how big to print it; why static codes never expire |
| `/qr-code-generator/url` | `/qr-code-generator`; N8; N6 | all 17 free QR code types; add UTM tags before you make the code; changing a code after printing |
| All type pages, "Need to change it after printing?" block (`[type]/page.tsx:136`) | `/dynamic-qr-code-generator` | Make a dynamic code. Make sure the CTA goes to the feature page, not straight to signup, or add a text link "how dynamic codes work" |
| `/qr-code-generator/wifi` | `/guides/wifi-qr-code` | hidden networks and security types |
| `/qr-code-generator/vcard` | `/guides/qr-code-business-card` | putting it on a business card |
| `/qr-code-generator/event` | `/guides/qr-code-for-events` | QR codes at events |
| `/qr-code-generator/location` | `/guides/qr-code-for-google-reviews` | Google review QR code |
| `/dynamic-qr-code-generator` | N6; N2; `/guides/static-vs-dynamic-qr-codes` | how to change a QR code after printing; pay once with Lifetime; full static vs dynamic comparison |
| `/qr-code-with-logo` | `/guides/qr-code-error-correction`; N9 | (already links to error correction) why logos need level H; SVG or PNG for print |
| `/` (home) | `/dynamic-qr-code-generator`; N2; `/alternatives` | dynamic QR code generator; lifetime plan; compare with other generators |
| `/pricing` | N2; N1 | what Lifetime means; what happens to codes when you cancel |

### 6.4 New-page outgoing links (each new page needs ≥3 incoming links; sources listed)
| New page | Links out to | Incoming from (≥3) |
|---|---|---|
| N1 stopped-working | do-qr-codes-expire (hub), N3, N6, static-vs-dynamic, `/dynamic-qr-code-generator`, N4 | do-qr-codes-expire, not-scanning, `/pricing`, N3, N4, N7 |
| N2 lifetime | `/pricing`, do-qr-codes-expire, N1, `/dynamic-qr-code-generator`, `/terms#cancelling` | footer, home, `/pricing`, `/dynamic-qr-code-generator`, do-qr-codes-expire, N3 |
| N3 never-expire | do-qr-codes-expire, `/qr-code-generator`, N1, N2, N5, N7 | `/qr-code-generator`, do-qr-codes-expire, `/alternatives`, all alternative pages |
| N4 QRCG Pro alt | `/alternatives`, N1, N3, N5, `/pricing` | `/alternatives`, N1, N5, footer (via COMPETITORS) |
| N5 Monkey alt | `/alternatives`, N4, N3, `/qr-code-generator`, `/qr-code-with-logo` | `/alternatives`, N4, N3, footer |
| N6 change-after-printing | `/dynamic-qr-code-generator` (hub), static-vs-dynamic, N1, `/qr-code-generator/url` | `/dynamic-qr-code-generator`, `/qr-code-generator/url`, N1, N12, N14 |
| N7 Canva | N3, do-qr-codes-expire, N9, `/qr-code-generator` | N3, `/alternatives`, design-best-practices, N9 |
| N8 GA4 | track-qr-code-scans (hub), `/qr-code-generator/url`, `/dynamic-qr-code-generator` | track-qr-code-scans, `/qr-code-generator/url`, `/bulk-qr-code-generator`, `/industries/agencies` |
| N9 SVG vs PNG | design-best-practices (hub), size-for-printing, `/qr-code-with-logo`, `/qr-code-generator` | size guide, `/qr-code-with-logo`, design guide, N7 |
| N10 Uniqode alt | `/alternatives`, N3, N4, `/bulk-qr-code-generator` | `/alternatives`, N4, `/industries/agencies`, footer |
| N11 real-estate sign | `/industries/real-estate`, `/qr-codes-for-business`, size guide, `/dynamic-qr-code-generator` | `/industries/real-estate`, `/qr-codes-for-business`, size guide |
| N12 PDF/Drive | `/qr-code-generator/url`, restaurant-menu guide, N6 | restaurant-menu guide, `/qr-codes-for-business`, `/industries/education`, `/industries/healthcare` |
| N13 QR TIGER alt | `/alternatives`, N3, N5 | `/alternatives`, N3, footer |
| N14 Google Form | `/qr-code-generator/url`, `/industries/education`, N6 | `/industries/education`, `/qr-codes-for-business`, `/guides/qr-code-for-events` |
| N15 business hub | all industries plus use-case guides | footer, home, `/guides`, every industry page |

---

## 7. Pre-delivery validation

| Check | Result |
|---|---|
| No two pages share a primary keyword | PASS after §4 fixes 4-1, 4-3 and 4-10. FAIL today |
| Every new spoke has ≥3 incoming links planned | PASS (§6.4) |
| Every spoke links to its hub, and the hub links to every spoke | PASS as planned. Today FAIL for guide→feature hubs (§6.2) |
| No orphan pages | PASS as planned. Today, education and agencies get links only from sibling industry pages |
| Template matches intent | PASS (T → landing page/tool, C → comparison, I → how-to/explainer) |
| Word counts within spec | PASS (spokes 1,200–1,800; N15 hub 2,500). `/qr-code-generator` stays tool-first (~741 words) and is not held to the 2,500-word pillar spec |
| Cluster size 2–5 × 2–4 | WARN: site-wide map has 8 groups. Each hub has 2–4 editorial spokes except `/alternatives` (6, a flat directory) |
| SERP overlap supports groupings (≥4 to peers) | WARN: most spokes have 0–3 URL overlap with their hub. That is why they are separate pages, grouped by topic for linking. Only C (N1, N3) and B (N6) groupings reach ≥4 |

---

## 8. Structured findings (Content Architecture, for audit-data.json)

```json
{
  "category": "Content Architecture",
  "source": "seo-cluster",
  "date": "2026-11-18",
  "data_caveat": "WebSearch result sets, not Google top-10; no volume data; competitor facts need verification",
  "findings": [
    {"id": "CA-1", "severity": "high", "title": "Hub and URL generator titles near-duplicate", "pages": ["/qr-code-generator", "/qr-code-generator/url"], "fix": "Hub = free/no sign-up; URL page = link/website to QR"},
    {"id": "CA-2", "severity": "high", "title": "'Never expires' targeted by 3 pages with 3 distinct SERPs", "pages": ["/", "/qr-code-generator", "/guides/do-qr-codes-expire"], "fix": "Split ownership; new /free-qr-code-generator-no-expiration"},
    {"id": "CA-3", "severity": "high", "title": "Zero in-body guide links to /dynamic-qr-code-generator and /qr-code-with-logo", "fix": "Add the 16 guide->tool links in section 6.2"},
    {"id": "CA-4", "severity": "medium", "title": "Logo-size answered on 3 pages", "pages": ["/qr-code-with-logo", "/guides/qr-code-design-best-practices", "/guides/qr-code-error-correction"], "fix": "Owner = /qr-code-with-logo"},
    {"id": "CA-5", "severity": "medium", "title": "Comparison content duplicated between dynamic tool page and static-vs-dynamic guide", "fix": "Trim tool table, guide owns 'what is a dynamic qr code'"},
    {"id": "CA-6", "severity": "medium", "title": "Home title competes for 'dynamic qr codes'", "fix": "Brand + 'keep working after you cancel'"},
    {"id": "CA-7", "severity": "medium", "title": "No /alternatives or /industries hub; education and agencies get links only from sibling industry pages", "fix": "Add /alternatives and /qr-codes-for-business"},
    {"id": "CA-8", "severity": "low", "title": "WiFi guide title carries tool intent", "fix": "Retitle to how-to and add iPhone/Android native sharing"}
  ],
  "new_pages": [
    {"p": 1, "url": "/guides/qr-code-stopped-working", "kw": "qr code stopped working", "intent": "informational", "template": "how-to", "words": 1600},
    {"p": 1, "url": "/lifetime-qr-code-generator", "kw": "lifetime qr code generator", "intent": "transactional", "template": "landing-page", "words": 1300},
    {"p": 1, "url": "/free-qr-code-generator-no-expiration", "kw": "qr code generator that never expires", "intent": "commercial", "template": "comparison", "words": 1800},
    {"p": 1, "url": "/alternatives/qr-code-generator-pro", "kw": "qr code generator pro alternative", "intent": "commercial", "template": "comparison", "words": 1400},
    {"p": 1, "url": "/alternatives/qr-code-monkey", "kw": "qrcode monkey alternative", "intent": "commercial", "template": "comparison", "words": 1300},
    {"p": 1, "url": "/guides/change-qr-code-after-printing", "kw": "change qr code after printing", "intent": "informational", "template": "how-to", "words": 1500},
    {"p": 1, "url": "/guides/canva-qr-codes", "kw": "do canva qr codes expire", "intent": "informational", "template": "explainer", "words": 1300},
    {"p": 2, "url": "/guides/qr-code-google-analytics", "kw": "qr code google analytics", "intent": "informational", "template": "how-to", "words": 1500},
    {"p": 2, "url": "/guides/qr-code-svg-vs-png", "kw": "qr code svg vs png", "intent": "informational", "template": "explainer", "words": 1300},
    {"p": 2, "url": "/alternatives/uniqode", "kw": "uniqode alternative", "intent": "commercial", "template": "comparison", "words": 1300},
    {"p": 2, "url": "/guides/qr-code-real-estate-sign", "kw": "qr code for real estate sign", "intent": "informational", "template": "how-to", "words": 1300},
    {"p": 2, "url": "/guides/qr-code-for-pdf", "kw": "how to make a qr code for a pdf", "intent": "informational", "template": "how-to", "words": 1400},
    {"p": 3, "url": "/alternatives/qr-tiger", "kw": "qr tiger alternative", "intent": "commercial", "template": "comparison", "words": 1200},
    {"p": 3, "url": "/guides/qr-code-for-google-form", "kw": "qr code for google form", "intent": "informational", "template": "how-to", "words": 1200},
    {"p": 3, "url": "/qr-codes-for-business", "kw": "qr codes for small business", "intent": "informational", "template": "ultimate-guide", "words": 2500}
  ],
  "scorecard": {"orphanPages_now": 0, "weaklyLinkedPages_now": 2, "cannibalizationPairs_now": 4, "cannibalizationPairs_after": 0, "contentGaps": 15}
}
```

---

## Sources (SERP samples and fact checks)
- [qr-code-generator.com: free generator no expiration](https://www.qr-code-generator.com/blog/free-qr-code-generator-no-expiration/)
- [QR TIGER: generators with no expiration](https://www.qrcode-tiger.com/qr-code-generator-with-no-expiration-limit)
- [kode.link: free QR generator that doesn't expire](https://blog.kode.link/articles-en/free-qr-code-generator-that-doesnt-expire/)
- [fixedqrcodegenerator.lovable.app](https://fixedqrcodegenerator.lovable.app/)
- [QRCG support: trial dynamic codes deactivated](https://support.qr-code-generator.com/hc/en-us/articles/7665013224205)
- [northpennnow: "Your QR code stops working the moment you stop paying"](https://northpennnow.com/news/2026/apr/02/your-qr-code-stops-working-the-moment-you-stop-paying/)
- [Trustpilot: qr-code-generator.com reviews](https://www.trustpilot.com/review/www.qr-code-generator.com?page=8)
- [Scanova: static vs dynamic](https://scanova.io/blog/static-vs-dynamic-qr-code)
- [Scanova: how to change QR code destination](https://scanova.io/blog/how-to-change-qr-code-destination/)
- [Rocketlink: can you change a QR code link after printing](https://rocketlink.io/blog/can-you-change-a-qr-code-link-after-printing)
- [Wikipedia: Dynamic QR code](https://en.wikipedia.org/wiki/Dynamic_QR_code)
- [Uniqode: free QR code with logo](https://uniqode.com/blog/qr-code-customization/create-a-free-qr-code-with-logo)
- [inventivehq: WiFi QR code](https://inventivehq.com/blog/how-do-i-create-a-wifi-qr-code-for-easy-network-sharing)
- [buonmenu: menu with QR code for free](https://blog.buonmenu.com/en/how-to-create-a-menu-with-qr-code-for-free/)
- [Hovercode: PDF to QR tool](https://hovercode.com/tools/pdf-to-qr-code/)
- [Scanova: minimum QR code size](https://scanova.io/blog/minimum-qr-code-size/)
- [Hovercode: SVG vs PNG](https://hovercode.com/blog/qr-code-svg-vs-png/)
- [QR TIGER: QR code not working](https://www.qrcode-tiger.com/qr-code-not-working)
- [Uniqode: how to track QR code scans](https://uniqode.com/blog/qr-code-tracking/how-to-track-qr-code-scans)
- [Loves Data: GA QR code tracking](https://www.lovesdata.com/blog/google-analytics-qr-code-tracking/)
- [KRM Digital: QR in GA4](https://krmdigital.uk/blog/qr-ga4/)
- [Pageloot: compare QRCode Monkey](https://pageloot.com/compare/qrcode-monkey/)
- [MarTech: Bitly acquires Egoditor](https://martech.org/bitly-announces-acquisition-of-egoditor/)
- [Uniqode alternative (netlify page)](https://qrcodeprogenerator.netlify.app/uniqode-alternative)
- [Canva help: create a QR code](https://www.canva.com/en_gb/help/create-qr-code/)
- [Rocketlink: Canva QR code generator limits](https://rocketlink.io/blog/canva-qr-code-generator)
- [OwnQR on GetApp (lifetime)](https://www.getapp.ca/software/2101249/ownqr)
- [Linkly: Bitly free plan](https://linklyhq.com/blog/bitly-free-plan)
- [u2l.ai: QR codes for real estate](https://u2l.ai/blog/qr-codes-for-real-estate)
- [Jotform: QR code for a Google Form](https://www.jotform.com/google-forms/how-to-create-a-qr-code-for-a-google-form/)
- [Small Business Trends: QR code uses](https://smallbiztrends.com/qr-code-uses/)

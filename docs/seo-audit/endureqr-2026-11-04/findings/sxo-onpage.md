# SXO and on-page metadata review: EndureQR (all 55 pages)

Audit date: 2026-11-04 (finished 2026-11-18; the coordinator confirmed nothing new was deployed in between) · Site: https://endureqr.com
Inputs: `../pages.json` (55 URLs), source in `src/` (read only), previous SXO findings `../../endureqr-2026-11-02/findings/sxo.md`
Machine-readable table: `../metadata-proposal.json` (`[{url, keyword, title, description, h1|null}]`, `h1: null` means keep the current H1)

**SXO Gap Score: 62 / 100** over the 10 money queries. It is separate from the SEO Health Score. The 2 Nov score was 64, but it covered only 4 easier queries. On those 4 queries the like-for-like average is now 68.

## Headline findings

1. **HIGH mismatch on "bulk qr code generator".** The SERP is free tools that run in the browser: 7 of 9 results are tools that turn a CSV or list into a ZIP with no account (QuickChart, QRStuff, qrgenerator.org, High QR, Barcodez, QR Code RW, plus a Play app). `/bulk-qr-code-generator` is a landing page with no input. Its only action, "Start bulk creating", goes to `/signup?plan=pro-yearly`.
2. **HIGH mismatch on "qr code for restaurant menu".** The SERP is menu-builder products, not articles: MustHaveMenus, iMenuPro, Square, MyDigiMenu, Odd Menu, ClickyMenu and QRCG's solution page make 7 of 9 results. The only page we have that targets the query is a guide (blog post), which is a CRITICAL/HIGH type mismatch. `/industries/restaurants` is the closer type, but it has no menu input and its title doesn't mention menus.
3. **MEDIUM mismatch on "app download qr code".** 7 of 10 results are hybrid solution pages with two store-URL fields in the hero (QRCodeChimp, Uniqode, QRPlanet, QRCG, qrcode-ai, TQRCG, ME-QR). Ours has no input. Its CTA "Create an app download code" goes to `/signup?plan=pro-yearly`, even though the free dynamic code includes the iOS/Android split (`plans.ts` MATRIX). **That is a copy and routing bug:** a free action is gated behind the paid plan.
4. **Claims that conflict with the "never say forever" rule** are still live in the most visible places:
   - The homepage `<title>`, H1, OG title and OG image alt say "never stop working" (`app/layout.tsx:37,45`, `app/opengraph-image.tsx:7`, `(marketing)/page.tsx:23`, `guides/[slug]/page.tsx:36`).
   - Pricing says "Free forever" (`components/sections/pricing-cards.tsx:50`), and the generator intro says the same (`components/sections/generator.tsx:16`).
   - The pricing meta says "$79 once for life" (`pricing/page.tsx:13`).
   - The pricing page says "Every plan: … codes never expire". This is true of static codes, but for dynamic codes it overstates the Terms promise (while EndureQR operates, 90 days' notice, export).
   - The email FAQ says "They work forever" (`content/qr-type-pages.ts:222`).
5. **Metadata.** 21 titles and 27 descriptions need rewriting, and 11 titles only need the brand suffix (it fits in 60 characters). The worst current titles:
   - "Pricing · EndureQR" (18 chars)
   - "Bitly alternative · EndureQR" (28) and "QRFY alternative · EndureQR" (27)
   - the 8 "Dynamic QR codes for X · EndureQR" industry titles
   - "Terms of Service · EndureQR" and "Privacy Policy · EndureQR"
   - `/qr-code-generator` at 64 chars, which gets truncated

   Six guide descriptions run 156–157 chars. All 8 industry descriptions and both legal descriptions are under 140 (97–130). All 14 proposed H1 changes put the keyword in an H1 that is currently a slogan.

**Resolved since 2 Nov:**
- The dynamic page now offers a free first code ("Create this code free", input at y 687 on mobile).
- The WiFi page shows "Never leaves your browser" next to the password field, in the first screen.
- There is no horizontal overflow at 390 px on any of the 13 pages measured (scrollWidth is 390).
- The `/qr-code-generator` title now contains "Never Expires".

## Method
- **Rendering:**
  - `claude-seo run render_page.py --mode always --json` (Playwright Chromium) on 12 pages: home, pricing, generator hub, url, wifi, logo, dynamic, bulk, app download, restaurant guide, restaurants industry page, Bitly alternative, do-qr-codes-expire.
  - Fold positions came from a Playwright script using the same Chromium, at 390×844 (DPR 2, mobile UA) and 1440×900, after load plus 2.5 s. Positions are document y in CSS px.
- **Metadata:** current values come from `pages.json`. Proposed values were checked by script: titles ≤60 chars, descriptions 140–155 chars, all 55 titles and descriptions unique, and no "forever", "for life" or "never stop".
- **SERP:** WebSearch, US. Each of the 10 queries was run in extended mode, because standard mode returned spam and mirror results for "free" and "dynamic". Page types follow `seo-sxo/references/page-type-taxonomy.md`.

---

## 1. SERP-backwards check: 10 money queries

| # | Query → our page | SERP dominant type (confidence) | What the top results show above the fold | Our page now (mobile fold 844 px) | Mismatch | Gap |
|---|---|---|---|---|---|---|
| 1 | free qr code generator → `/qr-code-generator` | Tool, 8/9 = 89% (Adobe, Wix, Hovercode ×2, QRCode Monkey, QuickChart bulk, TQRCG, Flowcode; alternativeto directory) | A URL input plus a live code in the first screen; "with Logo", "No Sign Up"; 3 of 8 offer free dynamic codes (Hovercode 3, TQRCG 2, Flowcode) | H1 y 171; the 17-type picker is open, so the first input is at **y 1,149** (desktop 971, below the 900 fold); Download at y 2,945; 0 images | ALIGNED | Input below the fold on both viewports; no sticky preview on phones; no example images; free dynamic code not mentioned near the tool |
| 2 | dynamic qr code generator → `/dynamic-qr-code-generator` | Tool or hybrid with free/trial dynamic entry, 6/10 = 60%; listicles 20%; app 10%; directory 10% | "Free Dynamic QR Codes, No Expiry" (Hovercode); "2 free dynamic codes" (TQRCG); 14-day trial (QRCG) | Input `dyn-dest` y 687; "Create this code free" plus "Make a free static one" in the fold; copy says the first code is free | ALIGNED (was MEDIUM) | We give 1 free code vs 3 at Hovercode and 2 at TQRCG, so lead with what we do better: unlimited scans and codes that keep working after you cancel. No analytics screenshot; 0 images |
| 3 | qr code generator no expiration → `/qr-code-generator` | Tool 7/9 = 78%; "best … no expiration" listicles 22% | 4 of 9 titles say "No Expiration", "No Expiry" or "Forever"; QR Creator and QR Planet warn that dynamic codes can die | Title now has "Never Expires"; the fold intro says "static codes never expire" | ALIGNED | The real differentiator (dynamic codes keep working after you cancel; Terms promise 90 days' notice and export) is not on the tool page. The homepage title competes with "never stop working" |
| 4 | qr code with logo → `/qr-code-with-logo` | Tool 9/10 = 90% (Canva app, QRCodeChimp, QRCode Monkey, Hovercode, QRPlanet, Adobe, Wix, AbcSubmit, QRSprint, ViralQR) | An upload-logo control next to a live preview; "Free, No Sign Up", "No Watermark"; logo-size guidance (Monkey 30%, QRSprint <20%) | H1 y 188; type input y 704; the logo upload is not in the first screen; Download y 2,500; 1,839 words; 0 images | ALIGNED | The logo upload, the one action the query asks for, is below the fold. No example outputs |
| 5 | wifi qr code generator → `/qr-code-generator/wifi` | Tool 8/10 = 80%; App Store 20% | "Free & Private", "100% Private, No Signup", "password never leaves your device"; print-a-sign option | SSID y 660; the "Never leaves your browser" note is in the fold; Download y 2,767 | ALIGNED | Title lacks "Private"; no printable table-card preset; output about 2 screens below the inputs on mobile |
| 6 | bulk qr code generator → `/bulk-qr-code-generator` | Free bulk tool 7/9 = 78%; QRCG home and a Workspace add-on make up the rest | Paste or upload a list → ZIP, free, often "runs in your browser"; limits stated (1,000, 5k, 50 lines) | No input. "Start bulk creating" goes to `/signup?plan=pro-yearly`; "See pricing"; payment notice in the fold | **HIGH** | Landing page vs tool. Price-sensitive volume makers bounce before seeing that ours is dynamic and editable |
| 7 | app download qr code / app store qr code → `/app-download-qr-code` | Hybrid solution page with an inline form, 7/10 = 70%; how-to guides 30% (QR Tiger, OpenQR, SmartyTags). "app store qr code generator" also pulls App Store generator apps | Two fields (App Store URL, Google Play URL), a live code, "Scan to download" frame and store badges | No input. "Create an app download code" goes to `/signup?plan=pro-yearly`; 0 images | **MEDIUM** | No form; a free action routes to the paid plan; no badge or frame example |
| 8 | qr code for restaurant menu → guide `/guides/qr-code-for-restaurant-menu` (and `/industries/restaurants`) | Menu product or solution page 8/9 = 89% (MustHaveMenus, iMenuPro, QRCG, Square, MyDigiMenu, Odd Menu, ClickyMenu, Adobe Stock noise); guide 1/9 (u2l) | "Upload your menu / build a menu → get a QR"; free tier; table-tent templates; ordering (Square) | Guide: H1 y 219, author, date and TOC; no tool. Industry page: slogan H1 "Print the table tent once…", "Start free" plus an animated mock; title "Dynamic QR codes for restaurants" | **HIGH** (guide) / **MEDIUM** (industry page) | We don't host menus (no PDF or menu type among the 17). Retarget the commercial query to `/industries/restaurants` and add a "Paste your menu link → free dynamic code" form. Keep the guide for "how to make a QR code menu" |
| 9 | bitly alternative (qr code) → `/alternatives/bitly` | Comparison or alternative page 7/9 = 78% (Scanova, QRCodeChimp, TQRCG listicle, QR Pulse, QRBliss, ZodQR, qrcodefordonation); G2 directory | "Bitly QR Code Alternative (2026)", with free dynamic codes in the hero (QRBliss 15, ZodQR 5, TQRCG 2, QR Pulse 2) and a feature table | H1 y 165 plus a price pitch ($120 vs $29) and "Switch to EndureQR" in the fold | ALIGNED | Title is 28 chars with no "QR code" and no price. No free entry next to the CTA; no "(2026)" or checked date in the hero |
| 10 | qr code generator pricing → `/pricing` | Split: vendor pricing pages ~45% (QRStuff, online-qr-generator, G2 pricing ×2); comparison or review articles ~55% (FitSmallBusiness, TQRCG pricing blog, iTechGuides, QR Forever, QRCodeNova "Cheapest … 7 tools") | Plan cards plus "cheapest", "free vs paid compared" tables; prices from $3.99 to $250+/mo | Plan cards in the fold ($0 / $2.42 a month on yearly / $79); "Free forever" note; 643 words | MEDIUM (half the SERP wants a cross-vendor comparison) | Title "Pricing · EndureQR"; no competitor price row on the page (it exists on the homepage); "Free forever" and "codes never expire" overstate the promise |

**SERP features (PAA, ads, AI Overview, snippets)** can't be seen through WebSearch. See Limitations.

### Gap scores (7 dimensions)

| Query → page | Type /15 | Depth /15 | UX /15 | Schema /15 | Media /15 | Authority /15 | Fresh /10 | **Total** |
|---|---|---|---|---|---|---|---|---|
| free → /qr-code-generator | 15 | 11 | 10 | 12 | 6 | 5 | 7 | **66** |
| dynamic → /dynamic-qr-code-generator | 13 | 13 | 12 | 13 | 3 | 6 | 7 | **67** |
| no expiration → /qr-code-generator | 14 | 10 | 10 | 12 | 6 | 6 | 7 | **65** |
| logo → /qr-code-with-logo | 15 | 14 | 11 | 13 | 4 | 5 | 7 | **69** |
| wifi → /qr-code-generator/wifi | 15 | 13 | 13 | 12 | 5 | 8 | 7 | **73** |
| bulk → /bulk-qr-code-generator | 5 | 12 | 8 | 12 | 3 | 5 | 7 | **52** |
| app download → /app-download-qr-code | 9 | 13 | 9 | 12 | 3 | 5 | 7 | **58** |
| restaurant menu → /industries/restaurants | 7 | 7 | 10 | 9 | 5 | 5 | 6 | **49** |
| bitly alternative → /alternatives/bitly | 12 | 10 | 12 | 9 | 3 | 9 | 8 | **63** |
| pricing → /pricing | 11 | 9 | 13 | 13 | 3 | 6 | 7 | **62** |

**Evidence by dimension:**
- **Media:** 0 `<img>` in `<main>` on every page except the homepage (3).
- **Schema:**
  - Industry and alternative pages carry only FAQPage and BreadcrumbList, with no SoftwareApplication or Offer.
  - Legal pages carry no schema at all.
- **Authority:**
  - Brand-new domain, no reviews.
  - WiFi scores higher for its on-page privacy claim, and Bitly for its dated, sourced vendor quotes.
- **Freshness:**
  - htmldate reads "2026-01-01" on most tool and feature pages, with no visible date.
  - Guides show "Updated 2 November 2026".

### User stories (each cites a SERP signal)
1. **Awareness, volume maker:** "As an event or ops manager with 300 names in a spreadsheet, I want to paste a CSV and get a ZIP right now, without an account. I'm blocked by **price and commitment**: our page asks for Pro first."
   *(Signals: QuickChart "generate thousands … free … ZIP"; qrgenerator.org "up to 5k"; High QR "runs entirely in the browser".)*
2. **Consideration, restaurant owner:** "I want my existing menu online behind a QR code I can update without reprinting. I'm blocked by **an information gap**: does EndureQR host the menu, or only link to it?"
   *(Signals: 7 of 9 results are menu builders; "Upload your menu" heroes; ClickyMenu "view-only digital menu with QR".)*
3. **Decision, app marketer:** "I want one code that sends iPhone users to the App Store and Android users to Play, tested before I print. I'm blocked by **a paywall I don't expect**: the CTA says pro-yearly, but the Free plan includes it."
   *(Signals: QRCodeChimp, Uniqode and QRCG hero forms; ME-QR "store" generator; Uniqode "edit … without changing the printed symbol".)*
4. **Decision, Bitly switcher:** "I hit Bitly's 5-codes-a-month cap and want a cheaper QR tool that won't kill my printed codes. I'm blocked by **comparison fatigue**: every alternative claims free dynamic codes."
   *(Signals: QRBliss "Bitly's free tier gives 2 dynamic QR codes per month"; ZodQR, QR Pulse and TQRCG free dynamic counts.)*
5. **Consideration, price comparer:** "I want to see what a dynamic QR plan costs across vendors. I'm blocked by **an information gap**: our pricing page shows only our own plans."
   *(Signals: QRCodeNova "Cheapest … 7 Tools"; QR Forever "Free vs Paid Compared (2026)"; FitSmallBusiness "Cheap or Free".)*

### Persona scores (best-matching page; weakest first)
| Persona | Page | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|---|
| Restaurant owner wanting a menu QR | /industries/restaurants | 12 | 9 | 10 | 8 | **39** | Critical mismatch |
| Volume maker | /bulk-qr-code-generator | 13 | 15 | 10 | 5 | **43** | Needs work |
| App marketer | /app-download-qr-code | 20 | 17 | 12 | 7 | **56** | Needs work |
| Price comparer | /pricing | 15 | 18 | 11 | 12 | **56** | Needs work |
| Bitly switcher | /alternatives/bitly | 21 | 18 | 15 | 12 | **66** | Good |
| Free-tier dynamic evaluator | /dynamic-qr-code-generator | 21 | 18 | 14 | 17 | **70** | Good (was 59) |
| Print-once, no-expiry buyer | /qr-code-generator | 21 | 18 | 15 | 20 | **74** | Good |

**Concrete improvements, weakest persona first:**
1. **Restaurant owner.**
   - Retitle and re-H1 `/industries/restaurants` for "QR code for restaurant menus" (see the table).
   - Put a hero form there, "Your menu link (website or PDF)", leading to "Create free menu QR". It should make the free dynamic code via `/signup?next=/dashboard/codes/new&from=restaurants`.
   - Add a table-tent frame example image.
   - State plainly: "EndureQR doesn't host menus; point the code at your menu page or a PDF on your site, and swap it any time."
2. **Volume maker.**
   - **Option A (best):** add a free, in-browser *static* bulk tool on the page: paste or upload a CSV of up to 100 rows, get a ZIP of PNG/SVG files, no account. Pitch Pro's dynamic bulk (500 rows, editable, tracked) right under the result.
   - **Option B (minimum):**
     - Put "Download sample CSV" and a 3-row preview table in the hero.
     - Label "Pro feature, $29 a year, 14-day money-back" next to the CTA.
     - Link "One-off codes? Free generator →".
3. **App marketer.**
   - Change the CTA to "Create your free app download code", routed to `/signup?next=/dashboard/codes/new&type=app&from=app-download`, not `plan=pro-yearly`.
   - Add two inputs (App Store URL, Google Play URL) plus a fallback URL in the hero that carry over into signup.
   - Show a framed example with "Scan to download" and store badges.
4. **Price comparer.**
   - Add an H2 "What dynamic QR codes cost elsewhere". Reuse the confirmed `competitors.ts` rows (Bitly Core $120/yr; QRFY $228/yr) with the "checked 26 Oct 2026" date, and add more vendors only after confirming them.
   - Replace "Free forever" with "Free, no time limit on static codes".
   - Replace "codes never expire" with "static codes never expire · dynamic codes keep working after you cancel".
5. **Bitly switcher.**
   - Add a line under the hero CTA: "Try it free: unlimited static codes plus 1 dynamic code, no card."
   - Show "Prices checked 26 Oct 2026" in the fold.
   - Use the new title.
6. **Free-tier evaluator.**
   - Add a dashboard screenshot (edit destination plus scan chart) under the hero.
   - Add an FAQ, "What if EndureQR shuts down?", quoting the Terms (90 days' notice, export).
7. **No-expiry buyer.** Add under the generator: "Static codes hold your content themselves and never expire. Dynamic codes keep redirecting after you cancel (see Terms)."

**Cannibalisation map applied in the table:**

| Query | Page that owns it | Pages pointed at related terms |
|---|---|---|
| "free qr code generator" / "no expiration" | `/qr-code-generator` | guide → "do QR codes expire"; homepage → brand |
| "qr code for restaurant menu" (commercial) | `/industries/restaurants` | guide → "how to make a QR code menu" |
| events | | generator → calendar "event QR code"; guide → "how to use QR codes at events"; industry page → conference and badge codes |
| WiFi | | tool → "wifi qr code generator"; guide → "how to make a wifi qr code" |
| vCard | | tool → "vcard qr code generator"; guide → "qr code on business card" |

---

## 2. Metadata table: all 55 URLs

**How to read it:**
- Lengths are in characters.
- **keep** means the current value is already right.
- **+brand** means the same title with " · EndureQR" added, because it fits in 60 characters.
- The H1 column says "keep" unless a change is proposed.
- The same data is in `../metadata-proposal.json`.

**Counts:**
- Titles: 21 new, 11 +brand, 23 keep.
- Descriptions: 27 new, 28 keep.
- H1s: 14 changes.

| # | Path | Primary keyword | Proposed title | Proposed meta description | H1 |
|---|---|---|---|---|---|
| 1 | `/` | EndureQR (brand) + QR codes that keep working | EndureQR: QR Codes That Keep Working After You Cancel (53) **new**<br><sub>was: EndureQR: Dynamic QR codes that never stop working (50)</sub> | Free static QR codes with no sign-up, plus dynamic codes you can edit after printing. Pro is $29 a year, and codes keep working if you cancel. Start free. (154) **new**<br><sub>was (135): Create dynamic QR codes you can edit after printing, with unlimited scans and real analytics. Cancel any time: your codes keep working.</sub> | QR codes that keep working, even after you cancel.<br><sub>was: QR codes that never stop working.</sub> |
| 2 | `/pricing` | qr code generator pricing | QR Code Generator Pricing: Free, $29 a Year or $79 Once (55) **new**<br><sub>was: Pricing · EndureQR (18)</sub> | Static QR codes are free. Pro is $3.99/month or $29/year for unlimited dynamic codes, analytics and bulk. Lifetime: $79 once. Codes work after you cancel. (154) **new**<br><sub>was (144): Free static QR codes, Pro at $3.99/month or $29/year, or $79 once for life. Unlimited scans on every plan, and codes keep working if you cancel.</sub> | QR code generator pricing: free, $29 a year, or $79 once<br><sub>was: Simple pricing. Codes that last.</sub> |
| 3 | `/qr-code-generator` | free qr code generator (+ qr code generator no expiration) | Free QR Code Generator: No Sign-Up, Never Expires · EndureQR (60) **new**<br><sub>was: Free QR Code Generator That Never Expires: No Sign-Up · EndureQR (64)</sub> | Make a free QR code for a link, WiFi, vCard and 14 more types. Add your logo and a frame, download PNG, SVG or PDF. No sign-up, no watermark, no expiry. (152) **new**<br><sub>was (153): Make a free QR code for a link, WiFi, vCard, WhatsApp and 13 more types. Add a logo and frame, download PNG, SVG, JPEG or PDF. Static codes never expire.</sub> | Free QR code generator: no sign-up, no expiry<br><sub>was: Free QR code generator.</sub> |
| 4 | `/qr-code-with-logo` | qr code with logo | QR Code with Logo: Free Generator, No Sign-Up · EndureQR (56) **new**<br><sub>was: QR Code with Logo: Free Custom QR Code Generator (48)</sub> | Put your logo in the centre of a free QR code. Upload PNG, SVG or JPEG and pick colours. Error correction goes to H so it still scans. No watermark. (148) **new**<br><sub>was (151): Make a free QR code with your logo in the centre. Upload PNG, SVG, JPEG or WebP, pick colours and a frame, then download print-ready files. No sign-up.</sub> | keep |
| 5 | `/dynamic-qr-code-generator` | dynamic qr code generator | Dynamic QR Code Generator: Free Code, Edit After Printing (57) **new**<br><sub>was: Dynamic QR Code Generator: Edit Links After Printing (52)</sub> | Your first dynamic QR code is free: edit the link after printing and see its scans. Pro is $29 a year for unlimited codes, and they work after you cancel. (154) **new**<br><sub>was (141): Create a dynamic QR code free and edit it after printing. Pro adds unlimited codes, with unlimited scans, analytics and iPhone/Android links.</sub> | keep |
| 6 | `/app-download-qr-code` | app download qr code / app store qr code | App Download QR Code for App Store and Google Play (50) **keep**<br><sub>was: App Download QR Code for App Store and Google Play (50)</sub> | One QR code sends iPhones to the App Store and Android phones to Google Play. Your first one is free; edit the store links after printing and track scans. (154) **new**<br><sub>was (155): Make one app download QR code that sends iPhone users to the App Store and Android users to Google Play. Change the links any time and see scans by device.</sub> | keep |
| 7 | `/bulk-qr-code-generator` | bulk qr code generator | Bulk QR Code Generator: 500 Codes from One CSV · EndureQR (57) **new**<br><sub>was: Bulk QR Code Generator: Create QR Codes from CSV (48)</sub> | Upload a CSV and create up to 500 dynamic QR codes at once. Get a ZIP of print-ready SVGs and a CSV of short links; edit any code later. Pro, $29 a year. (153) **new**<br><sub>was (150): Upload a CSV and create up to 500 dynamic QR codes at once. Download a ZIP of print-ready SVGs and a CSV of short links. Edit any code after printing.</sub> | Bulk QR code generator: hundreds of codes from one CSV<br><sub>was: Create hundreds of QR codes from one CSV</sub> |
| 8 | `/qr-code-generator/url` | url qr code generator | URL QR Code Generator: Free, Never Expires, No Sign-Up (54) **keep**<br><sub>was: URL QR Code Generator: Free, Never Expires, No Sign-Up (54)</sub> | Turn any link into a QR code for free. No sign-up, no watermark, unlimited scans and no expiry. Add your logo and colours, then download PNG, SVG or PDF. (153) **keep** | keep |
| 9 | `/qr-code-generator/text` | text qr code generator | Text QR Code Generator: Free Plain-Text QR Codes · EndureQR (59) **+brand**<br><sub>was: Text QR Code Generator: Free Plain-Text QR Codes (48)</sub> | Put a short message inside a QR code. It shows on screen when scanned and works with no internet. Free, no sign-up, no watermark, up to 300 characters. (151) **keep** | keep |
| 10 | `/qr-code-generator/wifi` | wifi qr code generator | WiFi QR Code Generator: Free, Private, No Sign-Up · EndureQR (60) **new**<br><sub>was: WiFi QR Code Generator: Free, No Sign-Up (40)</sub> | Make a WiFi QR code guests join in one scan, no password to type. Your password never leaves your browser. Works on iPhone and Android. Free, no sign-up. (153) **new**<br><sub>was (155): Make a WiFi QR code so guests join your network in one scan, with no password to type. Works on iPhone and Android. Free, no sign-up, and it never expires.</sub> | keep |
| 11 | `/qr-code-generator/vcard` | vcard qr code generator | vCard QR Code Generator: Free Contact QR Codes · EndureQR (57) **+brand**<br><sub>was: vCard QR Code Generator: Free Contact QR Codes (46)</sub> | Create a vCard QR code that saves your name, phone, email and company to contacts in one scan. Free, no sign-up, no watermark, and the code never expires. (154) **keep** | keep |
| 12 | `/qr-code-generator/email` | email qr code generator | Email QR Code Generator: Prefill Subject and Body · EndureQR (60) **+brand**<br><sub>was: Email QR Code Generator: Prefill Subject and Body (49)</sub> | Make an email QR code that opens a new message with your address, subject and text already filled in. Free, no account needed, no watermark and no expiry. (154) **keep** | keep |
| 13 | `/qr-code-generator/sms` | sms qr code generator | SMS QR Code Generator: Free Prefilled Texts · EndureQR (54) **new**<br><sub>was: SMS QR Code Generator: Free Prefilled Text Messages (51)</sub> | Create an SMS QR code that opens a text message with your number and message ready to send. Works on iPhone and Android. Free, no sign-up, no watermark. (152) **keep** | keep |
| 14 | `/qr-code-generator/phone` | phone number qr code generator | Phone Number QR Code Generator: Tap to Call, Free · EndureQR (60) **+brand**<br><sub>was: Phone Number QR Code Generator: Tap to Call, Free (49)</sub> | Make a phone number QR code that offers to call you as soon as it's scanned. No typing and no misdialled digits. Free, no sign-up, and it never expires. (152) **keep** | keep |
| 15 | `/qr-code-generator/whatsapp` | whatsapp qr code generator | WhatsApp QR Code Generator: Free Click-to-Chat · EndureQR (57) **new**<br><sub>was: WhatsApp QR Code Generator: Free Chat Link QR Codes (51)</sub> | Make a WhatsApp QR code that opens a chat with your message already typed. Customers scan, tap send and you're talking. Free, no sign-up, no watermark. (151) **new**<br><sub>was (156): Make a WhatsApp QR code that opens a chat with you and a message already typed. Customers scan, tap send and you're talking. Free, no sign-up, no watermark.</sub> | keep |
| 16 | `/qr-code-generator/location` | location qr code generator | Location QR Code Generator: Free Map Pin QR Codes · EndureQR (60) **+brand**<br><sub>was: Location QR Code Generator: Free Map Pin QR Codes (49)</sub> | Make a location QR code that opens a map at your address or exact coordinates, ready for directions. Free, no sign-up, no watermark, and it never expires. (154) **keep** | keep |
| 17 | `/qr-code-generator/event` | calendar event qr code generator | Event QR Code Generator: Add to Calendar, Free · EndureQR (57) **+brand**<br><sub>was: Event QR Code Generator: Add to Calendar, Free (46)</sub> | Create an event QR code that adds your event to a phone's calendar with the title, time, place and details filled in. Free, no sign-up and no watermark. (152) **keep** | keep |
| 18 | `/qr-code-generator/instagram` | instagram qr code generator | Instagram QR Code Generator: Free, No Sign-Up · EndureQR (56) **+brand**<br><sub>was: Instagram QR Code Generator: Free, No Sign-Up (45)</sub> | Make an Instagram QR code that opens your profile, post or reel in one scan. Add your logo and colours. Free, no sign-up, no watermark, never expires. (150) **keep** | keep |
| 19 | `/qr-code-generator/facebook` | facebook qr code generator | Facebook QR Code Generator: Free Page and Profile QR (52) **keep**<br><sub>was: Facebook QR Code Generator: Free Page and Profile QR (52)</sub> | Create a Facebook QR code that opens your page, profile, group or event in one scan. Free, no sign-up and no watermark. Download PNG, SVG, JPEG or PDF. (151) **keep** | keep |
| 20 | `/qr-code-generator/youtube` | youtube qr code generator | YouTube QR Code Generator: Free Channel and Video QR (52) **keep**<br><sub>was: YouTube QR Code Generator: Free Channel and Video QR (52)</sub> | Make a YouTube QR code that opens your channel or a specific video. Put how-to videos on packaging and trailers on posters. Free, no sign-up, no watermark. (155) **keep** | keep |
| 21 | `/qr-code-generator/linkedin` | linkedin qr code generator | LinkedIn QR Code Generator: Free Profile QR Codes · EndureQR (60) **+brand**<br><sub>was: LinkedIn QR Code Generator: Free Profile QR Codes (49)</sub> | Create a LinkedIn QR code for your profile or company page, so people you meet can connect in one scan. Free, no sign-up, no watermark, never expires. (150) **keep** | keep |
| 22 | `/qr-code-generator/x` | x / twitter qr code generator | X (Twitter) QR Code Generator: Free Profile QR · EndureQR (57) **+brand**<br><sub>was: X (Twitter) QR Code Generator: Free Profile QR (46)</sub> | Make an X (Twitter) QR code that opens your profile or a single post in one scan. Add your logo and colours. Free, no sign-up, no watermark, no expiry. (151) **keep** | keep |
| 23 | `/qr-code-generator/tiktok` | tiktok qr code generator | TikTok QR Code Generator: Free, No Watermark · EndureQR (55) **+brand**<br><sub>was: TikTok QR Code Generator: Free, No Watermark (44)</sub> | Create a TikTok QR code that opens your profile or a video in one scan. Use it on products, packaging and merch. Free, no sign-up, no watermark, no expiry. (155) **keep** | keep |
| 24 | `/qr-code-generator/paypal` | paypal qr code generator | PayPal QR Code Generator: Free PayPal.Me QR Codes · EndureQR (60) **+brand**<br><sub>was: PayPal QR Code Generator: Free PayPal.Me QR Codes (49)</sub> | Make a PayPal QR code that opens your PayPal.Me link, with or without a set amount. Great for stalls, tips and invoices. Free, no sign-up, no watermark. (152) **keep** | keep |
| 25 | `/guides` | qr code guides | QR Code Guides: Printing, Design and Expiry · EndureQR (54) **keep**<br><sub>was: QR Code Guides: Printing, Design and Expiry · EndureQR (54)</sub> | Plain answers on QR codes: whether they expire, static vs dynamic, the right print size, menus, WiFi codes and design rules that keep every code scannable. (155) **keep** | keep |
| 26 | `/guides/what-is-a-qr-code` | what is a qr code | What is a QR code? How it works, explained simply · EndureQR (60) **keep**<br><sub>was: What is a QR code? How it works, explained simply · EndureQR (60)</sub> | A QR code is a square barcode that stores links, text or data in a grid of modules. Learn how it works, its parts, versions and error correction levels. (152) **new**<br><sub>was (156): A QR code is a square barcode that stores links, text or data in a grid of modules. Learn how it works, its parts, its versions and error correction levels.</sub> | keep |
| 27 | `/guides/how-to-scan-a-qr-code` | how to scan a qr code | How to scan a QR code on iPhone, Android or laptop (50) **keep**<br><sub>was: How to scan a QR code on iPhone, Android or laptop (50)</sub> | To scan a QR code, open your phone's camera, point it at the code and tap the link that appears. Steps for iPhone, Android, screenshots and laptops. (148) **keep** | keep |
| 28 | `/guides/how-to-make-a-qr-code` | how to make a qr code | How to make a QR code: free step-by-step guide · EndureQR (57) **keep**<br><sub>was: How to make a QR code: free step-by-step guide · EndureQR (57)</sub> | Make a QR code in minutes: pick a type, enter your link or details, style it, add a logo, test it and download PNG, SVG or PDF. Free, with no sign-up. (150) **new**<br><sub>was (157): Make a QR code in minutes: pick a type, enter your link or details, style it, add a logo, test it and download PNG, SVG or PDF. Free, with no sign-up needed.</sub> | keep |
| 29 | `/guides/do-qr-codes-expire` | do qr codes expire | Do QR codes expire? Why codes stop working · EndureQR (53) **keep**<br><sub>was: Do QR codes expire? Why codes stop working · EndureQR (53)</sub> | Static QR codes never expire. Dynamic codes can stop working when a trial, subscription or account ends. Learn how to check your codes and avoid dead ones. (155) **keep** | keep |
| 30 | `/guides/static-vs-dynamic-qr-codes` | static vs dynamic qr code | Static vs dynamic QR codes: differences and uses · EndureQR (59) **keep**<br><sub>was: Static vs dynamic QR codes: differences and uses · EndureQR (59)</sub> | Static QR codes are free and never expire but cannot change. Dynamic codes can be edited and tracked. Compare both side by side and pick the right one. (151) **keep** | keep |
| 31 | `/guides/qr-code-size-for-printing` | qr code size for printing | QR code size for printing: minimum size and DPI · EndureQR (58) **keep**<br><sub>was: QR code size for printing: minimum size and DPI · EndureQR (58)</sub> | The minimum printed QR code size is about 2 cm (0.8 in). Use the 10:1 distance rule, the right DPI and vector files so your code scans every time. (146) **keep** | keep |
| 32 | `/guides/qr-code-for-restaurant-menu` | how to make a qr code menu (informational) | How to make a QR code menu for your restaurant · EndureQR (57) **keep**<br><sub>was: How to make a QR code menu for your restaurant · EndureQR (57)</sub> | Put your menu online, link it to a QR code, and print it on table tents at 5 cm or larger. Steps, placement tips and why dynamic codes suit changing menus. (155) **keep** | keep |
| 33 | `/guides/wifi-qr-code` | how to make a wifi qr code | How to make a WiFi QR code (free, no app needed) · EndureQR (59) **keep**<br><sub>was: How to make a WiFi QR code (free, no app needed) · EndureQR (59)</sub> | Make a WiFi QR code by entering your network name, password and security type. Learn the WIFI: format, hidden networks and safe guest network setup. (148) **keep** | keep |
| 34 | `/guides/qr-code-design-best-practices` | qr code design best practices | QR code design best practices: logos, colours, frames (53) **keep**<br><sub>was: QR code design best practices: logos, colours, frames (53)</sub> | Design a custom QR code with a logo that still scans: strong contrast, a light background, a logo under 25% of the area, clear frames and real phone tests. (155) **keep** | keep |
| 35 | `/guides/qr-code-not-scanning` | qr code not scanning | QR code not scanning? A checklist of common fixes · EndureQR (60) **keep**<br><sub>was: QR code not scanning? A checklist of common fixes · EndureQR (60)</sub> | QR code not scanning? Work through this checklist: contrast, size, quiet zone, data density, logo size, glare, curves, blur, dead links and expired codes. (154) **new**<br><sub>was (156): QR code not scanning? Work through this checklist: contrast, size, quiet zone, data density, logo size, glare, curves, blur, broken links and expired codes.</sub> | keep |
| 36 | `/guides/are-qr-codes-safe` | are qr codes safe | Are QR codes safe? How to spot QR code scams · EndureQR (55) **keep**<br><sub>was: Are QR codes safe? How to spot QR code scams · EndureQR (55)</sub> | QR codes are safe to scan; the link can be risky. Learn how quishing and fake parking codes work, what to check before you tap and how to protect yours. (152) **new**<br><sub>was (156): QR codes are safe to scan, but the link can be risky. Learn how quishing and fake parking codes work, what to check before you tap and how to protect codes.</sub> | keep |
| 37 | `/guides/qr-code-business-card` | qr code on business card | QR code on a business card: vCard, size and tips · EndureQR (59) **keep**<br><sub>was: QR code on a business card: vCard, size and tips · EndureQR (59)</sub> | Put a QR code on your business card with a vCard that saves your details or a link to a profile. Which fields to add, vCard 3.0, size and how to test it. (153) **keep** | keep |
| 38 | `/guides/qr-code-error-correction` | qr code error correction levels | QR code error correction levels: L, M, Q and H explained (56) **keep**<br><sub>was: QR code error correction levels: L, M, Q and H explained (56)</sub> | QR codes have four error correction levels, L, M, Q and H, which recover about 7, 15, 25 and 30% of damage. Learn the density trade-off and which to use. (153) **new**<br><sub>was (157): QR codes have four error correction levels, L, M, Q and H, which recover about 7, 15, 25 and 30% of damage. Learn the density trade-off and when to use each.</sub> | keep |
| 39 | `/guides/qr-code-for-google-reviews` | qr code for google reviews | QR code for Google reviews: how to make one · EndureQR (54) **keep**<br><sub>was: QR code for Google reviews: how to make one · EndureQR (54)</sub> | Make a QR code for Google reviews from your Business Profile review link. Where to place it, how to test it, and Google's rules on incentives and gating. (153) **keep** | keep |
| 40 | `/guides/track-qr-code-scans` | how to track qr code scans | How to track QR code scans: UTM links and analytics (51) **keep**<br><sub>was: How to track QR code scans: UTM links and analytics (51)</sub> | Static QR codes cannot count scans. Track them with UTM tags and web analytics, or use dynamic codes that log time, city and device. Privacy tips included. (155) **new**<br><sub>was (157): Static QR codes cannot count scans. Track them with UTM parameters and web analytics, or dynamic codes that log time, city and device. Privacy tips included.</sub> | keep |
| 41 | `/guides/qr-code-for-events` | how to use qr codes at events | QR codes for events: tickets, agendas, WiFi and more (52) **keep**<br><sub>was: QR codes for events: tickets, agendas, WiFi and more (52)</sub> | Use QR codes at events for agendas, venue WiFi, directions, calendar invites, badges and feedback forms, plus why dynamic codes suit changing schedules. (152) **keep** | keep |
| 42 | `/about` | about endureqr | About EndureQR: QR codes that keep working (42) **keep**<br><sub>was: About EndureQR: QR codes that keep working (42)</sub> | EndureQR makes QR codes that keep working: free static codes that never expire, and dynamic codes that keep redirecting even after you cancel. (142) **keep** | keep |
| 43 | `/contact` | contact endureqr | Contact EndureQR: help, billing, privacy and abuse (50) **keep**<br><sub>was: Contact EndureQR: help, billing, privacy and abuse (50)</sub> | Get help with EndureQR, ask about plans and billing, report a harmful QR code or make a privacy request. A person replies within one business day. (146) **keep** | Contact EndureQR: talk to a person<br><sub>was: Talk to a person.</sub> |
| 44 | `/terms` | endureqr terms of service | EndureQR Terms of Service: Refunds, Cancelling, Your Codes (58) **new**<br><sub>was: Terms of Service · EndureQR (27)</sub> | Plain-English EndureQR terms: plans, 14-day refunds, acceptable use, what keeps working after you cancel, and 90 days' notice if the service ever closes. (153) **new**<br><sub>was (104): The agreement between you and EndureQR for using the website, the free QR code generator and paid plans.</sub> | keep |
| 45 | `/privacy` | endureqr privacy policy | EndureQR Privacy Policy: What We Collect and Why (48) **new**<br><sub>was: Privacy Policy · EndureQR (25)</sub> | Our free generator runs in your browser, so what you type never reaches us. See what scan data dynamic codes record, how long we keep it and your rights. (153) **new**<br><sub>was (97): What EndureQR collects, why, how long we keep it, who we share it with, and the choices you have.</sub> | keep |
| 46 | `/industries/restaurants` | qr code for restaurant menu (commercial) | QR Code for Restaurant Menus: Update Without Reprinting (55) **new**<br><sub>was: Dynamic QR codes for restaurants · EndureQR (43)</sub> | Print one QR code on your table tents, point it at tonight's menu and swap to brunch on Sunday. See which tables scan most. First dynamic code free. (148) **new**<br><sub>was (130): Point one code at today's menu, swap it for the brunch menu on Sunday, and see which tables scan most, without reprinting a thing.</sub> | Menu QR codes: print the table tent once, change the menu every night.<br><sub>was: Print the table tent once. Change the menu every night.</sub> |
| 47 | `/industries/real-estate` | real estate qr code / qr code for real estate signs | Real Estate QR Codes for Yard Signs and Listings · EndureQR (59) **new**<br><sub>was: Dynamic QR codes for real estate · EndureQR (43)</sub> | Put one QR code on your sign rider, point it at the current listing, then switch to the next one when it sells. See which signs bring buyers. Start free. (153) **new**<br><sub>was (144): Put a code on your sign rider and point it at the current listing. When it sells, point it at the next one, and see which signs bring buyers in.</sub> | Real estate QR codes: one sign rider for every listing you'll have.<br><sub>was: One yard sign. Every listing you'll ever have.</sub> |
| 48 | `/industries/events` | conference qr codes / qr codes for event badges | QR Codes for Conferences: Badges, Agendas, Maps · EndureQR (58) **new**<br><sub>was: Dynamic QR codes for events · EndureQR (38)</sub> | Print QR codes on badges, posters and lanyards that always open the latest agenda, venue map or feedback form, even after the schedule changes. Start free. (155) **new**<br><sub>was (122): Codes on badges, posters and lanyards that always open the latest agenda, map or feedback form, even after the event ends.</sub> | Conference QR codes: the schedule changed, your badges didn't need to.<br><sub>was: The schedule changed. Your badges didn't need to.</sub> |
| 49 | `/industries/retail` | qr code on product packaging | QR Codes for Product Packaging and Retail · EndureQR (52) **new**<br><sub>was: Dynamic QR codes for retail · EndureQR (38)</sub> | Put QR codes on packaging, shelves and windows that open the right page today and next season. Edit the link after printing; see scans by city and device. (154) **new**<br><sub>was (105): Put codes on products, shelves and windows that open the right page today and the right page next season.</sub> | Packaging QR codes: the box lasts for years, and so should the link.<br><sub>was: Packaging lasts for years. Your links should too.</sub> |
| 50 | `/industries/healthcare` | qr codes in healthcare / patient form qr code | Healthcare QR Codes for Patient Forms and Leaflets (50) **new**<br><sub>was: Dynamic QR codes for healthcare · EndureQR (42)</sub> | QR codes on leaflets, waiting-room posters and appointment cards that always open the current form, guidance or booking page. Update them, no reprinting. (153) **new**<br><sub>was (122): Codes on leaflets, waiting-room posters and appointment cards that always open the current form, guidance or booking page.</sub> | Healthcare QR codes: patient leaflets that never point to an old form.<br><sub>was: Patient leaflets that never point to an old form.</sub> |
| 51 | `/industries/hotels` | hotel qr codes | Hotel QR Codes for Room Cards, WiFi and Check-Out · EndureQR (60) **new**<br><sub>was: Dynamic QR codes for hotels · EndureQR (38)</sub> | One QR code per room card for WiFi, breakfast hours, spa bookings and check-out. Change what it opens from your phone, with no reprinting. Start free. (150) **new**<br><sub>was (113): Wi-Fi details, breakfast hours, spa bookings and checkout: one code per room that you can change from your phone.</sub> | Hotel room QR codes that are always up to date.<br><sub>was: Every room card, always up to date.</sub> |
| 52 | `/industries/education` | qr codes for schools and teachers | QR Codes for Schools and Teachers: Reuse Every Term (51) **new**<br><sub>was: Dynamic QR codes for education · EndureQR (41)</sub> | QR codes on worksheets, noticeboards and textbooks that open this term's reading list, timetable or sign-up form. Update the link and keep the printout. (152) **new**<br><sub>was (110): Codes on worksheets, noticeboards and textbooks that open the current reading list, timetable or sign-up form.</sub> | QR codes for schools: handouts that point to this term, not last year's.<br><sub>was: Handouts that point to this term, not last year's.</sub> |
| 53 | `/industries/agencies` | qr code generator for agencies | QR Code Generator for Agencies: Codes by Client · EndureQR (58) **new**<br><sub>was: Dynamic QR codes for agencies · EndureQR (40)</sub> | Create QR codes for every campaign, sort them by client and send the analytics. Unlimited codes, $29 a year; if a client leaves, their codes keep working. (154) **new**<br><sub>was (127): Create codes for every campaign, organise them by client, and send the analytics. If a client leaves, their codes keep working.</sub> | QR codes for agencies: every client's codes in one place.<br><sub>was: Run every client's codes from one place.</sub> |
| 54 | `/alternatives/bitly` | bitly alternative / bitly qr code alternative | Bitly Alternative for QR Codes: $29 a Year, Unlimited Edits (59) **new**<br><sub>was: Bitly alternative · EndureQR (28)</sub> | Bitly Core is $120 a year for 5 QR codes and 5 edits a month. EndureQR Pro is $29 a year for unlimited codes, edits and scans; codes work if you cancel. (152) **new**<br><sub>was (128): Looking for a Bitly alternative? EndureQR is $29/year with unlimited codes and scans, and your codes keep working if you cancel.</sub> | The Bitly QR code alternative with unlimited edits after printing<br><sub>was: The Bitly alternative with unlimited edits after printing</sub> |
| 55 | `/alternatives/qrfy` | qrfy alternative | QRFY Alternative: Unlimited Dynamic QR Codes for $29 a Year (59) **new**<br><sub>was: QRFY alternative · EndureQR (27)</sub> | QRFY costs $228 a year, and cancelling locks you out of your codes and data. EndureQR Pro is $29 a year or $79 once, and codes keep working if you cancel. (154) **new**<br><sub>was (127): Looking for a QRFY alternative? EndureQR is $29/year with unlimited codes and scans, and your codes keep working if you cancel.</sub> | keep |

### Where each change lives (source, read only; not edited)

| Pages | Current source | Change |
|---|---|---|
| `/` | `app/layout.tsx:37` (default title), `:45` (OG title); `app/opengraph-image.tsx:7,79`; `(marketing)/page.tsx:23` (WebPage name); hero H1 component | New title and description; H1 "QR codes that keep working, even after you cancel."; OG text and alt to match; the guide OG alt at `guides/[slug]/page.tsx:36` too |
| `/pricing` | `pricing/page.tsx:12-13` (`title: "Pricing"` goes through the "%s · EndureQR" template) | Use `title: { absolute: … }`. In the description, drop "once for life" |
| `/qr-code-generator` | `qr-code-generator/page.tsx:17-18,57` | New title (49 chars + suffix = 60); description with "14 more types"; H1 |
| `/qr-code-with-logo`, `/dynamic-…`, `/app-download-…`, `/bulk-…` | `content/feature-pages.ts` (`title`, `description`, `h1`) | As in the table. The bulk H1 changes; the other three keep theirs |
| 17 type pages | `qr-code-generator/[type]/page.tsx:28` sets `{ absolute: page.title }`; strings in `content/qr-type-pages.ts` | Apply the same rule as guides: `page.title.length + 11 > 60 ? { absolute } : page.title`. That adds the suffix to the 11 "+brand" rows automatically. Change the strings for wifi, sms and whatsapp (title) and wifi and whatsapp (description) |
| 16 guides | `content/guides*.ts` `title`/`description` (the brand rule is already in `guides/[slug]/page.tsx:27`) | Only 6 descriptions change (trimmed to 155 or less). All titles stay |
| 8 industries | `industries/[slug]/page.tsx:46-47` builds `Dynamic QR codes for ${name}` and `fitDescription(intro, …)` | Add `seoTitle`, `metaDescription` and `h1` fields to each entry in `content/industries.ts`. Keep the slogan as the hero sub-line. Industry descriptions are 105–130 chars today because `fitDescription` drops the suffix |
| 2 alternatives | `alternatives/[slug]/page.tsx:31-32` | Add `seoTitle` and `metaDescription` to `content/competitors.ts`. Prices must come from the confirmed `price`/`pricePerYear` facts |
| `/terms`, `/privacy` | `content/legal.ts` `TERMS.title/description`, `PRIVACY.title/description` (used by `(legal)/*/page.tsx:5`) | Keep the H1s "Terms of Service" and "Privacy Policy". Change only `<title>` (absolute) and description |
| `/about`, `/contact` | `about/page.tsx:11-12`, `contact/page.tsx:9-10` | About: keep. Contact: keep the title and description; H1 "Contact EndureQR: talk to a person" |

**Wording rule check:**
- No proposed title, description or H1 contains "forever", "for life" or "never stop".
- "Never expires" or "no expiry" is used only on static-code pages: the generator hub and the 17 type pages.
- Dynamic pages say "keep working after you cancel".

---

## 3. Per-template above-the-fold fixes

### A. Homepage (`/`)
- **Promise wording.** Replace "QR codes that never stop working." in the H1, `<title>`, OG and alt text. Keep the "Live after you cancel" chip, which is accurate.
- **First input.** It sits at **y 4,404 on mobile** and 4,613 on desktop, and "Create free QR" (in the fold) goes to `/qr-code-generator`. Either embed a single URL input with a "Make my QR" button in the hero, or keep the link and accept that the homepage is a brand page (the title above assumes the latter).
- **Mock scan ticker.** The hero still shows a scan ticker. Label it "Example" (carried over from 2 Nov F7).

### B. Generator hub (`/qr-code-generator`)
- Pass `collapseTypes` with Link as the default, as the type pages do. That moves the first input from y 1,149 to about y 660 on mobile, and into the 900 px desktop fold.
- Add a sticky bottom bar on phones with a 64 px mini-preview and a "Download" button. Download is currently at y 2,945.
- Put two text links beside the type picker: "Need 50+ codes? Bulk from a CSV →" and "Want to edit it later? Your first dynamic code is free →".
- Add 3 example outputs (plain, brand colour plus logo, framed) as images with alt text.

### C. QR type pages (17, `qr-code-generator/[type]`)
- The input sits at y 660 on mobile, which is fine. Download is at y 2,456 to 2,767, so use the same sticky mini-preview and Download bar as B.
- **Grammar bug in the H2.** The site prints "How to make **a Instagram** QR code" and "How to make **a X (Twitter)** QR code". The cause is `[type]/page.tsx:67`, which tests only `/^(Email|SMS)$/`. Use `/^([AEIOU]|SMS$|X\b)/` so the output reads "an Instagram", "an SMS" and "an X".
- The sr-only H2 "Create your Contact card QR code" doesn't match the vCard keyword. Consider using the display name "vCard (contact card)".
- WiFi: add a "Print a table card" frame preset ("Scan to join WiFi" plus the network name).

### D. Feature landings (`feature-landing.tsx`: logo, dynamic, app download, bulk)
- **Logo:** put an "Upload your logo" button in the first screen, next to the type input at y 704, so the query's one action is visible. Add 2 or 3 example logo codes.
- **Dynamic:** aligned. Add the dashboard screenshot and a "What if EndureQR closes?" FAQ quoting the Terms.
- **App download:**
  - Hero form with App Store URL, Google Play URL and fallback URL fields.
  - CTA "Create your free app download code" routed to `/signup?next=…&from=app-download`. The current route is `plan=pro-yearly`.
  - A "Scan to download" framed example image.
- **Bulk:** a free static CSV-to-ZIP tool (preferred), or at minimum:
  - a "Download sample CSV" link;
  - a preview table;
  - "Pro feature · $29/yr · 14-day money-back" beside the CTA.

### E. Guides (16, `guides/[slug]`)
- **Current fold:** breadcrumb, H1, deck, author, date and TOC. That is good for informational intent.
- **Transactional guides:** on restaurant menu, WiFi, Google reviews, business card and how-to-make, add a one-line CTA box in the first screen, before the TOC, with the matching generator link. For example: "Make your menu QR now, free →" pointing to `/industries/restaurants#create`, or "Make a WiFi QR →" pointing to `/qr-code-generator/wifi`.
- **Restaurant guide:** link its "static or dynamic" section to `/industries/restaurants` with the anchor "QR code for restaurant menus".

### F. Industry pages (8, `industries/[slug]`)
- **H1:** lead with the keyword; the current slogan becomes the sub-line. All 8 are in the table.
- **Hero form:** "Paste the link this code should open" plus "Create free code". This uses the free dynamic code, routed through `signup?industry=…&next=…`. Today the hero has only "Start free" and "Make a free QR code".
- **Restaurants:** say plainly that menus are linked, not hosted. Add a framed table-tent image.
- **Schema:** add `Service` or `SoftwareApplication` with `Offer` (free, $29, $79) next to FAQPage and BreadcrumbList.

### G. Alternatives (2, `alternatives/[slug]`)
- Put "Try it free: unlimited static codes + 1 dynamic code, no card" under "Switch to EndureQR".
- Show "Prices checked 26 Oct 2026" in the fold.
- Add `SoftwareApplication` with `Offer` schema.
- Re-check the competitor prices before December, as `competitors.ts` itself asks.

### H. Pricing
- H1 with the keyword (see the table).
- Add a short "What dynamic QR codes cost elsewhere" row or table using only confirmed facts.
- Replace "Free forever. Account only for the dynamic code" with "Free, no time limit. Account only for the dynamic code".
- Replace the strip "Every plan: unlimited scans · codes never expire · no ads on your codes" with "… · static codes never expire · dynamic codes keep working if you cancel · …".

### I. About, contact and legal
- Metadata only. Optionally add `WebPage` schema to the legal pages.

### Copy to fix outside metadata (no-"forever" rule)

| Location | Current | Proposed |
|---|---|---|
| `components/sections/pricing-cards.tsx:50` | "Free forever. Account only for the dynamic code" | "Free, no time limit. Account only for the dynamic code" |
| `components/sections/generator.tsx:16` | "Free forever: no sign-up, no watermark…" | "Free: no sign-up, no watermark…" |
| `content/qr-type-pages.ts:222` | "No. They work forever, with unlimited scans." | "No. Email codes are static: they hold the address themselves, so they never expire and have no scan limit." |
| `pricing/page.tsx:13` | "$79 once for life" | Use the new description |
| `app/layout.tsx:37,45`, `opengraph-image.tsx:7,79`, `(marketing)/page.tsx:23`, `guides/[slug]/page.tsx:36` | "never stop working" | "keep working after you cancel" |
| `content/guides.ts:188` | "the code is wrong forever" | Fine as is: it describes a static code's fixed content, not a promise |

---

## Cross-skill follow-ups
- `/seo schema`: Offer schema on industry and alternative pages; WebPage schema on legal pages.
- `/seo content`: menu-hosting positioning on the restaurant page; a competitor price table on pricing.
- `/seo page`: the bulk page once a tool is added.

## Limitations
- **SERP data:**
  - WebSearch is not a live Google SERP. It gives no rank positions, PAA, ads, AI Overview, featured snippets or image or app packs. Results are US-only and up to 10 per query.
  - Standard-mode searches returned spam and mirror results for 2 queries, so every query was re-run in extended mode, and the type counts use those runs.
  - Competitor free-tier numbers come from result snippets and were not checked on the vendor sites.
- **Fold measurements:**
  - Taken on 4 Nov in Chromium mobile emulation (390×844), not on a real device.
  - The scratch outputs were lost when the run was interrupted. The coordinator confirmed nothing was deployed since, so the 4 Nov numbers stand.
  - The preview canvas selector didn't match, so live-preview positions are not reported. Download-button positions are.
- **No data:** there is no Search Console or keyword-volume data. Keyword assignments and persona weights are judgment, and I can't see which URL Google currently ranks for each query.
- **Not tested:** signup carry-over of a typed destination, whether the free dynamic code can use the iOS/Android split end to end (the plan matrix says yes), downloads and scanning.
- **Character counts:** counts are in characters, not pixels. Titles with "W" or "M"-heavy wording may still truncate near 580 px.

- **Line references:** file and line references point to commit `ba2cd8e`. When this report was finished, 13 files under `src/` had uncommitted edits made by someone else; this audit edited no project files. Re-check line numbers against the working tree.

## Structured findings (audit-data.json, Search Experience)
```json
{
  "category": "Search Experience",
  "sxo_gap_score": 62,
  "baseline": {"date": "2026-11-02", "sxo_gap_score": 64, "queries": 4, "like_for_like_now": 68},
  "pages": [
    {"url": "/qr-code-generator", "query": "free qr code generator", "serp_type": "Tool", "serp_confidence": 0.89, "page_type": "Tool", "mismatch": "ALIGNED", "score": 66},
    {"url": "/dynamic-qr-code-generator", "query": "dynamic qr code generator", "serp_type": "Tool/hybrid with free dynamic entry", "serp_confidence": 0.60, "page_type": "Hybrid with live input, first code free", "mismatch": "ALIGNED", "score": 67},
    {"url": "/qr-code-generator", "query": "qr code generator no expiration", "serp_type": "Tool", "serp_confidence": 0.78, "page_type": "Tool", "mismatch": "ALIGNED", "score": 65},
    {"url": "/qr-code-with-logo", "query": "qr code with logo", "serp_type": "Tool", "serp_confidence": 0.90, "page_type": "Tool", "mismatch": "ALIGNED", "score": 69},
    {"url": "/qr-code-generator/wifi", "query": "wifi qr code generator", "serp_type": "Tool (private)", "serp_confidence": 0.80, "page_type": "Tool", "mismatch": "ALIGNED", "score": 73},
    {"url": "/bulk-qr-code-generator", "query": "bulk qr code generator", "serp_type": "Free bulk tool", "serp_confidence": 0.78, "page_type": "Landing page (paid CTA, no input)", "mismatch": "HIGH", "score": 52},
    {"url": "/app-download-qr-code", "query": "app download qr code", "serp_type": "Hybrid with inline form", "serp_confidence": 0.70, "page_type": "Landing page (no input, pro-yearly CTA)", "mismatch": "MEDIUM", "score": 58},
    {"url": "/industries/restaurants", "query": "qr code for restaurant menu", "serp_type": "Menu product/solution page", "serp_confidence": 0.89, "page_type": "Landing page (guide also competes as Blog Post)", "mismatch": "HIGH", "score": 49},
    {"url": "/alternatives/bitly", "query": "bitly alternative", "serp_type": "Comparison/alternative page", "serp_confidence": 0.78, "page_type": "Comparison", "mismatch": "ALIGNED", "score": 63},
    {"url": "/pricing", "query": "qr code generator pricing", "serp_type": "Split: pricing page / comparison article", "serp_confidence": 0.55, "page_type": "Product/pricing", "mismatch": "MEDIUM", "score": 62}
  ],
  "findings": [
    {"id": "S1", "severity": "high", "title": "Bulk page is a paid-only landing page; SERP is free in-browser bulk tools"},
    {"id": "S2", "severity": "high", "title": "Restaurant-menu query served by a guide; SERP is menu products; retarget /industries/restaurants with a hero form"},
    {"id": "S3", "severity": "medium", "title": "App download page: no store-URL form; free action routed to /signup?plan=pro-yearly"},
    {"id": "S4", "severity": "medium", "title": "'never stop working' / 'Free forever' / 'for life' / 'work forever' claims exceed the Terms promise"},
    {"id": "S5", "severity": "medium", "title": "Weak or truncated titles: pricing (18), alternatives (27-28), 8 industry, 2 legal, generator hub (64); 6 guide descriptions over 155, 10 industry/legal under 140"},
    {"id": "S6", "severity": "medium", "title": "Generator hub input at y1149 mobile; downloads 2.5-3 screens down on all tool pages"},
    {"id": "S7", "severity": "low", "title": "Type-page H2 grammar: 'a Instagram', 'a X (Twitter)'"},
    {"id": "S8", "severity": "low", "title": "Zero images in <main> on all non-home pages measured"}
  ],
  "metadata_proposal": "docs/seo-audit/endureqr-2026-11-04/metadata-proposal.json"
}
```

*Generate a PDF report? Use `/seo google report`.*

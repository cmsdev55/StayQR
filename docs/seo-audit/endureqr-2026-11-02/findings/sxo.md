# SXO findings: EndureQR

Date: 2026-11-02 · Site: https://endureqr.com (owned domain; the baseline ran on endureqr.vercel.app)
Baseline: `../../endureqr-2026-10-27/findings/sxo.md` (SXO Gap Score 61 over 3 queries)

| Query | Our matching page |
|---|---|
| "dynamic qr code generator" | /dynamic-qr-code-generator |
| "free qr code generator" | /qr-code-generator |
| "wifi qr code generator" | /qr-code-generator/wifi |
| "qr code generator no expiration" | /qr-code-generator (best match; the homepage and /guides/do-qr-codes-expire also compete) |

**This SXO Gap Score is separate from the SEO Health Score.**

## Method
- **Rendering.** The `render_page.py` runtime was not installed (`claude-seo doctor`: "setup required, managed environment is missing"). I did not run `/seo setup`, because it downloads packages and a browser. Instead, the pages were rendered with the already-cached Playwright `chrome-headless-shell` (build 1248), driven over CDP. Each page was measured at 390×844 (mobile emulation, DPR 2) and 1440×900, after the load event plus a 3-second wait. Positions are document y in CSS px.
- **Sources.** Page facts were cross-checked against `crawl.json` (2026-11-02 20:29) and the source code in `src/`. The source was read only, not changed.
- **SERPs.** WebSearch in extended mode, US only, 10 results per query. Page types follow `page-type-taxonomy.md`.

## SXO Gap Score: 64 / 100

The score is the unweighted average of the four page scores.

| Query → page | SERP dominant type | Our type | Mismatch | Score | Baseline |
|---|---|---|---|---|---|
| dynamic → /dynamic-qr-code-generator | Tool with a free or trial dynamic entry (60%) | Landing page with a lead-capture input (pseudo-tool) | **MEDIUM** (was HIGH) | **60** | 54 |
| free → /qr-code-generator | Tool (89%) | Tool | ALIGNED | **66** | 64 |
| wifi → /qr-code-generator/wifi | Private, in-browser tool (80%) | Tool | ALIGNED | **68** | not scored |
| no expiration → /qr-code-generator | Tool that promises "no expiration" (78%) | Tool, but the promise is not in the title or H1 | ALIGNED on type, MEDIUM on intent wording | **62** | n/a |

The baseline score (61) included /guides/do-qr-codes-expire, which is not in this set. Comparing like for like on the two repeated queries: dynamic went from 54 to 60, and free went from 64 to 66.

**Primary finding: the "tool-first dynamic page" commit (bebced0) only partly resolves the baseline HIGH mismatch.**
- **What's fixed:** a destination input now sits above the fold (y 660 mobile, 627 desktop), and the "14-day money-back guarantee" sits beside it.
- **What isn't:**
  - The input is not a working generator. The QR beside it is a fixed placeholder that encodes `https://endureqr.com/r/yourcode`, which returns **404** if scanned, and it never changes as you type.
  - Nothing can be styled or downloaded.
  - "Create this dynamic code" still goes straight to `/signup?plan=pro-yearly&from=dynamic-try`, a paid plan.
- **What competitors offer:** 5 of the 6 tool or hybrid results give a free or trial dynamic code (Hovercode 3, TQRCG 2, qrcodedynamic, imqrscan, QRCG 14-day trial).

The severity drops from HIGH to MEDIUM, but the free-tier evaluator still has no way in without paying.

---

## 1. "dynamic qr code generator" → /dynamic-qr-code-generator

### SERP (10 results)
| # | Result | Type | Notes |
|---|---|---|---|
| 1 | hovercode.com | Tool | "Free Dynamic QR Codes, No Expiry"; free plan includes dynamic codes |
| 2 | hovercode.com/blog/best-dynamic-qr-generators | Comparison | "We tried the 14 best" |
| 3 | play.google.com DynamicQR | App | Edit destination, scan analytics |
| 4 | kobedigital.com top dynamic tools | Comparison | |
| 5 | qr-code-generator.com/solutions/dynamic-url-qr-code | Hybrid | 14-day free trial |
| 6 | the-qrcode-generator.com/dynamic-qr-code | Tool | 2 free dynamic codes that never expire |
| 7 | the-qrcode-generator.com | Tool | Same domain |
| 8 | qrcodedynamic.com | Tool | "Free & Dynamic" |
| 9 | imqrscan.com/dynamic-qr-code-generator | Tool | "Free Dynamic"; password, expiry, logo |
| 10 | alternativeto.net | Directory | |

- **Consensus:** Tool or hybrid 60%, comparison 20%, app 10%, directory 10%.
- **Free entry:** 4 of 6 tool titles say "Free". 5 of 6 offer a free dynamic code or a trial.
- **SERP features:** not observable through WebSearch (see Limitations).

### Our page now (measured)
- **Hero:**
  - H1 at y 188 mobile, 220 desktop.
  - Input `dyn-dest` at 660 / 627.
  - "Create this dynamic code" at 724 / 691. It is disabled until the input holds a valid URL.
  - "Make a free static one" goes to /qr-code-generator/url.
  - The note "Pro from $29 a year · 14-day money-back guarantee · codes keep working if you cancel" is above the fold.
- **Placeholder QR:** at y 934 on mobile, which is below the fold. It is decorative, and it scans to a 404.
- **Size and assets:** 1,389 rendered words. 0 images. Schema: BreadcrumbList, SoftwareApplication, FAQPage.
- **Mobile horizontal overflow:** the layout viewport is **498 px on a 390 px phone**, so the page scrolls sideways. A horizontal scrollbar is visible.
  - **Cause:** in `components/content/feature-landing.tsx:105`, the "In depth" grid has no base column template. Its child (`flex max-w-[68ch]`) keeps `min-width:auto` and stretches to the table's `min-w-[480px]` (`blocks.tsx:25`): 16 + 480 + 2 = 498. The table's `overflow-x-auto` wrapper never engages.
  - The guide template uses the same grid pattern (`guides/[slug]/page.tsx:90`), so guides with tables are probably affected too. The other feature pages, which share 7 tables, are likely affected as well.
- **Continuity:** the business-continuity commitment (90 days' notice, export of every destination, transfers with a sale) exists only in `/terms` (`content/legal.ts:85`). It is not on this page.

### What top results offer above the fold that we don't
1. A real code you can create and scan, free or on a trial, before paying (Hovercode, TQRCG, qrcodedynamic, imqrscan).
2. Scan analytics as the feature people see first, often with a dashboard image. Ours appears only as an H3 card at y 1,431 on mobile, with no screenshot.
3. A "No Expiry" claim in the title (Hovercode). Ours says "codes keep working if you cancel" in small print.

### User stories
1. As a **free-tier evaluator**, I want to make and scan one dynamic code before paying, because every other result lets me. I'm blocked by **commitment and price sensitivity**: the "Create" button goes to a $29 yearly signup.
   *(Signals: "Free" in Hovercode, TQRCG, qrcodedynamic and imqrscan titles; QRCG's 14-day trial.)*
2. As a **switcher burned by deactivation**, I want proof that printed codes survive cancellation and the vendor itself. I'm blocked by a **trust gap**: every vendor says "no expiry".
   *(Signals: Hovercode "No Expiry"; TQRCG "never expire"; QR Tiger's lower-tier 100-scan cap mentioned in the result summary.)*
3. As a **comparison shopper**, I want to see EndureQR's caps and price next to Hovercode, QR Tiger and QRCG. I'm blocked by **comparison fatigue**.
   *(Signals: 2 of 10 results are "best dynamic generators" listicles; alternativeto.)*
4. As an **analytics-driven marketer**, I want to see what scan data I'll get. I'm blocked by an **information gap**: there's no analytics screenshot.
   *(Signals: the DynamicQR app and imqrscan feature lists; QRCG "track".)*

### Persona scores
| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Comparison shopper | 14 | 15 | 12 | 15 | **56** | Needs work |
| Free-tier evaluator | 15 | 20 | 15 | 9 | **59** | Needs work (was 52) |
| Analytics-driven marketer | 20 | 15 | 12 | 16 | **63** | Good |
| Switcher burned by deactivation | 23 | 21 | 14 | 18 | **76** | Good (was 73) |

- **Comparison shopper (weakest).** The page has only an own-plan pricing table, low in the body. The homepage's competitor price table is still not here.
  - **Fix:** add an H2 "EndureQR vs Hovercode, QR Tiger and QR Code Generator PRO" below "Static and dynamic codes compared". Give free dynamic codes, scan caps, yearly price and "what happens when you cancel" a column each, with dated sources, using the same pattern as /alternatives/bitly.
- **Free-tier evaluator.** Action is 9/25.
  - **Fix (best):** create a real dynamic code with a 7-day free trial, or 1 free dynamic code, before card details are taken.
  - **Fix (minimum):** make the preview live. Encode a real reserved short link once the user types, and show the full logo and colour generator (`GeneratorApp`) in dynamic mode. Ask for a plan only at "Save & get short link". Never render a scannable QR that resolves to a 404.
- **Analytics marketer.** **Fix:** add 2 dashboard screenshots ("Edit destination", "Scan heatmap") directly under the hero, with alt text.
- **Switcher.** **Fix:** add an FAQ, "What if EndureQR shuts down?", that quotes the /terms commitment (90 days' notice, export of all destinations, transfers on a sale) and links to /terms#cancelling.

### Gap score: 60 / 100
| Dimension | Score | Evidence |
|---|---|---|
| Page type | 9/15 | An input is above the fold (up from 6), but there's no functional generator, no output and a paid-only path |
| Content depth | 13/15 | 1,389–1,503 words; how it works, static vs dynamic table, included features, cancel policy, pricing, FAQ (6) |
| UX signals | 10/15 | Input and guarantee are above the fold; preview is not live; button is disabled until valid; 108 px horizontal scroll on mobile |
| Schema | 13/15 | SoftwareApplication with Offers, FAQPage, BreadcrumbList |
| Media | 3/15 | 0 images; no dashboard or analytics visuals |
| Authority | 5/15 | Owned domain now (was vercel.app); continuity commitment exists but only in /terms; no reviews |
| Freshness | 7/10 | Current pricing; no visible date |

---

## 2. "free qr code generator" → /qr-code-generator

### SERP (10 results)
| # | Result | Type |
|---|---|---|
| 1 | adobe.com/express/feature/image/qr-code-generator | Tool ("Custom, Branded"; static only) |
| 2 | wix.com/wixel/qr-code-generator | Tool |
| 3 | hovercode.com | Tool (3 free dynamic codes) |
| 4 | qrcode-monkey.com | Tool ("with Logo") |
| 5 | hovercode.com/qr-code-generator-with-logo | Tool ("Free, No Sign Up") |
| 6 | quickchart.io/bulk-qr-code-generator | Tool (bulk, ZIP) |
| 7 | the-qrcode-generator.com | Tool (2 free dynamic codes) |
| 8 | app.flowcode.com/free-qr-code-generator | Tool |
| 9 | alternativeto.net | Directory |
| 10 | bandcamp track | Noise (excluded) |

- **Consensus:** Tool, 89% (8 of 9).
- **Free dynamic codes on a free-intent query:** 3 of 8 tools (Hovercode, TQRCG, Flowcode) lead with them.
- **Mismatch:** ALIGNED.

### Our page now (measured)
- **Hero and inputs:**
  - H1 at y 171 on mobile.
  - The 17-type picker is expanded here. It folds only on type pages.
  - So the first input is at **1,149 mobile** (better than the baseline's 1,806, but still below the 844 fold) and **971 desktop** (below the 900 fold, unchanged).
- **Preview and download:** the controls-first change moved the preview to **y 2,519 on mobile**, about 3 screens down. The download button sits below it. The preview has no sticky or mini version on phones (`lg:sticky` is for desktop only).
- **Logo step:** at 2,043 mobile and 1,769 desktop (was 2,782 / 1,851).
- **Size, schema and links:** 707–852 words. 0 images. Schema: BreadcrumbList, WebApplication (price 0), FAQPage, which includes "Do the QR codes expire?". The page links to /bulk-qr-code-generator and /dynamic-qr-code-generator.

### What top results offer above the fold that we don't
- **An input and a live code in the first screen.** QRCode Monkey, Adobe and Hovercode do this on desktop and mobile.
- **Example branded outputs.** Adobe and QRCode Monkey show visual examples; we have 0 images.
- **A free dynamic option** (Hovercode, TQRCG, Flowcode).

### User stories
1. **No-strings one-off maker:** wants a static code with no watermark and no expiry right now. Blocked by a **trust gap** about which tools are truly static.
   *(Signals: "No Sign Up" (Hovercode); Adobe described as static only; "never expire" vocabulary.)*
2. **Brand-conscious SMB:** wants a logo and colours. Blocked by **technical confusion** about whether a logo breaks scanning.
   *(Signals: QRCode Monkey "with Logo"; Adobe "Custom, Branded"; Hovercode's logo page ranking on the head term.)*
3. **Dynamic-curious user:** wants a free code they can edit later. Blocked by **price sensitivity**.
   *(Signals: Hovercode, TQRCG and Flowcode free dynamic tiers ranking for "free".)*
4. **Volume maker:** needs many codes at once. Blocked by **time**.
   *(Signal: QuickChart's bulk generator is in the top 10.)*

### Persona scores
| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Volume maker | 12 | 10 | 15 | 12 | **49** | Needs work |
| Dynamic-curious user | 14 | 14 | 15 | 11 | **54** | Needs work |
| Brand-conscious SMB | 20 | 14 | 15 | 19 | **68** | Good |
| No-strings one-off maker | 23 | 18 | 19 | 19 | **79** | Good |

- **Volume maker (weakest).** The bulk link exists but is nowhere near the tool.
  - **Fix:** add a text link beside the type picker: "Need 50+ codes? Bulk generator from a CSV →" pointing to /bulk-qr-code-generator.
- **Dynamic-curious user.** "Make it dynamic" appears only after a download, and only for web links.
  - **Fix:** add a static/dynamic toggle in step 1. The dynamic side should explain the trial or free dynamic code (see F1).
- **Brand SMB.**
  - **Fix:** add an "Add logo" shortcut next to the type picker.
  - **Fix:** show 3–4 example outputs (plain, brand colour, logo, frame) as images with alt text.
- **One-off maker.**
  - **Fix:** fold the 17-type picker on this page too, defaulting to Link, so the input sits at about y 660 on mobile. Use `collapseTypes`, as the type pages do.
  - **Fix:** add a sticky mini-preview with a "Download" button on phones.

### Gap score: 66 / 100
| Dimension | Score | Evidence |
|---|---|---|
| Page type | 15/15 | Working tool with no login and no watermark; WebApplication schema |
| Content depth | 11/15 | 852 words; good FAQ; no use-case or example section |
| UX signals | 10/15 | Input below the fold on both viewports; preview and download about 3 screens down on mobile |
| Schema | 12/15 | No `featureList` or `screenshot` |
| Media | 6/15 | 0 images |
| Authority | 5/15 | Owned domain; brand-heavy SERP (Adobe, Wix); no reviews |
| Freshness | 7/10 | n/a for tools; no date |

---

## 3. "wifi qr code generator" → /qr-code-generator/wifi

### SERP (10 results)
| # | Result | Type | Notes |
|---|---|---|---|
| 1 | apps.apple.com WiFi QR Code Generator | App | |
| 2 | qr-code-generator.com/solutions/wifi-qr-code | Tool | Never expires unless router changes; "Hidden" checkbox |
| 3 | vuzix.com/pages/wifi-qr-generator | Tool | |
| 4 | kleap.co/qr-code-wifi | Tool | "Instant & No Login"; PNG/SVG; WPA3 |
| 5 | wifiqr.io | Tool | "Free & Private"; "network name and password never leave your device" |
| 6 | wiqrcode.com | Tool | "100% Private, No Signup"; warns password change breaks codes |
| 7 | toolbay.leviro.net | Tool | |
| 8 | smartscanai.online | Tool | "Share Your WiFi Password"; iOS 11+/Android native |
| 9 | horusvalley.com | Tool | |
| 10 | apps.apple.com (mz) | App | Duplicate |

- **Consensus:** Tool, 80%. Apps make up 20%.
- **Privacy:** "Private" or "never leave your device" appears in 2 of 8 tool titles and is a top claim in snippets.
- **Mismatch:** ALIGNED.

### Our page now (measured)
- **Inputs:** SSID at y **660 mobile** (in the fold, thanks to the folded picker; screenshot verified) and 637 desktop. Password at 757; security select at 854.
- **Preview:** at **2,290 mobile** and 539 desktop.
- **Content and schema:** 878–1,048 words: 4 steps, 4 use cases, security tips, and an FAQ that covers iPhone scanning, security and password changes. Schema: WebApplication, FAQPage, BreadcrumbList.
- **Resolved since baseline:** "Make it dynamic" now shows only for http(s) data (`generator-app.tsx:84`), so WiFi users no longer see it.
- **Still missing:** nothing on the page says the password stays in the browser. The claim exists only in /privacy (`legal.ts:126, 145`) and a guide (`guides-basics.ts:430`). The title "WiFi QR Code Generator: Free, No Sign-Up" has no "Private".

### What top results offer above the fold that we don't
- **"100% private / never leaves your device" next to the password field** (wifiqr.io, wiqrcode).
- **The code visible beside the inputs on mobile.** Ours is about 1,450 px below the security select.

### User stories
1. **Privacy-cautious host:** doesn't want to type a router password into a website. Blocked by a **trust gap**.
   *(Signals: wifiqr.io "Free & Private" and "never leave your device"; wiqrcode "100% Private".)*
2. **Hospitality owner:** wants a printable table or door sign. Blocked by **time and design effort**.
   *(Signals: QRCG and Smart Scan AI "Share your WiFi password"; café and rental framing.)*
3. **Quick home user:** wants it done in 30 seconds. Blocked by **friction**.
   *(Signals: kleap "Instant & No Login".)*
4. **App seeker:** looks for an app. Blocked by **not knowing the browser works on a phone**.
   *(Signal: 2 App Store results.)*

### Persona scores
| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| App seeker | 10 | 12 | 15 | 15 | **52** | Needs work |
| Privacy-cautious host | 22 | 10 | 9 | 20 | **61** | Good |
| Hospitality owner | 21 | 17 | 16 | 15 | **69** | Good |
| Quick home user | 23 | 20 | 17 | 17 | **77** | Good |

- **App seeker (weakest).** **Fix:** add to the intro: "Works in your phone's browser, no app to install. iPhone and Android cameras join automatically."
- **Privacy host.** This is the systemic Trust gap.
  - **Fix:** directly under the password field, add "Your password never leaves this browser. Nothing is sent to EndureQR." and link to /privacy#free-generator.
  - **Fix:** retitle the page "WiFi QR Code Generator: Free, Private, No Sign-Up".
- **Hospitality owner.**
  - **Fix:** add a "Print a table card" preset: a frame with the text "Scan to join WiFi" plus the network name.
  - **Fix:** show one example image of a printed card.
- **Quick user.** **Fix:** use the sticky mini-preview with Download on phones (same fix as section 2).

### Gap score: 68 / 100
| Dimension | Score | Evidence |
|---|---|---|
| Page type | 15/15 | Tool; input above the fold on both viewports |
| Content depth | 13/15 | Steps, use cases, security, FAQ |
| UX signals | 11/15 | Fast first input; output and download far below on mobile |
| Schema | 12/15 | WebApplication, FAQ, Breadcrumb |
| Media | 5/15 | 0 images; no printed-sign example |
| Authority | 5/15 | No privacy claim on the page where it matters |
| Freshness | 7/10 | n/a |

---

## 4. "qr code generator no expiration" → /qr-code-generator

### SERP (10 results)
| # | Result | Type | Notes |
|---|---|---|---|
| 1 | qrcode-tiger.com/qr-code-generator-with-no-expiration-limit | Comparison | "7 Best … No Expiration Limit" |
| 2 | guestcam.co/free-tools/qr-code-generator | Tool | "No Sign-Up, No Expiration" |
| 3 | qrplanet.com | Tool | Warns dynamic codes die if the server goes offline |
| 4 | adobe.com/express … | Tool | "never expire" (static) |
| 5 | qr-creator.com | Tool | No expiry set, but "cannot guarantee" |
| 6 | myforeverqr.com | Tool | "Forever Static" |
| 7 | qrcake.com/qr-code-generator-no-expiry | Tool | "With No Expiration"; 5 free dynamic codes with no expiry or scan limit |
| 8 | thefreeqrcodegenerator.com | Tool | Static |
| 9 | me-qr.com blog "best free … no sign-up" | Comparison | |
| 10 | github | Noise (excluded) | |

- **Consensus:** Tool, 78% (7 of 9). Comparison listicles make up 22%.
- **Title wording:** 4 of 9 titles put "No Expiration", "No Expiry" or "Forever" in the title.

### Our page vs the SERP
- **Type:** ALIGNED (tool).
- **Wording:**
  - The title and H1 ("Free QR Code Generator: No Sign-Up, No Watermark" / "Free QR code generator.") don't use the query's words.
  - "Static codes never expire" appears in the meta description and the FAQ.
  - On desktop, "Static · never expires · no watermark" is above the fold. On mobile, only a truncated intro is.
- **Cannibalisation risk:** three pages could compete for this query.
  - The homepage title is "Dynamic QR codes that never stop working", but it's a landing page whose first input is at y 4,404 on mobile.
  - /guides/do-qr-codes-expire is a blog post.
  - If Google picks the homepage, this becomes a **HIGH** mismatch.
- **Differentiator not shown:** EndureQR's real advantage is that static codes never expire, dynamic codes survive cancellation, and there is a 90-day export commitment. None of this appears on the page this query lands on.

### User stories
1. **Print-once buyer:** wants a code that can't be switched off. Blocked by a **trust gap**.
   *(Signals: myforeverqr "Forever Static"; guestcam "No Expiration".)*
2. **Burned-by-expiry switcher:** wants a guarantee, not marketing. Blocked by **trust**.
   *(Signals: QR Creator "cannot guarantee"; QR Planet's server-offline warning.)*
3. **Free-dynamic, no-expiry seeker:** wants editable and permanent for free. Blocked by **price**.
   *(Signal: qrcake's 5 free dynamic codes with no expiry.)*
4. **List comparer:** wants a ranked list. Blocked by **comparison fatigue**.
   *(Signals: QR Tiger "7 Best"; me-qr "Best Free".)*

### Persona scores
| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Free-dynamic, no-expiry seeker | 12 | 12 | 14 | 8 | **46** | Needs work |
| List comparer | 10 | 12 | 12 | 14 | **48** | Needs work |
| Burned-by-expiry switcher | 18 | 12 | 12 | 14 | **56** | Needs work |
| Print-once buyer | 20 | 15 | 17 | 19 | **71** | Good |

- **Free-dynamic seeker (weakest).** **Fix:** same as F1, a free or trial dynamic path. Then add the line "Dynamic codes never expire either, even if you cancel" under the generator, linking to /dynamic-qr-code-generator#if-you-cancel.
- **List comparer.** **Fix:** add the "What happens to your codes when you cancel" provider table (baseline F4) to /guides/do-qr-codes-expire, and link it from the generator FAQ.
- **Switcher.** **Fix:** add a "Will my code ever stop working?" block under the preview:
  - Static: it holds the content itself and works without EndureQR.
  - Dynamic: it keeps working after you cancel, with 90 days' notice and a full export if the service ever closes.
  - Link to /terms#cancelling.
- **Print-once buyer.**
  - **Fix:** change the title to "Free QR Code Generator: No Sign-Up, No Watermark, Never Expires".
  - **Fix:** put "never expire" in the H1 intro's first clause so it shows on the mobile fold.

### Gap score: 62 / 100
| Dimension | Score | Evidence |
|---|---|---|
| Page type | 13/15 | Tool aligned; query wording missing; three pages compete |
| Content depth | 10/15 | Expiry FAQ only; no explanation on this page of why codes expire |
| UX signals | 9/15 | Promise not in title or H1; mobile fold doesn't show it |
| Schema | 12/15 | As in section 2 |
| Media | 6/15 | 0 images |
| Authority | 5/15 | Continuity guarantee hidden in /terms |
| Freshness | 7/10 | n/a |

---

## Findings (ordered by severity)

### F1. MEDIUM (was HIGH): the dynamic page is still a pseudo-tool with a paid-only path, and its preview QR scans to a 404
- **Query:** dynamic qr code generator. Secondary: no expiration.
- **Evidence:**
  - Input above the fold at y 660/627.
  - The QR is a fixed placeholder for `endureqr.com/r/yourcode`, which returns HTTP 404 (`dynamic-try.tsx:17-18`).
  - "Create this dynamic code" goes to `/signup?plan=pro-yearly`.
  - 5 of 6 SERP tools offer a free or trial dynamic code.
  - Free-tier evaluator persona: 59 (Action 9).
- **Fix:**
  - Offer a 7-day trial or 1 free dynamic code before card details are taken.
  - Make the preview live, with the real reserved short link, and embed `GeneratorApp` in dynamic mode (logo, colours, frame).
  - Gate the plan at "Save & get short link".
  - Until then, render the placeholder non-scannable or blurred, labelled "Preview".

### F2. MEDIUM: horizontal scroll on mobile on the dynamic page and probably other feature pages
- **Query:** dynamic qr code generator.
- **Evidence:**
  - At 390 px, innerWidth and scrollWidth are 498.
  - A horizontal scrollbar is visible in the screenshot.
  - Cause: the "In depth" grid item in `feature-landing.tsx:105` keeps `min-width:auto` around a `min-w-[480px]` table (`blocks.tsx:25`).
- **Fix:**
  - Add `min-w-0` to the grid children, or `grid-cols-[minmax(0,1fr)]` at the base breakpoint.
  - Apply the same to `guides/[slug]/page.tsx:90`.
  - Re-check every page that has a table at 390 px.
  - The homepage overflows by 16 px (406) because of a decorative glow at `w-[min(1100px,120%)]`. Clip it with `overflow-x-clip` on its section.

### F3. MEDIUM: the generator's input is below the fold on /qr-code-generator, and the output is 3 screens down on mobile
- **Queries:** free, no expiration, wifi.
- **Evidence:**
  - First input at 1,149 mobile and 971 desktop.
  - Preview at 2,519 mobile on /qr-code-generator and 2,290 on /wifi.
  - No sticky preview on phones.
- **Fix:**
  - Use `collapseTypes` on /qr-code-generator with Link as the default.
  - Add a sticky bottom bar on phones with a 64 px mini-preview and a "Download" button.

### F4. MEDIUM: the WiFi page never says the password stays in the browser
- **Query:** wifi qr code generator.
- **Evidence:** 2 of 8 SERP tools lead with "Private" or "never leave your device". The claim exists only in /privacy and a guide. Privacy host Trust is 9/25.
- **Fix:**
  - Add a microcopy line under the password field.
  - Change the title to "WiFi QR Code Generator: Free, Private, No Sign-Up".
  - Add "Works in your phone's browser, no app needed" to the intro.

### F5. MEDIUM: the "no expiration" intent is under-served, and the continuity guarantee is buried in /terms
- **Queries:** no expiration, dynamic.
- **Evidence:**
  - 4 of 9 SERP titles say "No Expiration" or "Forever".
  - Our title and H1 don't.
  - The 90-day-notice and export commitment exists only at `legal.ts:85`.
  - The homepage ("never stop working") competes with the tool page.
- **Fix:**
  - Add "Never Expires" to the /qr-code-generator title.
  - Add a "Will my code ever stop working?" block and FAQ to the generator, dynamic and pricing pages, quoting /terms.
  - Link the homepage hero's "never stop working" claim to /qr-code-generator with exact anchor text.

### F6. LOW: no media on a visual category
- **Evidence:** 0 `<img>` on all four target pages. The homepage has 6.
- **Fix:**
  - Add example outputs to /qr-code-generator.
  - Add 2 dashboard screenshots to the dynamic page.
  - Add a printed WiFi card example to /wifi.

### F7. LOW: the homepage hero shows an unlabelled mock "Scanned in Lahore, PK · iPhone · just now · #12,409" counter
- **Evidence:** the counter is hard-coded and starts at 12,409 (`hero-visual.tsx:56,140`) on a new site. It reads as real usage.
- **Fix:** label it "Example" or "Demo", or replace it with real aggregate numbers once they exist.

### Resolved since 27 Oct
- **Owned domain.** The site and short links now use endureqr.com.
- **Refund guarantee.** "14-day money-back guarantee" now sits beside the dynamic CTA, and the payment notices repeat it.
- **Type pages.** The type picker is folded, so the WiFi input is at y 660 on mobile.
- **Logo step.** Moved up: 2,043 mobile (was 2,782).
- **WiFi upsell.** The "Make it dynamic" upsell no longer appears for WiFi or other non-URL codes.

## Limitations
- **Rendering:** `render_page.py` and `parse_html.py` could not run, because the managed runtime is not set up and I did not run `/seo setup`. Rendering used the cached Playwright headless Chromium over CDP instead. Fold positions come from Chromium mobile emulation, not a real device.
- **SERP data:**
  - WebSearch is not a live Google SERP: it shows no rank positions, PAA, ads, AI Overview, featured snippets or image packs.
  - Results are US only and limited to 10 per query.
  - Free-tier facts come from vendor snippets and were not re-verified on vendor sites.
- **No traffic data:** without Search Console or volume data, persona weights are judgment, and I can't tell which page Google actually ranks for "no expiration".
- **Not tested:** downloads, scanning, the sign-up and checkout carry-over of the pending destination, and the guide pages for the table overflow (inferred from the shared grid pattern).
- **Screenshot anomaly:** the /qr-code-generator mobile screenshot was captured scrolled to the type picker. It could be a load-time scroll or an artifact of the measuring tab. Positions above are document coordinates and are not affected.

## Structured findings (audit-data.json, Search Experience)
```json
{
  "category": "Search Experience",
  "sxo_gap_score": 64,
  "baseline": {"date": "2026-10-27", "sxo_gap_score": 61},
  "pages": [
    {"url": "/dynamic-qr-code-generator", "query": "dynamic qr code generator", "serp_type": "Tool (free/trial dynamic)", "serp_confidence": 0.60, "page_type": "Landing Page (pseudo-tool input)", "mismatch": "MEDIUM", "score": 60},
    {"url": "/qr-code-generator", "query": "free qr code generator", "serp_type": "Tool", "serp_confidence": 0.89, "page_type": "Tool", "mismatch": "ALIGNED", "score": 66},
    {"url": "/qr-code-generator/wifi", "query": "wifi qr code generator", "serp_type": "Tool (private, in-browser)", "serp_confidence": 0.80, "page_type": "Tool", "mismatch": "ALIGNED", "score": 68},
    {"url": "/qr-code-generator", "query": "qr code generator no expiration", "serp_type": "Tool", "serp_confidence": 0.78, "page_type": "Tool", "mismatch": "ALIGNED (intent wording MEDIUM)", "score": 62}
  ],
  "findings": [
    {"id": "F1", "severity": "medium", "title": "Dynamic page: pseudo-tool, paid-only path, placeholder QR scans to 404"},
    {"id": "F2", "severity": "medium", "title": "Horizontal scroll at 390px on dynamic page (grid min-width + 480px table)"},
    {"id": "F3", "severity": "medium", "title": "/qr-code-generator input below fold; preview ~3 screens down on mobile"},
    {"id": "F4", "severity": "medium", "title": "WiFi page lacks on-page privacy claim"},
    {"id": "F5", "severity": "medium", "title": "'No expiration' intent under-served; continuity guarantee only in /terms"},
    {"id": "F6", "severity": "low", "title": "Zero images on all four target pages"},
    {"id": "F7", "severity": "low", "title": "Unlabelled mock scan counter in homepage hero"}
  ]
}
```

*Generate a PDF report? Use `/seo google report`.*

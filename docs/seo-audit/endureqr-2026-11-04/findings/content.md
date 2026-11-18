# Content Quality and E-E-A-T: EndureQR (4 Nov 2026)

- Site: https://endureqr.com. The domain went live on 2 Nov 2026.
- Previous audit: 2 Nov 2026, which scored 69.
- Method:
  - All 55 URLs were fetched live with `render_page.py --mode never`. Every page was server-rendered (`is_spa: false`).
  - Main text was taken from `<main>`, with script, style and svg removed.
  - Readability was scored with Flesch (FRE) and Flesch-Kincaid grade (FKGL) on prose lines. Duplication was measured as 5-word-shingle Jaccard similarity.
  - Templated metadata was checked with `metadata_template.py --pairs-file` across all 55 pages.
  - Sources read: `src/content/*.ts` and the page templates. No project files were edited.
- **Note:** another agent was editing JSON-LD in the page templates while this audit ran. Those diffs are schema-only and change none of the findings below.

## Score: 74 / 100 (was 69)

| Component | Weight | Score | Notes |
|---|---|---|---|
| E-E-A-T | 30% | 57 | The founder is now named on About, in the guide bylines, Terms and Privacy. There is still no first-hand evidence, external profile, legal entity or address. |
| Depth / thin content | 15% | 70 | Contact, About, Pricing, industry pages and alternatives pages are still thin for their intent. |
| Accuracy of claims | 15% | 62 | **New:** one fabricated social-proof line, "who scans" claims that contradict the anonymous analytics, and leftover "never stop / never reprint" copy. |
| Readability | 10% | 90 | Guides: FRE 70.6-82.0, FKGL 5.0-7.6. Tool pages: FRE 73-81. Industry pages: FRE 72-81. Alternatives: FRE 63-72. |
| Duplication | 10% | 80 | Industry pages: Jaccard 0.076, down from 0.171. Tool pages: 0.183, mostly generator UI. Alternatives: 0.363. |
| AI citation readiness | 10% | 80 | Guides are excellent. Industry, alternatives and pricing pages carry most of their facts in cards; trafilatura keeps only 220-266 words per industry page. |
| Metadata / freshness | 10% | 85 | `site_risk: low`. Guides now show "Updated 2 November 2026" with a byline. |

### E-E-A-T (this skill's internal weights, not Google's)

| Factor | Score | Evidence |
|---|---|---|
| Experience (20%) | 40 | There are 0 `<img>` or `<figure>` elements on the guides, tool pages, industry pages and About, and no test results anywhere: a search for "we tested", "tested on" and named devices finds nothing. The worked examples are hypothetical. |
| Expertise (25%) | 70 | Guides have the byline "By Armaghan Abdul Qayyum · Updated 2 November 2026", primary-source links and correct technical facts. The founder bio gives no background or credentials. |
| Authoritativeness (25%) | 45 | The Person has no `sameAs` link and no external profile, and there are no external mentions. The domain is 2 days old. |
| Trustworthiness (30%) | 66 | Contact now explains who answers, in which time zone, and what to send. Terms §6 is clear. Against that: there is no legal entity or postal address; scannable demo codes open third-party sites or 404s; and the site makes the fabricated "Many schools choose Lifetime" claim. |
| **Weighted** | **57** | Was 52. |

**AI citation readiness: 80.**
- Strengths: the guides are answer-first, use question H2s, cite primary sources, carry a byline and dates, and include tables.
- Gaps:
  - Industry, alternatives and pricing pages have no prose answer paragraph.
  - The alternatives page's savings counter renders as "$ 0 0 1 2 3 4 5 6 7 8 9 0…" in extracted text, because the digit reels are in the DOM (an `sr-only` label exists).
  - No diagrams.

**Templated metadata:**
- Result: `site_risk: low`, `templated_ratio: 0.0`, `templated_count: 0`, `shared_cta_phrases: {}`. There are no `description_echoes_title`, `brand_suffix_in_description` or `description_duplicates_title` flags.
- Secondary observation, not flagged by the tool: 13 of 17 tool descriptions end in a "Free, no sign-up, no watermark…" variant. Both alternatives descriptions are identical apart from the competitor name.

---

## Critical / High

### C1. Scannable demo QR codes open real third-party sites, dead hosts or 404s (new)
QR codes rendered on the page are real and scannable. On a site that sells trust in QR codes, and that publishes a guide on QR scams, this is the most damaging trust problem found.

| Where | Encodes | Result |
|---|---|---|
| /qr-code-generator/paypal (preview, SSR) | `paypal.me/osteriarossa` (`src/lib/qr-types.ts:373`) | A stranger's payment page, if that account exists. |
| /qr-code-generator/instagram, facebook, youtube, x, tiktok | handles `osteria.rossa` / `osteriarossa` (`qr-types.ts:300-358`) | Real profiles, if those handles exist. |
| /qr-code-generator/linkedin | `linkedin.com/in/maria-lopez` | Almost certainly a real person's profile. |
| /qr-code-generator/vcard, event | `maria@osteria.co`, website `osteria.co` | osteria.co resolves (185.230.63.x). |
| Home features (`features.tsx:18,170`) | `https://osteria.co/m`, `/t/1…` | Third-party site. |
| /industries/* hero (`industries/[slug]/page.tsx:57`) | `https://` + first destination host | homes.co, summit.io and shop.nord.com resolve. nord.com and harbourhotel.com are real brands. menu.osteria.co, clinic.health, stay.harbourhotel.com and campaign.brand.com do not resolve. |
| /alternatives/* "after cancelling" dashboard | `endureqr.com/r/k3xb9`, `/t4qa8`, `/p7mw2` | **404 on the live site, checked today.** The panel captioned "every code still Active and redirecting" shows codes that are dead when scanned. |

**Fix (priority 1):**
1. In `qr-types.ts` defaults, use reserved or owned values:
   - URLs: `example.com` or `endureqr.com`.
   - Social, PayPal and LinkedIn handles: leave empty and show a greyed sample pattern with a "Sample" overlay, or use EndureQR's own accounts once they exist.
   - Email: `you@example.com` (email already does this).
   - Phone numbers: already in the Ofcom drama ranges. Keep them.
2. In `industries.ts` destinations, use `example.com/...` paths (the bulk page already uses example.com), or better:
3. Turn the demos into **real, working proof**. Create one live dynamic code per industry in a demo account, e.g. `endureqr.com/r/demo-restaurants`, that genuinely rotates between three example.com pages. Do the same for the three alternatives-page codes, in a demo account whose Pro plan has actually been cancelled. Caption: "Scan it: this account's plan was cancelled on [date] and the codes still redirect." That turns a liability into the site's best Experience signal.
4. Until then, add a visible "Illustration" label to the alternatives dashboard and the industry hero cards.

### H1. A fabricated social-proof claim (new)
- **Where:** /industries/education FAQ, `src/content/industries.ts:227`: "There isn't a separate education plan. **Many schools choose Lifetime**: $79 once, with no renewals to budget for."
- **Problem:** the product launched on 2 Nov 2026, so no schools have chosen anything. The QRG treats deceptive claims about the business as a lowest-quality trust signal.
- **Exact change:** "There isn't a separate education plan. Lifetime may suit a school budget: $79 once, with no renewals to approve each year."

### H2. "Who scans" claims contradict the anonymous analytics (new)
- **Evidence:** Privacy says "We don't build profiles of the people who scan", and the dashboard settings say "Scan data contains no personal information". Yet the copy says:
  - Tool CTA band, on all 17 tool pages and /qr-code-generator: "A dynamic code … **shows you who scans it**" (`qr-code-generator/[type]/page.tsx` CtaBand; `qr-code-generator/page.tsx:88`).
  - Home features intro: "see **who scans**" (`components/sections/features.tsx:27`).
  - `faq.ts:10`: "see **who scans it**".
  - /industries/events: "a report of **who scanned it**" (`industries.ts:88`).
  - /industries/real-estate: "follow up with **the ones who scanned**" (`industries.ts:58`).
- **Exact changes:**
  - Replace "shows you who scans it" and "see who scans" with "**counts every scan by day, city and device**".
  - Events: "Give every sponsor their own code and a count of scans by day and hour."
  - Real estate: "Send visitors to a sign-in form and follow up with the people who sign in."

### H3. Leftover unconditional promises that go beyond Terms §6
Terms §6 says dynamic codes keep working "for as long as EndureQR operates the Service", with 90 days' notice and an export. Terms §4 allows codes to be paused for abuse.

| Copy | Location | Replace with |
|---|---|---|
| Title "EndureQR: Dynamic QR codes that never stop working"; H1 "QR codes that never stop working."; OG alt and OG image text | `app/layout.tsx:37,45`, `opengraph-image.tsx:7,79`, `guides/[slug]/page.tsx:36`, hero | Title: "EndureQR: Dynamic QR Codes That Keep Working After You Cancel". H1: "QR codes that keep working after you cancel." |
| "Every plan: unlimited scans · **codes never expire** · no ads on your codes" | `pricing-cards.tsx:91` (/pricing, home) | "Every plan: unlimited scans · static codes never expire · dynamic codes keep working after you cancel (Terms §6)" |
| "reprint with EndureQR once and **never have to reprint again**" | `faq.ts:26` | "…reprint once with EndureQR. After that, you change destinations instead of reprinting." |
| "After that, **you never need to reprint again**." | `alternatives/[slug]/page.tsx:56` (both pages) | "After that, you change where they point instead of reprinting." |
| "Client-safe: Codes **never break** if you or the client stop paying, so print runs are **never at risk**." | `industries.ts:244` | "Client-safe: codes keep redirecting if you or the client stop paying (Terms §6), so a print run isn't lost to a lapsed plan." |
| "Most QR codes are rentals." (unsourced "most") | home H2 | "Many dynamic QR codes are rentals." |
| "Pay $79 once and keep every Pro feature **for the life of the product**" | `faq.ts` (home, /pricing) | Use the Terms wording: "…for as long as EndureQR operates the Service." |
| "Free forever" | `pricing-cards.tsx:50`, `generator.tsx:16` | Acceptable for static codes, which never depend on EndureQR. On the plan card, say "Static codes: free, no expiry" so it isn't read as a promise about the free plan. |

---

## Page-by-page findings

### /contact (162 words): Medium
- **What's working:** three purpose-specific mailboxes, a named responder, a time zone, and what to include in a message.
- **What's missing for the searcher's intent** (someone who needs to reach the company, or check that it's real):
  - legal or trading identity and a postal address (still absent site-wide);
  - which days count as business days;
  - what happens after an abuse report;
  - the fact that Lemon Squeezy (the merchant of record per Terms §5) handles receipts, VAT and chargebacks;
  - a security-report route;
  - a link to the refund terms.
- **Add these blocks under "Who answers"** (exact text; fill in the bracketed parts truthfully):

> **Business days.** We answer Monday to Friday, 9:00-18:00 Pakistan time (UTC+5). Messages sent at the weekend are answered the next Monday.
>
> **What happens when you report a harmful code.** We check the destination the same business day. If it breaks our [acceptable use rules](/terms#acceptable-use), we pause the code so scanners see a warning page, and we tell the code's owner why. Send the short link (endureqr.com/r/…) or a photo of the code.
>
> **Payments and invoices.** Orders are processed by Lemon Squeezy, our merchant of record. Your receipt email has a link to manage billing and download VAT invoices. For a refund within 14 days, email hello@endureqr.com ([refund terms](/terms#plans)).
>
> **Security issues.** Found a vulnerability? Email hello@endureqr.com with "Security" in the subject line. Please don't test against other people's codes.
>
> **Postal address.** EndureQR, [registered or trading name], [street], Lahore, Pakistan.

- Only publish the abuse timeline if it is operationally true.
- Add the address to `company.ts` and to the Organization `address` in JSON-LD (Lahore and PK already appear there).

### /about (500 words): High
- **Missing:** when EndureQR launched; the founder's background; a photo; external profiles; whether there is a registered business; who keeps redirects running if the founder can't (a continuity plan); a written editorial policy; and an honest "we're new" statement.
- The current bio repeats the tagline ("print once and trust for years") and gives no background.
- **To cut or fix:** Principle 1 says "Our dynamic codes keep redirecting to their last destination even after you cancel." Add "for as long as EndureQR runs (Terms §6)".
- **Add, ready to paste** (the bracketed facts must be true):

> **EndureQR is new.** It launched in November 2026, built and run by one person. We would rather say that plainly than invent a customer count. What we can show you is how the product works: [the live demo codes on the alternatives page](/alternatives/bitly) belong to an account whose plan was cancelled on [date], and they still redirect.

> **About Armaghan.** [One or two verifiable sentences: e.g. "Armaghan has built web products for N years at [company]" — only what a linked profile confirms.] [LinkedIn] · [GitHub]

> **Editorial policy.** Armaghan Abdul Qayyum writes every guide on EndureQR and is responsible for its accuracy. Each technical claim links to its primary source, such as the QR code standard published by Denso Wave, the IETF RFCs for vCard and iCalendar, Apple and Google help pages, or the regulator that issued the guidance. Claims about other companies quote and link their own pricing or help pages, with the date we checked them, and we re-check those pages every quarter. Before a guide says something works on a phone, we test it on at least one iPhone and one Android phone. [If AI tools are used: "We use AI tools to help draft and edit; a person checks every fact and test before publishing."] When a guide changes in a way that matters, its "Updated" date changes too. Small typo fixes don't change the date. Found a mistake? Email hello@endureqr.com and we will correct it, usually within two business days, and say what changed.

> **If EndureQR closes.** Our Terms promise at least 90 days' notice and an export of every code's destination. [If a continuity arrangement exists, describe it: e.g. who holds the domain and redirect database.]

- **Schema:** add `sameAs` (LinkedIn/GitHub), `image`, and `knowsAbout` (["QR codes", "ISO/IEC 18004", "web development"]) to `founderLd()`. This is not a rich-result play; it lets the entity be resolved.

### /pricing (652 words): Medium
- **Missing for the searcher's intent** (people comparing what they get, and which plan to pick):
  - an answer-first intro;
  - a "which plan" decision guide with the break-even arithmetic;
  - "prices in USD before tax";
  - what "Priority support" means for a one-person company;
  - what the Free plan's single dynamic code can and can't do.
- **Cut:** the Lifetime list repeats itself: "Everything in Pro, with no renewals" and "One payment, no renewals". Replace the second with "Scan history kept for as long as your account exists" (true per Privacy retention).
- **Verify:** "Moving up is prorated to the day; moving to lifetime credits what's left of your current period" (BILLING_FAQ). Confirm this is how the Lemon Squeezy integration actually behaves; if not, reword it.
- **Define "Priority support":** e.g. "Lifetime emails are answered first, within one business day". Otherwise drop it, since every customer already gets one business day.
- **Title:** "Pricing · EndureQR" (18 characters) → "EndureQR Pricing: Free, Pro $29/Year or $79 Lifetime".
- **Add above the cards** (exact text):

> EndureQR's static QR codes are free, with no sign-up. One dynamic code is free with an account. Pro costs $3.99 a month or $29 a year for unlimited dynamic codes; Lifetime is $79 once. Prices are in US dollars before tax. On every plan, dynamic codes keep redirecting after you cancel, for as long as EndureQR runs ([Terms §6](/terms#cancelling)).

- **Add a section after the matrix**, "Which plan should you pick?":

> - **Only need codes that never change** (WiFi, contact card, a page you own)? Use the free generator. Static codes don't depend on us at all.
> - **One code to edit after printing**, such as a single menu or sign? The free account's one dynamic code covers it.
> - **Several codes, or analytics over time?** Pro yearly works out at $2.42 a month, 39% less than paying monthly.
> - **Planning to keep codes for three years or more?** Lifetime ($79) costs less than three years of Pro yearly ($87) and keeps your scan history with no 12-month limit.

### /industries/* (8 pages, 495-552 words): Medium
- **What improved:** the pages are much less templated (Jaccard 0.076; only 6 shared sentences). The FAQs are specific, and the healthcare FAQ (HIPAA, patient data) is exemplary.
- **Remaining issues:**
  1. **Lowercase H2 on all 8 pages:** "one handout code reused every term", "one code for a whole season of menus", and so on. The cause is `example.title.replace(/^Example:\s*/i, "")` in `industries/[slug]/page.tsx`. Capitalise the first letter, or store the titles without the "Example:" prefix in sentence case. Priority: Medium, because these are visible H2s.
  2. **"Printed March 2026 · Live"** on every hero is impossible: the product didn't exist in March 2026. Remove it, or change it to "Example".
  3. **No prose answer paragraph.** Extractors keep only 220-266 words per page, because the substance is in cards.
  4. **H1s are slogans with no query term**, e.g. "Every room card, always up to date." The H1 holds the strongest on-page relevance signal, so put the query term there and move the slogan into the intro.
  5. **Stat tiles are still rhetorical:** "5 years of shelf life, one code" (retail), "Always" (healthcare), "1 print". The retail "5 years" figure implies a track record the product doesn't have. Replace each tile with a verifiable product fact, or remove it. For example:
     - retail: "500 codes from one CSV";
     - events: "0 scan limits";
     - hotels: "1 CSV → one code per room".
  6. **Mixed locale on real estate:** "yard sign" and "sign rider" (US) sit alongside "estate agent", "pavement" and "under offer" (UK). Pick one audience.
  7. **Missing for intent:** none of the pages says what you need besides EndureQR. EndureQR only redirects, so you still need the menu page, form or listing. Restaurants also lacks the size and placement specifics that the menu guide already has: table tents at 5 cm or more, and allergen information available offline.

- **Opening paragraph for every page:** add an `answer` field to `industries.ts` and render it as a paragraph directly under the hero.

| Page | New title / H1 | Opening answer (exact text) |
|---|---|---|
| restaurants | "Restaurant QR Codes for Menus You Can Update · EndureQR" / "QR code menus you can change without reprinting" | "A restaurant QR code menu works best as a dynamic code: you print it once on table tents at least 5 cm wide, and point it at whichever menu page is current. EndureQR doesn't host your menu. It sends guests to the page you choose, such as a page on your own site, and counts scans by day and hour." |
| real-estate | "Real Estate QR Codes for Sign Riders and Flyers · EndureQR" / "QR codes for property signs you can reuse" | "Put one dynamic QR code on a sign rider and point it at the current listing. When the property sells, point it at the next one. Signs are scanned from the pavement, so print the code at about one tenth of the scanning distance: around 30 cm wide for 3 m." |
| hotels | "Hotel QR Codes for Room Cards and Wi-Fi · EndureQR" / "Hotel room QR codes you can update from your phone" | "Hotels use QR codes on room cards for guest information, Wi-Fi, breakfast hours and checkout. With a dynamic code, the card stays the same and you edit the page it opens. Use the free static Wi-Fi code only if the password rarely changes, because the password is stored in the code itself." |
| healthcare | "Healthcare QR Codes for Leaflets and Posters · EndureQR" / "QR codes for patient leaflets that open the current form" | "Clinics use QR codes to open booking pages, check-in forms and aftercare guidance. Keep patient data off the code and its link: EndureQR only redirects to pages you host and counts scans anonymously. It holds no healthcare compliance certification." |
| events, retail, education, agencies | Same pattern: query term plus outcome | One 50-60 word paragraph in the same style: what the code does, what you still need, one size or placement number, and one honest limit (e.g. agencies: no custom domain and no team seats yet; events: no scheduled switching yet). |

- **First-hand evidence to add:**
  - one photo per industry of a real printed item (table tent, sign rider, room card) with its scan distance and size noted;
  - the live rotating demo code from C1.

### /alternatives/bitly (697 words) and /alternatives/qrfy (766): Medium
- **What's working:** competitor facts are quoted, linked and dated, and the "Is EndureQR affiliated?" FAQ is clear.
- **Problems:**
  - The page reads as one-sided.
  - The template is heavy: Jaccard 0.363, with 28 shared sentences.
  - The mock dashboard is unlabelled ("412 scans today", "All 14 codes redirecting", "ends 14 Mar") and its codes 404 (see C1).
  - "Move over in an afternoon" is unsupported.
  - Step 1 ("Download the list of links your Bitly codes point to") assumes an export feature: confirm and link Bitly's and QRFY's export help pages, or say "copy the destinations into a spreadsheet".
  - "Bitly · after cancelling: keep working;" is a grammar fragment. Use "Bitly: codes keep working after you downgrade; …".
- **Intent:** "Bitly alternative" searchers are often looking for a *link-shortener* alternative. Make the scope explicit in the title and H1:
  - Title: "Bitly Alternative for QR Codes: $29/Year, Unlimited Edits · EndureQR"
  - Title: "QRFY Alternative: Dynamic QR Codes That Work After You Cancel · EndureQR"
- **Make descriptions unique**, e.g. Bitly: "Bitly Core allows 5 QR codes and 5 redirects a month for $120 a year. EndureQR Pro is $29 a year with unlimited codes and edits. Compare plans, sourced." Keep each competitor fact sourced.
- **Add an intro paragraph** (Bitly; write the QRFY one the same way):

> If you mainly use Bitly to make QR codes rather than short links, EndureQR does the QR part for less: Bitly Core is $120 a year for 5 QR codes and 5 redirects a month, while EndureQR Pro is $29 a year with unlimited codes and edits (prices checked 26 Oct 2026). If you rely on Bitly for link management, Bitly is still the better tool. Here is how to tell.

- **Add "When Bitly is the better choice"** (before "Switching"). EndureQR facts come from the site's own FAQs. Confirm every Bitly fact against Bitly's pages and add links before publishing:

> **When Bitly is the better choice**
> - **You need short links more than QR codes.** Bitly is a link-management platform first, with link-in-bio pages and campaign tools [link Bitly feature page]. EndureQR makes QR codes; its short links exist only to power them.
> - **You want short links on your own domain.** Bitly's paid plans include branded domains [link]. EndureQR codes all use endureqr.com/r/… and custom domains aren't available.
> - **Several people need their own logins.** EndureQR has one login per account today; team seats are on our roadmap.
> - **You connect links to other tools.** Bitly offers an API and integrations [link]. EndureQR has no public API yet.
> - **You need a long track record.** Bitly has run for many years. EndureQR launched in November 2026. Our Terms promise 90 days' notice and a full export if we ever close, but we can't offer history.
>
> **When EndureQR is the better choice:** you print QR codes, want to change where they point as often as you like, and want them to keep working if you stop paying.

- **Add "When QRFY is the better choice"** (same rule: link QRFY's pages for each competitor fact):

> **When QRFY is the better choice**
> - **You want the QR service to host the content.** QRFY offers code types that build a hosted page for you, such as a PDF, menu or business page [confirm and link qrfy.com]. EndureQR only redirects to pages you already have, so you need your own menu page, PDF link or form.
> - **You need more dynamic code types** than a link with iPhone and Android variants [confirm list on QRFY].
> - **You need several team members**, or white-label options [confirm]. EndureQR has one login per account today.
> - **You need a long track record.** EndureQR launched in November 2026.
>
> **When EndureQR is the better choice:** you want dynamic codes for $29 a year instead of $228, and you want them to keep redirecting after you cancel. QRFY's FAQ doesn't say whether codes keep redirecting during that time, only that you lose access to the codes and their data until you pay again.

- **Add comparison rows:**
  - custom domain (Bitly yes / EndureQR no);
  - team seats;
  - API;
  - analytics retention (EndureQR 12 months on Pro);
  - bulk creation (EndureQR 500 rows);
  - static generator without sign-up.

  Rows where EndureQR loses must stay in. The `win` flag already de-emphasises them.
- **Fix the savings counter:** render the final value as plain text, and keep the reels purely visual (or put them in a CSS pseudo-element), so the extracted text reads "$91 a year" rather than a string of digits.

### /qr-code-generator and 17 tool pages (749-959 words): Low-Medium
- **Readability is good:** FRE 73-81.
- **Duplication:** about 30% of each page is generator UI shared by all pages (18 identical sentences), so the editorial part is about 450-650 words. Jaccard is 0.183 on average, 0.238 at most: not near-duplicates.
- **Missing for intent:**
  - **Proof that the code works.** Add a one-line "Tested" note per type, using only results you actually get: device, OS version, camera app and result. Example for WiFi: "Tested 4 Nov 2026: iPhone [model] on iOS [x] and [Android model] on Android [x], built-in camera, joined a WPA2 network whose password contains `;` and `"`." This is the cheapest Experience signal, and the tips already imply that testing happened.
  - **Type-specific gotchas worth adding**, all verifiable:
    - PayPal: how a PayPal.Me link differs from the QR code PayPal generates in its own app; that the payer chooses "goods and services" or "friends and family" in PayPal; link to PayPal's PayPal.Me help page.
    - WhatsApp: the `wa.me` format, with a link to WhatsApp's "click to chat" help.
    - Instagram, TikTok and others: each platform has its own built-in QR or Nametag feature; explain when an EndureQR code is better (your logo, print formats, colours).
  - **/qr-code-generator hub:** for the head term "free QR code generator" the editorial content is thin; it is mostly the UI, a type list and three guide cards. Add a 4-step "How to make a QR code" summary with no HowTo schema, a five-row print-size table borrowed from the size guide, and a "Static or dynamic?" two-line decision.
- **Upsell copy:**
  - "Make it dynamic $29/yr or $79 once" ignores the free dynamic code. Change it to "Make it dynamic: 1 free, then $29/yr".
  - Make the 17 identical CTA bodies type-specific, e.g. WiFi: "Change the password without reprinting the card."
- **Demo defaults:** see C1. The PayPal default is the most urgent.

### Home (2,118 words): Low
- Hero mock data is now labelled "Example". Good.
- Still unlabelled: the NeverDies panel ("Scans 8,214 / 0 failed", "12,409 plan cancelled"), and the globe feed ("Toronto · Android · now"), which is `aria-hidden` but visible. Add a small "Illustration" caption to each.
- **Duplicate paragraph:** "With some QR services, stop paying…" and "With some dynamic QR services, cancelling pauses…" both sit in the DOM (likely a mobile and a desktop variant). Keep one, or hide the other from the accessibility tree.
- "Every style still scans." is absolute. Change it to "Every style is tested to scan at the default size."

### Guides (16): Low (strong)
- Byline, "Updated 2 November 2026" and primary sources are all present. Readability: FRE 70.6-82.0.
- Duplication: Jaccard 0.034. The highest pair is do-qr-codes-expire vs static-vs-dynamic at 0.079, which is fine.
- No AI-cliché phrasing was found.
- **Still missing:** images or diagrams, and test boxes. Start with not-scanning, size-for-printing, design-best-practices and error-correction:
  - an annotated quiet-zone diagram;
  - a photo of a 2 cm code scanned at 20 cm;
  - a logo-size series at 15%, 25% and 35%, scanned on two phones, with results.
- **L2 from the previous audit:** check the present-tense Denso Wave patent wording in `guides-basics.ts`.

### AdSense "low-value content" view: Info
- **Lowest-value pages:** the 8 industry pages and 2 alternatives pages are short and card-heavy, and Contact has 162 words.
- **Ad placement:** ad slots are only on the tool and guide pages, which are the strongest content, so a review should pass once C1 and H1 are fixed.
- **Privacy mismatch:** the AdSense loader script is in `<head>` on *every* public page, including /about, /pricing and /industries/*. Privacy says ads run only on "the free generator and guide pages". Keep Auto ads off in the AdSense console, or update the Privacy wording.
- **YMYL-adjacent pages:** keep ads well away from the payment steps on the PayPal tool and from the scam guide.

---

## Priority order
1. **C1:** replace scannable demo values; make the demo codes real or labelled (about 2 hours).
2. **H1, H2, H3:** fabricated school line, "who scans", "never stop / never reprint" (about 1 hour; text above).
3. **Industry pages:** lowercase H2 bug, "Printed March 2026", answer paragraphs, keyword H1s and titles.
4. **Alternatives pages:** "When X is the better choice", scoped titles, unique descriptions, extra rows, counter text.
5. **About:** "we're new", background, sameAs, editorial policy. **Contact:** business days, abuse process, billing route, address.
6. **Pricing:** intro, plan picker, title, Priority support definition, duplicate bullet.
7. **Experience:** "Tested" notes on the tool pages, diagrams and photos in the top 4 guides.

## Structured findings (audit-data.json, "Content Quality")

```json
{
  "category": "Content Quality",
  "score": 74,
  "previous_score": 69,
  "eeat": {"experience": 40, "expertise": 70, "authoritativeness": 45, "trustworthiness": 66, "weighted": 57},
  "ai_citation_readiness": 80,
  "metadata_template": {"site_risk": "low", "templated_ratio": 0.0, "templated_count": 0, "shared_cta_phrases": {}, "pages_checked": 55},
  "duplication_jaccard5": {"tools_mean": 0.183, "tools_max": 0.238, "industries_mean": 0.076, "industries_max": 0.119, "guides_mean": 0.034, "alternatives": 0.363},
  "findings": [
    {"id": "C1", "severity": "critical", "title": "Scannable demo QR codes open third-party accounts/sites (paypal.me/osteriarossa, osteria.co, homes.co, shop.nord.com, summit.io) or 404 (endureqr.com/r/k3xb9 on alternatives)", "files": ["src/lib/qr-types.ts", "src/content/industries.ts", "src/components/sections/features.tsx", "src/app/(marketing)/alternatives/[slug]/page.tsx"]},
    {"id": "H1", "severity": "high", "title": "Fabricated social proof: 'Many schools choose Lifetime'", "file": "src/content/industries.ts:227"},
    {"id": "H2", "severity": "high", "title": "'Shows you who scans it' contradicts anonymous analytics (19+ pages)", "files": ["qr-code-generator/[type]/page.tsx", "qr-code-generator/page.tsx:88", "features.tsx:27", "faq.ts:10", "industries.ts:58,88"]},
    {"id": "H3", "severity": "high", "title": "'Never stop working' title/H1/OG, 'codes never expire' on every plan, 'never reprint again', 'never break' exceed Terms §6", "files": ["app/layout.tsx", "opengraph-image.tsx", "pricing-cards.tsx:91", "faq.ts:26", "alternatives/[slug]/page.tsx:56", "industries.ts:244"]},
    {"id": "M1", "severity": "medium", "title": "Industry pages: lowercase worked-example H2 on 8 pages, impossible 'Printed March 2026', no answer paragraph, slogan H1s, rhetorical stat tiles", "pages": 8},
    {"id": "M2", "severity": "medium", "title": "Alternatives pages one-sided: no 'when competitor is better', unscoped titles, near-identical descriptions, unlabelled mock dashboard, digit-reel text", "pages": 2},
    {"id": "M3", "severity": "medium", "title": "About lacks launch date, background, sameAs, written editorial policy, continuity statement"},
    {"id": "M4", "severity": "medium", "title": "Contact lacks legal identity/address, business days, abuse process, merchant-of-record billing route"},
    {"id": "M5", "severity": "medium", "title": "Pricing: no intro answer or plan picker, weak title, undefined 'Priority support', duplicate Lifetime bullet, unverified proration claim"},
    {"id": "M6", "severity": "medium", "title": "No first-hand evidence: 0 images on guides/tools/industries/about, no device test results"},
    {"id": "L1", "severity": "low", "title": "Tool pages: identical upsell, 'Make it dynamic $29/yr' ignores free dynamic code; hub page thin editorially"},
    {"id": "L2", "severity": "low", "title": "Home: unlabelled NeverDies/globe mock data, duplicated paragraph, 'Every style still scans'"},
    {"id": "I1", "severity": "info", "title": "AdSense loader on all public pages while Privacy says ads only on generator and guides"}
  ]
}
```

# GEO / AEO audit: endureqr.com

Data gathered 4 Nov 2026, with a quick re-check on 18 Nov 2026. Scope: Google AI Overviews / AI Mode, ChatGPT search, Perplexity, Microsoft Copilot (Bing-fed) and Gemini. Previous GEO score: 69 (2 Nov).

Method:
- Read `src/content/*.ts`, `src/lib/qr-types.ts` (what each type actually encodes), `src/components/content/json-ld.tsx`, the About, pricing and hub pages, `src/app/llms.txt/route.ts` and `src/app/robots.ts`. Read-only.
- Used `docs/seo-audit/endureqr-2026-11-04/pages.json` (55 URLs) for headings and word counts.
- Live: fetched robots.txt, llms.txt and sitemap.xml, sent 14 crawler user-agents to 3 URLs, ran `render_page.py --mode auto` on /qr-code-generator/wifi, and checked the meta tags and bylines.
- Facts checked against qrcode.com (Denso Wave) standards, FAQ and history pages, and Wikipedia's QR code article. iso.org is behind a bot challenge, so the ISO/IEC 18004:2024 catalogue link needs a manual check.
- Searched Bing, DuckDuckGo, Mojeek, Reddit, Brave, Perplexity, G2, Capterra, PCMag, Zapier, TechRadar and Product Hunt. Most block scripted access, so off-site evidence is partial and labelled as such below.

No DataForSEO or other LLM-answer tools were available. Whether ChatGPT or Perplexity mention EndureQR was inferred, not measured (see section 7).

---

## 1. Score: 71 / 100 (was 69)

| Dimension | Weight | Score | Weighted | Basis |
|---|---|---|---|---|
| Citability | 25% | 85 | 21.3 | Guide leads are answer-first, 59-100 words, with 2-4 primary sources each. Weak spots: about 25 section leads under 30 words, 17 type pages with 0 sources and 0 question body headings, and 8 industry pages whose H1 is a slogan with no definitional passage. |
| Structural readability | 20% | 88 | 17.6 | Clean H1 > H2 > H3, tables and lists. Feature pages use declarative H2s. |
| Multi-modal | 15% | 32 | 4.8 | Unchanged since 2 Nov (no diagrams in guides). Not re-measured. |
| Authority and brand | 20% | 42 | 8.4 | New: Person `#founder`, Article author = Person, visible bylines, `founder` and `address` on the Organization. Still missing: `sameAs`, `foundingDate`, a definitional "EndureQR is..." sentence anywhere except one alternatives FAQ, and any third-party mention. |
| Technical accessibility | 20% | 93 | 18.6 | Every crawler gets 200 SSR. llms.txt covers 55/55 sitemap URLs. Still no `msvalidate.01` (re-checked 18 Nov), and Bing showed no endureqr.com results. |
| **Total** | | | **71** | |

### Platform readiness (estimates, not measured visibility)

| Platform | Score | Main limiter |
|---|---|---|
| Google AI Overviews / AI Mode | 55 | Inclusion follows Googlebot indexing and ranking. Google has indexed most pages, but the domain has no links and no history. |
| Gemini (app) | 50 | Grounds on Google Search. The same limiter applies, and Gemini also has no entity knowledge of EndureQR. |
| ChatGPT search | 40 | Retrieval leans heavily on Bing, which has not crawled the site. It also needs third-party mentions for "best X" prompts. |
| Perplexity | 58 | Its own index (PerplexityBot allowed, SSR). Sourced guides suit it. It cites Reddit, G2 and listicles heavily for "best" prompts. |
| Bing Copilot | 38 | Bing index gap, and no Bing Webmaster verification tag. |

---

## 2. Entity clarity

### The one-sentence definition (use it verbatim everywhere)

> **EndureQR is a web-based QR code generator, founded in 2026 by Armaghan Abdul Qayyum in Lahore, Pakistan, that makes free static QR codes in 17 types and paid dynamic QR codes that keep redirecting to their last destination even after you cancel.**

Short form, for bios and listings under 160 characters:

> **EndureQR: free QR code generator (17 types, no sign-up, no watermark) plus dynamic QR codes that keep working after you cancel.**

Where to use it:
- First sentence of the About page body.
- Organization `description`.
- llms.txt blockquote.
- Every off-site profile: LinkedIn, X, YouTube, Product Hunt, AlternativeTo, G2, Capterra and the GitHub org.
- Press and author bios.

The same wording everywhere is what lets models merge the mentions into one entity.

Today the only "EndureQR is ..." sentence on the site is in the alternatives FAQ ("EndureQR is an independent product"). The home H1 ("QR codes that never stop working.") and the About H1 ("QR codes that keep working.") are slogans. Neither tells a model what the thing is.

**Confirm before publishing:** "founded in 2026". The domain was registered on 2 Nov 2026, and the site ran on vercel.app from October. Use the real date.

### Add to the About page (`src/app/(marketing)/about/page.tsx`)

1. **Put the definition sentence under the H1**, replacing or preceding the current intro.
2. **Add an "EndureQR at a glance" `<dl>`** directly after it. Models extract key-value lists cleanly.

   | Term | Value |
   |---|---|
   | What it is | Web-based QR code generator (static and dynamic) |
   | Founded | 2026 (confirm month) |
   | Founder | Armaghan Abdul Qayyum (link #founder) |
   | Based in | Lahore, Pakistan |
   | Free plan | Unlimited static codes, 17 types, 1 dynamic code, no watermark |
   | Paid plans | Pro $3.99/month or $29/year; Lifetime $79 once (USD, before tax) |
   | Cancellation policy | Dynamic codes keep redirecting to their last destination; editing and new analytics pause |
   | If EndureQR closes | At least 90 days' notice and an export of every destination (as stated in the site FAQ) |
   | Payments | Lemon Squeezy (merchant of record) |
   | Contact | /contact |

3. **Add an "Elsewhere" line** linking the LinkedIn company page, the founder's LinkedIn, YouTube, X, Product Hunt and AlternativeTo once they exist. Mirror the same list in `sameAs`.

### Organization and Person JSON-LD (`src/components/content/json-ld.tsx`)

Add to `organizationLd()`:
- `alternateName: ["Endure QR", "endureqr.com"]`
- `foundingDate` (ISO, for example `"2026-10"`)
- `slogan: "QR codes that keep working"`
- `disambiguatingDescription`: the one-sentence definition above
- `knowsAbout: ["QR code", "Dynamic QR code", "ISO/IEC 18004", "vCard", "Error correction"]`
- `areaServed: "Worldwide"`
- `sameAs: [...]`, only URLs that exist and are live

Add to `founderLd()`:
- `sameAs`: the founder's LinkedIn and any other real profiles
- `description`: the first sentence of `FOUNDER.bio`
- `knowsAbout`: as above

Add a `dateModified` to the WebApplication JSON-LD on type and feature pages, and show it visibly. Without one, trafilatura inferred `publication_date: 2026-01-01` from the footer "© 2026" on /qr-code-generator/wifi.

### Facts that conflict or are not quotable (fix before models quote them)

1. **Logo size: area or width?**
   - The design guide says a logo should be "roughly 20 to 25% of the code's area" (lead and H2 "How big can a logo...").
   - /qr-code-with-logo and the generator say 15-35% of the code's **width**. At 35% of the width, that is about 12% of the area.
   - These differ by about 4x. Standardise on **width** and fix `src/content/guides.ts` (qr-code-design-best-practices).
2. **Dynamic page table header.** The /dynamic-qr-code-generator table header reads "Dynamic (Pro or Lifetime)", but a free account includes one dynamic code. Change it to "Dynamic (1 free; unlimited on Pro or Lifetime)".
3. **Industry "stat" blocks are number-shaped claims with no source.** Examples: retail "5 years of shelf life, one code", restaurants "1 print for every menu change this year", events "1 code". LLMs lift numbers. Reword them as plain statements, for example "One code for the life of the packaging", or remove the block.
4. **Absolute and conditional versions of the cancel promise.** FAQ[0] says "for as long as EndureQR runs" and gives a 90-day notice and export promise. Most other pages say codes "keep working" without that condition. Keep the short claim, but add "for as long as EndureQR operates" in About, llms.txt and the Organization description, so models quote the accurate version.
5. **Unnamed authorities.** /guides/are-qr-codes-safe still says "Councils, police and consumer bodies in several countries" but names only the FTC. Either name and link a second authority (the IC3 PSA is already cited elsewhere on the page) or say "The US FTC and the FBI's IC3 have warned...".

---

## 3. Answer-first passages, keyed by URL path (paste-ready)

How to use this section:
- Each **Lead** goes directly under the H1, replacing the first body paragraph (`body[0]` for guides and features, `intro` for type pages, `industry.intro` or a new field for industries).
- **Section fixes** replace the first paragraph under the named H2. Where a heading change is suggested, the new heading is given in quotes.
- Word counts are 40-80. Facts were checked against the product code and the sources listed.
- "Keep" means the current lead already meets the bar.

Shared source URLs:
- [Denso Wave: QR code standards](https://www.qrcode.com/en/about/standards.html) (ISO/IEC 18004 approved June 2000)
- [Denso Wave: history](https://www.qrcode.com/en/history/) (announced 1994, team led by Masahiro Hara)
- [Denso Wave: FAQ](https://www.qrcode.com/en/faq.html) ("You can use the code freely as long as you follow the standards for QR Codes in JIS or ISO"; about 3 KB maximum; minimum about 3.57 mm with 0.17 mm modules; "QR Code" is a registered trademark of DENSO WAVE)
- [Denso Wave: error correction](https://www.qrcode.com/en/about/error_correction.html)
- [ZXing: Barcode Contents](https://github.com/zxing/zxing/wiki/Barcode-Contents) (WIFI:, SMSTO:, MECARD and similar formats)
- ISO/IEC 18004:2024, the current edition. Wikipedia says it replaced the 2015 edition in August 2024. iso.org blocked automated access, so confirm the catalogue URL before linking.

### A. Guides (16)

#### /guides/what-is-a-qr-code
**Lead** (replaces the 81-word lead, 71 words):
> A QR code (Quick Response code) is a two-dimensional barcode that stores data in a square grid of dark and light modules. A phone camera decodes the pattern back into text, such as a web address, WiFi login or contact card. Denso Wave developed it in 1994 to track car parts, and the format is an international standard, ISO/IEC 18004. The largest version holds up to 7,089 digits or 2,953 bytes.

Sources: [history](https://www.qrcode.com/en/history/), [standards](https://www.qrcode.com/en/about/standards.html), capacity per [FAQ](https://www.qrcode.com/en/faq.html) and ISO/IEC 18004 version 40-L.

**Section fix.** "The parts of a QR code" becomes "What are the parts of a QR code?":
> Every QR code has three large finder patterns in its corners, timing patterns between them, alignment patterns from version 2 upward, format information next to the finders, version information from version 7 upward, and a blank quiet zone around the edge. None of these hold your data. They tell the scanner where the code is, which way up it is and how it was encoded.

**Section fix.** "Static and dynamic QR codes" (16 words) becomes "What is the difference between static and dynamic QR codes?":
> Every QR code is read the same way. The difference is what it stores. A static code stores the final content, such as a full web address, so it works without any service and cannot be changed. A dynamic code stores a short redirect link owned by a QR service, so the destination can be changed and scans counted, but only while that service keeps forwarding.

#### /guides/how-to-scan-a-qr-code
**Lead** (replaces 87 words, 66 words):
> To scan a QR code, open your phone's Camera app, point it at the code so the whole square and its margin are in view, and hold still. A link or button appears; check the address, then tap it. iPhones and most Android phones do this without an extra app. For a code already on your screen, use Photos on iPhone or Google Lens on Android.

Sources: [Apple iPhone guide](https://support.apple.com/en-gb/guide/iphone/iphe8bda8762/ios), [Google Lens help](https://support.google.com/websearch/answer/14508957).

**Section fix.** "How to scan a QR code on Android" lead (23 words), heading becomes "How do you scan a QR code on Android?":
> On most Android phones, open the Camera app and point it at the code. If nothing appears, use Google Lens, which is built into the Google app and offered as a camera or Quick Settings option on many phones. Menu names vary by manufacturer and Android version, so if your camera ignores codes, look in its settings for a QR or Lens option.

#### /guides/how-to-make-a-qr-code
**Lead** (71 words):
> To make a QR code, open a QR code generator, choose what the code should do (open a link, join WiFi, save a contact), enter the content, and download the image as SVG or PDF for print or PNG for screens. Before printing, add a short call to action, keep a clear margin and test it on an iPhone and an Android phone. A static code made this way never expires.

**Section fix.** "Steps 7 and 8: test it, then download" (13 words):
> Scan the on-screen preview with an iPhone and an Android phone before you download, and again after every design change. Then download the format for where the code will appear: SVG or PDF for print, because they stay sharp at any size, and PNG for websites, slides and documents. Finally, print one proof at real size and scan it where it will be used.

#### /guides/do-qr-codes-expire
**Lead:** keep (79 words, answer-first).

**Section fix.** "How to avoid QR codes that stop working" (19 words) becomes "How do you make a QR code that never expires?":
> Use a static QR code for content that will not change, because it stores the content in the pattern and depends on no service. If you need a dynamic code, choose a provider whose terms say codes keep redirecting after you cancel, point every code at a page you control, and keep a record of which account owns each printed code.

**Section fix.** "What happens to EndureQR codes if you cancel" opens with "EndureQR was built around this problem", which refers back to earlier text. Heading becomes "What happens to EndureQR dynamic codes if you cancel?":
> EndureQR dynamic codes keep redirecting to their last destination after you cancel a paid plan, with no service page or ads in between. Editing and new scan analytics pause until you resume. Codes from the free EndureQR generator are static, so they never depended on the service. EndureQR also commits to at least 90 days' notice and an export of every destination if it ever closes.

#### /guides/static-vs-dynamic-qr-codes
**Lead** (replaces 87 words, 73 words):
> A static QR code stores its content, such as a web address or WiFi password, directly in the pattern: it is free, needs no service and never expires, but cannot be changed after printing. A dynamic QR code stores a short redirect link, so you can change the destination and count scans, but it depends on the provider keeping that redirect running. Use static for fixed content, dynamic for anything that may change.

**Section fix.** "When a static code is the right choice" (16 words) becomes "When should you use a static QR code?":
> Use a static QR code when the content will stay the same for as long as the print exists and you do not need scan counts. Good examples are a WiFi network, a contact card, a phone number, or a link to a stable page on your own domain. Static codes cost nothing and cannot be switched off by anyone.

**Section fix.** "What to check before choosing a dynamic provider" (16 words) becomes "What should you check before choosing a dynamic QR code provider?":
> Check four things in the provider's own terms before you print: what happens to codes when you cancel or a trial ends, whether scans or destination edits are capped, whether you can export your destinations, and who owns the short-link domain. Dynamic codes from different services look identical on paper. The differences that decide whether a printed code survives are all in these terms.

#### /guides/qr-code-size-for-printing
**Lead:** keep (66 words). Optionally add Denso Wave's theoretical minimum as a sourced fact in the "smallest QR code" FAQ: "about 3.57 mm for a 21 x 21 code with 0.17 mm modules" ([FAQ](https://www.qrcode.com/en/faq.html)). Also split the 250-word 10:1 section with an H3 "Size by scanning distance".

**Section fix.** "Resolution, DPI and file formats" (21 words) becomes "What resolution and file format should a QR code be for print?":
> Send a vector file, SVG or PDF, to print, because vectors stay sharp at any size and keep module edges crisp. If you must use a raster image, export a PNG large enough for at least 300 dpi at the printed size: a 5 cm (2 in) code needs roughly 600 pixels across. Avoid JPEG for print, because compression blurs module edges.

#### /guides/qr-code-for-restaurant-menu
**Lead:** keep (76 words).

**Section fix.** "How big should a menu QR code be, and where should it go?" (24 words):
> Print a menu QR code at least 5 cm (2 in) wide on a table tent or card facing the guest's seat, with a short label such as "Scan for the menu". At a typical table distance of 30-50 cm, the 10:1 rule calls for 3-5 cm, so 5 cm leaves a margin for dim lighting and older phones. Keep a blank border of four modules around it.

#### /guides/wifi-qr-code
**Lead:** keep (59 words, with the `WIFI:` syntax and the ZXing source).

**Section fix.** "Use a separate guest network" (32 words) becomes "Should a WiFi QR code use a guest network?":
> Yes. A WiFi QR code contains your password as plain text, so anyone who photographs it can join, and a QR reader app can display the password. A guest network keeps visitors off the network your own computers, printers and cameras use. You can also change its password, and reprint the code, without disturbing your main network.

#### /guides/qr-code-design-best-practices
**Lead** (replaces the current lead, which gives logo size as a share of *area*; 66 words):
> A custom QR code scans reliably when its modules are much darker than the background, it keeps a clear margin of four modules, and any logo stays small, around 20 to 25% of the code's width, with error correction level H. Rounded dots and brand colours are fine if contrast stays high. Add a short call to action, then test a printed proof on several phones.

**Section fix.** "How big can a logo in a QR code be?":
> Keep a logo to about 20 to 25% of the code's width, which covers only around 4 to 6% of its area, and set error correction to level H. Level H can restore roughly 30% of the codewords, but glare, curves and wear use up the same margin, so a smaller logo scans more reliably. Never cover the three corner finder patterns.

Source: [error correction](https://www.qrcode.com/en/about/error_correction.html).

**Section fix.** "Dot styles and corner shapes" becomes "Can you change the shape of QR code dots and corners?":
> Yes. Rounded, dotted or soft modules and rounded corner squares usually scan fine, because scanners read the centre of each module, not its outline. Keep the three corner finder patterns solid and clearly square or round, keep strong contrast, and avoid very small or widely spaced dots, which make modules harder to tell apart. Test the styled code on several phones before printing.

#### /guides/qr-code-not-scanning
**Lead:** keep (78 words).

**Section fix.** "Start here: quick checks on the phone" (14 words) becomes "What should you check first when a QR code won't scan?":
> Rule out the phone first. Clean the camera lens, step back so the whole code and its margin fit on screen, move out of your own shadow, and check that QR scanning is switched on in the camera settings. Then try a second phone. If the second phone scans it, the problem is the first phone, not the code.

**Section fix.** "Check the size and the amount of data" becomes "Can a QR code be too small or hold too much data?":
> Yes. A code should be about one tenth as wide as the scanning distance, so a code scanned from 1 metre needs to be about 10 cm wide. Long links also add modules, which makes each module smaller at the same print size. Shorten the link, or use a dynamic code whose short link keeps the pattern simple, and print larger.

#### /guides/are-qr-codes-safe
**Lead** (replaces 88 words, 76 words):
> Scanning a QR code is generally safe in itself: a QR code only stores text, usually a web address, and your phone shows it before anything opens. The risk is the destination. Scammers place fake codes, often stickers over real ones, that lead to look-alike sites that steal logins or card details, a scam called quishing. Check the address in the preview, and be most careful with codes that ask you to pay or log in.

Sources: [FTC consumer alert, Dec 2023](https://consumer.ftc.gov/consumer-alerts/2023/12/scammers-hide-harmful-links-qr-codes-steal-your-information), [FBI IC3 PSA220118](https://www.ic3.gov/PSA/2022/PSA220118).

**Section fix.** "How to check a QR code before you open it" (no lead paragraph) becomes "How can you tell if a QR code is safe before you tap it?":
> Read the address in the camera preview before you tap. Check that the domain is the one you expect, spelled correctly and not hidden behind an unfamiliar link shortener. On printed signs, look for a sticker stuck over the original code. If a code asks for a payment or password, type the organisation's official website address yourself, or use its app, instead.

**Section fix.** "How businesses can protect their QR codes" (21 words) becomes "How can businesses protect their QR codes from tampering?":
> Print your domain in text beside each code so customers can compare it with the preview, link only to a domain you own, and check public codes regularly for stickers. Codes printed directly onto signs or under lamination are harder to cover. Keep a list of every code you have placed, so staff can tell a genuine one from a fake.

#### /guides/qr-code-business-card
**Lead** (replaces 100 words, 73 words):
> To put a QR code on a business card, choose a vCard code, which saves your name, number and email straight to the phone's contacts with no internet, or a link code that opens a profile page you can update later. Print it about 2.5 cm (1 in) wide on the back of an 85 x 55 mm or 3.5 x 2 in card, and test a printed proof on iPhone and Android.

**Section fix.** "vCard or a link to a profile page?" (12 words) becomes "Should a business card QR code use a vCard or a link?":
> Use a vCard if you want people to save you as a contact in one tap: the details live in the code and work offline, but they cannot be changed after printing. Use a link to a profile page if your details change often or you want to show your work, because you can update the page without reprinting the cards.

Source for vCard 3.0: [RFC 2426](https://www.rfc-editor.org/rfc/rfc2426) (already cited).

#### /guides/qr-code-error-correction
**Lead:** keep (76 words). **Section fix:** none needed. All section leads are 30-78 words.

#### /guides/qr-code-for-google-reviews
**Lead:** keep (72 words).

**Section fix.** "Turn the review link into a QR code" (14 words) becomes "How do you turn a Google review link into a QR code?":
> Paste the review link from your Google Business Profile into a URL QR code generator, add a frame that says what the code does, such as "Review us on Google", and download SVG or PDF for print. A free static code is enough for most businesses, because the review link rarely changes, and it never expires. Scan the printed proof before ordering.

**Section fix.** "Test it the way a customer would" (13 words) becomes "How do you test a Google review QR code?":
> Scan the printed code with a phone that is not signed in to your business account, ideally one iPhone and one Android phone, and check that it opens your business's review form with the star rating ready. Leave without posting. Test from the distance and in the light where customers will actually see the code, not only at your desk.

#### /guides/track-qr-code-scans
**Lead:** keep (71 words).

**Section fix.** "Option 1: UTM parameters and web analytics" becomes "How do you track QR code scans with UTM parameters?". Keep the lead text.

#### /guides/qr-code-for-events
**Lead** (replaces 81 words, 70 words):
> Use QR codes at every stage of an event: on posters and invitations to open the event page or add the date to a calendar, at the venue for the agenda, WiFi and directions, and at the end for a feedback form. Tickets are different, because each attendee needs a unique code from a ticketing system. Use a dynamic code for anything that may change after printing.

**Section fix.** "Feedback forms" becomes "How do you collect event feedback with a QR code?". Keep the lead.

### B. Feature pages (4)

#### /dynamic-qr-code-generator
**Lead (intro)** (64 words, adds the entity and the free code):
> EndureQR's dynamic QR codes point to a short link, so you can change where they go after printing and see how often they are scanned. A free account includes one dynamic code; Pro costs $3.99 a month or $29 a year for unlimited codes and scans, and Lifetime is $79 once. If you cancel, codes keep redirecting to their last destination.

**H2 renames:**

| Current | New |
|---|---|
| How a dynamic QR code works | How does a dynamic QR code work? |
| Static and dynamic codes compared | What is the difference between a static and a dynamic QR code? |
| When a dynamic code is worth it | When should you use a dynamic QR code? |
| What happens if you cancel | What happens to dynamic QR codes if you cancel? |
| Pricing | How much does a dynamic QR code cost? |

Also fix the table header (see section 2, item 2).

**Under "How does a dynamic QR code work?":**
> A dynamic QR code stores a short redirect link instead of your final address. When someone scans it, the phone opens the short link and the QR service forwards it to the destination saved in your account. Because the destination lives on the service, not in the printed pattern, you can change it at any time, count scans and send iPhone and Android users to different links.

**Under "How much does a dynamic QR code cost?":**
> On EndureQR, your first dynamic QR code is free with a free account, including editing and scan analytics. Pro costs $3.99 a month or $29 a year and adds unlimited dynamic codes, folders and bulk creation from CSV. Lifetime is $79 once. Prices are in US dollars before tax, with a refund within 14 days of the first Pro payment or a Lifetime purchase.

#### /qr-code-with-logo
**Lead:** keep the intro (50 words).

**H2 renames:**

| Current | New |
|---|---|
| How a logo fits inside a QR code | Will a logo stop a QR code from scanning? |
| Preparing your logo file | What file format should a QR code logo be? |
| Colours, styles and frames | What colours can a QR code with a logo use? |
| Downloading the right file | Which file format should you download a QR code in? |

**Under "Will a logo stop a QR code from scanning?":**
> A logo does not stop a QR code scanning if it stays modest and the contrast is strong. Every QR code carries Reed-Solomon error correction, and at level H about 30% of the codewords can be restored, so the scanner rebuilds the modules a central logo hides. Keep the logo to about 20-25% of the code's width, never cover the corner squares, and test a printed proof.

Source: [error correction](https://www.qrcode.com/en/about/error_correction.html).

#### /app-download-qr-code
**Lead:** keep the intro (63 words).

**H2 renames:**

| Current | New |
|---|---|
| Why one static code is not enough | Can a free static QR code link to both app stores? |
| How smart redirects work | How does a smart redirect QR code work? |
| Finding your store links | Where do you find your App Store and Google Play links? |
| Measuring scans and installs | Can a QR code track app installs? |

**New H2 "Can one QR code link to both the App Store and Google Play?"**, placed before "Why one static code...":
> Yes, but only with a dynamic QR code that checks the device at the moment of scanning, because a static code holds one fixed link. EndureQR's smart redirects send iPhone and iPad users to your App Store link, Android users to your Google Play link, and computers and other devices to a main web page you choose. You can change all three links after printing.

#### /bulk-qr-code-generator
**Lead:** keep the intro (54 words).

**H2 renames:**

| Current | New |
|---|---|
| Preparing your CSV file | What should the CSV file for bulk QR codes contain? |
| Why every bulk code is dynamic | Can you bulk create static QR codes? |

**New H2 "How do you create QR codes in bulk from a spreadsheet?"**, as the first H2:
> Save your spreadsheet as a CSV with a header row and one code per row: a name, a destination link starting with https://, and an optional folder. Upload it to EndureQR, review the rows, and it creates one dynamic QR code per row, up to 500 rows per upload. You then download a ZIP of SVG files and a CSV of the short links.

**Under "Can you bulk create static QR codes?":**
> Not with EndureQR. Bulk creation makes dynamic codes and is part of Pro and Lifetime, while the free generator makes one static code at a time. Dynamic matters more at scale: if one link in a batch of 300 has a typo, you fix that single destination in the dashboard instead of reprinting the batch. Codes keep redirecting if you cancel.

### C. Generator hub and type pages (18)

Each type-page passage replaces `intro` in `src/content/qr-type-pages.ts`. Better still, keep the current intro and add a new H2 "What is a [type] QR code?" with this text plus the source link. That also fixes "0 question body headings" on all 17 pages.

Grammar fix: the template renders "How to make a Instagram/X QR code". Use "an" before vowel sounds.

#### /qr-code-generator
> EndureQR's free QR code generator makes static QR codes in 17 types, including website links, WiFi, contact cards (vCard), WhatsApp, email, SMS, calendar events and social profiles. Add a logo, colours and a frame, then download PNG, SVG, JPEG or PDF up to 4096 px. There is no sign-up, watermark or scan limit, the code is built in your browser, and static codes never expire.

#### /qr-code-generator/url
> A URL QR code stores a web address in the pattern itself, so any phone camera opens that page in one scan. Made with EndureQR's free generator, it is a static code with no sign-up, no watermark, no scan limit and no expiry, though it only works while the page it points to stays online. Shorter links make simpler patterns. Changing the link after printing needs a dynamic code.

Source: [ISO/IEC 18004 via Denso Wave](https://www.qrcode.com/en/about/standards.html).

#### /qr-code-generator/text
> A text QR code stores a short plain-text message in the pattern, and a phone shows that message on screen when it scans the code. Nothing opens and no internet is needed, because the words are inside the code. EndureQR's free text codes hold up to 300 characters; the QR standard allows far more, about 3 KB, but long messages make dense patterns that are hard to scan from print.

Source: [Denso Wave FAQ](https://www.qrcode.com/en/faq.html).

#### /qr-code-generator/wifi
> A WiFi QR code stores your network name, password and security type as text in the format WIFI:T:WPA;S:NetworkName;P:password;; which iPhone and Android cameras recognise and offer to join. Nobody types the password, and reading the code needs no internet. Because the password is inside the code, anyone who can see it can join, so use a guest network and reprint whenever the password changes.

Source: [ZXing Barcode Contents](https://github.com/zxing/zxing/wiki/Barcode-Contents). Matches `qr-types.ts:136`.

#### /qr-code-generator/vcard
> A vCard QR code stores a contact card, with your name, phone, email, company, job title, website and address, in the vCard 3.0 text format defined in RFC 2426. When scanned, iPhone and Android phones show the details and offer to save them to contacts, with no internet needed. The details are fixed once printed, and each extra field adds modules, so include only what people need.

Source: [RFC 2426](https://www.rfc-editor.org/rfc/rfc2426).

#### /qr-code-generator/email
> An email QR code stores a mailto: link, the standard email address format defined in RFC 6068, with an optional subject and message. Scanning it opens the phone's mail app with a new draft addressed to you. Nothing is sent until the person taps send, and it only works if they have a mail app set up, so print your email address beside the code as well.

Source: [RFC 6068](https://www.rfc-editor.org/rfc/rfc6068).

#### /qr-code-generator/sms
> An SMS QR code stores a phone number and an optional message in the SMSTO: format that phone scanners recognise. Scanning it opens the messaging app with the number and text filled in; the person still has to tap send, and pays their usual rate. Write the number with the + and country code, and keep the message short so the code stays simple to scan.

Source: [ZXing Barcode Contents](https://github.com/zxing/zxing/wiki/Barcode-Contents). Matches `qr-types.ts:212`.

#### /qr-code-generator/phone
> A phone QR code stores a number as a tel: link, the standard telephone address format defined in RFC 3966. When scanned, the phone shows the number and asks whether to call it; it never dials automatically. Include the + and country code so it works from foreign SIMs. The code holds very little data, so it scans well when small, but a new number means a new code.

Source: [RFC 3966](https://www.rfc-editor.org/rfc/rfc3966).

#### /qr-code-generator/whatsapp
> A WhatsApp QR code stores a wa.me click-to-chat link containing your number in international format and an optional prefilled message. Scanning it opens a WhatsApp chat with you, without the person saving your number first. They can edit the message before tapping send. It works with personal and WhatsApp Business numbers, and opens in the browser if WhatsApp is not installed.

Source: WhatsApp Help Center, "How to use click to chat" (link the faq.whatsapp.com article; confirm the URL).

#### /qr-code-generator/location
> A location QR code opens a map at an address or exact coordinates, so the person scanning can get directions. EndureQR encodes it as a Google Maps search link, which opens in the maps app or browser on both iPhone and Android; the older geo: format is ignored by the iPhone camera. Coordinates give the most precise pin. Enter latitude first, then longitude.

Source: [Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started). Matches `qr-types.ts:256-259`.

#### /qr-code-generator/event
> An event QR code stores a calendar entry (title, start and end time, place and details) in the iCalendar VEVENT format defined in RFC 5545. The iPhone Camera offers to add it to the calendar directly; on Android, support varies and Google Lens is often needed. Reading it needs no internet, but the details are fixed once printed, so link to an event page if plans might change.

Source: [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545).

#### /qr-code-generator/instagram
> An Instagram QR code stores a link to your Instagram profile, post or reel and opens it in the Instagram app if installed, or in the browser if not. Unlike the code inside the Instagram app, EndureQR's version uses your own colours, logo and frame and downloads as PNG, SVG, JPEG or PDF for print. If you change your username, a static code stops reaching you.

#### /qr-code-generator/facebook
> A Facebook QR code stores the link to a Facebook page, profile, group, event or post and opens it in the Facebook app or the browser. It is a standard URL QR code, so it is free, never expires and has no scan limit. Set a page username first for a shorter link, and check what logged-out visitors see, because groups and private profiles need an account.

#### /qr-code-generator/youtube
> A YouTube QR code stores a link to a YouTube channel, video, Short or playlist and opens it in the YouTube app or the browser. Link a specific video when the code has one job, such as a setup guide on packaging, and your channel for discovery. Unlisted videos play for anyone with the link, but private ones do not, and a deleted video leaves the code opening an unavailable page.

#### /qr-code-generator/linkedin
> A LinkedIn QR code stores the link to your LinkedIn profile (linkedin.com/in/your-name) or company page (linkedin.com/company/name), so people you meet can open it and connect in one scan. It opens in the LinkedIn app if installed, otherwise in the browser, showing what your public profile settings allow. Set a custom public profile URL before printing, because changing it later breaks a static code.

#### /qr-code-generator/x
> An X (Twitter) QR code stores a link to an X profile or a single post and opens it in the X app or the browser. EndureQR builds x.com links from a handle, and older twitter.com links currently redirect to x.com. Link a profile for follows and a post for one specific message. Renaming the handle breaks a static code, so use a dynamic code if it might change.

#### /qr-code-generator/tiktok
> A TikTok QR code stores a link to your TikTok profile (tiktok.com/@username) or a single video and opens it in the TikTok app if installed, otherwise in the browser. Unlike the code in the TikTok app, EndureQR's version uses your colours, logo and frame and downloads as PNG, SVG, JPEG or PDF for print, free and without a watermark. Private accounts show little to people who scan.

#### /qr-code-generator/paypal
> A PayPal QR code stores your PayPal.Me link, optionally with a fixed amount and currency, and opens your PayPal payment page in the PayPal app or the browser. The payment happens entirely in PayPal: EndureQR never sees it or takes a cut, and any fees are PayPal's. Leave the amount blank for tips and donations, and check codes on public display regularly for stickers.

### D. Pricing, About, home

#### /pricing
Add the passage under the H1 (replacing the 26-word intro) and an H2 "How much does EndureQR cost?":
> EndureQR has three plans. Free gives unlimited static QR codes in 17 types and one dynamic code you can edit after printing. Pro costs $3.99 a month or $29 a year for unlimited dynamic codes, analytics, iPhone/Android redirects, folders and CSV bulk creation. Lifetime is $79 once, with everything in Pro. Every plan has unlimited scans, and codes keep redirecting if you cancel.

Prices are USD before tax, from `src/content/plans.ts`.

#### /about
Use the definition sentence under the H1, then this paragraph (60 words):
> EndureQR is a web-based QR code generator founded in 2026 by Armaghan Abdul Qayyum in Lahore, Pakistan. Its free generator makes static QR codes in 17 types that never expire, with no sign-up or watermark. Its paid plans add dynamic QR codes you can edit after printing, and those codes keep redirecting to their last destination even after you cancel.

#### / (home)
Add under the hero lead, or as the first paragraph of "Most QR codes are rentals.":
> EndureQR is a QR code generator for codes you print once and keep. The free generator makes static codes for links, WiFi, contact cards, WhatsApp and 13 more types, with no sign-up or watermark. Dynamic codes let you change the destination after printing and see scans, and unlike many services, they keep redirecting to their last destination after you cancel.

### E. Alternatives (2)

These contain competitor facts. Keep the "checked" date visible and re-check every quarter. The current data was checked 26 Oct 2026.

#### /alternatives/bitly
> EndureQR is an alternative to Bitly for QR codes you need to edit after printing. According to Bitly's pricing page, checked 26 October 2026, Bitly Core costs $120 a year billed yearly and allows 5 QR codes and 5 destination changes a month. EndureQR Pro costs $29 a year with unlimited dynamic codes, edits and scans, and its codes keep redirecting if you cancel.

#### /alternatives/qrfy
> EndureQR is an alternative to QRFY for dynamic QR codes that stay usable after you stop paying. QRFY's 12-month plan costs $228 a year ($19 a month), and its FAQ says cancelled accounts cannot access their codes or data until they pay again (checked 26 October 2026). EndureQR Pro costs $29 a year, or $79 once, and its dynamic codes keep redirecting after you cancel.

### F. Industries (8)

The H1s are slogans and the intros are about 25 words. Add each passage as a paragraph directly under the H1, keeping the intro as a second line. Also rename the "Worked example" H2s, which currently read like "one code for a whole season of menus", to questions such as "How does a restaurant use one QR code for every menu?".

#### /industries/restaurants
> Restaurants use QR codes to open the menu, ordering page, WiFi and review page from table tents, receipts and windows. A dynamic code lets you print the table card once and change the menu it opens, for brunch, a new season or new prices, without reprinting. A free static WiFi code lets guests join without asking for the password. Keep printed menus for guests who prefer them.

#### /industries/real-estate
> Estate agents use QR codes on sign riders, flyers and brochures to open a listing's photos, price and viewing times. With a dynamic code, the same printed sign rider can point at each new listing, or at your available-properties page once a home goes under offer, and scan counts show which signs draw interest. A free vCard code lets buyers save your contact details.

#### /industries/events
> Event organisers use QR codes on posters, badges and signs to open the agenda, venue map, WiFi and feedback form. Because schedules change after the print deadline, a dynamic code lets the same printed badge open the live agenda during the event and the recordings afterwards. Tickets need a unique code per attendee from a ticketing system. EndureQR makes information codes, not tickets.

#### /industries/retail
> Retailers use QR codes on packaging, shelf talkers and windows to open care guides, manuals, promotions and app downloads. Packaging stays on shelves long after a web page changes, so a dynamic code lets you update where on-pack codes point without new packaging, and send iPhone and Android shoppers to different app stores. Send the printer an SVG or PDF so the code stays sharp.

#### /industries/healthcare
> Clinics and practices use QR codes on posters, leaflets and appointment cards to open public pages: check-in forms on their own systems, booking pages, aftercare guidance and directions. A dynamic code keeps every printed leaflet pointing at the current version. Keep personal and clinical details out of the code and its link. EndureQR counts only anonymous scans and holds no compliance certification such as HIPAA.

#### /industries/hotels
> Hotels use QR codes on room cards, lift posters and reception signs to open guest information, WiFi, spa or restaurant bookings and checkout pages. With dynamic codes, one card per room stays in place all year while the page it opens changes, and room codes can be created in bulk from a CSV. A free WiFi code connects guests without typing, but needs reprinting when the password changes.

#### /industries/education
> Schools and universities use QR codes on handouts, noticeboards and slides to open reading lists, timetables, sign-up forms and open-day pages. A dynamic code lets a handout printed once point at each new term's resources, and pausing it shows a message when a link should stop working. Scanning needs no app or account, and EndureQR analytics record anonymous counts, not student details.

#### /industries/agencies
> Agencies use QR codes across client print campaigns, moving one printed code from a teaser page to the launch page to a thank-you page. EndureQR lets an agency keep each client's codes in a folder, create a campaign's codes from a CSV of up to 500 rows, and export scans as CSV for client reports. Codes keep redirecting if the agency stops paying.

---

## 4. Prompts per page (use as question headings or FAQ questions)

These are written the way people phrase prompts to assistants. FAQ blocks are fine as on-page Q&A. Do not add new FAQPage markup for rich results.

| Page | Prompts |
|---|---|
| /guides/what-is-a-qr-code | what is a QR code and how does it work · who invented the QR code · how much data can a QR code hold · what are the squares in the corners of a QR code · is the QR code free to use or patented |
| /guides/how-to-scan-a-qr-code | how do I scan a QR code on my iPhone · how to scan a QR code on Samsung/Android · how to scan a QR code from a screenshot · can I scan a QR code with my laptop · do I need an app to scan QR codes |
| /guides/how-to-make-a-qr-code | how do I make a QR code for free · how to create a QR code for a link · how to make a QR code for a PDF · what's the best file format for a QR code · how do I make a QR code that doesn't expire |
| /guides/do-qr-codes-expire | do QR codes expire · why did my QR code stop working · do free QR codes stop working after 14 days · what happens to my QR codes if I cancel my subscription · how to make a permanent QR code |
| /guides/static-vs-dynamic-qr-codes | difference between static and dynamic QR code · should I use a static or dynamic QR code · is a dynamic QR code worth paying for · can I change a static QR code after printing |
| /guides/qr-code-size-for-printing | what is the minimum size for a QR code · how big should a QR code be on a poster · QR code size for a business card · what DPI should a QR code be · how much white space around a QR code |
| /guides/qr-code-for-restaurant-menu | how to make a QR code for my restaurant menu · should a menu QR code be static or dynamic · how do I update my menu without reprinting the QR code · where to put QR codes on restaurant tables |
| /guides/wifi-qr-code | how do I make a QR code for my WiFi · is it safe to share WiFi with a QR code · does a WiFi QR code work with hidden networks · what happens to a WiFi QR code when I change the password |
| /guides/qr-code-design-best-practices | can a QR code be any colour · how big can a logo be in a QR code · will rounded dots stop a QR code scanning · does a QR code need a call to action |
| /guides/qr-code-not-scanning | why won't my QR code scan · QR code works on screen but not printed · why does my QR code scan but the page doesn't load · QR code works on iPhone but not Android |
| /guides/are-qr-codes-safe | are QR codes safe to scan · what is quishing · can a QR code hack my phone · are QR codes on parking meters a scam · how to tell if a QR code is fake |
| /guides/qr-code-business-card | should I put a QR code on my business card · vCard or LinkedIn QR code for a business card · what size QR code for a business card · how to make a vCard QR code |
| /guides/qr-code-error-correction | what are QR code error correction levels · which error correction level should I use · why do QR codes with logos need level H · does higher error correction make a QR code bigger |
| /guides/qr-code-for-google-reviews | how do I make a QR code for Google reviews · where do I find my Google review link · can I offer a discount for Google reviews · where to put a Google review QR code |
| /guides/track-qr-code-scans | how do I track QR code scans · can you track a static QR code · how to use UTM parameters with a QR code · can a QR code tell you who scanned it |
| /guides/qr-code-for-events | how to use QR codes at an event · can I use a free QR code for event tickets · how to make a QR code that adds an event to the calendar · what if the event schedule changes after printing |
| /dynamic-qr-code-generator | best dynamic QR code generator · dynamic QR code generator free · cheapest dynamic QR code without a subscription trap · dynamic QR code that keeps working after I cancel · how to edit a QR code after printing |
| /qr-code-with-logo | how to make a QR code with a logo for free · will a logo stop my QR code working · what size should the logo be in a QR code · QR code with logo no watermark |
| /app-download-qr-code | one QR code for App Store and Google Play · how to make an app download QR code · smart QR code iPhone and Android · can a QR code detect the phone type |
| /bulk-qr-code-generator | how to generate QR codes in bulk from Excel/CSV · bulk QR code generator with editable links · create 500 QR codes at once · bulk QR codes for restaurant tables |
| /qr-code-generator | best free QR code generator · free QR code generator no sign-up no watermark · QR code generator that never expires · free QR code generator with logo |
| /qr-code-generator/* | how to make a [WiFi / vCard / WhatsApp / email / SMS / phone / location / event / Instagram / Facebook / YouTube / LinkedIn / X / TikTok / PayPal / text / URL] QR code · does a [type] QR code work on iPhone/Android · does a [type] QR code need internet · can I change a [type] QR code after printing |
| /pricing | how much does EndureQR cost · is EndureQR free · does EndureQR have a lifetime deal · EndureQR refund policy |
| /about | what is EndureQR · who owns EndureQR · is EndureQR legit · where is EndureQR based |
| /alternatives/bitly | Bitly QR code alternative · is Bitly QR code worth it · Bitly QR code limits on Core plan · cheaper alternative to Bitly for QR codes |
| /alternatives/qrfy | QRFY alternative · what happens to QRFY codes if I cancel · QRFY vs EndureQR · QR code generator without subscription |
| /industries/* | QR codes for [restaurants / real estate signs / events / retail packaging / healthcare / hotels / schools / agencies] · how do [industry] use QR codes · best QR code generator for [industry] |

---

## 5. Tables, lists and definitions that improve extraction (with sources)

1. **"QR code facts" table on /guides/what-is-a-qr-code.** Every row is sourced:

   | Fact | Value | Source |
   |---|---|---|
   | Inventor | Denso Wave, team led by Masahiro Hara | qrcode.com/en/history |
   | Announced | 1994 | qrcode.com/en/history |
   | ISO standard | ISO/IEC 18004, first approved June 2000; current edition 2024 | qrcode.com/en/about/standards.html; iso.org (verify) |
   | Sizes | 40 versions, 21 x 21 to 177 x 177 modules | qrcode.com/en/about/version.html |
   | Max capacity (v40, level L) | 7,089 numeric / 4,296 alphanumeric / 2,953 bytes / 1,817 kanji | ISO/IEC 18004; Denso FAQ ("about 3 KB") |
   | Error correction | L 7%, M 15%, Q 25%, H 30% | qrcode.com/en/about/error_correction.html |
   | Quiet zone | 4 modules | qrcode.com/en/howto/code.html |
   | Licence | Free to use when following JIS/ISO standards; "QR Code" is a Denso Wave trademark | qrcode.com/en/faq.html |

2. **"What each code type stores" table on /qr-code-generator.** Columns: type, encoded format, needs internet to read?, can change after print?

   | Type | Encoded format |
   |---|---|
   | URL | https:// |
   | WiFi | `WIFI:T:..;S:..;P:..;;` |
   | vCard | vCard 3.0 |
   | Email | mailto: |
   | SMS | SMSTO: |
   | Phone | tel: |
   | WhatsApp | wa.me link |
   | Location | Google Maps URL |
   | Event | VEVENT |
   | Social and PayPal | https links |

   Data comes from `src/lib/qr-types.ts`, so it is accurate by construction. Models quote tables like this for "what format does a WiFi QR code use".
3. **"Cancellation terms compared" table.** This is the most citable original asset EndureQR can publish. Take 8-10 dynamic QR providers and quote each provider's own help or FAQ text on what happens to codes when you cancel, with the URL and the date checked. The same method is already used for Bitly and QRFY in `competitors.ts`. Put it on a new guide, for example `/guides/dynamic-qr-code-cancellation-policies`. Listicle writers and Reddit threads link to this kind of page, and assistants cite it for "QR code generator that doesn't expire".
4. **A definition list on each type page** ("Encodes / Opens / Needs internet / Editable after print / Expires"). Five lines that answer most type-page prompts on their own.
5. **Stats with sources.** Don't use QR usage statistics from aggregator blogs. If you want one, Wikipedia cites "89 million people in the United States scanned a QR code" in 2022, but trace it to its original source before using it. Better options are the standards facts above, the FTC and IC3 warnings already cited, and EndureQR's own anonymised aggregate data once real usage exists (for example "share of scans from iPhone vs Android across EndureQR codes, Nov 2026"). Clearly dated, first-party aggregates are original data that models cite.

---

## 6. AI crawler access and llms.txt (verified live 4 Nov; tag re-checked 18 Nov)

robots.txt (live, 200) contains: `User-Agent: *` / `Allow: /` / `Disallow: /dashboard` / `Disallow: /paused` / `Sitemap`. There are no bot-specific groups. Every user-agent below got **HTTP 200** with byte-identical SSR HTML containing the H1 on /guides/what-is-a-qr-code (256,572 B), /qr-code-generator/wifi (304,986 B) and / (610,872 B). None was challenged.

| Crawler | Governs | Status |
|---|---|---|
| OAI-SearchBot | ChatGPT search results and citations | Allowed, 200 |
| ChatGPT-User | User-triggered fetches inside ChatGPT | Allowed, 200 |
| GPTBot | OpenAI model **training** only (not ChatGPT search) | Allowed, 200 |
| Claude-SearchBot | Claude search citations | Allowed, 200 |
| Claude-User | User-triggered fetches in Claude | Allowed, 200 |
| ClaudeBot | Anthropic model **training** only | Allowed, 200 |
| PerplexityBot | Perplexity index and citations | Allowed, 200 |
| Perplexity-User | User-triggered fetches | Allowed, 200 |
| Bingbot | Bing index, which feeds Copilot and much of ChatGPT search | Allowed, 200 |
| Googlebot | Google Search, AI Overviews and AI Mode inclusion | Allowed, 200 |
| Google-Extended | Gemini/Vertex training and grounding, plus training of Search gen-AI models. It does **not** control AIO inclusion. | Allowed (inherits `*`), 200 |
| Applebot / Applebot-Extended | Siri/Spotlight (Applebot); Apple Intelligence training only (Applebot-Extended) | Allowed, 200 |
| CCBot | Common Crawl (training corpora) | Allowed, 200 |
| DuckAssistBot | DuckDuckGo AI answers | Allowed, 200 |

**Verdict:** access is optimal and robots.txt needs no change. Rendering: `render_page.py --mode auto` gave `is_spa=false` and 565 words extracted from the WiFi page.

**Bing (the real gap for ChatGPT and Copilot):**
- No `msvalidate.01` meta on the home page, re-checked 18 Nov 2026.
- A scraped Bing `site:endureqr.com` query returned no endureqr.com URLs. Scraped Bing SERPs are degraded, so confirm in Bing Webmaster Tools.
- Actions:
  - Verify the site in Bing Webmaster Tools (import from GSC is fastest).
  - Submit sitemap.xml.
  - Run `npm run indexnow`.
  - Automate IndexNow on deploy.

  Until Bing indexes the site, ChatGPT search and Copilot can rarely cite it.

**llms.txt:**
- Present and well-formed: 200 `text/plain; charset=utf-8`, 11,425 bytes.
- It has an H1, a blockquote, a pricing line, and 6 H2 sections (generators, features, guides, industries, comparisons, product).
- It now references **all 55 sitemap URLs**, so the 2 Nov gap is closed.
- `/llms-full.txt` returns 404 (optional). There is no RSL `license.xml` (404). That is optional, and only worth adding if you want machine-readable licence terms for AI use.

Quality fixes in `src/app/llms.txt/route.ts`:
1. **Industry lines use the slogan headline**, for example "Print the table tent once. Change the menu every night.", which tells a model nothing. Use the section 3F passage, or `industry.intro`.
2. **Comparison lines use the headline.** Use `c.pitch` instead, which carries the prices.
3. **Type-page lines repeat** "Free, no sign-up, no watermark" 17 times. Move that to one shared line and use the first sentence of each section 3C passage instead.
4. **Add a "## Key facts" block:**
   - the one-sentence definition
   - founded, founder and location
   - the cancel policy, with the "as long as EndureQR operates" condition and the 90-day notice
   - 14-day refund
   - unlimited scans
   - downloads up to 4096 px
   - the free generator runs in the browser
   - 500-row CSV bulk limit
   - analytics store no IP addresses
5. Put the definition sentence in the blockquote.

Remember that Google ignores llms.txt, and no major engine has confirmed using it at retrieval time. It is low-cost insurance, not a lever.

---

## 7. Does ChatGPT or Perplexity mention EndureQR yet?

Not measurable from this environment:
- No DataForSEO or LLM-answer API was available.
- Perplexity's web UI returned a 301 bot wall.
- DuckDuckGo and Mojeek served bot challenges.
- Reddit's search API was blocked.
- Bing scraping returned degraded, single-keyword results.

The inference is strong anyway: **EndureQR is almost certainly not mentioned** for "best free QR code generator that never expires" or similar prompts.

Reasons:
1. Recommendation answers are built from third-party sources (listicles, Reddit, review sites), and no third-party mention of EndureQR was found.
2. Bing, which ChatGPT search and Copilot rely on, showed no endureqr.com pages.
3. The domain is about 2 weeks old.

The only realistic near-term path to a mention is Perplexity or Google AI Mode citing a guide for an informational prompt (for example "do QR codes expire"), not a "best" list.

**Manual test protocol** (do it monthly and log the results):
- Run these 10 prompts in ChatGPT (search on), Perplexity, Copilot, Gemini and Google AI Mode, logged out where possible:
  - best free QR code generator that never expires
  - QR code generator without subscription
  - dynamic QR code that works after cancelling
  - do QR codes expire
  - Bitly QR alternative
  - QRFY alternative
  - WiFi QR code generator
  - QR code with logo free
  - bulk QR codes from CSV
  - static vs dynamic QR code
- Record whether EndureQR is mentioned, whether an endureqr.com URL is cited, and which sources are cited. The cited sources are your outreach list.

---

## 8. Off-site brand-mention plan (feeds AI answers)

What the search showed:
- **Bing's head SERP for "QR code generator"** queries (decoded results, 4 Nov) is the same set every time: qr-code-generator.com, qr.io, me-qr.com, the-qrcode-generator.com, qrfy.com, en.wikipedia.org/wiki/QR_code, qr-code-generator.org and qr.net. These are the brands ChatGPT and Copilot already "know" for this category.
- **AlternativeTo** (fetched; QR Code Generator alternatives page updated 22 Oct 2026) is crowd-sourced, and the counts are tiny: QRFY has 2 likes and Autonix 1. A listing with a handful of genuine likes would sit near the top. AlternativeTo pages are frequently cited by Perplexity and ChatGPT for "alternative to X" prompts.
- **G2 and Capterra** QR code generator categories exist but returned 403 to automated fetches. Listicles from Zapier, TechRadar and PCMag could not be fetched (404 or blocked), so which listicles assistants cite could not be confirmed from here. Treat them as targets to verify with the manual protocol above.
- **Reddit and YouTube** could not be searched (blocked). Industry studies consistently put Reddit and YouTube among the most-cited domains in AI answers. YouTube mentions are the strongest observed correlate (about 0.74).

Plan, in order of payoff per hour. Everything must be honest: disclosed affiliation, no fake reviews, and no review gating.

| # | Action | Why it reaches AI answers | Effort |
|---|---|---|---|
| 1 | **Create LinkedIn company and founder profiles, a YouTube channel, X and a GitHub org**, all with the identical one-sentence definition. Add them to `sameAs`. | Lets models resolve the entity and merge mentions. Prerequisite for everything else. | 3 h |
| 2 | **List on AlternativeTo** as an alternative to QRFY, QR Code Generator (Bitly), QR Code Monkey, ME-QR and QR.io. Also list on SaaSHub and Slant. | Crowd-sourced "alternative to X" pages are cited for exactly the prompts in /alternatives. Low competition. | 2 h |
| 3 | **Publish 4-6 short YouTube how-tos** mirroring the top guides (WiFi QR code, QR code with logo, do QR codes expire, static vs dynamic). Use the definition in each description and link the guide. | YouTube is the strongest correlate of AI citation, and Google AI Mode pulls videos into answers. | 2-3 days |
| 4 | **Publish the "dynamic QR cancellation policies compared" page** (section 5, item 3), then send it to writers of existing "best QR code generator" listicles as a correction or update source. | Original, sourced data is what listicles and Perplexity cite. It is a reason to be mentioned beyond "please add us". | 2 days, plus outreach |
| 5 | **Launch on Product Hunt.** The `/topics/qr-codes` URL 404'd, so pick the current QR or productivity topic at launch. | A dated, indexed third-party page with the brand name and description. | 1 day |
| 6 | **Claim G2 and Capterra vendor listings** (free). Only invite real users to review once they exist. | Both are heavily cited for "best X software" prompts. | 2 h now |
| 7 | **Reddit:** the founder account answers existing threads with full disclosure (r/smallbusiness, r/restaurateur, r/realtors, r/HomeNetworking, r/sysadmin for WiFi codes, r/Entrepreneur). Answer the question first and link the guide, not the product, unless asked. | Reddit is among the most-cited sources in ChatGPT and Perplexity answers. | 30 min/week |
| 8 | **Open-source a small utility on GitHub**, for example the WiFi escaping and encoding function or a CSV-to-QR script, with a README linking endureqr.com. | GitHub pages are crawled and cited for technical prompts, and give a credible backlink. | 1 day |
| 9 | **Don't create a Wikipedia article or Wikidata item yet.** EndureQR does not meet notability, and an article would be deleted. Revisit after independent press coverage. | | |

Stop doing: nothing found. No spammy footprints exist yet. Keep it that way: no paid listicle placements without disclosure, and no review swaps.

---

## 9. Top 5 highest-impact changes

| # | Change | Impact | Effort |
|---|---|---|---|
| 1 | Bing Webmaster verification (`msvalidate.01`), sitemap submission, IndexNow now and on deploy | High: unlocks ChatGPT search and Copilot | 1 h |
| 2 | Profiles, `sameAs`, AlternativeTo, Product Hunt and G2/Capterra listings, plus 4-6 YouTube how-tos (section 8) | High: the only route into "best X" answers | 1 day setup, then about 3 days of video |
| 3 | Paste the section 3 passages: type-page "What is a X QR code?" H2s with sources, feature-page question H2s, industry definition passages | Medium-high: passage selection in AIO and Perplexity | 1 day |
| 4 | Entity block on About (definition plus `<dl>`), and Organization `foundingDate`, `alternateName` and `disambiguatingDescription` | Medium: entity resolution across all engines | 2 h |
| 5 | Fix the conflicting and unquotable facts (logo area vs width, dynamic table header, industry "stats", cancel-promise condition), and add llms.txt Key facts | Medium: stops models quoting wrong numbers | 1-2 h |

---

## 10. Structured findings (audit-data.json, category "AI Search Readiness")

```json
{
  "category": "AI Search Readiness",
  "score": 71,
  "previous_score": 69,
  "dimensions": {"citability": 85, "structural_readability": 88, "multi_modal": 32, "authority_brand": 42, "technical_accessibility": 93},
  "platform_scores": {"google_aio": 55, "gemini": 50, "chatgpt": 40, "perplexity": 58, "bing_copilot": 38},
  "crawler_access": {"OAI-SearchBot": "allowed", "ChatGPT-User": "allowed", "GPTBot": "allowed", "Claude-SearchBot": "allowed", "Claude-User": "allowed", "ClaudeBot": "allowed", "PerplexityBot": "allowed", "Perplexity-User": "allowed", "Bingbot": "allowed", "Googlebot": "allowed", "Google-Extended": "allowed", "Applebot": "allowed", "CCBot": "allowed", "DuckAssistBot": "allowed"},
  "llms_txt": "present_complete_coverage_weak_descriptions",
  "ai_mentions_measured": false,
  "findings": [
    {"id": "GEO-1", "severity": "high", "title": "Bing not verified or crawled", "evidence": "No msvalidate.01 (re-checked 2026-11-18); Bing site: query shows no endureqr.com URLs", "fix": "Verify in Bing WMT, submit sitemap, npm run indexnow, automate on deploy"},
    {"id": "GEO-2", "severity": "high", "title": "Zero third-party mentions; no sameAs", "evidence": "No profiles or listings found; AlternativeTo QR category has low-competition crowd-sourced lists", "fix": "Profiles + sameAs, AlternativeTo/Product Hunt/G2/Capterra, YouTube how-tos, disclosed Reddit answers, original cancellation-policy comparison"},
    {"id": "GEO-3", "severity": "medium", "title": "No definitional entity sentence", "evidence": "Home and About H1s are slogans; only 'EndureQR is an independent product' in the alternatives FAQ", "fix": "Use the one-sentence definition on About/home/llms.txt/Organization; add an at-a-glance <dl>; foundingDate, alternateName, disambiguatingDescription"},
    {"id": "GEO-4", "severity": "medium", "title": "Type, feature and industry pages lack sourced question-led passages", "evidence": "17 type pages: 0 outbound sources, 0 question body H2s; feature H2s declarative; industry H1s are slogans", "fix": "Paste the section 3 passages"},
    {"id": "GEO-5", "severity": "medium", "title": "Conflicting or unquotable facts", "evidence": "Design guide: logo 20-25% of area vs logo page: 15-35% of width; dynamic table header omits the free code; industry stats like '5 years of shelf life'", "fix": "Standardise on width; fix the header; reword the stat blocks"},
    {"id": "GEO-6", "severity": "low", "title": "Weak section leads in guides", "evidence": "About 25 H2 sections open with fewer than 30 words or refer back to earlier text", "fix": "Section fixes in section 3A"},
    {"id": "GEO-7", "severity": "low", "title": "llms.txt descriptions are slogans for industries and comparisons", "evidence": "route.ts uses i.headline and c.headline", "fix": "Use the intro/pitch; add a Key facts block"},
    {"id": "GEO-8", "severity": "low", "title": "Type pages expose no date", "evidence": "trafilatura inferred publication_date 2026-01-01 from the footer '© 2026'", "fix": "Visible updated date plus dateModified on WebApplication"}
  ]
}
```

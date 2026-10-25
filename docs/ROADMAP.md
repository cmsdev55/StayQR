# StayQR roadmap and claim ledger

Every feature the site promises is listed here with the phase that makes it real. **Rule:** copy may
only describe a feature in the present tense once its row is ✅. Anything ⏳ must either be built
before launch or be worded as "on our roadmap" on the page that mentions it.

Last reviewed: 26 October 2026.

## Status key

- ✅ Built and working in this repo
- ⏳ Promised on the site, needs Phase 2 (backend) before launch
- 🗺 Worded as roadmap on the site (safe to launch without it)

## Phase 1: free tool engine and SEO (this repo, done)

| Claim | Where it appears | Status |
|---|---|---|
| Free static codes, no sign-up, no watermark, never expire | Landing, hub, every type page, FAQ, pricing | ✅ |
| 17 types: URL, text, WiFi, vCard, email, SMS, phone, WhatsApp, location, event, Instagram, Facebook, YouTube, LinkedIn, X, TikTok, PayPal | Hub, type pages, footer | ✅ `src/lib/qr-types.ts` |
| Logo upload, auto error correction H with a logo | Generator, pricing matrix, Retail FAQ, guides | ✅ |
| Frames with a call to action (label, box, pill) | Generator, pricing matrix | ✅ |
| PNG, SVG, JPEG and PDF (300 dpi) up to 4096 px | Generator, pricing, FAQ | ✅ `src/lib/qr-export.ts` |
| Nothing typed into the generator leaves the browser | Hub FAQ, logo hint | ✅ (keep true: no analytics on field values) |
| Per-type SEO pages, guides, sitemap, JSON-LD | `/qr-code-generator/*`, `/guides/*` | ✅ |
| AdSense on tool and guide pages only, `ads.txt` | `AdSlot`, `/ads.txt` | ✅ (off until env is set, see below) |

## Phase 2: accounts, billing, dynamic codes (Supabase + Lemon Squeezy)

These are sold on `/pricing` and the landing page **today**, so they must ship before taking money.

| Claim | Where it appears | Status |
|---|---|---|
| Sign up / log in | Header, `/signup`, `/login` | ⏳ UI only |
| Dynamic codes: edit destination after printing | Landing features, pricing, industries | ⏳ needs DB + edge redirect |
| Codes keep redirecting after you cancel | Everywhere (core promise) | ⏳ redirect service must not check billing state |
| Unlimited dynamic codes and scans, no throttling | Pricing, features | ⏳ needs rate-limit policy for abuse only |
| Analytics: devices, cities, time of day; 12 months on Pro, forever on Lifetime | Pricing matrix, features | ⏳ scan logging + retention job |
| iOS / Android smart redirect | Features, pricing | ⏳ user-agent routing in redirect |
| Bulk create from CSV (500 rows) | Features, pricing, industries | ⏳ |
| Export scans as CSV | Agencies FAQ | ⏳ |
| Folders and search | Pricing matrix, Agencies use case | ⏳ |
| Pause a code with a friendly page | Pricing matrix, `/paused` | ⏳ page exists, toggle does not |
| Pro $3.99/mo or $29/yr; Lifetime $79 once | Pricing | ⏳ Lemon Squeezy products + webhooks |
| Abuse reporting and takedown for malicious destinations | Terms | ⏳ required before public dynamic codes |
| Priority support (Lifetime) | Pricing | ⏳ define what it means |

## Phase 3: growth features (worded as roadmap on the site)

| Feature | Where the site mentions it | Status |
|---|---|---|
| Scheduled destination change | Events FAQ | 🗺 |
| Team seats with their own logins | Healthcare FAQ | 🗺 |
| Shareable read-only report links | Agencies FAQ | 🗺 |
| Client access to their own folder | Agencies FAQ | 🗺 |
| Other planned: password-protected codes, scan limits per code, GA4/pixel, custom domain, API, i18n pages, referral programme | Not on the site yet | — |

## Launch checklist for ads (Phase 1 is wired, needs your accounts)

1. Get AdSense approval for `stayqr.com` (needs the site live with the guides and tool pages indexed).
2. Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…` and the slot IDs `NEXT_PUBLIC_ADSENSE_SLOT_TOOL`,
   `NEXT_PUBLIC_ADSENSE_SLOT_GUIDE`. `/ads.txt` starts returning the publisher line automatically.
3. Turn on Google's consent message (Privacy & messaging → European regulations) before serving ads in
   the EEA, UK and Switzerland. Update `src/content/legal.ts` (Privacy) to mention advertising cookies.
4. Ads never go on the dashboard, pricing, auth, checkout or `/paused` pages.

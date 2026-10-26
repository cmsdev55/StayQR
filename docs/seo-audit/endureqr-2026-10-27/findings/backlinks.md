# Backlink profile: endureqr.vercel.app (old address: stayqr-six.vercel.app)

Audit date: 2026-10-27. Tier 0 (Common Crawl + verification crawler). No Moz, Bing or DataForSEO key is configured.

**Backlink Health Score: INSUFFICIENT DATA.** Fewer than 4 scoring factors have a data source, so no numeric score is given.

## 1. Sources and what each returned

| Source | Confidence | Result |
|---|---|---|
| Common Crawl web graph, release `cc-main-2026-jan-feb-mar` (quarterly) | 0.50, domain level only | `endureqr.vercel.app`: not in crawl, not in rankings. `stayqr-six.vercel.app`: not in crawl, not in rankings. PageRank, harmonic centrality and their ranks are all null for both. |
| Common Crawl, shared parent `vercel.app` (for context only) | 0.50 | In crawl and rankings: PageRank rank 374, harmonic centrality rank 928, 106,085 hosts. These figures describe the shared parent, not this site (see section 3). |
| Moz API | not configured | No data |
| Bing Webmaster API | not configured | No data |
| DataForSEO | not configured | No data |
| Verification crawler | 0.95 when used | Not run. There is no list of known backlinks to verify. |
| Redirect check (HTTP requests made during this audit) | 0.95 | See section 2. |

Not available from any source: referring domains, backlink count, anchor text, spam or toxicity, follow/nofollow split, link velocity, geographic spread.

Scoring factors scored: none. Skipped: all seven (referring domain count, domain quality, anchor naturalness, toxic ratio, link velocity, follow/nofollow, geography).

## 2. Old-address redirect (observed 2026-10-27)

| Request | Result |
|---|---|
| `stayqr-six.vercel.app/about`, `/pricing`, `/guides`, `/robots.txt`, `/sitemap.xml` | 308 to the same path on `endureqr.vercel.app` |
| `stayqr-six.vercel.app/` and `/?utm=1` | **200**, serving the new EndureQR homepage. No redirect. Canonical and og:image on that response point to `endureqr.vercel.app`. |

The `vercel.json` rule is `/:path*` with a host match on `stayqr-six.vercel.app`, `permanent: true`. My inference, not confirmed, is that this pattern does not match the bare `/`. The response is cached (`x-vercel-cache: HIT`).

`docs/LAUNCH.md` says the redirect is a 301. It is actually a 308. Both are permanent and both are treated alike by search engines, so this is a doc inaccuracy only.

## 3. Authority note (no scores)

- There is no measurable link authority for either hostname. Common Crawl has neither, and the web-graph release predates the rename and probably predates meaningful link activity. I cannot say how many backlinks exist. I can say none are visible in the one free source available.
- Do not read the `vercel.app` figures as ours. Every `*.vercel.app` site shares that parent, with 106,085 hosts in the graph. The parent's rank says nothing about this site's authority. Domain-level tools (Moz DA, Ahrefs DR, Semrush AS) will either return nothing for a subdomain or report the parent's numbers. Do not quote any such number.
- Link equity should not be expected to carry meaningfully from `*.vercel.app` to `endureqr.com`. Both hosts are temporary. Links earned now at the `.vercel.app` URLs will need a redirect chain later.
- Common Crawl updates quarterly. Nothing built this quarter will appear for months, so treat Common Crawl as a slow check. Add a free Moz key (2,500 rows a month) and verify the site in Bing Webmaster Tools and Google Search Console, which will show real link data for the property once registered.
- "Link profile: none visible" is the honest state for a pre-launch site renamed yesterday.

## 4. Findings

| # | Severity | Finding | Source |
|---|---|---|---|
| B1 | **High** | No backlink data and no authority signal exist for either hostname. The profile is effectively empty or unmeasurable, and with the current tooling it cannot be told which. The site has no link-based ranking support yet. | CC 0.50 |
| B2 | **High** | The permanent domain `endureqr.com` is not live yet. Any link built before then points at a temporary host and will pass through at least one redirect. `.env.example` already expects `NEXT_PUBLIC_SITE_URL=https://endureqr.com`. | Observed config, 0.95 |
| B3 | **Medium** | The old host's homepage returns 200 instead of redirecting. Canonical to the new host limits duplication, but any existing link or bookmark to `stayqr-six.vercel.app/` does not receive a 308, so the redirect signal is missing on the one URL most likely to have been linked. Fix: add an explicit `source: "/"` redirect, or a `has: host` redirect that covers the root, and retest. (Repo not modified in this audit.) | Observed, 0.95 |
| B4 | **Medium** | A second migration is planned (`.vercel.app` to `endureqr.com`). If `stayqr-six` keeps pointing at `endureqr.vercel.app`, the chain becomes stayqr-six, then endureqr.vercel.app, then endureqr.com. At cutover, repoint the old rule straight to `endureqr.com`, and keep both old hosts redirecting for at least 12 months. | Inference |
| B5 | **Medium** | Domain-level metrics for `*.vercel.app` hosts are the shared parent's and are misleading (see section 3). Do not report them as site authority. | CC 0.50 |
| B6 | **Low** | No toxic-link, anchor-text or velocity analysis is possible. A free Moz key and Bing/GSC verification would close most of the gap at no cost. | Tier 0 limit |
| B7 | **Low** | Doc mismatch: `docs/LAUNCH.md` describes a 301, but the live redirect is a 308. | Observed |
| B8 | **Info** | The verification crawler is ready. After outreach lands links, run `verify_backlinks.py --target <url> --links <file>` to confirm each link is live, whether it is dofollow, and its anchor. | Tool available |

Out of scope here: E-E-A-T and content depth (`/seo content`), crawlability (`/seo technical`).

## 5. First 90 days link plan (new SaaS QR code generator)

Legend: **[NOW]** can be done on the `.vercel.app` host without much loss. **[NEEDS endureqr.com]** wait until the permanent domain is live and serving 200 (not a redirect), because the link would be to a temporary URL, or the listing is hard to change afterwards. No link counts are promised. Targets below are effort goals, not forecasts.

### Days 0 to 14: foundation (mostly no external links)

1. **[NOW]** Fix B3 and register the property in Google Search Console and Bing Webmaster Tools. Add a Moz free key. This gives a real baseline.
2. **[NEEDS endureqr.com]** Register and go live on `endureqr.com`, with `www` redirecting to the apex, `NEXT_PUBLIC_SITE_URL` updated, sitemap and canonicals switched, and both old hosts redirecting directly to it. Set up `hello@endureqr.com` so outreach comes from the brand domain.
3. **[NOW]** Claim brand handles (X, LinkedIn, GitHub, YouTube, Instagram) with the name EndureQR. These are low-value links but protect the brand. Add the site URL once the permanent domain is live.
4. **[NOW]** Prepare a one-page press and assets kit: logo, screenshots, a three-line description, founder bio, and one factual hook (for example, "codes keep working after you cancel"). Only claim what the product does.
5. **[NOW]** Check which pages deserve links: the homepage, the free generator pages, the `/guides/*` set, and the two `/alternatives/*` pages. Link to these, not to `/login` or `/dashboard`.

### Days 15 to 45: directories and listings

Submit only when the product is usable. Most listings are nofollow or low weight. The value is discovery, brand-name search results and a few real referral visitors.

6. **[NEEDS endureqr.com]** Product directories and launch sites: Product Hunt, BetaList, AlternativeTo (list as an alternative to Bitly and QRfy, matching the existing alternatives pages), SaaSHub, Indie Hackers product page, Crunchbase, and Startup directories such as Uneed or Peerlist. Product Hunt launches and AlternativeTo entries are hard to change later, so use the final URL.
7. **[NEEDS endureqr.com]** Review platforms (G2, Capterra, GetApp, Trustpilot). These need a working paid product and real reviews. Create profiles only once there are genuine customers to ask. Do not buy or fabricate reviews.
8. **[NOW, but low priority]** Generic social profiles (GitHub org README, LinkedIn company page). Skip bulk directory submission services and any link packages. They create the toxic profile that section 4 would later have to detect.
9. Community presence without self-promotion: answer QR-code questions on Reddit, Stack Overflow, and relevant forums with real help. Only link where it is allowed and relevant. **[NOW]** for answering, **[NEEDS endureqr.com]** for any link you leave.

### Days 30 to 70: tool roundups

10. **[NEEDS endureqr.com]** Build a list of 40 to 60 "best QR code generator", "free QR code generator" and "Bitly alternatives" roundup pages (search the exact phrases, then filter to pages updated within about 12 months). Record the author, last update and whether the page accepts new entries.
11. **[NEEDS endureqr.com]** Send short, individual pitches to roughly 10 to 15 authors a week. Lead with what is different and verifiable (editing a printed code, scan analytics, behaviour after cancellation), offer a free upgraded account for testing, and never ask for a specific anchor. Expect low response, since many roundups are affiliate-driven and some will ask for payment. Decline paid placement that is not disclosed.
12. **[NEEDS endureqr.com]** Where a roundup already lists a competitor, ask for inclusion as an addition, not a replacement.
13. Track each outreach in a sheet. After each link lands, verify it with the crawler (B8).

### Days 30 to 90: guide outreach

The site already has 16 guides (for example, do QR codes expire, QR code size for printing, QR code error correction, are QR codes safe). These are the linkable assets.

14. **[NEEDS endureqr.com]** Pick the 3 to 5 most original guides and find pages that link to weaker sources on the same topic: resource pages, school and library "QR code" pages, restaurant and event-planning blogs, print-shop blogs. Pitch the guide as a replacement or supplement for a broken or thin source. Broken-link outreach (find a dead link on a relevant page, offer your guide) is the most polite form.
15. **[NEEDS endureqr.com]** Create one citable data asset, such as a short original study or a printable cheat sheet (minimum print size by scan distance) with a clear methodology. Pitch it to the same lists. Do not invent statistics. Only publish numbers you measured.
16. **[NEEDS endureqr.com]** Sector pages (`/industries/restaurants`, `/industries/real-estate`, and others) can be pitched to trade blogs and local business associations. Offer a short guest tip in return for a link. Prefer relevance over volume.
17. **[NOW]** Contribute expert comments on journalist-request services (HARO-style and Qwoted-style lists) on QR safety and scams. Only the real founder should respond, and any link would go to the permanent domain, so ask for the brand name mention until then.

### Days 45 to 90: free-tool embed and attribution

18. **[NEEDS endureqr.com]** Free static generators (the `/qr-code-generator/*` pages already cover URL, Wi-Fi, vCard and others). Add an optional "Made with EndureQR" attribution line that users can keep or remove, linking to the generator page. Do not force it or hide it in a way users cannot remove, and do not make the download depend on keeping the link.
19. **[NEEDS endureqr.com]** Offer an embeddable widget (an iframe with a visible, plain, followable credit link to the generator) for blogs, schools and small-business sites. Provide the snippet on a dedicated page, and make the link visible and honest. Before launching it, check the CSP: the current `frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN` headers block framing everywhere, so an embed route needs its own looser headers, scoped to that route only.
20. **[NEEDS endureqr.com]** Provide a short "how to cite or link to this tool" snippet on the embed page. Keep generated codes for free users neutral, with no branded logo inside the QR, so the codes remain usable.
21. Keep the free tools clearly labelled as free, with the dynamic paid features separate. That keeps links earned for the tool relevant to the product page.

### Day 90 check

- Verify every acquired link with the crawler and record dofollow, anchor and status.
- Add the Moz, GSC and Bing numbers to the next backlink audit. Expect small numbers: a handful to a few dozen referring domains is a realistic result for this effort level, but this is my judgement, not a measured forecast.
- Re-run Common Crawl once the next release is published and the domain is old enough to appear.

### Do not do

- Buy links, use link-exchange or PBN services, or bulk-submit to hundreds of directories.
- Build links to `endureqr.vercel.app` or `stayqr-six.vercel.app` URLs beyond the early assets above, since they will need a redirect chain.
- Use exact-match anchors for every link. Aim for mostly brand-name and URL anchors.

## 6. Validation

Automated validator (`validate_backlink_report.py`) on a Tier 0 report with a null score and no scored factors: PASS, 0 issues. Manual checks: every metric carries a source label, no inferences are presented as facts (B4 and the redirect cause are marked as inference), and no platform claims were made beyond observed HTTP responses and `vercel.json`.

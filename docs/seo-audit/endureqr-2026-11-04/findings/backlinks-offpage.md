# Backlinks and 90-day off-page plan: endureqr.com

Date: 2026-11-04. Tier 0. Backlink Health Score: **INSUFFICIENT DATA** (no factor has a data source).

## 1. What was checked

| Source | Result |
|---|---|
| Credentials check | Tier 0. No Moz, Bing Webmaster API, Keywords Everywhere key. No Ahrefs/Semrush/DataForSEO. Bing "No data" in the UI is consistent with a 2-day-old domain. |
| Common Crawl web graph (release cc-main-2026-jan-feb-mar, confidence 0.50) | endureqr.com **not in crawl, not in rankings**. Expected: the release predates the domain. Next useful release is probably the Apr-Jun 2027 graph; do not recheck before then. |
| Verification crawler | Nothing to verify: zero known backlinks. |
| Site-side check (curl, 0.95) | Organization JSON-LD has name, logo, email, founder, address, contactPoint but **no `sameAs`**. /llms.txt returns 200. Sitemap lists 16 guides, 8 industry pages, 2 alternatives pages (bitly, qrfy), 17 generator type pages. |
| Search engines from this shell | DuckDuckGo-HTML and Bing returned nothing usable; no web search tool. Many publisher URLs returned 403 (bot protection) or 404. See section 7 for the consequence. |

Referring domains, anchors, spam score, velocity: **unknown, not measured**. Do not read the absence of data as "zero links": the real answer comes from Google Search Console (Links report, appears after a few weeks) and Bing Webmaster Tools.

Rel attribute status (what I could actually verify): Wikipedia external links and sitelike.org links are `nofollow` (observed). Everything else below is marked **unknown** unless stated; check the live profile's HTML (`curl -s <profile> | grep -o '<a [^>]*endureqr[^>]*>'`) after you publish.

## 2. Rules before starting

- Pace: 1-3 new link sources per week looks natural; 30 directory submissions in one day does not.
- Anchor text: mostly brand ("EndureQR"), bare URL (https://endureqr.com), and "EndureQR free QR code generator". Use keyword anchors ("free QR code generator", "dynamic QR codes that don't expire") only when an editor writes them, and keep them well under 20 percent. Never ask for exact-match anchors in outreach.
- Always link the page that fits: homepage for brand, /qr-code-generator for the free tool, /guides/* for citations, /alternatives/* never as a submitted URL.
- Avoid: paid links or "sponsored posts" without rel=sponsored, PBNs, link exchanges ("add me and I add you"), reciprocal-only directory swaps, mass-submission "100 directories" services, Fiverr backlink packages, comment spam, fake reviews on G2/Capterra/Trustpilot. AdSense review is pending: manipulative links risk a manual action on the site and are a poor look for a reviewer. Also do not buy upvotes on Product Hunt or similar.
- Disclose affiliation (founder) in every community post. One identical copy-paste description across all sites is fine for directories but vary Reddit/HN text.
- Keep one canonical "boilerplate" (name, one-line, 160-char, 500-char descriptions, logo 512px, screenshots, founder bio) in a doc. Reuse to cut hours per listing.

Suggested boilerplate (edit freely, claims must match the site):
- One line: "Free QR code generator for 17 code types, plus dynamic QR codes that keep working if you cancel."
- Founder: "Built by Armaghan Abdul Qayyum in Lahore, Pakistan."

## 3. The 90-day plan, ordered by impact per hour

Hours are solo-founder estimates. "Value" tags: R = referral traffic, E = entity/brand signal, L = ranking link (only if dofollow and editorial).

### Week 1-2: foundation (about 8 hours total)

| # | Item | URL | Free? | Rel | What to write | Value | Hrs |
|---|---|---|---|---|---|---|---|
| 1 | Search Console + Bing Webmaster Tools: verify endureqr.com, submit sitemap | https://search.google.com/search-console , https://www.bing.com/webmasters | Free | n/a | Nothing. This is how you will see real links. Bing's backlink view only fills as links get crawled. | Measurement | 0.5 |
| 2 | Add `sameAs` to Organization JSON-LD once profiles in #3 exist (code change, not done by me) | site code | Free | n/a | Array of LinkedIn, X, GitHub, Crunchbase, Product Hunt, YouTube URLs | E | 0.5 |
| 3 | Social/entity profiles with consistent name, logo, URL | LinkedIn Company page (linkedin.com/company/setup/new), X/Twitter, GitHub org, YouTube, Facebook page, Instagram, Pinterest (QR-adjacent, optional) | Free | Mostly nofollow or unknown; LinkedIn/X/Facebook are generally nofollow, unverified here | Same bio + site link. Founder personal LinkedIn: add EndureQR as current role and link it. Pin the free generator. | E (entity, sameAs), small R | 2 |
| 4 | Crunchbase organization profile | https://www.crunchbase.com/ (add organization; 200 reachable, signup required) | Free basic | unknown | Lahore, founded 2026, category "QR code / SaaS", founder person profile. | E, knowledge-graph signal | 0.75 |
| 5 | Google Business Profile: skip unless there is a real service-area address. Do not invent an office. | n/a | | | | | 0 |
| 6 | Own-asset link hygiene: founder's personal site / GitHub README / email signature / any existing blog link to endureqr.com | owned | Free | dofollow if you control it | Brand anchor. Genuine, immediate first links. | L (small), E | 0.5 |
| 7 | SaaSHub listing | https://www.saashub.com/ (alternatives pages exist and are live: /qrfy-alternatives, /qr-code-monkey-alternatives, verified 200) | Free listing | unknown | Add as alternative to QRFY and QR Code Monkey. Lead: "free forever static codes, dynamic codes keep redirecting after cancellation". | R (modest), E, category placement | 0.5 |
| 8 | AlternativeTo | https://alternativeto.net/ (blocked to my fetch, 403, so submit form unverified) | Free | unknown (commonly nofollow, unverified) | List as alternative to QR Code Monkey, QRFY, Bitly, QR Code Generator Pro. Real users write comments: tell your first customers. | R (people comparing alternatives), E | 0.75 |

### Week 2-4: launches (about 12 hours)

| # | Item | URL | Free? | Rel | What to write | Value | Hrs |
|---|---|---|---|---|---|---|---|
| 9 | Show HN | https://news.ycombinator.com/showhn.html (rules page, 200) then https://news.ycombinator.com/submit | Free | HN outbound links are nofollow (widely documented; not verified by me) | Title: "Show HN: EndureQR, free QR generator where codes keep working after you cancel". Link to the generator (no sign-up), not the pricing page. First comment: why you built it (the "rented QR code" problem), what is free, what is paid, honest limits. Post Tue-Thu morning US time. No asking for upvotes. | R spike (hundreds to thousands of visits if it lands, zero if not), press pickup | 2 |
| 10 | Product Hunt launch | https://www.producthunt.com/ (403 to my fetch; submit via your account) | Free | PH product links are generally nofollow, unverified | Tagline under 60 chars: "QR codes that keep working, even if you cancel". Maker comment with founder story. Build a few real supporters first (comment on others' launches for 2 weeks; do not solicit votes). Launch 12:01 am PT. | R, E, DR-style page that ranks for brand | 4 (incl. assets) |
| 11 | Indie Hackers product page + launch post | https://www.indiehackers.com/ (403 to bot fetch) | Free | unknown | Product page with revenue field left honest ($0). Post "I launched a QR generator whose pricing doesn't punish you for cancelling" with real numbers, lessons. | R, community, entity | 1.5 |
| 12 | BetaList | https://betalist.com/submissions/new (200 verified) | Free submission has a queue; paid expedite exists (not needed, skip) | unknown | One-liner + screenshots. | R (small), E | 0.5 |
| 13 | Uneed | https://www.uneed.best/submit-a-tool (200 verified) | Free tier exists (check form) | unknown | Same boilerplate. | R small, E | 0.5 |
| 14 | Fazier | https://fazier.com/ (200) | Free launch | unknown | Same boilerplate. | R small | 0.5 |
| 15 | Microlaunch | https://microlaunch.net/ (200) | Free launch | unknown | Same boilerplate. | R small | 0.5 |
| 16 | Reddit: r/SideProject, r/SaaS (weekly self-promo threads), r/Entrepreneur "share your startup" threads, r/InternetIsBeautiful (rare; needs genuine utility, check rules and 9:1 etiquette) | https://www.reddit.com/r/SideProject/ | Free | nofollow (Reddit default; unverified here) | Show the free tool, say you are the maker, ask for feedback. One post per sub, never cross-spam. | R, small | 1.5 |

Expectations: launch sites in 12-15 are low-yield individually (tens of visits each); do them because they are cheap and build the brand SERP. Ranking value from directory links is small; treat as entity validation. #9 and #10 are the only ones with real upside.

### Week 3-8: linkable assets and outreach (about 25 hours)

Guides most worth promoting, who to pitch (all 16 exist, verified 200):

| Guide | Why linkable | Pitch to |
|---|---|---|
| /guides/qr-code-size-for-printing | Practical reference (min size, DPI). Printers cite these. | Print shops, sign makers, graphic-design blogs, Canva/Affinity forum threads about QR sizing |
| /guides/qr-code-error-correction | L/M/Q/H explainer; evergreen. | Designer and developer communities, Wikipedia-adjacent tech wikis, StackOverflow answers (nofollow, but ranking-of-trust) |
| /guides/do-qr-codes-expire | Unique angle that matches the brand (the "rental" problem). | Consumer-tech writers, small-business newsletters, subreddit answers |
| /guides/are-qr-codes-safe | Quishing/scam interest is cyclical and press covers it. | Local news tech columnists, cybersecurity newsletters, parents/seniors-safety sites |
| /guides/qr-code-for-restaurant-menu | Restaurant owners search this constantly. | Restaurant blogs, POS vendor help centres, local restaurant associations, Pakistani food/F&B blogs |
| /guides/wifi-qr-code | Helpful, shareable. | Airbnb/host communities, hospitality blogs, tech-help sites |
| /guides/qr-code-for-google-reviews | Local-SEO audience links to such guides. | Local-SEO bloggers and agencies, GBP community |
| /guides/track-qr-code-scans | Marketers cite UTM guides. | Marketing newsletters, agency blogs |
| /guides/qr-code-not-scanning | Troubleshooting pages get cited from forums. | Reddit/forum answers (organic), tech-support sites |

Lower value for outreach: what-is-a-qr-code and how-to-scan (competitive head terms with Wikipedia/major publishers; useful for internal ranking only).

Highest-upside new asset (not yet on site, recommendation only): a small original data piece, e.g. "We tested N QR codes at sizes X on 5 phones" with a table and photos, or a "QR code free-tier comparison: what expires and what doesn't" table across QRFY, QR Code Monkey, Bitly, QR Code Generator Pro (verify each claim from their public pricing pages before publishing and date it). Comparison tables get cited; opinions do not.

| # | Item | URL | Free? | What to do | Value | Hrs |
|---|---|---|---|---|---|---|
| 17 | Featured.com expert answers | https://featured.com/ (200; pricing page shows a Free plan, other tiers $39-$239+ as of today; verify limits) | Free plan | Answer journalist questions on QR codes, small-business signage, scams. Short, quotable, with a name, title, URL. Published quotes generally carry a link; dofollow status unknown. | L, E, authority | 1 hr/week |
| 18 | Qwoted | https://www.qwoted.com/ (403 to my fetch) | Free expert account; check current limits | Same. | L, E | 0.5/week |
| 19 | Help a B2B Writer | helpab2bwriter.com (not verified; I could not fetch it) | Free newsletter | Respond to requests matching QR/printing/small business. | L | 0.5/week |
| 20 | Wider HARO-style alternatives | MentionMatch https://mentionmatch.com/ (200 verified); Source of Sources via Substack | Free tiers | As above. Do not pitch irrelevant requests: low reply rate hurts. | L | 0.5/week |
| 21 | Community answering | Reddit (r/smallbusiness, r/restaurateur, r/graphic_design, r/sysadmin for scams), Quora, StackExchange (Graphic Design, Webmasters) | Free | Answer the question fully in-thread first; link a guide only where it truly helps and rules allow. Disclose affiliation. Link in profile, not in every answer. Expect nofollow; value is R and brand mentions. | R, E | 2 hr/week max |
| 22 | Resource-page outreach | See section 7 | Free | Short personal email, offer one specific reason to add, no pushy anchor. | L | 4-6 |
| 23 | Broken-link outreach | Use Ahrefs free broken link checker or Dead Link Checker on found resource pages (free tools) | Free | Only when the dead target is a QR generator or QR guide page. Offer the closest EndureQR page. | L | 3 |
| 24 | G2 | https://www.g2.com/ (403 to bot) | Free listing, review collection needs real customers | Claim a profile once you have real users; ask for honest reviews. Never incentivize beyond G2's stated policy. | R, E | 1 |
| 25 | Capterra / GetApp / Software Advice (one Gartner Digital Markets submission) | https://www.capterra.com/vendors (403 to bot) | Free listing; paid PPC optional, skip | Listing takes review; category "QR Code Generator". Expect nofollow or tracked links, unverified. | E, R | 1 |
| 26 | Startupbase | https://startupbase.io/ (200) | Free | Submit startup profile. | E small | 0.25 |
| 27 | Pakistani startup/tech presence | startup.pk (200 reachable); also Propakistani, TechJuice, Tribune Tech, Pakistan Software Houses Association, Startup Pakistan communities, LinkedIn Pakistan founders groups, Lahore: Plan9, Nest I/O (verify each current site before submitting; I only confirmed startup.pk loads) | Free to pitch | Pitch the story to editors: "Lahore founder builds QR generator whose codes never expire", 150-word note + link to /about. Offer a short founder Q&A. Editorial coverage is the best backlink you can get here and builds the Pakistan/geo signal. | L, E, geo | 3 |
| 28 | Podcasts and newsletters | Indie Hackers podcast submissions, small-business newsletters, "Starter Story" style sites | Free | Pitch after the first 100 users with a concrete data point. | L, R | 2 |
| 29 | GitHub | https://github.com/topics/qr-code-generator (200) | Free | If any part is open-sourceable (e.g. a tiny QR print-size calculator), publish it with README linking to the site; add topic tags. Do not fake an "awesome list" PR. | E, small L | 3 |

### Week 8-13: compounding

- Re-pitch the best guide with an update ("2026 data") to anyone who linked or replied earlier.
- Convert every real mention without a link into a link request (set a Google Alert for "EndureQR" and "endureqr.com").
- Write 2 guest posts on small-business, restaurant-tech or print-design blogs only if the editor is real and the site is not a "write for us" link farm (see section 6). Max 1 brand-anchor author link.
- Reassess data: GSC Links report, Bing WMT, Common Crawl next release, and add a free Moz key to see DA/spam.

## 4. Competitor backlink gaps

No paid index is connected, so no backlink counts for QRFY, QR Code Monkey or Bitly QR. What I can say from observation:

- SaaSHub has live "alternatives" pages for QRFY and QR Code Monkey (verified 200): both are ready-made placements for EndureQR (item 7).
- sitelike.org has a live "similar to qr-code-monkey.com" page; its outbound links are `nofollow` (observed). Low value.
- Not verified: which publishers' "best QR generator" roundups include QRFY/QR Code Monkey/Bitly. That is the real gap and needs a free tool run from your side.

Free ways to see competitor links (do these yourself, 1-2 hours):
1. Ahrefs Webmaster Tools (free, needs ownership of a site) and the free Ahrefs Backlink Checker (https://ahrefs.com/backlink-checker) show top 100 backlinks for any domain, enter qrfy.com, qrcode-monkey.com, qr-code-generator.com, bitly.com/pages/products/qr-codes.
2. Moz Link Explorer free account: a few queries a day.
3. Google: `"qr code monkey" "alternatives"`, `"qrfy" review`, `intitle:"best free qr code generator" 2026`, `"free qr code generator" inurl:resources`, `"qr code generator" "useful links"`. Anything listing 3+ competitors is a target.
4. Bing: `linkfromdomain:` is retired; use plain queries.
Gap rule: target pages linking to 2+ competitors but not to you; ignore competitor links from their own affiliate/review networks.

## 5. Anchor-text guidance

| Type | Target share (first 90 days) | Example |
|---|---|---|
| Brand | 50-60% | "EndureQR" |
| Naked URL | 15-20% | endureqr.com |
| Brand + descriptor | 10-15% | "EndureQR, a free QR code generator" |
| Generic | 5-10% | "this tool", "here" |
| Keyword-rich | under 10% | "free QR code generator", "dynamic QR codes" |

Most early links will be nofollow profiles; their anchor mix matters little. Do not engineer anchors on directory profiles.

## 6. Avoid

- Paid links, sponsored posts without rel=sponsored/nofollow, link-selling "guest post" farms ("write for us" sites that take any topic).
- PBNs, expired-domain redirects, 301 stacks onto endureqr.com.
- Link exchanges and "I'll link to you if you link to me". Recip links between two small sites are an obvious pattern.
- Mass directory packages; low-quality Pakistani or global "free web directory" lists (zero traffic, spam neighbourhood).
- Comment spam, forum signature spam, Reddit self-promotion beyond sub rules, vote rings.
- Fake testimonials or reviews; claiming metrics (users, scans) you do not have.
- Pushing identical exact-match anchors. With AdSense pending, keep the profile clean and the site's own content quality as the priority.
- Do NOT use the retired vercel.app hosts as submission URLs; always endureqr.com (they 308 to it).

## 7. Resource pages listing free QR generators: honest status

The request was for 10 real live pages that list free QR generators and could add EndureQR. **I could not deliver 10 verified pages.** Search engines were not reachable from this shell, and the publisher URLs I guessed (PCMag, TechRadar, CNET, Zapier, HubSpot, Shopify, Wix, Hostinger, MakeUseOf, How-To Geek and others) mostly returned 404 or 403 bot blocks, so I am not going to list unverified URLs as real. Verified live (HTTP 200 observed 2026-11-04):

| Page | Type | Opportunity |
|---|---|---|
| https://www.saashub.com/qrfy-alternatives | Directory alternatives page | Submit EndureQR on SaaSHub so it can appear here |
| https://www.saashub.com/qr-code-monkey-alternatives | Directory alternatives page | Same |
| https://www.saashub.com/best-qr-code-generators-software | Category roundup | Same; 200 verified |
| https://www.sitelike.org/similar/qr-code-monkey.com/ | Similar-sites page, nofollow links | Low value; skip |
| https://github.com/topics/qr-code-generator | Topic listing | Tag a real repo if you publish one |
| https://www.pcworld.com/article/394316/best-qr-code-generators.html | Loaded, but the title/H1 returned was an unrelated Dell monitor promo, so it is **not** confirmed as a QR roundup | Do not use |

Only 3 are real opportunities. To reach 10 in about 45 minutes with a browser:
1. Run the Google queries in section 4 (#3) and `"free qr code generator" "best" 2025 OR 2026`, `"qr code" "tools" resources list`, `"free tools for restaurants" qr`, `"free tools for small business" qr code`.
2. Check each result for: updated in the last 12 months, lists 5+ tools (including free ones), has a visible author/email. Skip pages by the competitors themselves.
3. Query forms for niche lists that tend to exist: restaurant owner resource lists, wedding planning tools, teacher/classroom tools, real estate agent toolkits, church/nonprofit tech lists, "free marketing tools" lists.
4. Email template (under 90 words): "Hi [name], I saw your [page title] and thought of EndureQR (https://endureqr.com/qr-code-generator): free QR codes for 17 types, no sign-up, and codes don't expire if you cancel a paid plan. Happy to be a candidate for [section]. If it's not a fit, no problem. Armaghan, founder, Lahore." Send one follow-up after 7 days, then stop.
Expect 5-10% acceptance on cold outreach.

## 8. First-two-weeks checklist

- [ ] Verify endureqr.com in Search Console and Bing Webmaster Tools; submit sitemap (0.5 h)
- [ ] Write boilerplate and gather assets (screenshots, 512px logo, founder photo) (1 h)
- [ ] Create LinkedIn company, X, GitHub, YouTube, Facebook profiles; link founder's LinkedIn (2 h)
- [ ] Add sameAs to Organization schema after profiles exist (code change, 0.5 h)
- [ ] Crunchbase organization profile (0.75 h)
- [ ] SaaSHub and AlternativeTo listings as alternative to QR Code Monkey, QRFY, Bitly (1.25 h)
- [ ] Join Featured.com (free), Qwoted, MentionMatch; answer 2 relevant queries (1.5 h)
- [ ] Set Google Alerts for "EndureQR" and "endureqr.com" (0.1 h)
- [ ] Build the competitor list with Ahrefs free checker and Google queries; shortlist 10 resource pages (2 h)
- [ ] Begin Product Hunt preparation: comment on others' launches daily; schedule launch for week 3 (0.25 h/day)
- [ ] Draft Show HN text and Indie Hackers post (1 h)
- [ ] Submit BetaList, Uneed, Fazier, Microlaunch (2 h)
- [ ] Recheck rel attributes on each published profile and record in a sheet

## 9. Gaps in this report
- No backlink counts, anchors, DA or spam data exist; none was guessed.
- Rel attribute is verified only for Wikipedia and sitelike.org; all others unknown.
- Submit-form details for 403 sites (Product Hunt, AlternativeTo, G2, Capterra, Indie Hackers, Qwoted) were not inspected.
- Free-tier limits and prices for Featured.com were read from its page today and may change.

# Technical SEO + sitemap findings, endureqr.com (4 Nov 2026)

Technical score: 93/100. No Critical or High technical blockers. Bing "Discovered but not crawled" is not caused by anything in the stack (Bingbot UA gets 200 on every page tested, no robots/CSP/header block).

## Findings

### 1. stayqr.vercel.app still serves the old site with 200 (Medium)
- Evidence: `curl https://stayqr.vercel.app/` returns 200, `<title>StayQR - Scan the story. Own the experience.`, no redirect, no canonical to endureqr.com. endureqr.vercel.app and stayqr-six.vercel.app redirect (308) correctly.
- Risk: old-brand duplicate host that Google/Bing can discover (any stray link) and index; dilutes a 0-backlink domain.
- Fix: /Users/codingcrafts/Downloads/stayqr/vercel.json: add two entries to `redirects` (same shape as the existing endureqr.vercel.app pair) with `"value": "stayqr.vercel.app"` for source `/` and `/:path+`, destination `https://endureqr.com/...`. If stayqr.vercel.app is actually a separate Vercel project, either add the same redirect there or remove/disable the project. Cannot confirm which from here.

### 2. Bing: submit actively; IndexNow script exists but no evidence it was run (Medium)
- Evidence: key file https://endureqr.com/a1c13608465f3a199446374fd4d85e12.txt returns 200 with matching key; scripts/indexnow.mjs is correct (posts all 55 sitemap URLs to api.indexnow.org). Bing still shows all pages as discovered-not-crawled.
- Fix: run `npm run indexnow` after the next deploy (and after each content change). In Bing Webmaster Tools, submit sitemap.xml and use URL Submission on the home, /qr-code-generator, /pricing, top guides. Bing crawl on a new domain with 0 backlinks is mostly trust/quota gated, so expect it to lag until external links exist (see backlink work in other reports). No code fix needed.

### 3. www http hop chain is 2 redirects (Low)
- Evidence: `http://www.endureqr.com/x` -> 308 `https://www.endureqr.com/x` -> 308 `https://endureqr.com/x`. http://endureqr.com and https://www are single hop.
- Fix: the first hop is Vercel's domain-level http->https. In Vercel dashboard > Domains, set www.endureqr.com to redirect to endureqr.com (308) directly so it skips the middle hop. The vercel.json host redirects at lines for www.endureqr.com already handle the second hop. Negligible SEO impact.

### 4. Homepage HTML is 610 KB uncompressed (Low)
- Evidence: / is 610,872 bytes raw, ~60 KB brotli; 109 inline scripts, one 68 KB, about 152 inline `<svg>`, 66 KB inlined CSS (`experimental.inlineCss: true` in /Users/codingcrafts/Downloads/stayqr/next.config.mjs). Next 2nd copy of content in RSC flight payload. Next largest page is 406 KB (vcard). TTFB is fine (0.2s cached).
- Risk: Googlebot truncates only at 15 MB so no indexing risk; minor parse/INP cost on low-end phones.
- Fix (optional): move below-the-fold sections of src/app/(marketing)/page.tsx to server components with fewer inline SVG icons (use an SVG sprite or lucide icons imported once) and/or lazy-load the interactive demo. Re-check with Lighthouse before bothering.

### 5. /qr-code-generator title is 64 chars (Low)
- Evidence in pages.json: only title over 60. May be truncated in SERP.
- Fix: trim the metadata title in src/app/(marketing)/qr-code-generator/page.tsx to <=60 chars.

### 6. /r/demo noindex relies on header + meta, but is crawlable (Low, informational)
- /r/demo returns 200 with `x-robots-tag: noindex` and meta noindex: correct. /paused is blocked in robots.txt AND noindex; because it is disallowed, crawlers cannot see the noindex. Harmless as long as nothing links to it publicly. Optional: remove `/paused` from the disallow list in src/app/robots.ts so the noindex is honoured if it ever gets a link.

## Verified passing
- robots.txt: 200, `Allow: /`, disallows /dashboard and /paused, declares https://endureqr.com/sitemap.xml (valid, fetches 200 application/xml).
- sitemap.xml: 55 URLs, matches pages.json exactly, all 200 and self-canonical, lastmod present (no priority/changefreq), no noindex or redirecting URLs listed.
- Canonicals: all 55 self-referencing absolute apex URLs, no trailing-slash duplicates (`/qr-code-generator/` 308s to no-slash); no duplicate titles or descriptions; one H1 per page; OG image on all.
- Redirects: http->https and www->apex 308; endureqr.vercel.app and stayqr-six.vercel.app 308 to apex; /dashboard 307 to /login?next=; 404 returns real 404 status.
- Noindex: /login, /signup `noindex, follow` (with canonical, fine); /paused noindex,nofollow.
- Bingbot UA: 200 on /, /pricing, /login, /signup, /paused, /r/demo; same as default UA; no UA-based blocking.
- Security headers: HSTS (2 yr), nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy, Permissions-Policy, CSP. (HSTS lacks `includeSubDomains; preload`: optional.)
- CSP vs AdSense/Funding Choices: script/connect/frame-src allow pagead2.googlesyndication.com, *.googlesyndication.com, *.doubleclick.net, *.google.com, *.gstatic.com, *.googleadservices.com, *.adtrafficquality.google and fundingchoicesmessages.google.com; img-src allows https:. Nothing blocked. Live head has adsbygoogle.js?client=ca-pub-1520133402245003 and google-adsense-account meta; ads.txt 200 with correct line. No change recommended.
- Rendering: fully server-rendered (static prerender, x-nextjs-prerender: 1); no SPA shell, content in raw HTML.
- Caching: HTML `max-age=0, must-revalidate` with Vercel edge HIT; fonts and OG image `immutable` 1 yr. Fine.
- Internal linking: homepage links 54 internal URLs; every sitemap page is within 2 clicks (13 guides via /guides hub); no orphans found; every page has >=35 internal links.
- URL structure: lowercase, hyphenated, flat, no params in sitemap.
- hreflang: not needed (single English site, `lang="en"`).
- llms.txt 200, ads.txt 200, IndexNow key file valid.

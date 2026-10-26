# StayQR SEO action plan

From the audit of 26 October 2026 (score 75/100). Ordered by impact.

## Critical: fix now

- [ ] **Point every absolute URL at the live domain.** Canonicals, sitemap, robots.txt, Open Graph and JSON-LD all
      use `https://stayqr.com`, which doesn't serve this site. Generate them from `NEXT_PUBLIC_SITE_URL` instead.
      If you own stayqr.com, connect it in Vercel and set `NEXT_PUBLIC_SITE_URL=https://stayqr.com`. If you don't, pick
      the domain you will launch on. Either way, also check the contact emails (`hello@`, `privacy@`, `abuse@stayqr.com`):
      they only work on a domain you control.

## High: this week

- [ ] `noindex` on `/login`, `/signup` and `/auth/*`; give `/login` its own description.
- [ ] Open Graph image on all 16 guides.
- [ ] Trim the 8 industry meta descriptions to about 155 characters.
- [ ] Submit the sitemap in Google Search Console and Bing Webmaster Tools once the domain is final.

## Medium: this month

- [ ] Security headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
      `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy` (camera, microphone and geolocation off).
- [ ] `WebSite` + `Organization` schema on the homepage; `SoftwareApplication` with offers on `/pricing`.
- [ ] Fix the "StayQR · StayQR" titles on `/about` and `/contact`.
- [ ] Add `/favicon.ico` and `/llms.txt`.
- [ ] Name an author or reviewer on the guides, with a short bio and an editorial-policy page.
- [ ] Homepage performance: defer the 3D hero further on mobile (TBT 412 ms, score 83).

## Content and authority: next 1–2 months

- [ ] Landing pages for the gaps the product already supports: QR code with logo, dynamic QR code generator,
      app-download QR code, bulk QR code generator.
- [ ] Expand the industry pages with a worked example and 2–3 more FAQs each.
- [ ] Earn first links: list StayQR on SaaS and tool directories, and pitch the guides to small-business blogs.

## Ongoing

- [ ] Watch Search Console coverage and queries weekly for the first 2 months.
- [ ] Re-run this audit after each content batch, comparing it with this report.

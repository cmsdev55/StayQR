# Technical SEO (score 62)

## What works
- 53/53 pages return 200
- Server-rendered HTML
- HSTS with preload
- Complete sitemap, no orphans

## Findings
### Critical: Canonical and sitemap host mismatch
All 53 canonicals, sitemap <loc> URLs and the robots.txt Sitemap line use https://stayqr.com, which resolves to a GoDaddy server and does not answer over HTTPS.

**Fix:** Generate absolute URLs from NEXT_PUBLIC_SITE_URL and launch on a domain you control.

### Medium: Missing security headers
Only HSTS is sent. No CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy or Permissions-Policy.

**Fix:** Add headers in next.config.

### Low: favicon.ico returns 404
Only /icon.svg exists.

**Fix:** Serve /favicon.ico.

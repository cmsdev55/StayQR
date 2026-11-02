<p align="center">
  <img src="public/logo-512.png" width="88" height="88" alt="EndureQR logo">
</p>

<h1 align="center">EndureQR</h1>

<p align="center">
  QR codes that keep working, even if you leave.<br>
  <a href="https://endureqr.com"><strong>endureqr.com</strong></a>
</p>

---

## About

EndureQR is a QR code generator with two parts:

- **A free generator.** Make static QR codes for 17 content types (links, WiFi, contact cards, calendar events, social
  profiles and more). Add your logo and a frame, then download PNG, SVG, JPEG or PDF up to 4096 px. There's no sign-up
  and no watermark. Codes are drawn in the browser, so what you type never reaches our servers.
- **Dynamic QR codes (first one free).** The printed code points to a short link, so you can change where it goes after printing.
  Plans include unlimited codes and scans, scan analytics (device, city, time of day), separate iPhone and Android
  destinations, and bulk creation from CSV.

The name is the promise: if you cancel, your dynamic codes keep redirecting to the last destination you set. They're
never replaced with an ad or an upgrade page.

## Plans

| Plan | Price | Includes |
|---|---|---|
| Free | $0 | Unlimited static codes and 1 dynamic code, logo and frame, all download formats |
| Pro | $3.99 / month or $29 / year | Unlimited dynamic codes and scans, analytics, smart redirects, bulk create |
| Lifetime | $79 once | Everything in Pro, with no renewals |

Every paid plan has a 14-day money-back guarantee.

## Tech stack

| Area | Tools |
|---|---|
| App | [Next.js 15](https://nextjs.org) (App Router), React 19, TypeScript |
| Styling and motion | Tailwind CSS, Framer Motion, GSAP, Lenis |
| 3D | three.js, React Three Fiber |
| QR rendering | qr-code-styling, qrcode-generator |
| Database | PostgreSQL on [Railway](https://railway.com) |
| Sign-in | Email and password, plus Google sign-in |
| Payments | [Lemon Squeezy](https://www.lemonsqueezy.com) (merchant of record) |
| Email | [Resend](https://resend.com) |
| Hosting | [Vercel](https://vercel.com) |

## Getting started

You need Node.js 20 or later and PostgreSQL installed locally.

```bash
npm install
cp .env.example .env.local       # fill in what you need; most services are optional locally
scripts/db-local.sh start        # local Postgres on port 54329, with migrations applied
node scripts/db-seed.mjs         # demo account: demo@endureqr.local / demo-password
npm run dev                      # http://localhost:3000
```

Locally, emails print to the server log and checkout is simulated, so you don't need Resend or Lemon Squeezy keys
to try the app.

## Project structure

```
src/app/            pages, API routes and the dashboard
src/components/     UI, generator, dashboard and 3D components
src/content/        site copy: plans, guides, FAQs, legal pages
src/lib/server/     auth, billing, email, codes and analytics
db/migrations/      database schema
scripts/            database, icon, screenshot and performance tools
tests/e2e/          end-to-end tests
```

## Documentation

- [Development notes](docs/DEVELOPMENT.md): routes, QA flags, scripts and performance measurements
- [Design system](DESIGN.md)
- [Launch checklist](docs/LAUNCH.md)
- [Roadmap](docs/ROADMAP.md)

## License

Copyright © 2026 EndureQR. All rights reserved.

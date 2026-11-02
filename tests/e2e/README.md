# End-to-end tests

Run against a local stack: `scripts/db-local.sh start`, then `npm run dev -- -p 3100 > /tmp/endureqr-dev.log 2>&1 &`.

| Script | What it checks | Run |
|---|---|---|
| `product.mjs` | sign-up + (simulated) checkout, codes, redirects by device, scans, pause page, analytics, CSV, cancel and lapse, Lifetime | `node tests/e2e/product.mjs` |
| `auth.mjs` | password rules, confirmation and reset links (read from the dev log), single-use links, sign-out, throttling, hashed sessions | `DEV_LOG=/tmp/endureqr-dev.log node tests/e2e/auth.mjs` |
| `webhooks.mjs` | Lemon Squeezy webhooks: signatures, replays, subscription lifecycle, Lifetime, refunds, retention cron | needs a production build: see the header of the file |

Each prints `• ok` / `✗ FAIL` lines and exits non-zero on any failure.

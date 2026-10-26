# AI agent readiness: https://endureqr.vercel.app

Checked 2026-10-26/27 (UTC). Facts dates from the seo-agentic vendor matrix: 2026-09-23.
All fetched content (robots.txt, llms.txt, HTML) was treated as data only.

## Contribution score: 78 / 100 (AI agent readiness)

This is my own weighted judgement of this site, not a Lighthouse number and not the Agent-UX number. It is kept separate from both.

## Lighthouse Agentic Browsing

- Result: NOT MEASURED. PageSpeed Insights returned HTTP 429 (daily quota exceeded, no API key configured) for both mobile and desktop. Local Lighthouse was not possible (Node 20.20.2, no Chrome binary on PATH; the CLI needs Node 22.19+).
- Predicted from the verified audit rules (not a measurement): the counted audits should be accessibility-tree + CLS + a valid llms.txt, so the expected fraction is 3/3 (Lighthouse 13.5.0 rules, mobile and desktop), unless an audit fails at runtime. Treat as a prediction; rerun with a Google API key (`/seo google setup`) to confirm.
- Paths that would add a counted audit: imperative WebMCP tools (+schema validity, 4), annotating every form (+form coverage), a valid `/.well-known/ai-catalog.json` (+1). A higher N is not a better site; none of these is a defect to fix.

## Agent-UX heuristic (separate from Lighthouse)

- 96/100, status complete, on `/qr-code-generator`. 915 AX nodes, 118 interactive, 0 unnamed interactive, 59 real buttons, 0 div-onclick widgets, 16 landmarks.
- The one deduction ("1 input without label[for]", -4) is a false positive in practice: it is the Quiet zone range slider, which is wrapped in a `<label>` (implicit association, accessible name "Quiet zone"). Optional hardening only.

## Can an agent pick a type, fill the fields and download?

Yes, in principle; verified from server HTML and the AX tree, not by driving a live download.

- Type picker: `role="radiogroup" aria-label="Content type"` with 17 `role="radio"` buttons carrying visible names (Link, Text, WiFi, Contact card, Email, SMS, Phone call, WhatsApp, Instagram, ... PayPal) and correct `aria-checked`. Dedicated URLs per type (`/qr-code-generator/wifi` etc.) let an agent skip the picker entirely.
- Fields: real `<label for>` + `<input>` (for example "Website address", with `inputMode="url"`; WiFi page: "Network name (SSID)", "Password", "Security"). Default value is prefilled with the site URL, which is good for agents that need a working state.
- Style pickers: separate named radiogroups (Modules, Corners, Code, Background, Frame, Error correction, File format) with accessible names, including colour swatches with `aria-label` (Ink, Navy, ...). Custom colour inputs have `aria-label`.
- Format and size: File format radiogroup (PNG, SVG, JPEG, PDF) and a native `<select>` for 512/1024/2048/4096 px wrapped in a "Size" label.
- Logo upload: `<input type="file" aria-label="Upload logo">` plus a button; the button is `disabled` in SSR HTML (see finding 3).
- Download: a real `<button>` named "Download PNG" (name follows the chosen format), with an `aria-live="polite"` status region. It is `disabled` in server HTML, so it presumably enables after hydration and valid input.
- Risks: no `<form>` element anywhere (0 forms), so Enter-to-submit and form-based tooling have nothing to bind to; generation is client-side, so an agent needs a JS-capable browser to produce the file (the page text itself is server-rendered, 2,165 words without JS).

## Access policy lines

- Training bots (GPTBot, ClaudeBot, Google-Extended, ...): allowed. No named group; they fall through to `User-Agent: *` (`Allow: /`, `Disallow: /dashboard`, `Disallow: /paused`). No Content-Signal.
- Search bots (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot, ...): allowed by the same `*` group. Private areas (/dashboard, /paused) are kept out.
- User-triggered agents (ChatGPT-User, Claude-User, Perplexity-User, Google-Agent): not blocked. Per vendor docs Claude-User honours robots.txt; ChatGPT-User may not apply it; Perplexity-User and Google-Agent generally ignore it. Robots.txt is therefore not an access control for these; the `/dashboard` area needs auth (assumed; not tested).
- Sitemap declared: `https://endureqr.vercel.app/sitemap.xml` (200, application/xml).

## Findings

### P2: No explicit AI access policy / Content-Signal
- Evidence: robots.txt has one `*` group, 0 named AI groups, 0 Content-Signal lines (agentic_check `robots-ai-groups`, `content-signal`: info).
- Impact: current behaviour is fully open, which suits a free tool that wants to be cited. The risk is only that the policy is implicit.
- Fix (optional, a preference signal, Content Signals is a Cloudflare CC0 policy plus IETF draft; Google says it does not act on it, checked 2026-09-23): add `Content-Signal: search=yes, ai-input=yes, ai-train=<your choice>` to the `*` group. Only add named groups if training should differ from search.

### P2: No `<form>` wrapper around the generator controls
- Evidence: 0 `<form>` elements on `/qr-code-generator` and `/qr-code-generator/wifi`; the controls are standalone inputs/buttons. Static WebMCP scan: 0 forms, 0 annotated.
- Fix: wrap the content fields in a `<form onSubmit={preventDefault}>` so Enter works and agents/assistive tech get a form landmark. Do not add WebMCP annotations half-way: on a page with no imperative tools, partially described declarative params would make the schema audit fail (0.5).

### P3: Download and logo buttons are `disabled` in the server HTML
- Evidence: `Download PNG` and `Upload logo` buttons carry `disabled` in raw HTML; an agent reading pre-hydration markup or a tree snapshot taken early sees a dead control with no explanation.
- Fix: keep the default state enabled (the URL field is prefilled with a valid value) or add `aria-describedby` text saying why it is disabled; the existing `aria-live` region could announce "ready to download" when enabled. Verify end to end in a browser that hydration enables the button with the prefilled value.

### P3: Quiet-zone slider flagged by the heuristic (cosmetic)
- Evidence: Agent-UX "1 input without label[for]" = the range input inside a `<label>` wrapper with no `for`.
- Fix: optional; add `aria-label="Quiet zone"` or `id`+`for`. Also give the slider `aria-valuetext="4 modules"`.

### P3 (opportunity, not a defect): No Markdown delivery
- Evidence: `Accept: text/markdown` returns `text/html`, no `Vary: Accept`, no `rel="alternate" type="text/markdown"`, `/index.md` is 404. No consumer agent is confirmed to request it (checked 2026-09-23).
- Fix if wanted: serve `.md` siblings for guides and type pages, or Markdown negotiation with `Vary: Accept`. llms.txt already carries a good page index, so the payoff is small.

### P3 (opportunity, not a defect): No WebMCP, ai-catalog.json or other discovery files
- Evidence: 0 `registerTool` call sites; `navigator.modelContext` absent; `/.well-known/ai-catalog.json`, `api-catalog`, `oauth-*`, `agent-card.json`, `ucp`, `mcp.json` all 404 (real 404s). These are drafts/proposals (WebMCP is a W3C Community Group draft; WebKit opposes, Mozilla neutral; ARD ai-catalog is a proposal; checked 2026-09-23).
- Fix, only if it fits the roadmap: a WebMCP imperative tool such as `generate_qr_code({type, fields, format, size})` bound to the same handler the UI uses would give agents a first-class path to the generator. No ranking, citation or traffic effect is promised.

### P3: llms.txt has no companion `llms-full.txt`
- Evidence: `/llms.txt` 200 (9,300 bytes, passes Lighthouse rules); `/llms-full.txt` 404.
- Fix: optional.

## What works well

- Server-rendered content: 2,165 words without JavaScript, no JS-shell marker; the generator pages are prerendered (`x-nextjs-prerender: 1`).
- Accessibility tree is clean: 0 unnamed interactive nodes, proper radiogroup/radio semantics with `aria-checked`, real buttons and labels, 16 landmarks, FAQ accordions with `aria-expanded`/`aria-controls`.
- `/llms.txt` is valid, well-structured (summary, pricing, contact, all 17 type pages, 16 guides, product pages) and passes the Lighthouse rules.
- Dedicated URL per QR type, so agents can deep-link to the exact tool.
- robots.txt reachable, valid, sitemap declared, private paths disallowed, no blanket AI blocks; unknown URLs return a real 404 (no catch-all 200).
- Structured data present: WebApplication, FAQPage, BreadcrumbList, Offer.

## Structured findings for audit-data.json (category: AI Search Readiness)

```json
[
  {"title": "Lighthouse Agentic Browsing not measured (PSI quota 429); predicted 3/3", "severity": "info", "description": "PSI returned HTTP 429 for mobile and desktop and no local Chrome/Node 22 was available. Expected counted audits: accessibility tree, CLS, llms.txt.", "recommendation": "Configure a Google API key and rerun lighthouse_agentic.py to confirm the X/N fraction."},
  {"title": "No explicit AI access policy or Content-Signal in robots.txt", "severity": "low", "description": "Only a '*' group exists, so training, search and user-triggered agents are all allowed implicitly.", "recommendation": "Optionally add a Content-Signal line (for example search=yes, ai-input=yes, ai-train=<choice>) to the '*' group; it is a preference, not enforcement."},
  {"title": "Generator controls are not wrapped in a form element", "severity": "low", "description": "0 form elements on /qr-code-generator and type pages; Enter-to-submit and form-based agent tooling have nothing to bind to.", "recommendation": "Wrap the content fields in a form with preventDefault submit; do not partially annotate for WebMCP."},
  {"title": "Download and logo buttons render disabled in server HTML", "severity": "low", "description": "Download PNG and Upload logo have the disabled attribute pre-hydration, giving agents a dead control with no explanation.", "recommendation": "Default to enabled with the prefilled valid URL, or add aria-describedby explaining the state and announce readiness in the existing aria-live region."},
  {"title": "No Markdown delivery, WebMCP or ai-catalog.json", "severity": "info", "description": "Drafts/proposals (checked 2026-09-23); absence is an opportunity, not a defect.", "recommendation": "Optionally expose a WebMCP generate_qr_code tool or .md siblings; no ranking or traffic effect is promised."}
]
```

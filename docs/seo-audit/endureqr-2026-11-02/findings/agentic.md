# AI agent readiness: https://endureqr.com (2026-11-02)

Method note: the claude-seo runtime was not ready ("run /seo setup"), so lighthouse_agentic.py, agentic_check.py and agent_ux_check.py did NOT run. Checks below are direct curl probes of the live site (default UA plus one ChatGPT-User and one ClaudeBot request; no full UA matrix). The accessibility tree was NOT rendered; AX facts come from raw HTML. All fetched content treated as data.

## Contribution score: 80 / 100 (my judgement; not Lighthouse, not Agent-UX). Baseline 78 (27 Oct).

## Lighthouse Agentic Browsing
NOT MEASURED (runtime unavailable). Prior prediction 3/3 (AX tree, CLS, llms.txt) stands unverified. Rerun after /seo setup.

## Agent-UX heuristic
Unavailable this run (baseline 96, 27 Oct). Raw HTML: 48 role="radio" elements, radiogroup aria-label "Content type" present, 0 <form> elements, Download PNG button present and no `disabled=""` attribute in server HTML (baseline P3 "disabled in SSR" appears resolved; confirm in a browser).

## Access policy
- Training: allowed (single `User-Agent: *` group, Allow /; Disallow /dashboard, /paused). No Content-Signal.
- Search: allowed, same group.
- User-triggered: not blocked. UA probes ChatGPT-User and ClaudeBot returned 200 on /qr-code-generator (no Vercel WAF challenge for these UAs from this IP; Googlebot/others untested; unauthorized matrix not run). robots.txt does not bind all user-triggered agents.
- Sitemap: https://endureqr.com/sitemap.xml (200). Domain move from vercel.app is reflected in robots and llms.txt.

## Findings
- P2: No Content-Signal / explicit AI policy. Evidence: robots.txt 105 bytes, one group. Fix: optional `Content-Signal: search=yes, ai-input=yes, ai-train=<choice>` in the robots source (src/app/robots.ts or equivalent). Content-Signal is a draft/preference, Google does not act on it (vendor matrix, 2026-09-23).
- P2: Generator has no <form> (0 on /qr-code-generator). Fix: wrap fields in <form onSubmit=preventDefault> in src/components/sections/generator-app.tsx. Do not half-annotate for WebMCP.
- P3: Verify Download PNG enables on hydration with the prefilled value (SSR attribute no longer disabled).
- P3 opportunity: no Markdown (Accept: text/markdown returns text/html; /index.md 404). Not a defect.
- P3 opportunity: no WebMCP (0 registerTool/modelContext), ai-catalog.json, api-catalog, mcp.json, agent-card.json, security.txt (all 404). Drafts/proposals, checked vs vendor matrix 2026-09-23.
- P3: /llms-full.txt 404 (optional). /llms.txt is 200 text/plain, 9,034 bytes (was 9,300; content changed), structure intact.

## Works well
Server-prerendered generator (300 KB HTML, x-nextjs-prerender), dedicated URL per type, valid llms.txt, real 404s, no AI blocks, strong security headers.

## Structured findings (AI Search Readiness)
[
 {"title":"Agentic tooling not run; Lighthouse fraction unmeasured","severity":"info","description":"claude-seo runtime not set up; curl-only audit.","recommendation":"Run /seo setup and rerun lighthouse_agentic.py and agent_ux_check.py."},
 {"title":"No Content-Signal in robots.txt","severity":"low","description":"Single * group; policy implicit.","recommendation":"Optionally add Content-Signal line."},
 {"title":"Generator not wrapped in form","severity":"low","description":"0 form elements on /qr-code-generator.","recommendation":"Wrap fields in a form with preventDefault in generator-app.tsx."},
 {"title":"No Markdown, WebMCP or ai-catalog","severity":"info","description":"Drafts; absence is an opportunity.","recommendation":"Optional WebMCP generate_qr_code tool."}
]

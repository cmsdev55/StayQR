# AI agent readiness: https://endureqr.com (2026-11-04)

Tools run: lighthouse_agentic.py, agentic_check.py (no --ua-matrix), agent_ux_check.py x3. Fetched content treated as data. Standards facts last checked 2026-09-23 (vendor-matrix.md).

## Lighthouse Agentic Browsing
Not measured: PSI returned HTTP 429 (daily quota, no API key) for both mobile and desktop. Fix: configure a Google API key (/seo google setup) and rerun. No fraction is claimed.

## Agent-UX heuristic (separate from Lighthouse; status complete for all three)
| URL | Score | Notes |
|---|---|---|
| /qr-code-generator | 96 | 922 AX nodes, 119 interactive, 0 unnamed; 1 input without label[for] (-4) |
| /qr-code-generator/wifi | 96 | 862 nodes, 96 interactive, 0 unnamed; same 1 input |
| /dynamic-qr-code-generator | 100 | 988 nodes, 72 interactive, 0 unnamed, no issues |
Previous run (2 Nov) had no Agent-UX number; baseline 96 (27 Oct) is unchanged.

## Findings
- P2: Generator has no `<form>` (0 on all three pages, confirmed via curl). Same as 2 Nov, unfixed.
- P2 (wording from checker): no Content-Signal line; robots.txt is still one `*` group. Draft/preference; Google does not act on it (checked 2026-09-23).
- P3: 1 input without label[for] on both generators: the hidden logo file input (`id="logo-input"`, has aria-label "Upload logo" so it is named; the -4 is heuristic only).
- P3 opportunity: Markdown not offered (Accept: text/markdown returns text/html, no Vary: Accept, /index.md 404). Not a defect.
- P3 opportunity: WebMCP absent (0 registerTool, no navigator.modelContext). W3C CG draft, WebKit opposes (2026-09-23).
- P3: /llms-full.txt 404 (optional). ai-catalog.json, api-catalog, oauth-*, agent-card.json, ucp, mcp.json, security.txt all 404: not applicable, no service operated.

## Passing
Server-rendered (2,236 words without JS), robots.txt 200, llms.txt passes Lighthouse rules (200, text/plain, 11,425 bytes; grew from 9,034 on 2 Nov), real 404s, no AI crawler blocked, 0 div-onclick widgets, 0 unnamed interactive nodes. Dynamic page: input has a real label (`dyn-dest`), CTA is a real button.

## Access policy (robots.txt: `User-agent: *`, Allow /, Disallow /dashboard, /paused)
- Training (GPTBot, ClaudeBot, Google-Extended etc.): allowed via `*`; no Content-Signal.
- Search (OAI-SearchBot, Claude-SearchBot, PerplexityBot): allowed via `*`.
- User-triggered (ChatGPT-User, Claude-User, Perplexity-User, Google-Agent): not blocked; vendors differ on whether robots.txt binds them (Claude-User honours; ChatGPT-User may not apply; Perplexity-User and Google-Agent generally ignore).

## Recommended changes (not applied)

### 1. Wrap the generator controls in a form (P2)
File: /Users/codingcrafts/Downloads/stayqr/src/components/sections/generator-app.tsx, line ~90.
```diff
-      <div className="glass rounded-xl p-5 sm:p-8">
+      <form className="glass rounded-xl p-5 sm:p-8" aria-label="QR code generator" onSubmit={(e) => e.preventDefault()} noValidate>
         <Step n={1} title="What should it open?">
 ...
-      </div>
+      </form>
```
Close the matching `</div>` of that controls container (before the preview column, the second grid child). Download PNG (line 304) sits in the preview column, so it stays outside; if you wrap everything instead, add `type="button"` to it.
Required companion change, or any `<Button>` inside the form becomes a submit button and Enter key will fire it:
File: /Users/codingcrafts/Downloads/stayqr/src/components/ui/button.tsx, line 33:
```diff
-    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
+    <button ref={ref} type="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />
```
(`{...props}` after it still lets a caller pass type="submit".) Check src/components/auth/auth-form.tsx and other `<form>` users that rely on an untyped Button submitting; add `type="submit"` there. Sliders at lines 191 and 248 are labelled via wrapping `<label>`; fine.

### 2. Optional Content-Signal (P2, draft)
Next's MetadataRoute.Robots cannot emit Content-Signal. File: replace /Users/codingcrafts/Downloads/stayqr/src/app/robots.ts with a route handler /Users/codingcrafts/Downloads/stayqr/src/app/robots.txt/route.ts (delete robots.ts):
```ts
import { siteUrl } from "@/lib/site";
export const dynamic = "force-static";
export function GET() {
  const body = [
    "User-Agent: *",
    "Content-Signal: search=yes, ai-input=yes, ai-train=no", // owner decides the ai-train value
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /paused",
    "",
    `Sitemap: ${siteUrl("/sitemap.xml")}`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
```
Policy choice (ai-train yes/no) belongs to the owner; it is a preference, not enforcement. Skip if you do not want to state one.

### 3. Optional: logo input label (P3)
Same file, line 170: change `aria-label="Upload logo"` to keep, and add `tabIndex={-1}` is unnecessary; to clear the heuristic just add a `<label htmlFor="logo-input" className="sr-only">Upload logo</label>` before the input. Cosmetic for the score only.

### 4. WebMCP feasibility (opportunity, draft; do after #1)
Feasible: generator state is client-side and the type/field schema lives in src/lib/qr-types.ts. After #1, add `toolname`/`tooldescription` declarative annotations on the form (Chrome-only draft) or register an imperative `generate_qr_code` tool in a client effect in generator-app.tsx:
```ts
useEffect(() => {
  const mc = (navigator as any).modelContext;
  if (!mc?.registerTool) return;
  mc.registerTool({ name: "generate_qr_code", description: "Fill the QR generator for a content type",
    inputSchema: { type: "object", properties: { type: { type: "string" }, value: { type: "string" } }, required: ["type", "value"] },
    execute: async (a: {type: string; value: string}) => { /* call same setters the UI uses */ return { content: [{ type: "text", text: "ok" }] }; } });
}, []);
```
Do not half-annotate; confirm at runtime via lighthouse_agentic.py webmcp-registered-tools. Draft status, no ranking or traffic claim.

### 5. Optional Markdown / llms-full (P3)
Not recommended unless wanted: llms.txt already passes. If desired, add /Users/codingcrafts/Downloads/stayqr/src/app/llms-full.txt/route.ts concatenating key page copy.

## Structured findings (AI Search Readiness)
[
 {"title":"Lighthouse Agentic fraction unmeasured (PSI 429)","severity":"info","description":"PSI daily quota exceeded for mobile and desktop; no API key configured.","recommendation":"Configure a Google API key and rerun lighthouse_agentic.py."},
 {"title":"Generator not wrapped in a form","severity":"low","description":"0 form elements on /qr-code-generator, /wifi and /dynamic-qr-code-generator; Agent-UX 96/96/100.","recommendation":"Wrap controls in <form onSubmit=preventDefault> in src/components/sections/generator-app.tsx and default Button type to button in src/components/ui/button.tsx."},
 {"title":"No Content-Signal in robots.txt","severity":"low","description":"Single * group; training/search policy implicit (draft standard).","recommendation":"Optionally emit Content-Signal via a robots.txt route handler."},
 {"title":"No Markdown, WebMCP or ai-catalog","severity":"info","description":"Drafts/proposals; absence is an opportunity.","recommendation":"Optional WebMCP generate_qr_code tool after the form change."}
]

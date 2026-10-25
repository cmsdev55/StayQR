// Lighthouse mobile (default simulated throttling), N runs, median + per-run table.
// Usage: node scripts/lighthouse.mjs [path=/] [runs=3]   (BASE_URL defaults to :3000, prod build)
// THROTTLE=devtools applies real throttling (4x CPU, 150ms RTT, 1.6 Mbps) instead of Lantern's
// simulation. On localhost, Lantern bills all framework JS to LCP because scripts arrive before first paint.
// Reports go to .lighthouse/ (gitignored).
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { launch } = require("chrome-launcher");

const lighthouse = (await import("lighthouse")).default;
const base = process.env.BASE_URL ?? "http://localhost:3000";
const [path = "/", runs = "3"] = process.argv.slice(2);
const url = base + path;
mkdirSync(".lighthouse", { recursive: true });

const rows = [];
for (let i = 0; i < Number(runs); i++) {
  const chrome = await launch({ chromeFlags: ["--headless=new", "--no-first-run"] });
  const r = await lighthouse(url, { port: chrome.port, output: "json", logLevel: "error", throttlingMethod: process.env.THROTTLE ?? "simulate" });
  await chrome.kill();
  const lhr = r.lhr;
  const a = lhr.audits;
  const lcpEl = a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node;
  const phases = a["largest-contentful-paint-element"]?.details?.items?.[1]?.items ?? [];
  rows.push({
    perf: Math.round(lhr.categories.performance.score * 100),
    a11y: Math.round(lhr.categories.accessibility.score * 100),
    bp: Math.round(lhr.categories["best-practices"].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
    fcp: a["first-contentful-paint"].numericValue,
    lcp: a["largest-contentful-paint"].numericValue,
    tbt: a["total-blocking-time"].numericValue,
    cls: a["cumulative-layout-shift"].numericValue,
    si: a["speed-index"].numericValue,
    lcpEl: lcpEl?.selector ?? lcpEl?.nodeLabel ?? "?",
    phases: phases.map((p) => `${p.phase ?? p.label}:${Math.round(p.timing ?? 0)}`).join(" "),
  });
  const name = path.replace(/[^a-z0-9]+/gi, "_") || "home";
  writeFileSync(`.lighthouse/${name}-${i + 1}.json`, r.report);
  const failing = Object.values(lhr.categories)
    .flatMap((c) => c.auditRefs.map((ref) => lhr.audits[ref.id]))
    .filter((au) => au.score !== null && au.score < 0.9 && au.scoreDisplayMode !== "informative" && au.scoreDisplayMode !== "manual");
  if (i === 0 && failing.length) console.log("audits below 0.9 (run 1):", failing.map((f) => f.id).join(", "));
}

const fmt = (r) =>
  `perf ${r.perf}  a11y ${r.a11y}  bp ${r.bp}  seo ${r.seo}  FCP ${(r.fcp / 1000).toFixed(2)}s  LCP ${(r.lcp / 1000).toFixed(2)}s  TBT ${Math.round(r.tbt)}ms  CLS ${r.cls.toFixed(3)}  SI ${(r.si / 1000).toFixed(2)}s`;
rows.forEach((r, i) => console.log(`run ${i + 1}: ${fmt(r)}\n        LCP element: ${r.lcpEl}  [${r.phases}]`));
const med = (k) => [...rows].sort((x, y) => x[k] - y[k])[Math.floor(rows.length / 2)][k];
console.log(`median: ${fmt(Object.fromEntries(Object.keys(rows[0]).map((k) => [k, typeof rows[0][k] === "number" ? med(k) : rows[0][k]])))}`);

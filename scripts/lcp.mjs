// Lists LCP candidates on a Lighthouse-sized phone (412×823 @1.75x, 4x CPU throttle).
// Usage: node scripts/lcp.mjs [path=/]   (BASE_URL defaults to :3000)
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const base = process.env.BASE_URL ?? "http://localhost:3000";
const path = process.argv[2] ?? "/";
const browser = await chromium.launch();
for (const theme of ["dark", "light"]) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true, colorScheme: theme });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    window.__lcp = [];
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => {
        const el = e.element;
        const r = el?.getBoundingClientRect();
        window.__lcp.push({
          t: Math.round(e.startTime),
          size: e.size,
          el: el ? `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""}` : "?",
          url: e.url?.split("/").pop(),
          rect: r ? [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] : null,
        });
      }),
    ).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.goto(`${base}${path}${path.includes("?") ? "&" : "?"}theme=${theme}`, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  console.log(theme, JSON.stringify(await page.evaluate(() => window.__lcp), null, 1));
  await ctx.close();
}
await browser.close();

// Usage: node scripts/screenshots.mjs [path=/] [name=home] [waitMs=6500]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { mkdirSync } from "node:fs";

const [path = "/", name = "home", waitMs = "6500"] = process.argv.slice(2);
const base = process.env.BASE_URL ?? "http://localhost:3000";
const out = process.env.OUT_DIR ?? "design-screenshots";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const errors = [];
for (const theme of ["dark", "light"]) {
  for (const [label, width, height, mobile] of [["desktop", 1440, 900, false], ["mobile", 390, 844, true]]) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: mobile ? 2 : 1,
      isMobile: mobile,
      hasTouch: mobile,
      colorScheme: theme,
    });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(`${label}/${theme}: ${e.message}`));
    page.on("console", (m) => m.type() === "error" && errors.push(`${label}/${theme} console: ${m.text()}`));
    const tier = process.env.TIER ?? (mobile ? "low" : "high");
    await page.goto(`${base}${path}${path.includes("?") ? "&" : "?"}theme=${theme}&tier=${tier}&capture${process.env.FREEZE ? `&freeze=${process.env.FREEZE}` : ""}`, { waitUntil: "load" });
    await page.waitForTimeout(Number(waitMs));
    if (!mobile) await page.mouse.move(width * 0.7, height * 0.35);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/${name}-${label}-${theme}.png` });
    await ctx.close();
  }
}
await browser.close();
if (errors.length) console.log("ERRORS:\n" + [...new Set(errors)].join("\n"));
console.log("done");

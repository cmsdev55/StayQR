// Renders the static hero fallback images from the live 3D scene (resting state, no beam).
// Usage: node scripts/render-fallbacks.mjs   (dev server on :3000)
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const sharp = require("sharp");

const base = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

for (const theme of ["dark", "light"]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1700 }, deviceScaleFactor: 1 });
  // freeze=9: assembled, scanned once, softly lit, beam off-screen
  await page.goto(`${base}/?tier=high&capture&freeze=9&theme=${theme}`, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas");
  await page.waitForTimeout(5000);
  await page.evaluate(() => {
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    const c = document.querySelector("canvas");
    for (let el = c.parentElement; el; el = el.parentElement) {
      el.style.maskImage = "none";
      el.style.webkitMaskImage = "none";
      el.style.background = "transparent";
      el.style.backgroundImage = "none";
    }
    document.querySelectorAll("body *").forEach((el) => {
      if (!el.contains(c) && el !== c) el.style.visibility = "hidden";
    });
  });
  const box = await page.evaluate(() => {
    const r = document.querySelector("canvas").getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  });
  const png = await page.screenshot({ clip: box, omitBackground: true, timeout: 120000 });
  // Bake the page colour in: an opaque image is ~10x smaller, and the CSS mask fades the edges anyway.
  const bg = theme === "dark" ? "#07080B" : "#F5F6F2";
  await sharp(png).flatten({ background: bg }).webp({ quality: 74, effort: 6 }).toFile(`public/hero-qr-${theme}.webp`);
  const meta = await sharp(png).metadata();
  console.log(theme, meta.width, "x", meta.height);
  await page.close();
}
await browser.close();

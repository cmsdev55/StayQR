// Renders the static hero fallback images from the live 3D scene (resting state, no beam).
// Usage: node scripts/render-fallbacks.mjs   (dev server running; BASE_URL defaults to :3000)
//   public/hero-qr-{dark,light}.webp     desktop, full frame (33×33, high tier)
//   public/hero-qr-m-{dark,light}.webp   phones, tightly cropped (25×25, low tier, 390px wide)
//   src/components/sections/hero-fallback.json  where the phone crop sits inside the hero box
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const sharp = require("sharp");

const base = process.env.BASE_URL ?? "http://localhost:3000";
const only = process.env.ONLY; // "desktop" | "mobile"
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

/** Load the scene frozen at t=9 (assembled, scanned once, softly lit) and capture just the canvas. */
async function capture(page, theme, tier) {
  await page.goto(`${base}/?tier=${tier}&capture&freeze=9&theme=${theme}`, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas");
  await page.waitForTimeout(5000);
  await page.evaluate(() => {
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    const c = document.querySelector("canvas");
    // the page's grain overlay sits on an ancestor of the canvas; don't bake it into the image
    document.querySelectorAll(".noise").forEach((el) => el.classList.remove("noise"));
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
  return { png, box };
}

const layout = {};
for (const theme of ["dark", "light"]) {
  if (only !== "mobile") {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1700 }, deviceScaleFactor: 1 });
    const { png } = await capture(page, theme, "high");
    // Bake the page colour in: an opaque image is ~10x smaller, and the CSS mask fades the edges anyway.
    const bg = theme === "dark" ? "#07080B" : "#F5F6F2";
    await sharp(png).flatten({ background: bg }).webp({ quality: 74, effort: 6 }).toFile(`public/hero-qr-${theme}.webp`);
    const meta = await sharp(png).metadata();
    console.log("desktop", theme, meta.width, "x", meta.height);
    await page.close();
  }

  if (only !== "desktop") {
    // Phones: the low-tier scene at 390px, trimmed to the code itself. Kept transparent so the
    // depth glow behind it shows through exactly as it does behind the live (alpha) canvas.
    const dpr = 2;
    const page = await browser.newPage({ viewport: { width: 390, height: 1400 }, deviceScaleFactor: dpr, isMobile: true, hasTouch: true });
    const { png, box } = await capture(page, theme, "low");
    const pad = 12 * dpr;
    const { info } = await sharp(png).trim({ threshold: 4 }).toBuffer({ resolveWithObject: true });
    const left = Math.max(0, -info.trimOffsetLeft - pad);
    const top = Math.max(0, -info.trimOffsetTop - pad);
    const { width: W, height: H } = await sharp(png).metadata();
    const width = Math.min(W - left, info.width + pad * 2);
    const height = Math.min(H - top, info.height + pad * 2);
    // Shipped at 1.5x: sharp on DPR 1.75–3 phones, and AVIF keeps it under ~50 KB with alpha.
    const crop = sharp(png).extract({ left, top, width, height }).resize(Math.round((width / dpr) * 1.5));
    if (process.env.RAW_OUT) await crop.clone().png().toFile(`${process.env.RAW_OUT}/m-${theme}.png`);
    await crop.clone().avif({ quality: 42, effort: 7 }).toFile(`public/hero-qr-m-${theme}.avif`);
    await crop.clone().webp({ quality: 55, alphaQuality: 40, effort: 6 }).toFile(`public/hero-qr-m-${theme}.webp`);
    if (theme === "dark") {
      // fractions of the hero box (square at 360–480px wide, where the 3D framing scales with width)
      layout.width = +(width / W).toFixed(4);
      layout.cx = +((left + width / 2) / W).toFixed(4);
      layout.cy = +((top + height / 2) / H).toFixed(4);
      layout.px = [Math.round(width / dpr), Math.round(height / dpr)];
    }
    console.log("mobile", theme, width, "x", height, "at", left, top);
    await page.close();
  }
}
if (layout.width) writeFileSync("src/components/sections/hero-fallback.json", JSON.stringify(layout, null, 2) + "\n");
await browser.close();

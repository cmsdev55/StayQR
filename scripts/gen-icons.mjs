// Renders mark A ("The Lit Core") app icons from one geometry (see src/components/logo.tsx).
// Usage: node scripts/gen-icons.mjs  → src/app/icon.svg (dark tile) + src/app/apple-icon.png (180×180)
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const sharp = createRequire(import.meta.url)("sharp");

const BG = "#07080B", INK = "#F2F4F7", LIME = "#B6FF3B";
// the mark on its 32 grid, placed at `scale` and centred in a `size` box
const mark = (size, scale) => {
  const o = (size - 32 * scale) / 2;
  return `<g transform="translate(${o} ${o}) scale(${scale})">
    <rect x="2" y="2" width="28" height="28" rx="7" fill="none" stroke="${INK}" stroke-width="4"/>
    <rect x="10.5" y="10.5" width="11" height="11" rx="3.2" fill="${LIME}"/>
  </g>`;
};

// favicon: dark rounded tile, mark at 72%
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${BG}"/>${mark(32, 0.72)}</svg>\n`;
writeFileSync("src/app/icon.svg", icon);

// apple touch icon: full-bleed (iOS applies its own mask), mark at ~60%
const apple = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="${BG}"/>${mark(180, 3.4)}</svg>`;
await sharp(Buffer.from(apple)).png({ compressionLevel: 9 }).toFile("src/app/apple-icon.png");
console.log("icon.svg + apple-icon.png written");

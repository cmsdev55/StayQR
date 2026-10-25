import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import qrcode from "qrcode-generator";

export const alt = "StayQR: QR codes that never stop working";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#07080B", INK = "#F2F4F7", MUTED = "#9AA3B2", SUBTLE = "#7A8294", LIME = "#B6FF3B", DEPTH = "#6E7BFF";

/** Background: 64px grid, a depth glow, and a tilted 21×21 code with a lime scan line (one SVG layer). */
function scene() {
  // Upper-case URL in alphanumeric mode fits version 1 (21×21) at level M, so the drawn code really scans.
  const qr = qrcode(1, "M");
  qr.addData("HTTPS://STAYQR.COM", "Alphanumeric");
  qr.make();
  const n = qr.getModuleCount();
  const cell = 15, scanRow = 12.4; // beam sits between rows 12 and 13
  let modules = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      if (!qr.isDark(r, c)) continue;
      // rows just above the beam are still lit (the trail); the rest stay a faint lime-grey
      const lit = r <= scanRow && r > scanRow - 3.2 ? 1 - (scanRow - r) / 3.2 : 0;
      const fill = lit > 0 ? (lit > 0.5 ? LIME : "#C9E89A") : "#D5DAE2";
      modules += `<rect x="${c * cell + 1.2}" y="${r * cell + 1.2}" width="${cell - 2.4}" height="${cell - 2.4}" rx="3.2" fill="${fill}" opacity="${lit > 0 ? 1 : 0.9}"/>`;
    }
  const w = n * cell;
  const grid = Array.from({ length: 20 }, (_, i) => `<path d="M${i * 64} 0V630M0 ${i * 64}H1200" stroke="#FFFFFF" stroke-opacity="0.045"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <radialGradient id="g" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${DEPTH}" stop-opacity="0.32"/><stop offset="0.6" stop-color="${DEPTH}" stop-opacity="0.08"/><stop offset="1" stop-color="${DEPTH}" stop-opacity="0"/></radialGradient>
      <linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="${BG}" stop-opacity="1"/><stop offset="0.45" stop-color="${BG}" stop-opacity="0"/></linearGradient>
      <filter id="blur" x="-20%" y="-400%" width="140%" height="900%"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    ${grid}
    <rect width="1200" height="630" fill="url(#fade)"/>
    <ellipse cx="900" cy="330" rx="380" ry="300" fill="url(#g)"/>
    <g transform="translate(905 320) rotate(-11) skewX(9) scale(1 0.9) translate(${-w / 2} ${-w / 2})">
      <rect x="-22" y="-22" width="${w + 44}" height="${w + 44}" rx="26" fill="#0D0F14" stroke="#FFFFFF" stroke-opacity="0.08"/>
      ${modules}
      <rect x="-40" y="${scanRow * cell + cell - 2}" width="${w + 80}" height="10" fill="${LIME}" filter="url(#blur)" opacity="0.9"/>
      <rect x="-40" y="${scanRow * cell + cell + 1}" width="${w + 80}" height="3" rx="1.5" fill="#E6FFB8"/>
    </g>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function Mark({ size: s }: { size: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <rect x="2" y="2" width="28" height="28" rx="7" fill="none" stroke={INK} strokeWidth="4" />
      <rect x="10.5" y="10.5" width="11" height="11" rx="3.2" fill={LIME} />
    </svg>
  );
}

const chip = { display: "flex", alignItems: "center", height: 48, padding: "0 22px", borderRadius: 999, fontSize: 22 } as const;

export default async function OpengraphImage() {
  const font = (f: string) => readFile(join(process.cwd(), "src/assets/og", f));
  const [clash, inter, mono] = await Promise.all([font("ClashDisplay-600.ttf"), font("Inter-500.ttf"), font("JetBrainsMono-500.ttf")]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: BG, fontFamily: "Inter" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={scene()} width={1200} height={630} alt="" style={{ position: "absolute", left: 0, top: 0 }} />

        <div style={{ position: "absolute", left: 72, top: 64, display: "flex", alignItems: "center", gap: 14 }}>
          <Mark size={40} />
          <span style={{ fontFamily: "Clash Display", fontSize: 34, color: INK, letterSpacing: -0.7 }}>StayQR</span>
        </div>

        <div style={{ position: "absolute", left: 72, top: 178, display: "flex", flexDirection: "column", fontFamily: "Clash Display", fontSize: 84, lineHeight: 0.96, letterSpacing: -3.4, color: INK }}>
          <span>QR codes that</span>
          <span>never stop</span>
          <span style={{ color: LIME }}>working.</span>
        </div>

        <div style={{ position: "absolute", left: 72, bottom: 64, display: "flex", gap: 12 }}>
          <span style={{ ...chip, color: MUTED, border: "1.5px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.04)" }}>Edit after printing</span>
          <span style={{ ...chip, color: MUTED, border: "1.5px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.04)" }}>Unlimited scans</span>
          <span style={{ ...chip, color: "#0A0D02", background: LIME }}>$79 lifetime</span>
        </div>

        <span style={{ position: "absolute", right: 64, bottom: 72, fontFamily: "JetBrains Mono", fontSize: 22, color: SUBTLE }}>stayqr.com</span>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Clash Display", data: clash, weight: 600, style: "normal" },
        { name: "Inter", data: inter, weight: 500, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}

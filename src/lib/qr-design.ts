/** Shared QR design model for the free generator and the dashboard editor (qr-code-styling options). */

export type DotStyle = "square" | "rounded" | "extra-rounded" | "dots" | "classy";
export type CornerStyle = "square" | "extra-rounded" | "dot";
export type ContentKind = "url" | "text" | "wifi" | "email";

export type QrDesign = {
  dots: DotStyle;
  corners: CornerStyle;
  fg: string;
  bg: string;
};

export const DEFAULT_DESIGN: QrDesign = { dots: "rounded", corners: "extra-rounded", fg: "#0B0D12", bg: "#FFFFFF" };

export const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "extra-rounded", label: "Soft" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
];

export const CORNER_STYLES: { value: CornerStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "extra-rounded", label: "Rounded" },
  { value: "dot", label: "Circle" },
];

export const FG_SWATCHES = [
  { value: "#0B0D12", label: "Ink" },
  { value: "#1E3A8A", label: "Navy" },
  { value: "#5B21B6", label: "Plum" },
  { value: "#065F46", label: "Forest" },
  { value: "#9F1239", label: "Wine" },
  { value: "#7C2D12", label: "Rust" },
];

export const BG_SWATCHES = [
  { value: "#FFFFFF", label: "White" },
  { value: "#F5F6F2", label: "Paper" },
  { value: "#FEF3C7", label: "Cream" },
  { value: "#E0F2FE", label: "Sky" },
  { value: "#ECFCCB", label: "Lime tint" },
];

// ── Content encoding ──────────────────────────────────────────────────
export type ContentFields = {
  url: string;
  text: string;
  ssid: string;
  password: string;
  security: "WPA" | "WEP" | "nopass";
  email: string;
  subject: string;
};

export const DEFAULT_FIELDS: ContentFields = {
  url: "https://stayqr.com",
  text: "Table 12 · Ask us about today's specials",
  ssid: "Cafe Guest",
  password: "coffee2026",
  security: "WPA",
  email: "hello@stayqr.com",
  subject: "Hello from your QR code",
};

const wifiEscape = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

export function encodeContent(kind: ContentKind, f: ContentFields): string {
  switch (kind) {
    case "url": {
      const u = f.url.trim();
      if (!u) return "";
      return /^[a-z][a-z0-9+.-]*:/i.test(u) ? u : `https://${u}`;
    }
    case "text":
      return f.text;
    case "wifi":
      return f.ssid ? `WIFI:T:${f.security};S:${wifiEscape(f.ssid)};${f.security === "nopass" ? "" : `P:${wifiEscape(f.password)};`};` : "";
    case "email":
      return f.email ? `mailto:${f.email.trim()}${f.subject ? `?subject=${encodeURIComponent(f.subject)}` : ""}` : "";
  }
}

/** Human summary shown under the preview. */
export function describeContent(kind: ContentKind, f: ContentFields): string {
  switch (kind) {
    case "url":
      return encodeContent("url", f).replace(/^https?:\/\//, "") || "Add a link";
    case "text":
      return f.text ? `${f.text.length} characters of text` : "Add some text";
    case "wifi":
      return f.ssid ? `Wi-Fi · ${f.ssid}` : "Add a network name";
    case "email":
      return f.email ? `Email · ${f.email}` : "Add an email address";
  }
}

// ── Contrast (WCAG relative luminance) ────────────────────────────────
function lum(hex: string) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Warn when a code may not scan: low contrast, or light modules on a dark ground. */
export function scanWarning(fg: string, bg: string): string | null {
  const a = lum(fg), b = lum(bg);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  if (ratio < 3) return "Low contrast: this code may not scan.";
  if (a > b) return "Light modules on a dark ground don't scan on some older phones.";
  return null;
}

/** qr-code-styling options for a design. */
export function stylingOptions(data: string, d: QrDesign, size: number, margin = 0) {
  return {
    width: size,
    height: size,
    margin,
    data: data || " ",
    qrOptions: { errorCorrectionLevel: "M" as const },
    dotsOptions: { type: d.dots, color: d.fg },
    cornersSquareOptions: { type: d.corners, color: d.fg },
    cornersDotOptions: { type: d.corners === "dot" ? ("dot" as const) : ("square" as const), color: d.fg },
    backgroundOptions: { color: d.bg },
  };
}

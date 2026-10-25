/** Shared QR design model for the free generator and the dashboard editor (qr-code-styling options). */

export type DotStyle = "square" | "rounded" | "extra-rounded" | "dots" | "classy";
export type CornerStyle = "square" | "extra-rounded" | "dot";

export type FrameStyle = "none" | "label" | "box" | "pill";
export type Ecl = "L" | "M" | "Q" | "H";

export type QrDesign = {
  dots: DotStyle;
  corners: CornerStyle;
  fg: string;
  bg: string;
  /** Logo as a data URL (stays in the browser; never uploaded). */
  logo?: string;
  /** Logo width as a fraction of the code (0.15–0.35). */
  logoSize?: number;
  frame?: FrameStyle;
  frameLabel?: string;
  /** Error correction; a logo forces H. */
  ecl?: Ecl;
  /** Quiet zone in modules (4 is the spec minimum for print). */
  quietZone?: number;
};

export const FRAME_STYLES: { value: FrameStyle; label: string }[] = [
  { value: "none", label: "None" },
  { value: "label", label: "Label" },
  { value: "box", label: "Box" },
  { value: "pill", label: "Pill" },
];

export const ECL_LEVELS: { value: Ecl; label: string; hint: string }[] = [
  { value: "L", label: "L", hint: "7% recovery: smallest code" },
  { value: "M", label: "M", hint: "15%: the usual default" },
  { value: "Q", label: "Q", hint: "25%: rough surfaces" },
  { value: "H", label: "H", hint: "30%: needed with a logo" },
];

/** Error correction actually used: a logo covers modules, so it always needs H. */
export const effectiveEcl = (d: QrDesign): Ecl => (d.logo ? "H" : (d.ecl ?? "M"));

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
    qrOptions: { errorCorrectionLevel: effectiveEcl(d) },
    image: d.logo,
    imageOptions: { hideBackgroundDots: true, imageSize: d.logoSize ?? 0.28, margin: Math.round(size / 120), crossOrigin: "anonymous" },
    dotsOptions: { type: d.dots, color: d.fg },
    cornersSquareOptions: { type: d.corners, color: d.fg },
    cornersDotOptions: { type: d.corners === "dot" ? ("dot" as const) : ("square" as const), color: d.fg },
    backgroundOptions: { color: d.bg },
  };
}

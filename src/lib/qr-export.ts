/**
 * Client-side export for generated codes: PNG, JPEG, SVG or a print PDF, at any size, with the
 * optional frame + label composited into one file. Nothing leaves the browser.
 */
import type QRCodeStyling from "qr-code-styling";
import { stylingOptions, type QrDesign } from "@/lib/qr-design";

export type ExportFormat = "png" | "svg" | "jpeg" | "pdf";
export const EXPORT_FORMATS: { value: ExportFormat; label: string; hint: string }[] = [
  { value: "png", label: "PNG", hint: "Web, social, documents" },
  { value: "svg", label: "SVG", hint: "Vector: any print size" },
  { value: "jpeg", label: "JPEG", hint: "Smallest file" },
  { value: "pdf", label: "PDF", hint: "Print shops, 300 dpi" },
];
export const EXPORT_SIZES = [512, 1024, 2048, 4096];

const QR_BASE = 1000; // internal SVG units for the code itself
const FONT = "Helvetica, Arial, sans-serif"; // available when an SVG is rasterised as an image

/** Frame geometry in SVG units; the HTML preview mirrors these ratios. */
export function frameLayout(frame: QrDesign["frame"]) {
  const pad = frame === "none" || !frame ? 0 : 60;
  const label = frame === "none" || !frame ? 0 : 190;
  return { pad, label, width: QR_BASE + pad * 2, height: QR_BASE + pad * 2 + label };
}

async function loadLib() {
  return (await import("qr-code-styling")).default as typeof QRCodeStyling;
}

/** The code alone as an SVG string (QR_BASE units, quiet zone included). */
async function codeSvg(data: string, design: QrDesign): Promise<string> {
  const Q = await loadLib();
  // quiet zone in modules → px: a module is ≈ QR_BASE/45 on the codes this generator produces
  const quiet = Math.round((design.quietZone ?? 4) * (QR_BASE / 45));
  const qr = new Q({ ...stylingOptions(data, design, QR_BASE, quiet), type: "svg" });
  const blob = (await qr.getRawData("svg")) as Blob;
  // drop the XML prolog: it is invalid once this SVG is nested inside the frame artwork
  return (await blob.text()).replace(/<\?xml[^>]*\?>/g, "").replace(/<!DOCTYPE[^>]*>/gi, "").trim();
}

const escapeXml = (s: string) => s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c]!);

/** Full artwork (frame + code + label) as one standalone SVG. */
export async function artworkSvg(data: string, design: QrDesign): Promise<{ svg: string; width: number; height: number }> {
  const inner = await codeSvg(data, design);
  const frame = design.frame ?? "none";
  if (frame === "none") return { svg: inner, width: QR_BASE, height: QR_BASE };
  const { pad, label, width, height } = frameLayout(frame);
  // place the code inside the frame as a plain group (nested <svg> trips up some editors' renderers)
  const body = inner.replace(/^[\s\S]*?<svg\b[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  const nested = `<g transform="translate(${pad} ${pad})">${body}</g>`;
  const text = escapeXml((design.frameLabel || "Scan me").slice(0, 28));
  const fg = design.fg, bg = design.bg;
  const r = frame === "pill" ? 120 : 64;
  const parts: string[] = [];
  if (frame === "label") {
    parts.push(`<rect width="${width}" height="${height}" rx="${r}" fill="${bg}"/>`);
    parts.push(nested);
    parts.push(`<text x="${width / 2}" y="${QR_BASE + pad * 2 + label * 0.52}" font-family="${FONT}" font-weight="700" font-size="96" fill="${fg}" text-anchor="middle" dominant-baseline="middle" letter-spacing="2">${text}</text>`);
  } else {
    // box / pill: solid frame in the code colour with the label reversed out
    parts.push(`<rect width="${width}" height="${height}" rx="${r}" fill="${fg}"/>`);
    parts.push(`<rect x="${pad * 0.5}" y="${pad * 0.5}" width="${QR_BASE + pad}" height="${QR_BASE + pad}" rx="${r * 0.6}" fill="${bg}"/>`);
    parts.push(nested);
    parts.push(`<text x="${width / 2}" y="${QR_BASE + pad * 2 + label * 0.45}" font-family="${FONT}" font-weight="700" font-size="96" fill="${bg}" text-anchor="middle" dominant-baseline="middle" letter-spacing="2">${text}</text>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${parts.join("")}</svg>`;
  return { svg, width, height };
}

/** Draw an SVG string onto a canvas at `pxWidth` (height keeps the ratio). */
async function rasterise(svg: string, w: number, h: number, pxWidth: number, type: "image/png" | "image/jpeg", bg: string): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = pxWidth;
    canvas.height = Math.round((pxWidth * h) / w);
    const ctx = canvas.getContext("2d")!;
    if (type === "image/jpeg") {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("Canvas export failed"))), type, 0.95));
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Minimal single-page PDF embedding one JPEG at 300 dpi (no PDF library needed). */
function pdfFromJpeg(jpeg: Uint8Array, pxW: number, pxH: number): Blob {
  const ptW = (pxW / 300) * 72, ptH = (pxH / 300) * 72;
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (c: Uint8Array | string) => {
    const b = typeof c === "string" ? enc.encode(c) : c;
    chunks.push(b);
    length += b.length;
  };
  const obj = (n: number, body: () => void) => {
    offsets[n] = length;
    push(`${n} 0 obj\n`);
    body();
    push("\nendobj\n");
  };
  const content = `q ${ptW.toFixed(2)} 0 0 ${ptH.toFixed(2)} 0 0 cm /Im0 Do Q`;
  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  obj(1, () => push("<< /Type /Catalog /Pages 2 0 R >>"));
  obj(2, () => push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"));
  obj(3, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ptW.toFixed(2)} ${ptH.toFixed(2)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`));
  obj(4, () => {
    push(`<< /Type /XObject /Subtype /Image /Width ${pxW} /Height ${pxH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
    push(jpeg);
    push("\nendstream");
  });
  obj(5, () => push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`));
  const xref = length;
  push(`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`);
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(chunks as BlobPart[], { type: "application/pdf" });
}

/** Build the file for a code in the chosen format and size. */
export async function exportQr(data: string, design: QrDesign, format: ExportFormat, size: number): Promise<Blob> {
  const { svg, width, height } = await artworkSvg(data, design);
  if (format === "svg") return new Blob([svg], { type: "image/svg+xml" });
  if (format === "png") return rasterise(svg, width, height, size, "image/png", design.bg);
  const jpeg = await rasterise(svg, width, height, size, "image/jpeg", design.bg);
  if (format === "jpeg") return jpeg;
  return pdfFromJpeg(new Uint8Array(await jpeg.arrayBuffer()), size, Math.round((size * height) / width));
}

/** Export and save. */
export async function downloadQr(data: string, design: QrDesign, format: ExportFormat, size: number, name = "stayqr-code") {
  const blob = await exportQr(data, design, format, size);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name}.${format === "jpeg" ? "jpg" : format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

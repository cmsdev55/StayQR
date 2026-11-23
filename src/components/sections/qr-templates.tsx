"use client";

/**
 * Printable QR code templates: a WiFi sign, a folding table tent, review cards (4 per sheet) and a
 * "Scan to pay" sign. The whole sheet is one SVG in millimetres, so the preview scales on screen and
 * prints at true size (A4 or US Letter). Print / Save as PDF uses the browser; SVG downloads as a file.
 * Everything is made in the browser; nothing is sent anywhere.
 */
import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/input";
import { qrMatrix, qrRuns } from "@/lib/qr";
import { qrType } from "@/lib/qr-types";
import { cn } from "@/lib/utils";

type TemplateId = "wifi" | "table" | "review" | "pay";
type Paper = "a4" | "letter";

const TEMPLATES: { id: TemplateId; name: string; blurb: string }[] = [
  { id: "wifi", name: "WiFi sign", blurb: "One sign per page. Guests scan to join, with the password printed as a backup." },
  { id: "table", name: "Table tent", blurb: "Fold the sheet in half to stand it on a table. Both sides show the code." },
  { id: "review", name: "Review cards", blurb: "Four cards per sheet to cut out, for the counter, receipts or bags." },
  { id: "pay", name: "Scan to pay", blurb: "One sign per page that opens your payment link." },
];

const PAPER: Record<Paper, { w: number; h: number; label: string }> = {
  a4: { w: 210, h: 297, label: "A4" },
  letter: { w: 215.9, h: 279.4, label: "US Letter" },
};

const ACCENTS = [
  { name: "Ink", value: "#0B0D12" },
  { name: "Blue", value: "#1D4ED8" },
  { name: "Green", value: "#047857" },
  { name: "Terracotta", value: "#B4441E" },
];

type Fields = {
  business: string;
  heading: string;
  sub: string;
  note: string;
  link: string;
  ssid: string;
  password: string;
  security: string;
  payee: string;
};

const DEFAULTS: Record<TemplateId, Fields> = {
  wifi: { business: "Your Café", heading: "Free WiFi", sub: "Scan to connect", note: "Point your phone camera at the code", link: "", ssid: "Cafe Guest", password: "coffee2026", security: "WPA", payee: "" },
  table: { business: "Your Café", heading: "Scan for our menu", sub: "Order at the counter", note: "Point your phone camera at the code", link: "https://example.com/menu", ssid: "", password: "", security: "WPA", payee: "" },
  review: { business: "Your Café", heading: "Enjoyed your visit?", sub: "Scan to leave us a review", note: "It takes less than a minute. Thank you!", link: "https://example.com/review", ssid: "", password: "", security: "WPA", payee: "" },
  pay: { business: "Your Café", heading: "Scan to pay", sub: "Use your phone's camera", note: "Check the name on the payment page before you pay.", link: "https://example.com/pay", ssid: "", password: "", security: "WPA", payee: "Your Café" },
};

const INK = "#0B0D12";
const PRINT_WRAP = "qr-template-print";
const PRINT_SVG = "qr-template-sheet";
const MUTED = "#4B5160";
const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";

/** Font size (mm) that fits `text` in `width` mm, capped at `max`. ~0.56em per character for a bold sans. */
const fit = (text: string, width: number, max: number, em = 0.56) => Math.min(max, width / Math.max(1, text.length * em));

/** Wrap to at most `lines` lines of about `chars` characters. */
function wrap(text: string, chars: number, lines = 2) {
  const out: string[] = [];
  let cur = "";
  for (const w of text.split(/\s+/).filter(Boolean)) {
    if ((cur + " " + w).trim().length > chars && cur) {
      out.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) out.push(cur);
  return out.slice(0, lines);
}

const shortUrl = (u: string) => {
  const s = u.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return s.length > 44 ? s.slice(0, 42) + "…" : s;
};

/** A QR code with its 4-module quiet zone, drawn at (x, y) and `size` mm wide. */
function Qr({ data, x, y, size }: { data: string; x: number; y: number; size: number }) {
  const m = useMemo(() => (data ? qrMatrix(data, 0) : null), [data]);
  if (!m) {
    return (
      <g>
        <rect x={x} y={y} width={size} height={size} fill="none" stroke="#C4C8D0" strokeDasharray="2 2" strokeWidth={0.4} />
        <text x={x + size / 2} y={y + size / 2} textAnchor="middle" fontSize={4} fill={MUTED} fontFamily={FONT}>Add your details</text>
      </g>
    );
  }
  const n = m.length;
  const q = 4;
  return (
    <svg x={x} y={y} width={size} height={size} viewBox={`${-q} ${-q} ${n + 2 * q} ${n + 2 * q}`} shapeRendering="crispEdges">
      <rect x={-q} y={-q} width={n + 2 * q} height={n + 2 * q} fill="#FFFFFF" />
      <path d={qrRuns(m)} fill="none" stroke={INK} strokeWidth={1} strokeLinecap="square" />
    </svg>
  );
}

function T({ x, y, size, children, weight = 400, fill = INK, anchor = "middle" }: { x: number; y: number; size: number; children: string; weight?: number; fill?: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} fontFamily={FONT}>
      {children}
    </text>
  );
}

/** WiFi and pay signs: one large sign per portrait sheet. */
function Sign({ f, data, w, h, accent, details }: { f: Fields; data: string; w: number; h: number; accent: string; details: string[] }) {
  const cx = w / 2;
  const qr = Math.min(w - 70, 118);
  const qy = 92;
  return (
    <>
      <rect x={0} y={0} width={w} height={10} fill={accent} />
      {f.business && <T x={cx} y={36} size={fit(f.business, w - 40, 9, 0.5)} fill={MUTED}>{f.business}</T>}
      <T x={cx} y={62} size={fit(f.heading, w - 30, 22)} weight={700} fill={accent}>{f.heading}</T>
      {f.sub && <T x={cx} y={78} size={fit(f.sub, w - 40, 9, 0.5)}>{f.sub}</T>}
      <Qr data={data} x={cx - qr / 2} y={qy} size={qr} />
      {details.map((d, i) => (
        <T key={i} x={cx} y={qy + qr + 16 + i * 11} size={fit(d, w - 40, 7.5, 0.52)} weight={i === 0 ? 600 : 400}>{d}</T>
      ))}
      {wrap(f.note, 52).map((l, i) => (
        <T key={i} x={cx} y={h - 24 + i * 7} size={5} fill={MUTED}>{l}</T>
      ))}
    </>
  );
}

/** Table tent: landscape sheet, two panels; the top one is upside down so both read correctly once folded. */
function Tent({ f, data, w, h, accent }: { f: Fields; data: string; w: number; h: number; accent: string }) {
  const ph = h / 2;
  const qr = Math.min(ph - 24, 80);
  const tx = 30 + qr + 14;
  const tw = w - tx - 18;
  const panel = (
    <g>
      <rect x={0} y={ph - 6} width={w} height={6} fill={accent} />
      <Qr data={data} x={24} y={(ph - qr) / 2 - 2} size={qr} />
      {f.business && <T x={tx} y={ph / 2 - 20} size={fit(f.business, tw, 7, 0.5)} fill={MUTED} anchor="start">{f.business}</T>}
      {wrap(f.heading, 16).map((l, i, a) => (
        <T key={i} x={tx} y={ph / 2 - (a.length - 1) * 7 + i * 14 + 2} size={fit(a.reduce((m, s) => (s.length > m.length ? s : m), ""), tw, 14)} weight={700} fill={accent} anchor="start">{l}</T>
      ))}
      {f.sub && <T x={tx} y={ph / 2 + 20} size={fit(f.sub, tw, 7, 0.5)} anchor="start">{f.sub}</T>}
      {f.note && <T x={tx} y={ph / 2 + 30} size={fit(f.note, tw, 4.5, 0.5)} fill={MUTED} anchor="start">{f.note}</T>}
    </g>
  );
  return (
    <>
      <g transform={`translate(0 ${ph})`}>{panel}</g>
      <g transform={`rotate(180 ${w / 2} ${ph / 2})`}>{panel}</g>
      <line x1={8} x2={w - 8} y1={ph} y2={ph} stroke="#9AA0AC" strokeWidth={0.3} strokeDasharray="3 2" />
      <T x={w - 10} y={ph - 1.5} size={3} fill="#9AA0AC" anchor="end">fold</T>
    </>
  );
}

/** Review cards: 2 × 2 on a portrait sheet, with dashed cut lines. */
function Cards({ f, data, w, h, accent }: { f: Fields; data: string; w: number; h: number; accent: string }) {
  const cw = w / 2;
  const ch = h / 2;
  const qr = Math.min(cw - 40, ch - 85, 64);
  const card = (
    <g>
      <rect x={12} y={12} width={cw - 24} height={4} rx={2} fill={accent} />
      {f.business && <T x={cw / 2} y={28} size={fit(f.business, cw - 24, 5.5, 0.5)} fill={MUTED}>{f.business}</T>}
      <T x={cw / 2} y={42} size={fit(f.heading, cw - 20, 10)} weight={700} fill={accent}>{f.heading}</T>
      <Qr data={data} x={(cw - qr) / 2} y={49} size={qr} />
      {f.sub && <T x={cw / 2} y={49 + qr + 10} size={fit(f.sub, cw - 20, 5.5, 0.5)} weight={600}>{f.sub}</T>}
      {wrap(f.note, 40).map((l, i) => (
        <T key={i} x={cw / 2} y={49 + qr + 18 + i * 5.5} size={4} fill={MUTED}>{l}</T>
      ))}
    </g>
  );
  return (
    <>
      {[0, 1].flatMap((r) => [0, 1].map((c) => <g key={`${r}${c}`} transform={`translate(${c * cw} ${r * ch})`}>{card}</g>))}
      <line x1={cw} x2={cw} y1={0} y2={h} stroke="#9AA0AC" strokeWidth={0.3} strokeDasharray="3 2" />
      <line x1={0} x2={w} y1={ch} y2={ch} stroke="#9AA0AC" strokeWidth={0.3} strokeDasharray="3 2" />
    </>
  );
}

function Sheet({ id, tpl, f, data, paper, accent, print }: { id?: string; tpl: TemplateId; f: Fields; data: string; paper: Paper; accent: string; print?: boolean }) {
  const p = PAPER[paper];
  const landscape = tpl === "table";
  const w = landscape ? p.h : p.w;
  const h = landscape ? p.w : p.h;
  const details =
    tpl === "wifi"
      ? [f.ssid && `Network: ${f.ssid}`, f.security !== "nopass" && f.password && `Password: ${f.password}`].filter((x): x is string => Boolean(x))
      : tpl === "pay"
        ? [f.payee && `Pay to: ${f.payee}`, data && shortUrl(data)].filter((x): x is string => Boolean(x))
        : [];
  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={print ? `${w}mm` : undefined}
      height={print ? `${h}mm` : undefined}
      className={print ? undefined : "block h-auto w-full"}
      style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
      role={print ? undefined : "img"}
      aria-label={print ? undefined : `Preview of the ${TEMPLATES.find((t) => t.id === tpl)?.name} on ${p.label} paper`}
    >
      <rect width={w} height={h} fill="#FFFFFF" />
      {tpl === "table" ? <Tent f={f} data={data} w={w} h={h} accent={accent} /> : tpl === "review" ? <Cards f={f} data={data} w={w} h={h} accent={accent} /> : <Sign f={f} data={data} w={w} h={h} accent={accent} details={details} />}
    </svg>
  );
}

export function QrTemplates() {
  const uid = useId();
  const [tpl, setTpl] = useState<TemplateId>("wifi");
  const [all, setAll] = useState<Record<TemplateId, Fields>>(DEFAULTS);
  const [paper, setPaper] = useState<Paper>("a4");
  const [accent, setAccent] = useState(ACCENTS[0].value);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const f = all[tpl];
  const set = (k: keyof Fields) => (e: { target: { value: string } }) => setAll((a) => ({ ...a, [tpl]: { ...a[tpl], [k]: e.target.value } }));

  const data = useMemo(() => {
    if (tpl === "wifi") return qrType("wifi")?.encode({ ssid: f.ssid, password: f.password, security: f.security, hidden: "" }) ?? "";
    return f.link.trim() ? (qrType("url")?.encode({ url: f.link.trim() }) ?? "") : "";
  }, [tpl, f.ssid, f.password, f.security, f.link]);

  const exampleLink = tpl !== "wifi" && /example\.com/i.test(f.link);
  const landscape = tpl === "table";
  const p = PAPER[paper];

  const downloadSvg = () => {
    const el = document.getElementById(PRINT_SVG);
    if (!el) return;
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${el.outerHTML}`], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `qr-${tpl}-${paper}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const input = (k: keyof Fields, label: string, opts: { max?: number; placeholder?: string; type?: string; hint?: string } = {}) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={`${uid}-${k}`} className="text-body-sm font-medium text-fg">{label}</label>
      <input
        id={`${uid}-${k}`}
        type={opts.type ?? "text"}
        value={f[k]}
        onChange={set(k)}
        maxLength={opts.max}
        placeholder={opts.placeholder}
        className={cn(fieldClass, "h-11 px-4 text-body-sm")}
      />
      {opts.hint && <p className="text-[13px] text-fg-subtle">{opts.hint}</p>}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
      {/* print-only copy at true size, as a direct child of <body> so everything else can be display:none in print */}
      {mounted &&
        createPortal(
          <div id={PRINT_WRAP} style={{ display: "none" }} aria-hidden>
            <style>{`@media print{@page{size:${paper === "a4" ? "A4" : "letter"} ${landscape ? "landscape" : "portrait"};margin:0}html,body{background:#fff!important;margin:0!important;padding:0!important}body>*:not(#${PRINT_WRAP}){display:none!important}#${PRINT_WRAP}{display:block!important}#${PRINT_WRAP} svg{display:block}}`}</style>
            <Sheet id={PRINT_SVG} tpl={tpl} f={f} data={data} paper={paper} accent={accent} print />
          </div>,
          document.body,
        )}

      <div className="glass flex flex-col gap-6 rounded-lg p-5 sm:p-7">
        <fieldset>
          <legend className="text-body-sm font-medium text-fg">Template</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTpl(t.id)}
                aria-pressed={tpl === t.id}
                className={cn(
                  "rounded-sm border px-3 py-2.5 text-left text-body-sm transition-colors",
                  tpl === t.id ? "border-accent bg-glass-strong text-fg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-fg-subtle">{TEMPLATES.find((t) => t.id === tpl)?.blurb}</p>
        </fieldset>

        {tpl === "wifi" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {input("ssid", "Network name (SSID)", { max: 32 })}
            {input("password", "Password", { max: 63, hint: "Stays in your browser." })}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor={`${uid}-security`} className="text-body-sm font-medium text-fg">Security</label>
              <select id={`${uid}-security`} value={f.security} onChange={set("security")} className={cn(fieldClass, "h-11 px-4 text-body-sm")}>
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (open network)</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {input("link", tpl === "review" ? "Your review link" : tpl === "pay" ? "Your payment link" : "Your menu link", {
              type: "url",
              placeholder: "https://",
              hint:
                tpl === "review"
                  ? "On Google, find it under “Ask for reviews” in your Business Profile."
                  : tpl === "pay"
                    ? "A PayPal.me, Stripe, Square or bank payment link."
                    : "Your online menu, ordering page or a PDF link.",
            })}
            {exampleLink && <p className="rounded-sm border border-line bg-bg-raised px-3 py-2 text-[13px] text-fg">Replace the example link with your own before printing.</p>}
            {tpl === "pay" && input("payee", "Name shown under the code", { max: 32 })}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {input("business", "Business name", { max: 32 })}
          {input("heading", "Heading", { max: 26 })}
          {input("sub", "Line under the heading", { max: 40 })}
          {input("note", "Small print", { max: 60 })}
        </div>

        <div className="flex flex-wrap items-end gap-6">
          <fieldset>
            <legend className="text-body-sm font-medium text-fg">Paper</legend>
            <div className="mt-2 flex gap-2">
              {(Object.keys(PAPER) as Paper[]).map((k) => (
                <button key={k} type="button" onClick={() => setPaper(k)} aria-pressed={paper === k} className={cn("h-10 rounded-sm border px-3 text-body-sm", paper === k ? "border-accent text-fg" : "border-line text-fg-muted hover:text-fg")}>
                  {PAPER[k].label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-body-sm font-medium text-fg">Colour</legend>
            <div className="mt-2 flex gap-2">
              {ACCENTS.map((a) => (
                <button key={a.value} type="button" onClick={() => setAccent(a.value)} aria-pressed={accent === a.value} aria-label={a.name} title={a.name} className={cn("size-10 rounded-full border-2", accent === a.value ? "border-fg" : "border-line")} style={{ background: a.value }} />
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className={cn("mx-auto w-full overflow-hidden rounded-md shadow-lg ring-1 ring-line", landscape ? "max-w-[640px]" : "max-w-[440px]")}>
          <Sheet tpl={tpl} f={f} data={data} paper={paper} accent={accent} />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={() => window.print()} disabled={!data}>Print or save as PDF</Button>
          <Button type="button" variant="secondary" onClick={downloadSvg} disabled={!data}>Download SVG</Button>
        </div>
        <p className="text-center text-[13px] text-fg-subtle">
          {p.label}, {landscape ? "landscape" : "portrait"}. Print at 100% (actual size). Scan the printout with your phone before you put it out.
        </p>
      </div>
    </div>
  );
}


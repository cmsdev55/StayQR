"use client";

import { useMemo, useRef, useState } from "react";
import { QrPreview } from "@/components/qr/qr-preview";
import { StylePicker, SwatchPicker } from "@/components/qr/qr-controls";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, fieldClass } from "@/components/ui/input";
import { SegmentedToggle, Toggle } from "@/components/ui/toggle";
import {
  BG_SWATCHES,
  CORNER_STYLES,
  DEFAULT_DESIGN,
  DOT_STYLES,
  ECL_LEVELS,
  FG_SWATCHES,
  FRAME_STYLES,
  effectiveEcl,
  scanWarning,
  type Ecl,
  type FrameStyle,
  type QrDesign,
} from "@/lib/qr-design";
import { EXPORT_FORMATS, EXPORT_SIZES, downloadQr, frameLayout, type ExportFormat } from "@/lib/qr-export";
import { QR_TYPES, qrType, type FieldDef, type QrTypeSlug, type Values } from "@/lib/qr-types";
import { cn } from "@/lib/utils";

const GROUPS = ["Popular", "Contact", "Social", "More"] as const;
const LOGO_MAX_BYTES = 1_000_000;

/**
 * The free generator: 17 static content types, styles, colours, logo, frames, and PNG/SVG/JPEG/PDF
 * export at up to 4096px. Everything runs in the browser; nothing is uploaded.
 */
export function GeneratorApp({ placeholder, initialType = "url" }: { placeholder: string[]; initialType?: QrTypeSlug }) {
  const [type, setType] = useState<QrTypeSlug>(initialType);
  const [values, setValues] = useState<Record<string, Values>>(() => Object.fromEntries(QR_TYPES.map((t) => [t.slug, { ...t.defaults }])));
  const [design, setDesign] = useState<QrDesign>({ ...DEFAULT_DESIGN, frame: "none", frameLabel: "Scan me", quietZone: 4 });
  const [format, setFormat] = useState<ExportFormat>("png");
  const [size, setSize] = useState(1024);
  const [busy, setBusy] = useState(false);
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [sweep, setSweep] = useState(0);
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const def = qrType(type)!;
  const v = values[type];
  const data = useMemo(() => def.encode(v), [def, v]);
  const problem = def.validate(v);
  const warning = scanWarning(design.fg, design.bg);
  const style = <K extends keyof QrDesign>(k: K) => (val: QrDesign[K]) => setDesign((d) => ({ ...d, [k]: val }));
  const setField = (name: string, val: string) => setValues((all) => ({ ...all, [type]: { ...all[type], [name]: val } }));

  const onLogo = (file?: File) => {
    setLogoError(null);
    if (!file) return;
    if (!/^image\/(png|jpeg|svg\+xml|webp)$/.test(file.type)) return setLogoError("Use a PNG, JPG, SVG or WebP image.");
    if (file.size > LOGO_MAX_BYTES) return setLogoError("Keep the logo under 1 MB.");
    const r = new FileReader();
    r.onload = () => setDesign((d) => ({ ...d, logo: String(r.result), logoSize: d.logoSize ?? 0.28 }));
    r.readAsDataURL(file);
  };

  const [exportError, setExportError] = useState<string | null>(null);
  const download = async () => {
    if (problem) return;
    setBusy(true);
    setExportError(null);
    try {
      await downloadQr(data, design, format, size, `stayqr-${type}`);
      setDownloaded(format.toUpperCase());
    } catch {
      setExportError("Couldn't create that file. Try another format, or remove the logo and try again.");
    } finally {
      setBusy(false);
    }
  };
  const upsell = downloaded !== null && !dismissed;
  const framed = (design.frame ?? "none") !== "none";

  return (
    <div className="mt-12 grid items-start gap-6 lg:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
      {/* ── Controls ── */}
      <div className="glass order-2 rounded-xl p-5 sm:p-8 lg:order-1">
        <Step n={1} title="What should it open?">
          <div role="radiogroup" aria-label="Content type" className="flex flex-col gap-4">
            {GROUPS.map((g) => (
              <div key={g}>
                <p className="eyebrow mb-2">{g}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {QR_TYPES.filter((t) => t.group === g).map((t) => {
                    const on = t.slug === type;
                    return (
                      <button
                        key={t.slug}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setType(t.slug)}
                        className={cn(
                          "flex h-11 items-center gap-2 rounded-sm border px-3 text-left text-body-sm font-medium transition-colors duration-fast ease-stay",
                          on ? "border-fg bg-glass-strong text-fg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                        )}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
                          <path d={t.icon} />
                        </svg>
                        <span className="truncate">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {def.fields.map((f) => (
              <Field key={`${type}-${f.name}`} f={f} value={v[f.name] ?? ""} onChange={(val) => setField(f.name, val)} />
            ))}
          </div>
          <p aria-live="polite" className={cn("mt-4 text-body-sm", problem ? "text-warning" : "text-fg-subtle")}>
            {problem ?? "Static code: it stores this content itself, works without StayQR and never expires."}
          </p>
        </Step>

        <Step n={2} title="Style">
          <div className="grid gap-6">
            <StylePicker label="Modules" kind="dots" options={DOT_STYLES} value={design.dots} onChange={style("dots")} />
            <StylePicker label="Corners" kind="corners" options={CORNER_STYLES} value={design.corners} onChange={style("corners")} />
          </div>
        </Step>

        <Step n={3} title="Colour">
          <div className="grid gap-6">
            <SwatchPicker label="Code" value={design.fg} onChange={style("fg")} swatches={FG_SWATCHES} />
            <SwatchPicker label="Background" value={design.bg} onChange={style("bg")} swatches={BG_SWATCHES} />
          </div>
          <div aria-live="polite">
            {warning && <p className="mt-5 rounded-sm bg-warning/[0.1] px-3 py-2.5 text-body-sm text-warning">{warning}</p>}
          </div>
        </Step>

        <Step n={4} title="Logo and frame" last>
          <div className="grid gap-6">
            <div>
              <p className="mb-3 text-body-sm font-medium text-fg">Logo</p>
              <div className="flex flex-wrap items-center gap-3">
                {design.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={design.logo} alt="Your logo" className="size-12 rounded-sm border border-line bg-white object-contain p-1" />
                ) : (
                  <span className="grid size-12 place-items-center rounded-sm border border-dashed border-line-strong text-fg-subtle" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                )}
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="sr-only" id="logo-input" aria-label="Upload logo" onChange={(e) => onLogo(e.target.files?.[0])} />
                <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                  {design.logo ? "Change logo" : "Upload logo"}
                </Button>
                {design.logo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDesign((d) => ({ ...d, logo: undefined }));
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {design.logo && (
                <label className="mt-4 flex items-center gap-4 text-body-sm text-fg-muted">
                  <span className="w-20 shrink-0">Logo size</span>
                  <input
                    type="range"
                    min={0.15}
                    max={0.35}
                    step={0.01}
                    value={design.logoSize ?? 0.28}
                    onChange={(e) => style("logoSize")(Number(e.target.value))}
                    className="h-1 flex-1 cursor-pointer accent-[rgb(var(--accent-text))]"
                  />
                  <span className="w-10 text-right font-mono text-[12px]">{Math.round((design.logoSize ?? 0.28) * 100)}%</span>
                </label>
              )}
              <p className={cn("mt-2 text-body-sm", logoError ? "text-danger" : "text-fg-subtle")}>
                {logoError ?? (design.logo ? "Logos switch the code to high error correction (H) so it still scans." : "PNG, JPG, SVG or WebP, up to 1 MB. It stays in your browser.")}
              </p>
            </div>

            <div>
              <p className="mb-3 text-body-sm font-medium text-fg">Frame</p>
              <SegmentedToggle label="Frame" size="sm" options={FRAME_STYLES} value={design.frame ?? "none"} onChange={(f) => style("frame")(f as FrameStyle)} />
              {framed && (
                <Input
                  className="mt-4"
                  size="sm"
                  label="Frame text"
                  maxLength={28}
                  value={design.frameLabel ?? ""}
                  onChange={(e) => style("frameLabel")(e.target.value)}
                  placeholder="Scan me"
                  hint="A short call to action gets more scans than a bare code."
                />
              )}
            </div>

            <details className="group rounded-sm border border-line px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between text-body-sm font-medium text-fg">
                Advanced
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="transition-transform duration-fast ease-stay group-open:rotate-180" aria-hidden>
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </summary>
              <div className="mt-4 grid gap-5">
                <div>
                  <p className="mb-2 text-body-sm text-fg-muted">
                    Error correction {design.logo && <span className="text-fg-subtle">(set to H by your logo)</span>}
                  </p>
                  <SegmentedToggle
                    label="Error correction"
                    size="sm"
                    options={ECL_LEVELS.map((l) => ({ value: l.value, label: l.label }))}
                    value={effectiveEcl(design)}
                    onChange={(e) => !design.logo && style("ecl")(e as Ecl)}
                  />
                  <p className="mt-2 text-[12px] text-fg-subtle">{ECL_LEVELS.find((l) => l.value === effectiveEcl(design))?.hint}</p>
                </div>
                <label className="flex items-center gap-4 text-body-sm text-fg-muted">
                  <span className="w-24 shrink-0">Quiet zone</span>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    step={1}
                    value={design.quietZone ?? 4}
                    onChange={(e) => style("quietZone")(Number(e.target.value))}
                    className="h-1 flex-1 cursor-pointer accent-[rgb(var(--accent-text))]"
                  />
                  <span className="w-20 text-right font-mono text-[12px]">{design.quietZone ?? 4} modules</span>
                </label>
                <p className="-mt-2 text-[12px] text-fg-subtle">4 modules of empty margin is the print standard. Less can fail on busy backgrounds.</p>
              </div>
            </details>
          </div>
        </Step>
      </div>

      {/* ── Preview + download ── */}
      <div className="order-1 flex flex-col gap-4 lg:sticky lg:top-28 lg:order-2">
        <Card tilt spotlight className="rounded-xl p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Preview</span>
            <span className="inline-flex items-center gap-2 font-mono text-[12px] text-fg-subtle">
              <span className="size-1.5 rounded-full bg-accent" /> Live
            </span>
          </div>
          <FramedPreview design={design} sweep={sweep}>
            <QrPreview data={data} design={design} size={224} placeholder={placeholder} onRender={() => setSweep((s) => s + 1)} />
          </FramedPreview>
          <p className="mt-6 truncate text-center font-mono text-[12px] text-fg-muted" title={data}>
            {def.describe(v)}
          </p>
          <p className="mt-1 text-center font-mono text-[12px] text-fg-subtle">Static · never expires · no watermark</p>
        </Card>

        <div className="glass flex flex-col gap-4 rounded-xl p-5">
          <SegmentedToggle
            label="File format"
            size="sm"
            options={EXPORT_FORMATS.map((f) => ({ value: f.value, label: f.label }))}
            value={format}
            onChange={(f) => setFormat(f as ExportFormat)}
            className="w-full [&>button]:flex-1 [&>button]:justify-center"
          />
          <div className="flex items-center gap-3">
            <label className="flex flex-1 items-center gap-2 text-body-sm text-fg-muted">
              <span className="shrink-0">Size</span>
              <select value={size} onChange={(e) => setSize(Number(e.target.value))} className={cn(fieldClass, "h-10 px-3 text-body-sm")} disabled={format === "svg"}>
                {EXPORT_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s} × {s}px
                  </option>
                ))}
              </select>
            </label>
            <Button onClick={download} disabled={!!problem || busy} variant={upsell ? "secondary" : "primary"} className="shrink-0">
              {busy ? "Preparing…" : `Download ${format.toUpperCase()}`}
            </Button>
          </div>
          {exportError && <p role="alert" className="text-body-sm text-danger">{exportError}</p>}
          <p className="text-[12px] text-fg-subtle">
            {EXPORT_FORMATS.find((f) => f.value === format)?.hint}
            {format === "svg" ? " · scales to any size" : ""}
          </p>
          <p className="sr-only" aria-live="polite">
            {downloaded ? `Downloaded ${downloaded}` : ""}
          </p>
        </div>

        {/* "Make it dynamic" slides up after the first download (height via grid rows, no JS measuring) */}
        <div className={cn("grid transition-[grid-template-rows] duration-slow ease-stay", upsell ? "grid-rows-[1fr]" : "grid-rows-[0fr]")} inert={!upsell}>
          <div className="overflow-hidden">
            <div className={cn("transition-[opacity,transform] duration-slow ease-stay", upsell ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
              <div className="glass relative rounded-xl p-6">
                <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl [box-shadow:inset_0_0_0_1px_rgb(var(--accent)/0.35)]" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant="accent">Downloaded · next step</Badge>
                    <h3 className="mt-3 font-display text-h3 font-semibold text-fg">Make it dynamic</h3>
                  </div>
                  <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss" className="grid size-8 place-items-center rounded-full text-fg-subtle transition-colors hover:bg-glass-strong hover:text-fg">
                    <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                      <path d="M2 2l8 8M10 2l-8 8" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-body-sm text-fg-muted">
                  Change where this code points after it&apos;s printed, see every scan, and keep it working even if you cancel.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <ButtonLink href={`/signup?plan=pro&from=generator-${type}`} size="sm">
                    Make it dynamic
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </ButtonLink>
                  <span className="font-mono text-[12px] text-fg-subtle">$29/yr or $79 once</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** HTML mirror of the exported frame (same ratios as frameLayout in qr-export). */
function FramedPreview({ design, sweep, children }: { design: QrDesign; sweep: number; children: React.ReactNode }) {
  const frame = design.frame ?? "none";
  const { label, width } = frameLayout(frame);
  const scale = 248 / width;
  const solid = frame === "box" || frame === "pill";
  return (
    <div
      className="relative mx-auto mt-6 w-fit overflow-hidden shadow-lg transition-colors duration-base ease-stay"
      style={{ background: solid ? design.fg : design.bg, borderRadius: frame === "pill" ? 32 : 16 }}
    >
      <div style={{ padding: frame === "none" ? 14 : 10 }}>
        <div className="rounded-[10px] p-[6px]" style={{ background: design.bg }}>
          {children}
        </div>
      </div>
      {frame !== "none" && (
        <p
          className="text-center font-bold tracking-[0.04em]"
          style={{ color: solid ? design.bg : design.fg, fontSize: 20, lineHeight: `${Math.round(label * scale)}px`, fontFamily: "Helvetica, Arial, sans-serif", marginTop: -6 }}
        >
          {(design.frameLabel || "Scan me").slice(0, 28)}
        </p>
      )}
      {sweep > 0 && <span key={sweep} aria-hidden className="shine pointer-events-none absolute inset-0" />}
    </div>
  );
}

function Field({ f, value, onChange }: { f: FieldDef; value: string; onChange: (v: string) => void }) {
  const span = f.half ? "" : "sm:col-span-2";
  if (f.kind === "textarea")
    return (
      <div className={cn("flex flex-col gap-2", span)}>
        <label htmlFor={`f-${f.name}`} className="text-body-sm font-medium text-fg">{f.label}</label>
        <textarea
          id={`f-${f.name}`}
          value={value}
          maxLength={f.maxLength}
          rows={3}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(fieldClass, "resize-none px-4 py-3 text-body")}
        />
        {f.maxLength && <p className="text-right font-mono text-[12px] text-fg-subtle">{value.length}/{f.maxLength}</p>}
      </div>
    );
  if (f.kind === "select")
    return (
      <div className={cn("flex flex-col gap-2", span)}>
        <label htmlFor={`f-${f.name}`} className="text-body-sm font-medium text-fg">{f.label}</label>
        <select id={`f-${f.name}`} value={value} onChange={(e) => onChange(e.target.value)} className={cn(fieldClass, "h-12 px-4 text-body")}>
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  if (f.kind === "toggle")
    return (
      <div className={cn("flex items-center justify-between gap-4 rounded-sm border border-line px-4 py-3", span)}>
        <span className="text-body-sm font-medium text-fg">{f.label}</span>
        <Toggle size="sm" label={f.label} checked={value === "true"} onChange={(on) => onChange(on ? "true" : "")} />
      </div>
    );
  return (
    <Input
      className={span}
      label={f.label}
      type={f.kind === "datetime-local" ? "datetime-local" : f.kind === "number" ? "number" : f.kind === "tel" ? "tel" : f.kind === "email" ? "email" : "text"}
      inputMode={f.kind === "url" ? "url" : undefined}
      spellCheck={false}
      value={value}
      placeholder={f.placeholder}
      maxLength={f.maxLength}
      hint={f.hint}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Step({ n, title, children, last }: { n: number; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={cn(!last && "mb-8 border-b border-line pb-8")}>
      <h3 className="mb-5 flex items-center gap-3 text-body font-semibold text-fg">
        <span className="grid size-6 place-items-center rounded-full bg-glass-strong font-mono text-[12px] text-fg-muted">{n}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

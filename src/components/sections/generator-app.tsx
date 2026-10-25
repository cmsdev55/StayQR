"use client";

import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { useRef, useState } from "react";
import { QrPreview, type QrPreviewHandle } from "@/components/qr/qr-preview";
import { StylePicker, SwatchPicker } from "@/components/qr/qr-controls";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, fieldClass } from "@/components/ui/input";
import { SegmentedToggle } from "@/components/ui/toggle";
import { EASE } from "@/lib/motion";
import {
  BG_SWATCHES,
  CORNER_STYLES,
  DEFAULT_DESIGN,
  DEFAULT_FIELDS,
  DOT_STYLES,
  FG_SWATCHES,
  describeContent,
  encodeContent,
  scanWarning,
  type ContentFields,
  type ContentKind,
  type QrDesign,
} from "@/lib/qr-design";
import { cn } from "@/lib/utils";

const loadFeatures = () => import("@/lib/motion-features").then((r) => r.default);

const KINDS: { value: ContentKind; label: string }[] = [
  { value: "url", label: "Link" },
  { value: "text", label: "Text" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "email", label: "Email" },
];

export function GeneratorApp({ placeholder }: { placeholder: string[] }) {
  const [kind, setKind] = useState<ContentKind>("url");
  const [fields, setFields] = useState<ContentFields>(DEFAULT_FIELDS);
  const [design, setDesign] = useState<QrDesign>(DEFAULT_DESIGN);
  const [downloaded, setDownloaded] = useState<null | "svg" | "png">(null);
  const [dismissed, setDismissed] = useState(false);
  const [sweep, setSweep] = useState(0);
  const preview = useRef<QrPreviewHandle>(null);

  const data = encodeContent(kind, fields);
  const warning = scanWarning(design.fg, design.bg);
  const set = <K extends keyof ContentFields>(k: K) => (v: ContentFields[K]) => setFields((f) => ({ ...f, [k]: v }));
  const style = <K extends keyof QrDesign>(k: K) => (v: QrDesign[K]) => setDesign((d) => ({ ...d, [k]: v }));

  const download = async (ext: "svg" | "png") => {
    await preview.current?.download(ext, "stayqr-code");
    setDownloaded(ext);
  };
  const upsell = downloaded !== null && !dismissed;

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="mt-12 grid items-start gap-6 lg:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
        {/* ── Controls ── */}
        <div className="glass order-2 rounded-xl p-5 sm:p-8 lg:order-1">
          <Step n={1} title="What should it open?">
            <SegmentedToggle label="Content type" options={KINDS} value={kind} onChange={setKind} className="w-full [&>button]:flex-1 [&>button]:justify-center" />
            <div className="mt-6 grid gap-5">
              {kind === "url" && (
                <Input
                  label="Website address"
                  value={fields.url}
                  onChange={(e) => set("url")(e.target.value)}
                  inputMode="url"
                  autoComplete="url"
                  spellCheck={false}
                  placeholder="yourwebsite.com/menu"
                  hint="Static codes store the link itself. Need to change it later? Make it dynamic."
                />
              )}
              {kind === "text" && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="gen-text" className="text-body-sm font-medium text-fg">Text</label>
                  <textarea
                    id="gen-text"
                    value={fields.text}
                    maxLength={300}
                    rows={3}
                    onChange={(e) => set("text")(e.target.value)}
                    className={cn(fieldClass, "resize-none px-4 py-3 text-body")}
                  />
                  <p className="text-right font-mono text-[12px] text-fg-subtle">{fields.text.length}/300</p>
                </div>
              )}
              {kind === "wifi" && (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Network name" value={fields.ssid} onChange={(e) => set("ssid")(e.target.value)} autoComplete="off" spellCheck={false} />
                    <Input
                      label="Password"
                      value={fields.password}
                      onChange={(e) => set("password")(e.target.value)}
                      disabled={fields.security === "nopass"}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-body-sm font-medium text-fg" id="gen-sec">Security</span>
                    <SegmentedToggle
                      label="Security"
                      size="sm"
                      options={[
                        { value: "WPA", label: "WPA / WPA2" },
                        { value: "WEP", label: "WEP" },
                        { value: "nopass", label: "None" },
                      ]}
                      value={fields.security}
                      onChange={set("security")}
                      className="self-start"
                    />
                  </div>
                </>
              )}
              {kind === "email" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Email address" type="email" value={fields.email} onChange={(e) => set("email")(e.target.value)} autoComplete="off" />
                  <Input label="Subject (optional)" value={fields.subject} onChange={(e) => set("subject")(e.target.value)} />
                </div>
              )}
            </div>
          </Step>

          <Step n={2} title="Style">
            <div className="grid gap-6">
              <StylePicker label="Modules" kind="dots" options={DOT_STYLES} value={design.dots} onChange={style("dots")} />
              <StylePicker label="Corners" kind="corners" options={CORNER_STYLES} value={design.corners} onChange={style("corners")} />
            </div>
          </Step>

          <Step n={3} title="Colour" last>
            <div className="grid gap-6">
              <SwatchPicker label="Code" value={design.fg} onChange={style("fg")} swatches={FG_SWATCHES} />
              <SwatchPicker label="Background" value={design.bg} onChange={style("bg")} swatches={BG_SWATCHES} />
            </div>
            <div aria-live="polite" className="min-h-0">
              {warning && (
                <p className="mt-5 flex items-center gap-2 rounded-sm bg-warning/[0.1] px-3 py-2.5 text-body-sm text-warning">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                    <path d="M8 1.8l6.5 11.4H1.5zM8 6.3v3.2M8 11.6v.1" />
                  </svg>
                  {warning}
                </p>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between gap-4 rounded-sm border border-dashed border-line-strong px-4 py-3">
              <span className="text-body-sm text-fg-muted">Logo in the centre</span>
              <Badge variant="accent">Pro</Badge>
            </div>
          </Step>
        </div>

        {/* ── Preview ── */}
        <div className="order-1 flex flex-col gap-4 lg:sticky lg:top-28 lg:order-2">
          <Card tilt spotlight className="rounded-xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Preview</span>
              <span className="inline-flex items-center gap-2 font-mono text-[12px] text-fg-subtle">
                <span className="size-1.5 rounded-full bg-accent" /> Live
              </span>
            </div>
            <div className="relative mx-auto mt-6 w-fit overflow-hidden rounded-lg p-5 shadow-lg transition-colors duration-base ease-stay" style={{ background: design.bg }}>
              <QrPreview ref={preview} data={data} design={design} size={232} placeholder={placeholder} onRender={() => setSweep((s) => s + 1)} />
              {sweep > 0 && <span key={sweep} aria-hidden className="shine pointer-events-none absolute inset-0" />}
            </div>
            <p className="mt-6 truncate text-center font-mono text-[12px] text-fg-muted" title={data}>
              {describeContent(kind, fields)}
            </p>
            <p className="mt-1 text-center font-mono text-[12px] text-fg-subtle">Static · never expires · no watermark</p>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button variant={upsell ? "secondary" : "primary"} onClick={() => download("png")} disabled={!data}>
              <DownloadIcon /> PNG
            </Button>
            <Button variant="secondary" onClick={() => download("svg")} disabled={!data}>
              <DownloadIcon /> SVG
            </Button>
          </div>
          <p className="sr-only" aria-live="polite">{downloaded ? `Downloaded ${downloaded.toUpperCase()}` : ""}</p>

          <AnimatePresence initial={false}>
            {upsell && (
              <m.div
                key="upsell"
                initial={{ opacity: 0, y: 32, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 16, height: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="glass relative rounded-xl p-6">
                  <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl [box-shadow:inset_0_0_0_1px_rgb(var(--accent)/0.35)]" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge variant="accent">Downloaded · next step</Badge>
                      <h3 className="mt-3 font-display text-h3 font-semibold text-fg">Make it dynamic</h3>
                    </div>
                    <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss" className="grid size-8 place-items-center rounded-full text-fg-subtle transition-colors hover:bg-glass-strong hover:text-fg">
                      <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><path d="M2 2l8 8M10 2l-8 8" /></svg>
                    </button>
                  </div>
                  <p className="mt-2 text-body-sm text-fg-muted">
                    Change where this code points after it&apos;s printed, see every scan, and keep it working even if you cancel.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                    <ButtonLink href="/signup?plan=pro&from=generator" size="sm">
                      Make it dynamic
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                    </ButtonLink>
                    <span className="font-mono text-[12px] text-fg-subtle">$29/yr or $79 once</span>
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LazyMotion>
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

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 2v8M4.5 6.5L8 10l3.5-3.5M2.5 13.5h11" />
    </svg>
  );
}

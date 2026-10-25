"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Toast } from "@/components/dashboard/toast";
import { StylePicker, SwatchPicker } from "@/components/qr/qr-controls";
import { QrPreview, type QrPreviewHandle } from "@/components/qr/qr-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, fieldClass } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { FOLDERS, type QrCode } from "@/content/dashboard";
import { BG_SWATCHES, CORNER_STYLES, DOT_STYLES, FG_SWATCHES, scanWarning, type QrDesign } from "@/lib/qr-design";
import { cn } from "@/lib/utils";

type Draft = {
  name: string;
  destination: string;
  folder: string;
  smart: boolean;
  ios: string;
  android: string;
  paused: boolean;
  reason: string;
  back: string;
  design: QrDesign;
};

const toDraft = (c: QrCode): Draft => ({
  name: c.name,
  destination: c.destination,
  folder: c.folder,
  smart: !!c.smart,
  ios: c.smart?.ios ?? "",
  android: c.smart?.android ?? "",
  paused: c.status === "paused",
  reason: c.status === "paused" ? "while we print the winter menu" : "",
  back: c.status === "paused" ? "2026-11-03" : "",
  design: c.design,
});

/** Edit a dynamic code. Calm by design: solid cards, 40px controls, one lime action (Save). */
export function CodeEditor({ code, isNew }: { code: QrCode; isNew?: boolean }) {
  const initial = useMemo(() => toDraft(code), [code]);
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const preview = useRef<QrPreviewHandle>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const set = <K extends keyof Draft>(k: K) => (v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const setDesign = <K extends keyof QrDesign>(k: K) => (v: QrDesign[K]) => setDraft((d) => ({ ...d, design: { ...d.design, [k]: v } }));
  const shortUrl = `https://${code.shortUrl}`;
  const warning = scanWarning(draft.design.fg, draft.design.bg);
  const destOk = /^(https?:\/\/|WIFI:|mailto:)/i.test(draft.destination) || /^[\w-]+\.[\w.-]+/.test(draft.destination);

  const save = () => {
    setSaved(draft);
    setToast(isNew ? "Code created · ready to print" : "Saved · live in about a second");
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <>
      <div className="pb-24">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M10 3L5 8l5 5" /></svg>
          All codes
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-h4 font-semibold text-fg sm:text-[26px]">{draft.name || "Untitled code"}</h1>
          {isNew ? <Badge>Draft</Badge> : draft.paused ? <Badge variant="warning">Paused</Badge> : <Badge variant="accent">Active</Badge>}
        </div>
        <p className="mt-1 text-fg-subtle">{isNew ? "New dynamic code" : `Created ${code.created} · edited ${code.updated}`}</p>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex min-w-0 flex-col gap-4">
            <Panel title="Destination" desc="Where the code sends people. Change it any time: the printed code stays the same.">
              <Input
                size="sm"
                label="Link"
                value={draft.destination}
                onChange={(e) => set("destination")(e.target.value)}
                placeholder="https://yourwebsite.com/menu"
                inputMode="url"
                spellCheck={false}
                error={draft.destination && !destOk ? "That doesn't look like a link yet." : undefined}
                hint={!draft.destination || destOk ? "Changes go live in about a second." : undefined}
              />
              <div className="mt-5 flex items-start justify-between gap-6 border-t border-line pt-5">
                <div>
                  <p className="font-medium text-fg">Smart redirects</p>
                  <p className="mt-0.5 text-fg-muted">Send iPhone and Android to their app stores. Everyone else gets the link above.</p>
                </div>
                <Toggle size="sm" label="Smart redirects" checked={draft.smart} onChange={set("smart")} className="mt-1" />
              </div>
              <div className={cn("grid transition-[grid-template-rows,opacity] duration-base ease-stay", draft.smart ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")} inert={!draft.smart}>
                <div className="overflow-hidden">
                  <div className="grid gap-4 pt-5 sm:grid-cols-2">
                    <Input size="sm" label="iPhone and iPad" value={draft.ios} onChange={(e) => set("ios")(e.target.value)} placeholder="https://apps.apple.com/…" spellCheck={false} />
                    <Input size="sm" label="Android" value={draft.android} onChange={(e) => set("android")(e.target.value)} placeholder="https://play.google.com/…" spellCheck={false} />
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input size="sm" label="Name" value={draft.name} onChange={(e) => set("name")(e.target.value)} hint="Only you see this." />
                <div className="flex flex-col gap-2">
                  <label htmlFor="folder" className="text-body-sm font-medium text-fg">Folder</label>
                  <select id="folder" value={draft.folder} onChange={(e) => set("folder")(e.target.value)} className={cn(fieldClass, "h-10 px-3 text-body-sm")}>
                    {FOLDERS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
              </div>
            </Panel>

            <Panel title="Design" desc="Every style still scans. Keep dark modules on a light background for older phones.">
              <div className="grid gap-6">
                <StylePicker compact label="Modules" kind="dots" options={DOT_STYLES} value={draft.design.dots} onChange={setDesign("dots")} />
                <StylePicker compact label="Corners" kind="corners" options={CORNER_STYLES} value={draft.design.corners} onChange={setDesign("corners")} />
                <div className="grid gap-6 xl:grid-cols-2">
                  <SwatchPicker compact label="Code colour" value={draft.design.fg} onChange={setDesign("fg")} swatches={FG_SWATCHES} />
                  <SwatchPicker compact label="Background" value={draft.design.bg} onChange={setDesign("bg")} swatches={BG_SWATCHES} />
                </div>
                {warning && <p className="rounded-sm bg-warning/[0.1] px-3 py-2.5 text-warning" role="status">{warning}</p>}
              </div>
            </Panel>

            <Panel title="Status">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-medium text-fg">{draft.paused ? "Paused" : "Active"}</p>
                  <p className="mt-0.5 text-fg-muted">
                    {draft.paused ? "Scanners see a friendly page with your message instead of the link." : "Scans go straight to your destination."}
                  </p>
                </div>
                <Toggle size="sm" label="Pause this code" checked={draft.paused} onChange={set("paused")} className="mt-1" />
              </div>
              <div className={cn("grid transition-[grid-template-rows,opacity] duration-base ease-stay", draft.paused ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")} inert={!draft.paused}>
                <div className="overflow-hidden">
                  <div className="grid gap-4 pt-5 sm:grid-cols-[minmax(0,1fr)_180px]">
                    <Input size="sm" label="Message" value={draft.reason} onChange={(e) => set("reason")(e.target.value)} placeholder="while we update the menu" />
                    <Input size="sm" label="Back on" type="date" value={draft.back} onChange={(e) => set("back")(e.target.value)} />
                  </div>
                  <Link href="/paused" target="_blank" className="mt-4 inline-flex items-center gap-1.5 font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
                    Preview the paused page
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden><path d="M4 2h6v6M10 2L3 9" /></svg>
                  </Link>
                </div>
              </div>
            </Panel>
          </div>

          {/* Preview */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24" aria-label="Preview">
            <div className="rounded-md border border-line bg-bg-raised p-5">
              <div className="mx-auto w-fit rounded-md p-4 shadow-md transition-colors duration-base ease-stay" style={{ background: draft.design.bg }}>
                <QrPreview ref={preview} data={shortUrl} design={draft.design} size={200} placeholder={[]} />
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-sm border border-line bg-bg px-3 py-2">
                <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-fg-muted">{code.shortUrl}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(shortUrl).catch(() => {});
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="h-7 rounded-[6px] px-2 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-muted transition-colors hover:bg-glass-strong hover:text-fg"
                  aria-live="polite"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="mt-2 text-[12px] text-fg-subtle">The code points here, so you can change the destination without reprinting.</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" onClick={() => preview.current?.download("png", code.id)}>PNG</Button>
                <Button variant="secondary" size="sm" onClick={() => preview.current?.download("svg", code.id)}>SVG</Button>
              </div>
            </div>
            {!isNew && (
              <div className="rounded-md border border-line bg-bg-raised p-5">
                <p className="text-fg-muted">Scans · last 30 days</p>
                <p className="mt-1 text-[28px] font-semibold leading-tight text-fg">{code.scans30.toLocaleString("en-US")}</p>
                <p className={cn("font-mono text-[12px]", code.delta >= 0 ? "text-accent-text" : "text-fg-subtle")}>
                  {code.delta >= 0 ? "↑" : "↓"} {Math.abs(code.delta)}% vs previous 30 days
                </p>
                <Link href={`/dashboard/analytics?code=${code.id}`} className="mt-4 inline-block font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
                  Open analytics
                </Link>
              </div>
            )}
          </aside>
        </div>

        {/* Save bar: only when something changed */}
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg-overlay/95 backdrop-blur-md transition-[transform,opacity] duration-base ease-stay lg:left-[248px]",
            dirty || isNew ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
          )}
          inert={!(dirty || isNew)}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
            <p className="text-fg-muted">{isNew ? "Not saved yet" : "Unsaved changes"}</p>
            <div className="flex gap-2">
              {!isNew && <Button variant="ghost" size="sm" onClick={() => setDraft(saved)}>Discard</Button>}
              <Button size="sm" onClick={save} disabled={!draft.destination || !destOk}>{isNew ? "Create code" : "Save changes"}</Button>
            </div>
          </div>
        </div>

        <Toast message={toast} raised />
      </div>
    </>
  );
}

function Panel({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-line bg-bg-raised p-5 sm:p-6" aria-label={title}>
      <h2 className="text-body font-semibold text-fg">{title}</h2>
      {desc && <p className="mt-1 text-fg-muted">{desc}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

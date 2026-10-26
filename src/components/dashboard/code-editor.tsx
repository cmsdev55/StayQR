"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { deleteCodeAction, saveCodeAction } from "@/app/dashboard/actions";
import { PlanNotice } from "@/components/dashboard/codes-list";
import { Toast } from "@/components/dashboard/toast";
import { StylePicker, SwatchPicker } from "@/components/qr/qr-controls";
import { QrPreview, type QrPreviewHandle } from "@/components/qr/qr-preview";
import { FramedPreview } from "@/components/sections/generator-app";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, fieldClass } from "@/components/ui/input";
import { SegmentedToggle, Toggle } from "@/components/ui/toggle";
import type { DashCode, Folder, Plan } from "@/lib/dashboard-types";
import { BG_SWATCHES, CORNER_STYLES, DEFAULT_DESIGN, DOT_STYLES, FG_SWATCHES, FRAME_STYLES, scanWarning, type FrameStyle, type QrDesign } from "@/lib/qr-design";
import { cn } from "@/lib/utils";

type Draft = {
  name: string;
  destination: string;
  folderId: string;
  smart: boolean;
  ios: string;
  android: string;
  paused: boolean;
  reason: string;
  back: string;
  design: QrDesign;
};

const LOGO_MAX_BYTES = 200 * 1024; // stored with the code, so smaller than the free generator's limit

const toDraft = (c: DashCode | null): Draft => ({
  name: c?.name ?? "",
  destination: c?.destination ?? "",
  folderId: c?.folderId ?? "",
  smart: !!(c?.iosUrl || c?.androidUrl),
  ios: c?.iosUrl ?? "",
  android: c?.androidUrl ?? "",
  paused: c?.paused ?? false,
  reason: c?.pauseMessage ?? "",
  back: c?.pauseUntil ?? "",
  design: c?.design ?? DEFAULT_DESIGN,
});

/** Create or edit a dynamic code. Calm by design: solid cards, 40px controls, one lime action (Save). */
export function CodeEditor({ code, folders, plan, shortHost }: { code: DashCode | null; folders: Folder[]; plan: Plan; shortHost: string }) {
  const router = useRouter();
  const isNew = !code;
  const initial = useMemo(() => toDraft(code), [code]);
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, start] = useTransition();
  const preview = useRef<QrPreviewHandle>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const readOnly = !plan.canEdit;
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const set = <K extends keyof Draft>(k: K) => (v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const setDesign = <K extends keyof QrDesign>(k: K) => (v: QrDesign[K]) => setDraft((d) => ({ ...d, design: { ...d.design, [k]: v } }));
  // a new code's short link doesn't exist yet: preview with a same-length placeholder so the pattern looks right
  const shortUrl = `https://${code?.shortUrl ?? `${shortHost}/r/xxxxxx`}`;
  const warning = scanWarning(draft.design.fg, draft.design.bg);
  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2600);
  };

  const onLogo = (file?: File) => {
    setError(null);
    if (!file) return;
    if (!/^image\/(png|jpeg|svg\+xml|webp)$/.test(file.type)) return setError("Use a PNG, JPG, SVG or WebP logo.");
    if (file.size > LOGO_MAX_BYTES) return setError("Keep the logo under 200 KB for dynamic codes.");
    const r = new FileReader();
    r.onload = () => setDraft((d) => ({ ...d, design: { ...d.design, logo: String(r.result), logoSize: d.design.logoSize ?? 0.28 } }));
    r.readAsDataURL(file);
  };

  const save = () =>
    start(async () => {
      setError(null);
      const r = await saveCodeAction(code?.id ?? null, {
        name: draft.name,
        destination: draft.destination,
        iosUrl: draft.smart ? draft.ios : "",
        androidUrl: draft.smart ? draft.android : "",
        folderId: draft.folderId || null,
        paused: draft.paused,
        pauseMessage: draft.reason,
        pauseUntil: draft.back,
        design: draft.design,
      });
      if (!r.ok) return setError(r.error);
      setSaved(draft);
      if (isNew && r.data) {
        router.replace(`/dashboard/codes/${r.data}?created=1`);
      } else {
        flash("Saved · live on the next scan");
        router.refresh();
      }
    });

  const remove = () => {
    if (!code) return;
    if (!window.confirm(`Delete "${code.name || "this code"}"? Printed copies will stop working straight away. This can't be undone.`)) return;
    start(async () => {
      const r = await deleteCodeAction(code.id);
      if (!r.ok) return setError(r.error);
      router.replace("/dashboard");
    });
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
          {isNew ? <Badge>Draft</Badge> : code.disabled ? <Badge variant="warning">Disabled</Badge> : draft.paused ? <Badge variant="warning">Paused</Badge> : <Badge variant="accent">Active</Badge>}
        </div>
        <p className="mt-1 text-fg-subtle">{isNew ? "New dynamic code" : `Created ${code.created} · edited ${code.updated}`}</p>
        {code?.disabled && (
          <p role="alert" className="mt-4 rounded-sm bg-danger/[0.08] px-4 py-3 text-fg">
            StayQR disabled this code after its link was reported as harmful. Scanners see a warning page. Contact abuse@stayqr.com if you think this is a mistake.
          </p>
        )}
        {readOnly && <div className="mt-6"><PlanNotice plan={plan} /></div>}

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <fieldset disabled={readOnly} className="flex min-w-0 flex-col gap-4">
            <Panel title="Destination" desc="Where the code sends people. Change it any time: the printed code stays the same.">
              <Input
                size="sm"
                label="Link"
                value={draft.destination}
                onChange={(e) => set("destination")(e.target.value)}
                placeholder="https://yourwebsite.com/menu"
                inputMode="url"
                spellCheck={false}
                hint="Changes go live on the next scan."
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
                <Input size="sm" label="Name" value={draft.name} onChange={(e) => set("name")(e.target.value)} placeholder="Table tent · dinner menu" hint="Only you see this." />
                <div className="flex flex-col gap-2">
                  <label htmlFor="folder" className="text-body-sm font-medium text-fg">Folder</label>
                  <select id="folder" value={draft.folderId} onChange={(e) => set("folderId")(e.target.value)} className={cn(fieldClass, "h-10 px-3 text-body-sm")}>
                    <option value="">No folder</option>
                    {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
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
                <div className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <p className="text-body-sm font-medium text-fg">Logo</p>
                    <div className="flex items-center gap-3">
                      {draft.design.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={draft.design.logo} alt="" className="size-10 rounded-sm border border-line bg-white object-contain p-1" />
                      ) : (
                        <span className="grid size-10 place-items-center rounded-sm border border-dashed border-line-strong text-fg-subtle" aria-hidden>+</span>
                      )}
                      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="sr-only" id="code-logo" onChange={(e) => onLogo(e.target.files?.[0])} />
                      <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>{draft.design.logo ? "Replace" : "Upload logo"}</Button>
                      {draft.design.logo && (
                        <button type="button" onClick={() => setDraft((d) => ({ ...d, design: { ...d.design, logo: undefined, logoSize: undefined } }))} className="h-9 rounded-sm px-2 text-fg-muted hover:text-fg">Remove</button>
                      )}
                    </div>
                    <p className="text-[12px] text-fg-subtle">Up to 200 KB. Error correction switches to H.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-body-sm font-medium text-fg">Frame</p>
                    <SegmentedToggle label="Frame" size="sm" options={FRAME_STYLES} value={draft.design.frame ?? "none"} onChange={(f) => setDesign("frame")(f as FrameStyle)} />
                    {draft.design.frame && draft.design.frame !== "none" && (
                      <Input size="sm" label="Frame text" value={draft.design.frameLabel ?? "Scan me"} maxLength={28} onChange={(e) => setDesign("frameLabel")(e.target.value)} />
                    )}
                  </div>
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
                    <Input size="sm" label="Message" value={draft.reason} maxLength={160} onChange={(e) => set("reason")(e.target.value)} placeholder="while we update the menu" />
                    <Input size="sm" label="Back on" type="date" value={draft.back} onChange={(e) => set("back")(e.target.value)} />
                  </div>
                  {code && (
                    <Link href={`/p/${code.slug}`} target="_blank" className="mt-4 inline-flex items-center gap-1.5 font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
                      Preview the paused page
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden><path d="M4 2h6v6M10 2L3 9" /></svg>
                    </Link>
                  )}
                </div>
              </div>
            </Panel>

            {code && (
              <Panel title="Delete code" desc="Printed copies stop working the moment you delete it. To stop scans for a while, pause it instead.">
                <button type="button" onClick={remove} className="h-10 rounded-sm border border-line px-4 font-medium text-danger transition-colors hover:bg-danger/10">Delete this code…</button>
              </Panel>
            )}
          </fieldset>

          {/* Preview */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24" aria-label="Preview">
            <div className="rounded-md border border-line bg-bg-raised p-5">
              <FramedPreview design={draft.design} sweep={0}>
                <QrPreview ref={preview} data={shortUrl} design={draft.design} size={200} placeholder={[]} />
              </FramedPreview>
              <div className="mt-5 flex items-center gap-2 rounded-sm border border-line bg-bg px-3 py-2">
                <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-fg-muted">{code?.shortUrl ?? "Short link appears after you create the code"}</span>
                {code && (
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
                )}
              </div>
              <p className="mt-2 text-[12px] text-fg-subtle">The code points here, so you can change the destination without reprinting.</p>
              {code ? (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {(["png", "svg", "jpeg", "pdf"] as const).map((f) => (
                    <Button key={f} variant="secondary" size="sm" className="px-0" onClick={() => preview.current?.download(f, `stayqr-${code.slug}`)}>{f === "jpeg" ? "JPG" : f.toUpperCase()}</Button>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-[12px] text-fg-subtle">Downloads unlock once the code is created, so you never print a placeholder.</p>
              )}
            </div>
            {code && (
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
            !readOnly && (dirty || isNew) ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
          )}
          inert={readOnly || !(dirty || isNew)}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
            <p className={cn("min-w-0 truncate", error ? "text-danger" : "text-fg-muted")} role={error ? "alert" : undefined}>
              {error ?? (isNew ? "Not saved yet" : "Unsaved changes")}
            </p>
            <div className="flex shrink-0 gap-2">
              {!isNew && <Button variant="ghost" size="sm" onClick={() => { setDraft(saved); setError(null); }}>Discard</Button>}
              <Button size="sm" onClick={save} disabled={!draft.destination.trim() || saving}>{saving ? "Saving" : isNew ? "Create code" : "Save changes"}</Button>
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

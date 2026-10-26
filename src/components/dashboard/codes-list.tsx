"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { createFolderAction, deleteFolderAction, renameFolderAction } from "@/app/dashboard/actions";
import { QrThumb } from "@/components/dashboard/qr-thumb";
import { Toast } from "@/components/dashboard/toast";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SegmentedToggle } from "@/components/ui/toggle";
import type { DashCode, Folder, Plan } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

type Status = "all" | "active" | "paused";
type Sort = "scans" | "recent" | "name";

const compact = (n: number) => (n >= 10000 ? `${(n / 1000).toFixed(1)}K` : n.toLocaleString("en-US"));

export function CodesList({ codes, folders, plan, initialQuery = "" }: { codes: DashCode[]; folders: Folder[]; plan: Plan; initialQuery?: string }) {
  const router = useRouter();
  const [folder, setFolder] = useState<string>("all");
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<Status>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [view, setView] = useState<"list" | "grid">("list");
  const [toast, setToast] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2600);
  };

  const current = folders.find((f) => f.id === folder);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = codes.filter(
      (c) =>
        (folder === "all" || (folder === "none" ? !c.folderId : c.folderId === folder)) &&
        (status === "all" || (status === "paused") === c.paused) &&
        (!q || c.name.toLowerCase().includes(q) || c.destination.toLowerCase().includes(q) || c.slug.includes(q) || (c.folderName ?? "").toLowerCase().includes(q)),
    );
    return [...list].sort((a, b) => (sort === "scans" ? b.scans30 - a.scans30 : sort === "name" ? a.name.localeCompare(b.name) : 0));
  }, [codes, folder, query, status, sort]);
  const total = shown.reduce((s, c) => s + c.scans30, 0);
  const unfiled = codes.filter((c) => !c.folderId).length;

  const folderAction = (kind: "new" | "rename" | "delete") => {
    if (kind === "delete" && current) {
      if (!window.confirm(`Delete the folder "${current.name}"? Its ${current.count} codes move to "No folder" and keep working.`)) return;
      start(async () => {
        const r = await deleteFolderAction(current.id);
        if (r.ok) setFolder("all");
        flash(r.ok ? "Folder deleted" : r.error);
      });
      return;
    }
    const name = window.prompt(kind === "new" ? "Folder name" : "Rename folder", kind === "rename" ? current?.name : "")?.trim();
    if (!name) return;
    start(async () => {
      const r = kind === "new" ? await createFolderAction(name) : await renameFolderAction(current!.id, name);
      if (r.ok && kind === "new" && typeof r.data === "string") setFolder(r.data);
      flash(r.ok ? (kind === "new" ? "Folder created" : "Folder renamed") : r.error);
      router.refresh();
    });
  };

  if (!codes.length) return <EmptyState plan={plan} />;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-8">
      {/* Folders */}
      <nav aria-label="Folders" className="xl:sticky xl:top-24 xl:self-start">
        <p className="eyebrow mb-3 hidden xl:block">Folders</p>
        <ul className="flex gap-1 overflow-x-auto pb-1 xl:flex-col xl:overflow-visible">
          {[{ id: "all", name: "All codes", count: codes.length }, ...folders, ...(folders.length && unfiled ? [{ id: "none", name: "No folder", count: unfiled }] : [])].map((f) => {
            const on = folder === f.id;
            return (
              <li key={f.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setFolder(f.id)}
                  aria-pressed={on}
                  className={cn(
                    "flex h-9 w-full items-center justify-between gap-4 rounded-sm px-3 text-left transition-colors duration-fast ease-stay",
                    on ? "bg-bg-overlay font-medium text-fg shadow-inner-glow" : "text-fg-muted hover:bg-glass-strong hover:text-fg",
                  )}
                >
                  <span className="flex items-center gap-2.5 whitespace-nowrap">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden>
                      {f.id === "all" ? <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /> : <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />}
                    </svg>
                    {f.name}
                  </span>
                  <span className="font-mono text-[12px] tabular-nums text-fg-subtle">{f.count}</span>
                </button>
              </li>
            );
          })}
          {plan.canEdit && (
            <li className="shrink-0">
              <button type="button" onClick={() => folderAction("new")} disabled={pending} className="flex h-9 w-full items-center gap-2.5 whitespace-nowrap rounded-sm px-3 text-fg-subtle transition-colors hover:bg-glass-strong hover:text-fg">
                <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><path d="M7 2v10M2 7h10" /></svg>
                New folder
              </button>
            </li>
          )}
        </ul>
      </nav>

      <section aria-labelledby="codes-title" className="min-w-0">
        {(plan.lapsed || (plan.tier === "pro" && plan.status === "cancelled")) && <PlanNotice plan={plan} />}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 id="codes-title" className="font-display text-h4 font-semibold text-fg sm:text-[26px]">
              {folder === "all" ? "All codes" : folder === "none" ? "No folder" : current?.name}
            </h1>
            <p className="mt-1 text-fg-muted">
              {shown.length} {shown.length === 1 ? "code" : "codes"} · {total.toLocaleString("en-US")} scans in the last 30 days
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {current && plan.canEdit && (
              <>
                <button type="button" onClick={() => folderAction("rename")} className="h-9 rounded-sm px-3 font-medium text-fg-muted hover:bg-glass-strong hover:text-fg">Rename</button>
                <button type="button" onClick={() => folderAction("delete")} className="h-9 rounded-sm px-3 font-medium text-fg-muted hover:bg-danger/10 hover:text-danger">Delete folder</button>
              </>
            )}
            {plan.canEdit && <ButtonLink href="/dashboard/codes/bulk" variant="secondary" size="sm">Bulk create</ButtonLink>}
            <a href="/api/export/codes" className="inline-flex h-10 items-center rounded-sm px-3 font-medium text-fg-muted transition-colors hover:bg-glass-strong hover:text-fg">Export CSV</a>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <label htmlFor="codes-search" className="sr-only">Filter codes</label>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" aria-hidden><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <input
              id="codes-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by name, link or folder"
              className="h-10 w-full rounded-sm border border-line bg-bg-raised pl-9 pr-3 text-fg placeholder:text-fg-subtle hover:border-line-strong focus:border-accent focus:outline-none [[data-theme=light]_&]:focus:border-accent-text"
            />
          </div>
          <SegmentedToggle
            label="Status"
            size="sm"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "paused", label: "Paused" },
            ]}
          />
          <label className="flex items-center gap-2 text-fg-muted">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 rounded-sm border border-line bg-bg-raised px-3 text-fg hover:border-line-strong focus:border-accent focus:outline-none"
            >
              <option value="recent">Recently created</option>
              <option value="scans">Most scanned</option>
              <option value="name">Name</option>
            </select>
          </label>
          <SegmentedToggle
            label="View"
            size="sm"
            value={view}
            onChange={setView}
            options={[
              { value: "list", label: <span className="sr-only sm:not-sr-only">List</span> },
              { value: "grid", label: <span className="sr-only sm:not-sr-only">Grid</span> },
            ]}
            className="hidden sm:inline-flex"
          />
        </div>

        {shown.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-md border border-dashed border-line-strong px-6 py-16 text-center">
            <p className="font-medium text-fg">{query ? `No codes match “${query}”` : "No codes here yet"}</p>
            <p className="mt-1 text-fg-muted">Try another word, or clear the filters.</p>
            <button type="button" onClick={() => { setQuery(""); setStatus("all"); setFolder("all"); }} className="mt-4 h-10 rounded-sm border border-line px-4 font-medium text-fg hover:bg-glass-strong">
              Clear filters
            </button>
          </div>
        ) : view === "list" ? (
          <div className="mt-6 overflow-hidden rounded-md border border-line bg-bg-raised">
            <table className="w-full table-fixed text-left">
              <caption className="sr-only">Your QR codes</caption>
              <thead className="bg-bg-overlay font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle">
                <tr>
                  <th scope="col" className="px-4 py-3 font-normal">Code</th>
                  <th scope="col" className="hidden w-[26%] px-4 py-3 font-normal md:table-cell">Destination</th>
                  <th scope="col" className="w-[92px] whitespace-nowrap px-4 py-3 text-right font-normal sm:w-[130px]"><span className="sm:hidden">30 days</span><span className="hidden sm:inline">30-day scans</span></th>
                  <th scope="col" className="hidden w-[136px] px-4 py-3 font-normal lg:table-cell">Last 14 days</th>
                  <th scope="col" className="hidden w-[118px] px-4 py-3 font-normal sm:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shown.map((c) => (
                  <tr key={c.id} className="group relative transition-colors duration-fast ease-stay hover:bg-glass-strong">
                    <td className="px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <QrThumb data={`https://${c.shortUrl}`} design={c.design} className="size-10" />
                        <div className="min-w-0">
                          <Link href={`/dashboard/codes/${c.id}`} className="block truncate font-medium text-fg after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-sm focus-visible:after:ring-2 focus-visible:after:ring-accent">
                            {c.name || "Untitled code"}
                          </Link>
                          <p className="truncate text-[12px] text-fg-subtle">{c.folderName ?? "No folder"} · edited {c.updated}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <p className="truncate font-mono text-[12px] text-fg-muted">{c.destination.replace(/^https?:\/\//, "")}</p>
                      <p className="truncate font-mono text-[11px] text-fg-subtle">{c.shortUrl}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-medium tabular-nums text-fg">{compact(c.scans30)}</p>
                      <Delta v={c.delta} />
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <Spark values={c.spark} muted={c.paused} />
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge code={c} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {shown.map((c) => (
              <li key={c.id}>
                <Link href={`/dashboard/codes/${c.id}`} className="flex h-full flex-col rounded-md border border-line bg-bg-raised p-4 transition-colors duration-fast ease-stay hover:border-line-strong">
                  <div className="flex items-start justify-between gap-3">
                    <QrThumb data={`https://${c.shortUrl}`} design={c.design} className="size-16" />
                    <StatusBadge code={c} />
                  </div>
                  <p className="mt-4 truncate font-medium text-fg">{c.name || "Untitled code"}</p>
                  <p className="truncate font-mono text-[12px] text-fg-subtle">{c.destination.replace(/^https?:\/\//, "")}</p>
                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-3">
                    <div>
                      <p className="font-medium tabular-nums text-fg">{compact(c.scans30)} scans</p>
                      <Delta v={c.delta} />
                    </div>
                    <Spark values={c.spark} muted={c.paused} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <Toast message={toast} />
    </div>
  );
}

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "");

/** Cancelled or lapsed: say plainly that the codes still work. */
export function PlanNotice({ plan }: { plan: Plan }) {
  const ended = plan.lapsed;
  return (
    <div role="status" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-warning/30 bg-warning/[0.06] px-4 py-3">
      <p className="text-fg">
        {ended ? `Your plan ended${plan.endsAt ? ` on ${fmt(plan.endsAt)}` : ""}.` : `Your plan ends on ${fmt(plan.endsAt)}.`}{" "}
        <span className="text-fg-muted">Every code keeps redirecting. {ended ? "Resume a plan to edit them and see new scans." : "You can edit until then."}</span>
      </p>
      <ButtonLink href="/dashboard/billing" size="sm" variant="secondary">{ended ? "Resume" : "Keep my plan"}</ButtonLink>
    </div>
  );
}

function EmptyState({ plan }: { plan: Plan }) {
  return (
    <div className="mx-auto max-w-[640px] py-10 text-center">
      <h1 className="font-display text-h3 font-semibold text-fg">{plan.canEdit ? "Make your first dynamic code" : "Choose a plan to make dynamic codes"}</h1>
      <p className="mx-auto mt-3 max-w-[52ch] text-body text-fg-muted">
        {plan.canEdit
          ? "Print it once, then change where it points whenever you like. Every scan shows up here."
          : "Dynamic codes can be edited after printing and show you every scan. They keep working even if you cancel."}
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {plan.canEdit ? (
          <>
            <ButtonLink href="/dashboard/codes/new">Create a code</ButtonLink>
            <ButtonLink href="/dashboard/codes/bulk" variant="secondary">Bulk create from CSV</ButtonLink>
          </>
        ) : (
          <>
            <ButtonLink href="/dashboard/billing">See plans</ButtonLink>
            <ButtonLink href="/qr-code-generator" variant="secondary">Make a free static code</ButtonLink>
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ code }: { code: DashCode }) {
  if (code.disabled) return <Badge variant="warning"><span className="size-1.5 rounded-full bg-current" /> Disabled</Badge>;
  return code.paused ? (
    <Badge variant="warning"><span className="size-1.5 rounded-full bg-current" /> Paused</Badge>
  ) : (
    <Badge variant="accent"><span className="size-1.5 rounded-full bg-current" /> Active</Badge>
  );
}

function Delta({ v }: { v: number }) {
  const up = v >= 0;
  return (
    <p className={cn("font-mono text-[11px] tabular-nums", up ? "text-accent-text" : "text-fg-subtle")}>
      <span aria-hidden>{up ? "↑" : "↓"}</span> {Math.abs(v)}%<span className="sr-only"> {up ? "more" : "fewer"} than the previous 30 days</span>
    </p>
  );
}

/** 14-day sparkline: de-emphasis line with today's point in the accent. */
function Spark({ values, muted }: { values: number[]; muted?: boolean }) {
  const w = 96, h = 28, max = Math.max(...values, 1);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * (w - 4) + 2, h - 3 - (v / max) * (h - 6)] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="overflow-visible">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className="text-fg-subtle" />
      <circle cx={lx} cy={ly} r="3" className={muted ? "fill-fg-subtle" : "fill-accent [[data-theme=light]_&]:fill-accent-text"} />
    </svg>
  );
}

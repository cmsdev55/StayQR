import type { Metadata } from "next";
import Link from "next/link";
import { day, PlanBadge, StatusBadge, td, th, tableWrap, thead } from "@/components/admin/format";
import { Button, ButtonLink } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/input";
import { accountPlan, accountStatus, listUsers, PAGE_SIZE, PLAN_FILTERS, PLAN_LABEL, readUserFilters, STATUS_FILTERS, STATUS_LABEL } from "@/lib/server/admin";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsers({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const s = await searchParams;
  const f = readUserFilters(s);
  const { rows, total, page } = await listUsers(f);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (extra: Record<string, string | number>) => {
    const p = new URLSearchParams();
    if (f.q) p.set("q", f.q);
    if (f.plan !== "all") p.set("plan", f.plan);
    if (f.status !== "all") p.set("status", f.status);
    for (const [k, v] of Object.entries(extra)) p.set(k, String(v));
    return p.toString();
  };
  const select = cn(fieldClass, "h-10 px-3 text-body-sm");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight">Users</h1>
          <p className="mt-1 text-body-sm text-fg-muted">{total.toLocaleString("en-US")} account{total === 1 ? "" : "s"} match.</p>
        </div>
        <ButtonLink href={`/admin/users/export?${qs({})}`} prefetch={false} variant="secondary" size="sm">Export CSV</ButtonLink>
      </div>

      {s.deleted && <p role="status" className="rounded-sm bg-accent/[0.1] px-3 py-2.5 text-body-sm">Account deleted. Its codes keep redirecting.</p>}

      <form className="grid gap-3 rounded-md border border-line bg-bg-raised p-4 sm:grid-cols-[1fr_180px_180px_auto]" method="get">
        <label className="flex flex-col gap-1.5 text-body-sm text-fg-muted">
          Search
          <input name="q" defaultValue={f.q} placeholder="Email, name or account ID" className={select} />
        </label>
        <label className="flex flex-col gap-1.5 text-body-sm text-fg-muted">
          Plan
          <select name="plan" defaultValue={f.plan} className={select}>
            {PLAN_FILTERS.map((p) => <option key={p} value={p}>{p === "all" ? "All plans" : PLAN_LABEL[p]}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-body-sm text-fg-muted">
          Status
          <select name="status" defaultValue={f.status} className={select}>
            {STATUS_FILTERS.map((p) => <option key={p} value={p}>{p === "all" ? "All statuses" : STATUS_LABEL[p]}</option>)}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <Button type="submit" size="sm">Filter</Button>
          <ButtonLink href="/admin/users" variant="ghost" size="sm">Clear</ButtonLink>
        </div>
      </form>

      <div className={tableWrap}>
        <table className="w-full min-w-[860px] text-left text-body-sm">
          <thead className={thead}>
            <tr>
              <th className={th}>Account</th>
              <th className={th}>Plan</th>
              <th className={th}>Status</th>
              <th className={th}>Renews / ends</th>
              <th className={`${th} text-right`}>Codes</th>
              <th className={th}>Joined</th>
              <th className={th}>Last active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((u) => {
              const status = accountStatus(u);
              return (
                <tr key={u.id} className="relative hover:bg-glass-strong">
                  <td className={td}>
                    <Link href={`/admin/users/${u.id}`} className="font-medium after:absolute after:inset-0 hover:underline">{u.email}</Link>
                    <span className="block text-fg-subtle">{u.name ?? "—"}{!u.verified && " · email not confirmed"}</span>
                  </td>
                  <td className={td}><PlanBadge plan={accountPlan(u)} /></td>
                  <td className={td}><StatusBadge status={status} /></td>
                  <td className={`${td} whitespace-nowrap text-fg-muted`}>
                    {u.tier === "lifetime" ? "never" : status === "cancelling" ? `ends ${day(u.ends_at)}` : u.renews_at ? `renews ${day(u.renews_at)}` : "—"}
                  </td>
                  <td className={`${td} text-right tabular-nums`}>{u.codes}</td>
                  <td className={`${td} whitespace-nowrap text-fg-muted`}>{day(u.created_at)}</td>
                  <td className={`${td} whitespace-nowrap text-fg-muted`}>{day(u.last_seen)}</td>
                </tr>
              );
            })}
            {!rows.length && <tr><td className={td} colSpan={7}>No accounts match these filters.</td></tr>}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav aria-label="Pages" className="flex items-center justify-between text-body-sm">
          {page > 1 ? <ButtonLink href={`/admin/users?${qs({ page: page - 1 })}`} variant="secondary" size="sm">← Previous</ButtonLink> : <span />}
          <span className="text-fg-muted">Page {page} of {pages}</span>
          {page < pages ? <ButtonLink href={`/admin/users?${qs({ page: page + 1 })}`} variant="secondary" size="sm">Next →</ButtonLink> : <span />}
        </nav>
      )}
    </div>
  );
}

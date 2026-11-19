import type { Metadata } from "next";
import Link from "next/link";
import { day, money, td, th, tableWrap, thead, when } from "@/components/admin/format";
import { overview } from "@/lib/server/admin";

export const metadata: Metadata = { title: "Overview" };

function Stat({ label, value, sub, href }: { label: string; value: string | number; sub?: string; href?: string }) {
  const body = (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle">{label}</p>
      <p className="mt-2 text-[28px] font-semibold leading-none tabular-nums">{value}</p>
      {sub && <p className="mt-2 text-body-sm text-fg-subtle">{sub}</p>}
    </>
  );
  const cls = "block rounded-md border border-line bg-bg-raised p-5 transition-colors";
  return href ? <Link href={href} className={`${cls} hover:border-line-strong`}>{body}</Link> : <div className={cls}>{body}</div>;
}

export default async function AdminOverview() {
  const o = await overview();
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-[32px] font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-body-sm text-fg-muted">Live from the database. Payments and refunds are handled in Polar.</p>
      </div>

      <section aria-label="Subscribers" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Pro monthly" value={o.monthly} sub="renewing" href="/admin/users?plan=pro-monthly&status=active" />
        <Stat label="Pro yearly" value={o.yearly} sub="renewing" href="/admin/users?plan=pro-yearly&status=active" />
        <Stat label="Lifetime" value={o.lifetime} href="/admin/users?plan=lifetime" />
        <Stat label="Monthly recurring" value={money(Math.round(o.mrr * 100))} sub="renewing plans, before fees" />
        <Stat label="Cancelling" value={o.cancelling} sub="active until period end" href="/admin/users?status=cancelling" />
        <Stat label="Payment failed" value={o.past_due} href="/admin/users?status=past_due" />
        <Stat label="Revenue, 30 days" value={money(o.revenue30)} sub={`${money(o.revenueAllTime)} all time`} />
        <Stat label="Suspended" value={o.suspended} href="/admin/users?status=suspended" />
      </section>

      <section aria-label="Usage" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Accounts" value={o.users} href="/admin/users" />
        <Stat label="New, 7 days" value={o.new7} sub={`${o.new30} in 30 days`} />
        <Stat label="Dynamic codes" value={o.codes} />
        <Stat label="Scans, 30 days" value={o.scans30.toLocaleString("en-US")} />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-body font-semibold">Newest accounts</h2>
          <div className={tableWrap}>
            <table className="w-full text-left text-body-sm">
              <thead className={thead}><tr><th className={th}>Account</th><th className={th}>Joined</th></tr></thead>
              <tbody className="divide-y divide-line">
                {o.recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-glass-strong">
                    <td className={td}><Link href={`/admin/users/${u.id}`} className="hover:underline">{u.email}</Link>{u.name && <span className="block text-fg-subtle">{u.name}</span>}</td>
                    <td className={`${td} whitespace-nowrap text-fg-muted`}>{day(u.created_at)}</td>
                  </tr>
                ))}
                {!o.recentUsers.length && <tr><td className={td} colSpan={2}>No accounts yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-body font-semibold">Latest payments</h2>
          <div className={tableWrap}>
            <table className="w-full text-left text-body-sm">
              <thead className={thead}><tr><th className={th}>Payment</th><th className={`${th} text-right`}>Amount</th><th className={th}>When</th></tr></thead>
              <tbody className="divide-y divide-line">
                {o.recentPayments.map((p, i) => (
                  <tr key={i} className="hover:bg-glass-strong">
                    <td className={td}>
                      {p.email ? <Link href={`/admin/users/${p.user_id}`} className="hover:underline">{p.email}</Link> : <span className="text-fg-subtle">deleted account</span>}
                      <span className="block text-fg-subtle">{p.description}{p.status !== "paid" ? ` · ${p.status}` : ""}</span>
                    </td>
                    <td className={`${td} text-right tabular-nums`}>{money(p.total_cents, p.currency)}</td>
                    <td className={`${td} whitespace-nowrap text-fg-muted`}>{when(p.created_at)}</td>
                  </tr>
                ))}
                {!o.recentPayments.length && <tr><td className={td} colSpan={3}>No payments yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

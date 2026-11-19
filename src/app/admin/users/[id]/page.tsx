import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  cancelSubAction, deleteUserAction, disableCodeAction, enableCodeAction, grantLifetimeAction, resumeSubAction, revokeLifetimeAction,
  revokeSubAction, signOutEverywhereAction, suspendAction, switchSubAction, unsuspendAction, updateProfileAction, verifyEmailAction,
} from "@/app/admin/actions";
import { ActionButton, DeleteForm, ProfileForm, ReasonForm } from "@/components/admin/admin-ui";
import { ACTION_LABEL, day, detailText, money, PlanBadge, StatusBadge, td, th, tableWrap, thead, when } from "@/components/admin/format";
import { Badge } from "@/components/ui/badge";
import { accountPlan, accountStatus, PLAN_LABEL, requireAdmin, userDetail } from "@/lib/server/admin";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Account" };

const SUB_STATUS: Record<string, string> = {
  active: "Active", on_trial: "Trial", cancelled: "Cancelling", past_due: "Payment failed", unpaid: "Unpaid", paused: "Paused", expired: "Ended",
};

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-line bg-bg-raised p-5 sm:p-6">
      <h2 className="text-body font-semibold">{title}</h2>
      {hint && <p className="mt-1 text-body-sm text-fg-subtle">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function AdminUser({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await requireAdmin();
  const d = await userDetail(id);
  if (!d) notFound();
  const p = d.profile;
  const status = accountStatus(p);
  const self = admin.id === p.id;
  const liveSubs = d.subs.filter((s) => ["active", "on_trial", "past_due", "cancelled"].includes(s.status) && (s.status !== "cancelled" || !s.ends_at || s.ends_at > new Date()));
  const freeLifetime = d.orders.find((o) => o.id.startsWith("manual_") && o.status === "paid");
  const paidLifetime = d.orders.find((o) => !o.id.startsWith("manual_") && o.plan === "lifetime" && o.status === "paid");

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="text-body-sm text-fg-muted hover:text-fg">← All users</Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="break-all text-[28px] font-semibold tracking-tight">{p.email}</h1>
          <p className="mt-1 text-body-sm text-fg-muted">
            {p.name ?? "No name"} · joined {day(p.created_at)} · {p.google ? "Google sign-in" : "email + password"}
            {p.google && p.has_password ? " and password" : ""} · {d.sessions.n} active session{d.sessions.n === 1 ? "" : "s"}
            {d.sessions.last_seen ? `, last seen ${day(d.sessions.last_seen)}` : ""}
          </p>
          <p className="mt-1 font-mono text-[12px] text-fg-subtle">{p.id}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PlanBadge plan={accountPlan(p)} />
          <StatusBadge status={status} />
          {!p.verified && <Badge variant="warning">Email not confirmed</Badge>}
          {self && <Badge>You</Badge>}
        </div>
      </header>

      {p.suspended_at && (
        <p className="rounded-sm bg-danger/[0.1] px-4 py-3 text-body-sm">
          Suspended {when(p.suspended_at)}{p.suspended_reason ? `: “${p.suspended_reason}”` : ""}. They can't log in; their codes still redirect.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Profile">
          <ProfileForm run={updateProfileAction.bind(null, p.id)} name={p.name ?? ""} email={p.email} />
          {!p.verified && <div className="mt-4"><ActionButton run={verifyEmailAction.bind(null, p.id)} label="Mark email as confirmed" /></div>}
        </Section>

        <Section title="Plan and billing" hint="Changes go through Polar, so billing really changes. Refunds are issued in the Polar dashboard.">
          {liveSubs.length === 0 && !paidLifetime && !freeLifetime && <p className="text-body-sm text-fg-muted">No active plan.</p>}
          {paidLifetime && <p className="mb-3 text-body-sm">Paid Lifetime since {day(paidLifetime.created_at)} ({money(paidLifetime.total_cents, paidLifetime.currency)}).</p>}
          <div className="space-y-4">
            {liveSubs.map((s) => (
              <div key={s.id} className="rounded-sm border border-line p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{PLAN_LABEL[s.plan] ?? s.plan} · {SUB_STATUS[s.status] ?? s.status}</p>
                  <p className="text-body-sm text-fg-muted">{s.status === "cancelled" ? `ends ${day(s.ends_at)}` : s.renews_at ? `renews ${day(s.renews_at)}` : ""}</p>
                </div>
                <p className="mt-1 font-mono text-[12px] text-fg-subtle">{s.id}{s.card_last_four ? ` · ${s.card_brand ?? "card"} ·· ${s.card_last_four}` : ""}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.status === "cancelled"
                    ? <ActionButton run={resumeSubAction.bind(null, p.id, s.id)} label="Resume" confirm="Resume this subscription? It will renew and charge as normal." />
                    : <ActionButton run={cancelSubAction.bind(null, p.id, s.id)} label="Cancel at period end" confirm="Cancel at the end of the paid period? They keep Pro until then and aren't charged again." />}
                  {s.status !== "cancelled" && (
                    <ActionButton
                      run={switchSubAction.bind(null, p.id, s.id, s.plan === "pro-monthly" ? "pro-yearly" : "pro-monthly")}
                      label={s.plan === "pro-monthly" ? "Switch to yearly" : "Switch to monthly"}
                      confirm={s.plan === "pro-monthly" ? "Switch to yearly? Polar charges the prorated difference now." : "Switch to monthly?"}
                    />
                  )}
                  <ActionButton run={revokeSubAction.bind(null, p.id, s.id)} label="End now" danger confirm="End this subscription immediately? Pro stops now. No refund is issued automatically; do that in Polar if needed." />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-line pt-4">
            {freeLifetime ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-body-sm">Free Lifetime given {day(freeLifetime.created_at)}.</p>
                <ActionButton run={revokeLifetimeAction.bind(null, p.id, freeLifetime.id)} label="Take back" danger confirm="Take back the free Lifetime? They drop to Free (or to any Pro subscription they have)." />
              </div>
            ) : !paidLifetime ? (
              <ReasonForm run={grantLifetimeAction.bind(null, p.id)} label="Give Lifetime free (partners, influencers, support)" placeholder="Note, e.g. YouTube review deal" submit="Give Lifetime" required={false} confirm="Give this account Lifetime for free?" />
            ) : null}
          </div>
        </Section>
      </div>

      <Section title={`Dynamic codes (${d.codes.length})`} hint="Disable a code only for phishing, malware or other abuse (Terms §4). Scanners then see a warning page.">
        {d.codes.length === 0 ? <p className="text-body-sm text-fg-muted">No dynamic codes.</p> : (
          <div className={tableWrap}>
            <table className="w-full min-w-[760px] text-left text-body-sm">
              <thead className={thead}><tr><th className={th}>Code</th><th className={th}>Destination</th><th className={`${th} text-right`}>Scans, 30 days</th><th className={th}>State</th><th className={th}></th></tr></thead>
              <tbody className="divide-y divide-line">
                {d.codes.map((c) => (
                  <tr key={c.id}>
                    <td className={td}>
                      <a href={siteUrl(`/r/${c.slug}`)} target="_blank" rel="noreferrer" className="font-mono hover:underline">/r/{c.slug}</a>
                      <span className="block text-fg-subtle">{c.name || "Untitled"} · {day(c.created_at)}</span>
                    </td>
                    <td className={`${td} max-w-[320px] break-all text-fg-muted`}>{c.destination}</td>
                    <td className={`${td} text-right tabular-nums`}>{c.scans30}</td>
                    <td className={td}>
                      {c.disabled_at ? <Badge variant="danger">Disabled</Badge> : c.paused ? <Badge variant="warning">Paused by owner</Badge> : <Badge variant="accent">Live</Badge>}
                      {c.disabled_reason && <span className="mt-1 block text-[12px] text-fg-subtle">“{c.disabled_reason}”</span>}
                    </td>
                    <td className={`${td} min-w-[260px]`}>
                      {c.disabled_at
                        ? <ActionButton run={enableCodeAction.bind(null, p.id, c.id)} label="Re-enable" confirm={`Let /r/${c.slug} redirect again?`} />
                        : <ReasonForm run={disableCodeAction.bind(null, p.id, c.id)} label="" placeholder="Reason (e.g. phishing report)" submit="Disable" danger confirm={`Disable /r/${c.slug}? Everyone who scans it sees a warning page.`} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Payments" hint="Every charge Polar reported for this account.">
          {d.invoices.length === 0 && d.orders.length === 0 ? <p className="text-body-sm text-fg-muted">No payments.</p> : (
            <ul className="divide-y divide-line text-body-sm">
              {d.invoices.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span>{i.description}<span className="block text-fg-subtle">{when(i.created_at)}{i.status !== "paid" ? ` · ${i.status}` : ""}</span></span>
                  <span className="tabular-nums">{money(i.total_cents, i.currency)}</span>
                </li>
              ))}
              {d.orders.filter((o) => o.id.startsWith("manual_")).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span>Free Lifetime (given by admin)<span className="block text-fg-subtle">{when(o.created_at)} · {o.status}</span></span>
                  <span className="tabular-nums">{money(0)}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Account access">
          <div className="space-y-5">
            <ActionButton run={signOutEverywhereAction.bind(null, p.id)} label="Sign out of all devices" confirm="Sign this account out everywhere?" />
            {self ? (
              <p className="text-body-sm text-fg-subtle">You can't suspend or delete your own account here.</p>
            ) : p.suspended_at ? (
              <ActionButton run={unsuspendAction.bind(null, p.id)} label="Lift suspension" confirm="Let this account log in again?" />
            ) : (
              <ReasonForm run={suspendAction.bind(null, p.id)} label="Suspend: blocks login and signs out everywhere. Codes keep working; billing is not changed." placeholder="Reason (kept in the activity log)" submit="Suspend" danger confirm="Suspend this account?" />
            )}
          </div>
        </Section>
      </div>

      {!self && (
        <Section title="Delete account" hint="Cancels any subscription in Polar first, then deletes the account, its folders and sessions. Its codes keep redirecting, as the Terms promise. This can't be undone.">
          <DeleteForm run={deleteUserAction.bind(null, p.id)} email={p.email} />
        </Section>
      )}

      <Section title="Admin activity on this account">
        {d.log.length === 0 ? <p className="text-body-sm text-fg-muted">Nothing yet.</p> : (
          <ul className="divide-y divide-line text-body-sm">
            {d.log.map((l) => (
              <li key={l.id} className="py-2.5">
                <span className="font-medium">{ACTION_LABEL[l.action] ?? l.action}</span>
                {detailText(l.details) && <span className="text-fg-muted"> · {detailText(l.details)}</span>}
                <span className="block text-fg-subtle">{when(l.created_at)} · {l.admin_email}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

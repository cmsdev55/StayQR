"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cancelPlanAction, portalAction, resumePlanAction, switchPlanAction, type Result } from "@/app/dashboard/actions";
import { Toast } from "@/components/dashboard/toast";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { LIFETIME, PRO, YEARLY_SAVING } from "@/content/plans";
import type { Plan } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

export type BillingProps = {
  plan: Plan;
  card: { brand: string | null; last4: string | null } | null;
  hasPortal: boolean;
  invoices: { id: string; date: string; description: string; amount: string; status: string; url: string | null }[];
  codes: number;
  scans30: number;
  creditCents: number;
  checkout: string | null;
  testMode: boolean;
};

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");

/** Plan, usage, payment method, invoices, and a cancel flow that says what really happens. */
export function BillingView({ plan, card, hasPortal, invoices, codes, scans30, creditCents, checkout, testMode }: BillingProps) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [busy, start] = useTransition();
  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 3000);
  };
  const run = (fn: () => Promise<Result>, ok: string) =>
    start(async () => {
      const r = await fn();
      flash(r.ok ? ok : r.error);
      setConfirm(false);
      router.refresh();
    });

  // after checkout the webhook can land a moment later: refresh a few times until the plan shows
  useEffect(() => {
    if (checkout !== "done") return;
    flash(plan.canEdit ? "You're all set. Thank you!" : "Payment received. Activating your plan…");
    window.history.replaceState(null, "", "/dashboard/billing");
    if (plan.canEdit) return;
    let n = 0;
    const t = setInterval(() => (++n > 6 ? clearInterval(t) : router.refresh()), 2500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout]);

  const cancelled = plan.tier === "pro" && plan.status === "cancelled";
  const period = plan.plan === "pro-monthly" ? "monthly" : "yearly";
  const lifetimePrice = Math.max(0, LIFETIME - creditCents / 100);

  return (
    <div className="max-w-[960px]">
      <h1 className="font-display text-h4 font-semibold text-fg sm:text-[26px]">Billing</h1>
      <p className="mt-1 text-fg-muted">Manage your plan and invoices.</p>
      {testMode && (
        <p role="note" className="mt-4 rounded-sm border border-dashed border-warning/40 bg-warning/[0.06] px-4 py-3 text-fg-muted">
          <span className="font-medium text-warning">Local development.</span> Lemon Squeezy isn&apos;t configured, so checkout is simulated and no money moves.
        </p>
      )}
      {checkout === "unavailable" && <p role="alert" className="mt-4 rounded-sm bg-danger/[0.08] px-4 py-3 text-fg">Checkout isn&apos;t available right now. Please try again later or email hello@stayqr.com.</p>}

      {plan.tier === "free" ? (
        <PlanPicker lapsed={plan.lapsed} endsAt={plan.endsAt} />
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <section className={cn("rounded-md border border-line bg-bg-raised p-5 sm:p-6", plan.tier === "lifetime" && "md:col-span-2")} aria-labelledby="plan-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-fg-muted">Current plan</p>
                <h2 id="plan-title" className="mt-1 text-[24px] font-semibold text-fg">{plan.tier === "lifetime" ? "Lifetime" : `Pro · ${period}`}</h2>
              </div>
              {cancelled ? <Badge variant="warning">Ends {fmt(plan.endsAt)}</Badge> : plan.status === "past_due" ? <Badge variant="warning">Payment due</Badge> : <Badge variant="accent"><span className="size-1.5 rounded-full bg-current" /> Active</Badge>}
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
              <div><dt className="text-fg-subtle">Price</dt><dd className="mt-0.5 font-medium text-fg">{plan.tier === "lifetime" ? `$${LIFETIME} once` : period === "monthly" ? `$${PRO.monthly} / month` : `$${PRO.yearly} / year`}</dd></div>
              <div><dt className="text-fg-subtle">{plan.tier === "lifetime" ? "Renews" : cancelled ? "Access until" : "Renews on"}</dt><dd className="mt-0.5 font-medium text-fg">{plan.tier === "lifetime" ? "Never" : fmt(cancelled ? plan.endsAt : plan.renewsAt)}</dd></div>
              <div><dt className="text-fg-subtle">Dynamic codes</dt><dd className="mt-0.5 font-medium text-fg">{codes} <span className="font-normal text-fg-subtle">of unlimited</span></dd></div>
              <div><dt className="text-fg-subtle">Scans · 30 days</dt><dd className="mt-0.5 font-medium text-fg">{scans30.toLocaleString("en-US")} <span className="font-normal text-fg-subtle">of unlimited</span></dd></div>
            </dl>
            {plan.tier === "pro" && (
              <div className="mt-6 flex flex-wrap gap-2">
                {cancelled ? (
                  <Button size="sm" disabled={busy} onClick={() => run(resumePlanAction, "Welcome back. Your plan will renew.")}>Resume plan</Button>
                ) : (
                  <Button variant="secondary" size="sm" disabled={busy} onClick={() => run(() => switchPlanAction(period === "monthly" ? "pro-yearly" : "pro-monthly"), period === "monthly" ? "Switched to yearly" : "Switched to monthly")}>
                    {period === "monthly" ? `Switch to yearly (save ${YEARLY_SAVING}%)` : "Switch to monthly"}
                  </Button>
                )}
              </div>
            )}
          </section>

          {plan.tier === "pro" && (
            <section className="relative overflow-hidden rounded-md border border-line bg-bg-raised p-5 sm:p-6" aria-labelledby="life-title">
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-md [box-shadow:inset_0_0_0_1px_rgb(var(--accent)/0.3)]" />
              <Badge variant="accent">Best value</Badge>
              <h2 id="life-title" className="mt-3 text-[20px] font-semibold text-fg">Go lifetime</h2>
              <p className="mt-1 text-fg-muted">Pay once, never renew.{creditCents > 0 ? " We credit the unused part of your current period." : ""}</p>
              <p className="mt-5 flex items-baseline gap-2">
                <span className="text-[28px] font-semibold text-fg">${lifetimePrice.toFixed(2)}</span>
                {creditCents > 0 && <span className="text-fg-subtle line-through">${LIFETIME}</span>}
              </p>
              {creditCents > 0 && <p className="font-mono text-[12px] text-fg-subtle">${(creditCents / 100).toFixed(2)} credit applied</p>}
              <ButtonLink href="/api/checkout?plan=lifetime" size="sm" className="mt-5 w-full">Upgrade to lifetime</ButtonLink>
            </section>
          )}
        </div>
      )}

      {card?.last4 && (
        <section className="mt-4 rounded-md border border-line bg-bg-raised p-5 sm:p-6" aria-labelledby="pm-title">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-10 w-14 place-items-center rounded-[6px] border border-line bg-bg font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-fg">{card.brand ?? "Card"}</span>
              <div>
                <h2 id="pm-title" className="font-medium text-fg">{card.brand ? card.brand.charAt(0).toUpperCase() + card.brand.slice(1) : "Card"} ending {card.last4}</h2>
                <p className="text-fg-subtle">Payments are processed by Lemon Squeezy.</p>
              </div>
            </div>
            {hasPortal && (
              <form action={portalAction}>
                <Button type="submit" variant="secondary" size="sm">Update card or billing details</Button>
              </form>
            )}
          </div>
        </section>
      )}

      <section className="mt-4 rounded-md border border-line bg-bg-raised" aria-labelledby="inv-title">
        <h2 id="inv-title" className="px-5 pt-5 font-semibold text-fg sm:px-6 sm:pt-6">Invoices</h2>
        {invoices.length === 0 ? (
          <p className="px-5 pb-6 pt-2 text-fg-muted sm:px-6">No invoices yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-bg-overlay font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle">
                <tr>
                  <th className="px-5 py-3 font-normal sm:px-6">Date</th>
                  <th className="px-3 py-3 font-normal">Description</th>
                  <th className="px-3 py-3 text-right font-normal">Amount</th>
                  <th className="px-3 py-3 font-normal">Status</th>
                  <th className="px-5 py-3 text-right font-normal sm:px-6"><span className="sr-only">Invoice</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="transition-colors duration-fast ease-stay hover:bg-glass-strong">
                    <td className="whitespace-nowrap px-5 py-3 text-fg sm:px-6">{inv.date}</td>
                    <td className="px-3 py-3 text-fg-muted">{inv.description}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-fg">{inv.amount}</td>
                    <td className="px-3 py-3"><Badge>{inv.status}</Badge></td>
                    <td className="px-5 py-3 text-right sm:px-6">
                      {inv.url ? <a href={inv.url} target="_blank" rel="noopener noreferrer" className="font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">View</a> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {plan.tier === "pro" && !cancelled && (
        <section className="mt-4 rounded-md border border-line bg-bg-raised p-5 sm:p-6" aria-labelledby="cancel-title">
          <h2 id="cancel-title" className="font-semibold text-fg">Cancel plan</h2>
          <p className="mt-1 max-w-[60ch] text-fg-muted">
            {codes === 1 ? "Your code keeps" : `All ${codes} of your codes keep`} working after you cancel, forever. You&apos;ll keep editing and analytics until {fmt(plan.renewsAt)}.
          </p>
          <div className={cn("grid transition-[grid-template-rows,opacity] duration-base ease-stay", confirm ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")} inert={!confirm}>
            <div className="overflow-hidden">
              <div className="mt-5 rounded-sm border border-line bg-bg p-4">
                <p className="font-medium text-fg">What happens when your plan ends</p>
                <ul className="mt-3 flex flex-col gap-2 text-fg-muted">
                  <li className="flex gap-2.5"><Check /> Every printed code keeps redirecting to its last destination</li>
                  <li className="flex gap-2.5"><Check /> No service pages, no ads, no scan limits</li>
                  <li className="flex gap-2.5"><Dash /> Editing destinations and new analytics pause until you come back</li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setConfirm(false)}>Keep my plan</Button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => run(cancelPlanAction, "Plan cancelled. Your codes keep working.")}
                    className="inline-flex h-10 items-center rounded-sm px-4 font-medium text-danger transition-colors hover:bg-danger/10"
                  >
                    Cancel at period end
                  </button>
                </div>
              </div>
            </div>
          </div>
          {!confirm && (
            <button type="button" onClick={() => setConfirm(true)} className="mt-4 h-10 rounded-sm border border-line px-4 font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg">
              Cancel plan…
            </button>
          )}
        </section>
      )}

      <p className="mt-6 text-[13px] text-fg-subtle">
        Refunds: email hello@stayqr.com within 14 days of your first payment or a Lifetime purchase. Prices are before tax; Lemon Squeezy adds any VAT or sales tax at checkout.
      </p>

      <Toast message={toast} />
    </div>
  );
}

function PlanPicker({ lapsed, endsAt }: { lapsed: boolean; endsAt: string | null }) {
  const plans = [
    { key: "pro-monthly", name: "Pro monthly", price: `$${PRO.monthly}`, per: "/ month", note: "Cancel any time" },
    { key: "pro-yearly", name: "Pro yearly", price: `$${PRO.yearly}`, per: "/ year", note: `Save ${YEARLY_SAVING}%`, best: true },
    { key: "lifetime", name: "Lifetime", price: `$${LIFETIME}`, per: "once", note: "Never renews" },
  ];
  return (
    <section className="mt-6" aria-labelledby="pick-title">
      <h2 id="pick-title" className="text-[20px] font-semibold text-fg">{lapsed ? "Resume editing your codes" : "Choose a plan"}</h2>
      <p className="mt-1 max-w-[62ch] text-fg-muted">
        {lapsed
          ? `Your plan ended on ${fmt(endsAt)}. Every code kept working. Pick a plan to edit them again and see new scans.`
          : "Unlimited dynamic codes and scans, editing after printing, analytics and smart redirects. Your codes keep working even if you cancel."}
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <li key={p.key} className={cn("relative flex flex-col rounded-md border bg-bg-raised p-5", p.best ? "border-accent/40" : "border-line")}>
            {p.best && <Badge variant="accent" className="absolute right-4 top-4">Most popular</Badge>}
            <p className="font-medium text-fg">{p.name}</p>
            <p className="mt-3 flex items-baseline gap-1.5"><span className="text-[28px] font-semibold text-fg">{p.price}</span><span className="text-fg-subtle">{p.per}</span></p>
            <p className="mt-1 font-mono text-[12px] text-fg-subtle">{p.note}</p>
            <ButtonLink href={`/api/checkout?plan=${p.key}`} size="sm" variant={p.best ? "primary" : "secondary"} className="mt-5 w-full">
              {lapsed ? "Resume with " : "Choose "}{p.name.toLowerCase()}
            </ButtonLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Check() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-accent-text" aria-hidden><path d="M3 8.5l3 3 7-7" /></svg>;
}
function Dash() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="mt-0.5 shrink-0 text-fg-subtle" aria-hidden><path d="M4 8h8" /></svg>;
}

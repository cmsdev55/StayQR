"use client";

import { useState } from "react";
import { Toast } from "@/components/dashboard/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CODES, INVOICES } from "@/content/dashboard";
import { LIFETIME, PRO } from "@/content/plans";
import { cn } from "@/lib/utils";

/** Plan, usage, payment method, invoices, and a cancel flow that says what really happens. */
export function BillingView() {
  const [confirm, setConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const credit = 13.5; // unused part of the current yearly period
  const scans = CODES.reduce((s, c) => s + c.scans30, 0);
  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="max-w-[960px]">
      <h1 className="font-display text-h4 font-semibold text-fg sm:text-[26px]">Billing</h1>
      <p className="mt-1 text-fg-muted">Manage your plan and invoices.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="rounded-md border border-line bg-bg-raised p-5 sm:p-6" aria-labelledby="plan-title">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-fg-muted">Current plan</p>
              <h2 id="plan-title" className="mt-1 text-[24px] font-semibold text-fg">Pro · yearly</h2>
            </div>
            {cancelled ? <Badge variant="warning">Ends 14 Mar 2027</Badge> : <Badge variant="accent"><span className="size-1.5 rounded-full bg-current" /> Active</Badge>}
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
            <div><dt className="text-fg-subtle">Price</dt><dd className="mt-0.5 font-medium text-fg">${PRO.yearly} / year</dd></div>
            <div><dt className="text-fg-subtle">{cancelled ? "Access until" : "Renews on"}</dt><dd className="mt-0.5 font-medium text-fg">14 Mar 2027</dd></div>
            <div><dt className="text-fg-subtle">Dynamic codes</dt><dd className="mt-0.5 font-medium text-fg">{CODES.length} <span className="font-normal text-fg-subtle">of unlimited</span></dd></div>
            <div><dt className="text-fg-subtle">Scans · 30 days</dt><dd className="mt-0.5 font-medium text-fg">{scans.toLocaleString("en-US")} <span className="font-normal text-fg-subtle">of unlimited</span></dd></div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => flash(`Switched to monthly from 14 Mar 2027 ($${PRO.monthly}/month)`)}>Switch to monthly</Button>
            {cancelled && <Button variant="secondary" size="sm" onClick={() => { setCancelled(false); flash("Welcome back. Your plan will renew."); }}>Resume plan</Button>}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-md border border-line bg-bg-raised p-5 sm:p-6" aria-labelledby="life-title">
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-md [box-shadow:inset_0_0_0_1px_rgb(var(--accent)/0.3)]" />
          <Badge variant="accent">Best value</Badge>
          <h2 id="life-title" className="mt-3 text-[20px] font-semibold text-fg">Go lifetime</h2>
          <p className="mt-1 text-fg-muted">Pay once, never renew. We credit what&apos;s left of your yearly plan.</p>
          <p className="mt-5 flex items-baseline gap-2">
            <span className="text-[28px] font-semibold text-fg">${(LIFETIME - credit).toFixed(2)}</span>
            <span className="text-fg-subtle line-through">${LIFETIME}</span>
          </p>
          <p className="font-mono text-[12px] text-fg-subtle">${credit.toFixed(2)} credit applied</p>
          <Button size="sm" className="mt-5 w-full" onClick={() => flash("Lifetime unlocked. No more renewals.")}>Upgrade to lifetime</Button>
        </section>
      </div>

      <section className="mt-4 rounded-md border border-line bg-bg-raised p-5 sm:p-6" aria-labelledby="pm-title">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-10 w-14 place-items-center rounded-[6px] border border-line bg-bg font-mono text-[12px] font-semibold tracking-[0.08em] text-fg">VISA</span>
            <div>
              <h2 id="pm-title" className="font-medium text-fg">Visa ending 4242</h2>
              <p className="text-fg-subtle">Expires 08/2028 · maria@osteria.co</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => flash("Card update opened (demo)")}>Update card</Button>
        </div>
      </section>

      <section className="mt-4 rounded-md border border-line bg-bg-raised" aria-labelledby="inv-title">
        <h2 id="inv-title" className="px-5 pt-5 font-semibold text-fg sm:px-6 sm:pt-6">Invoices</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead className="bg-bg-overlay font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle">
              <tr>
                <th className="px-5 py-3 font-normal sm:px-6">Date</th>
                <th className="px-3 py-3 font-normal">Description</th>
                <th className="px-3 py-3 text-right font-normal">Amount</th>
                <th className="px-3 py-3 font-normal">Status</th>
                <th className="px-5 py-3 text-right font-normal sm:px-6"><span className="sr-only">Download</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="transition-colors duration-fast ease-stay hover:bg-glass-strong">
                  <td className="whitespace-nowrap px-5 py-3 text-fg sm:px-6">{inv.date}</td>
                  <td className="px-3 py-3 text-fg-muted">{inv.description}<span className="ml-2 font-mono text-[11px] text-fg-subtle">{inv.id}</span></td>
                  <td className="px-3 py-3 text-right tabular-nums text-fg">{inv.amount}</td>
                  <td className="px-3 py-3"><Badge>{inv.status}</Badge></td>
                  <td className="px-5 py-3 text-right sm:px-6">
                    <button type="button" onClick={() => flash(`${inv.id}.pdf downloaded (demo)`)} className="font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-4 rounded-md border border-line bg-bg-raised p-5 sm:p-6" aria-labelledby="cancel-title">
        <h2 id="cancel-title" className="font-semibold text-fg">Cancel plan</h2>
        <p className="mt-1 max-w-[60ch] text-fg-muted">
          All {CODES.length} of your codes keep working after you cancel, forever. You&apos;ll keep editing and analytics until 14 Mar 2027.
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
                  onClick={() => { setCancelled(true); setConfirm(false); flash("Plan cancelled. Your codes keep working."); }}
                  className="inline-flex h-10 items-center rounded-sm px-4 font-medium text-danger transition-colors hover:bg-danger/10"
                >
                  Cancel at period end
                </button>
              </div>
            </div>
          </div>
        </div>
        {!confirm && !cancelled && (
          <button type="button" onClick={() => setConfirm(true)} className="mt-4 h-10 rounded-sm border border-line px-4 font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg">
            Cancel plan…
          </button>
        )}
      </section>

      <Toast message={toast} />
    </div>
  );
}

function Check() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-accent-text" aria-hidden><path d="M3 8.5l3 3 7-7" /></svg>;
}
function Dash() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="mt-0.5 shrink-0 text-fg-subtle" aria-hidden><path d="M4 8h8" /></svg>;
}

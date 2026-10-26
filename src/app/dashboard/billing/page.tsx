import type { Metadata } from "next";
import { BillingView } from "@/components/dashboard/billing-view";
import { requireUser } from "@/lib/server/auth";
import { lifetimeCreditCents } from "@/lib/server/billing";
import { db } from "@/lib/server/db";
import { billingMode } from "@/lib/server/env";
import { getPlan } from "@/lib/server/plan";

export const metadata: Metadata = { title: "Billing" };

const money = (cents: number, currency: string) => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const { checkout } = await searchParams;
  const user = await requireUser();
  const sql = db();
  const [plan, subs, invoices, usage, credit] = await Promise.all([
    getPlan(user.id),
    sql<{ card_brand: string | null; card_last_four: string | null; portal_url: string | null }[]>`
      select card_brand, card_last_four, portal_url from public.subscriptions where user_id = ${user.id} order by updated_at desc limit 1`,
    sql<{ id: string; created_at: Date; description: string; total_cents: number; currency: string; status: string; invoice_url: string | null }[]>`
      select id, created_at, description, total_cents, currency, status, invoice_url from public.invoices where user_id = ${user.id} order by created_at desc limit 24`,
    sql<{ codes: number; scans: number }[]>`
      select (select count(*)::int from public.codes where user_id = ${user.id}) as codes,
             (select count(*)::int from public.scans s join public.codes c on c.id = s.code_id
               where c.user_id = ${user.id} and s.scanned_at >= now() - interval '30 days') as scans`,
    lifetimeCreditCents(user.id),
  ]);
  const sub = subs[0];
  return (
    <BillingView
      plan={plan}
      card={sub ? { brand: sub.card_brand, last4: sub.card_last_four } : null}
      hasPortal={!!sub && billingMode === "lemonsqueezy"}
      invoices={invoices.map((i) => ({
        id: i.id,
        date: i.created_at.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        description: i.description,
        amount: money(i.total_cents, i.currency),
        status: i.status.charAt(0).toUpperCase() + i.status.slice(1),
        url: i.invoice_url,
      }))}
      codes={usage[0].codes}
      scans30={usage[0].scans}
      creditCents={credit}
      checkout={checkout ?? null}
      testMode={billingMode === "dev"}
    />
  );
}

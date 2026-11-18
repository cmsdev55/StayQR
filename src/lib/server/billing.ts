import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { LIFETIME, PRO } from "@/content/plans";
import { db } from "./db";
import { billingMode, env } from "./env";

export type PlanKey = "pro-monthly" | "pro-yearly" | "lifetime";
export const PLAN_KEYS: PlanKey[] = ["pro-monthly", "pro-yearly", "lifetime"];
export const isPlanKey = (v: unknown): v is PlanKey => PLAN_KEYS.includes(v as PlanKey);
export const PLAN_NAME: Record<PlanKey, string> = { "pro-monthly": "EndureQR Pro · monthly", "pro-yearly": "EndureQR Pro · yearly", lifetime: "EndureQR Lifetime" };
const PLAN_CENTS: Record<PlanKey, number> = { "pro-monthly": Math.round(PRO.monthly * 100), "pro-yearly": PRO.yearly * 100, lifetime: LIFETIME * 100 };

const planForProduct = (id: unknown): PlanKey | null =>
  (Object.entries(env.creem.products).find(([, v]) => v && v === id)?.[0] as PlanKey | undefined) ?? null;

// ── Creem API ───────────────────────────────────────────────────────────────

async function creem<T = Record<string, unknown>>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${env.creem.apiBase}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "x-api-key": env.creem.apiKey ?? "" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Creem ${init.method ?? "GET"} ${path} failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as T;
}

/** Credit for the unpaid-for remainder of a Pro period, used to discount Lifetime. */
export async function lifetimeCreditCents(userId: string) {
  const [s] = await db()<{ plan: PlanKey; renews_at: Date | null; status: string }[]>`
    select plan, renews_at, status from public.subscriptions
     where user_id = ${userId} and status in ('active', 'on_trial') and renews_at > now()
     order by renews_at desc limit 1`;
  if (!s?.renews_at || s.status === "on_trial") return 0;
  const periodDays = s.plan === "pro-yearly" ? 365 : 30;
  const left = Math.min(periodDays, (s.renews_at.getTime() - Date.now()) / 86400000);
  return Math.max(0, Math.floor((PLAN_CENTS[s.plan] * left) / periodDays));
}

/** Creem hosted checkout URL for a plan. The user id rides along as metadata and comes back on every webhook. */
export async function createCheckout(user: { id: string; email: string; name: string | null }, plan: PlanKey): Promise<string> {
  const product = env.creem.products[plan];
  if (!product) throw new Error(`CREEM_PRODUCT for ${plan} is not set`);
  const credit = plan === "lifetime" ? await lifetimeCreditCents(user.id) : 0;
  const res = await creem<{ checkout_url: string }>("/checkouts", {
    method: "POST",
    body: JSON.stringify({
      product_id: product,
      request_id: `${user.id}:${plan}:${Date.now()}`,
      ...(credit > 0 ? { custom_price: PLAN_CENTS.lifetime - credit } : {}),
      customer: { email: user.email },
      success_url: `${env.siteUrl}/dashboard/billing?checkout=done`,
      metadata: { user_id: user.id, plan },
    }),
  });
  return res.checkout_url;
}

async function ownSubscription(userId: string, id: string) {
  const [s] = await db()<{ id: string; customer_id: string }[]>`select id, customer_id from public.subscriptions where id = ${id} and user_id = ${userId}`;
  if (!s) throw new Error("Subscription not found");
  return s;
}

/** Cancel at the end of the paid period (Creem keeps it active until then, as `scheduled_cancel`). */
export async function cancelSubscription(userId: string, id: string) {
  await ownSubscription(userId, id);
  if (billingMode === "dev") return devSubscriptionChange(id, { status: "cancelled" });
  const sub = await creem<Sub>(`/subscriptions/${id}/cancel`, { method: "POST", body: JSON.stringify({ mode: "scheduled", onExecute: "cancel" }) });
  await upsertSubscription(userId, sub);
}

/** Undo a scheduled cancellation. */
export async function resumeSubscription(userId: string, id: string) {
  await ownSubscription(userId, id);
  if (billingMode === "dev") return devSubscriptionChange(id, { status: "active" });
  const sub = await creem<Sub>(`/subscriptions/${id}/resume`, { method: "POST" });
  await upsertSubscription(userId, sub);
}

/** Monthly ⇄ yearly. Creem prorates the change on the next invoice. */
export async function switchPlan(userId: string, id: string, plan: "pro-monthly" | "pro-yearly") {
  await ownSubscription(userId, id);
  if (billingMode === "dev") return devSubscriptionChange(id, { plan });
  const sub = await creem<Sub>(`/subscriptions/${id}/upgrade`, { method: "POST", body: JSON.stringify({ product_id: env.creem.products[plan], update_behavior: "proration-charge" }) });
  await upsertSubscription(userId, sub);
}

/** Signed-in Creem customer portal link: card, invoices, billing address. */
export async function portalUrl(userId: string, id: string) {
  const s = await ownSubscription(userId, id);
  if (billingMode === "dev") return "/dashboard/billing";
  const res = await creem<{ customer_portal_link?: string }>("/customers/billing", { method: "POST", body: JSON.stringify({ customer_id: s.customer_id }) });
  return res.customer_portal_link ?? "/dashboard/billing";
}

// ── Webhooks ────────────────────────────────────────────────────────────────

export function verifySignature(raw: string, signature: string | null) {
  if (!env.creem.webhookSecret || !signature) return false;
  const digest = createHmac("sha256", env.creem.webhookSecret).update(raw).digest("hex");
  return digest.length === signature.length && timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

type Ref = string | { id: string; email?: string } | null | undefined;
type Sub = {
  id: string;
  product: Ref;
  customer: Ref;
  status: string;
  current_period_end_date?: string | null;
  next_transaction_date?: string | null;
  canceled_at?: string | null;
  metadata?: { user_id?: string } | null;
  last_transaction?: { id: string; amount_paid?: number; amount?: number; currency?: string; status?: string; created_at?: number } | null;
};
type Order = { id: string; product: Ref; amount_paid?: number; amount?: number; currency?: string; status: string; type: string; created_at?: string };
type Event = { id: string; eventType: string; object: Record<string, unknown> & { metadata?: { user_id?: string } | null } };

const idOf = (r: Ref) => (typeof r === "string" ? r : r?.id ?? null);
const ts = (v: unknown) => (typeof v === "string" && v ? new Date(v) : typeof v === "number" ? new Date(v) : null);

/** Creem's statuses in the vocabulary public.plan_of and the dashboard use (the Lemon Squeezy one they were written for). */
function localStatus(s: Sub) {
  switch (s.status) {
    case "trialing": return { status: "on_trial", ends: null };
    case "scheduled_cancel": return { status: "cancelled", ends: ts(s.current_period_end_date) };
    case "canceled": return { status: "expired", ends: ts(s.canceled_at) ?? new Date() };
    default: return { status: s.status, ends: null }; // active | past_due | unpaid | paused
  }
}

async function upsertSubscription(userId: string, s: Sub) {
  const product = idOf(s.product);
  const plan = planForProduct(product);
  if (!plan || plan === "lifetime") throw new Error(`Unknown subscription product ${product}`);
  const { status, ends } = localStatus(s);
  const renews = status === "active" || status === "on_trial" ? ts(s.next_transaction_date) ?? ts(s.current_period_end_date) : null;
  await db()`
    insert into public.subscriptions (id, user_id, customer_id, variant_id, plan, status, renews_at, ends_at, updated_at)
    values (${s.id}, ${userId}, ${idOf(s.customer) ?? ""}, ${product}, ${plan}, ${status}, ${renews}, ${ends}, now())
    on conflict (id) do update set customer_id = coalesce(nullif(excluded.customer_id, ''), subscriptions.customer_id), variant_id = excluded.variant_id,
      plan = excluded.plan, status = excluded.status, renews_at = excluded.renews_at, ends_at = excluded.ends_at, updated_at = now()`;
}

/** Find the EndureQR user for an event: checkout metadata first (Creem copies it to the subscription), then rows we already linked. */
async function userFor(e: Event): Promise<string> {
  const o = e.object;
  const sub = (o.object === "subscription" ? o : o.subscription) as Sub | string | undefined;
  const fromMeta = o.metadata?.user_id ?? (typeof sub === "object" ? sub?.metadata?.user_id : undefined);
  if (fromMeta) return fromMeta;
  const sql = db();
  const subId = typeof sub === "string" ? sub : sub?.id;
  if (subId) {
    const [s] = await sql<{ user_id: string }[]>`select user_id from public.subscriptions where id = ${subId}`;
    if (s) return s.user_id;
  }
  const customer = o.customer as Ref;
  const customerId = idOf(customer);
  if (customerId) {
    const [s] = await sql<{ user_id: string }[]>`select user_id from public.subscriptions where customer_id = ${customerId} limit 1`;
    if (s) return s.user_id;
  }
  const email = typeof customer === "object" ? customer?.email : undefined;
  if (email) {
    const [p] = await sql<{ id: string }[]>`select id from public.profiles where lower(email) = lower(${email})`;
    if (p) return p.id;
  }
  throw new Error(`No EndureQR user for ${e.eventType} ${e.id}`);
}

async function recordInvoice(userId: string, s: Sub, plan: PlanKey) {
  const t = s.last_transaction;
  if (!t?.id) return;
  await db()`
    insert into public.invoices (id, user_id, description, total_cents, currency, status, created_at)
    values (${`inv-${t.id}`}, ${userId}, ${PLAN_NAME[plan]}, ${Number(t.amount_paid ?? t.amount ?? 0)}, ${t.currency ?? "USD"}, 'paid', ${ts(t.created_at) ?? new Date()})
    on conflict (id) do nothing`;
}

async function handle(e: Event) {
  const o = e.object;
  if (e.eventType === "refund.created") return refund(o);
  if (!e.eventType.startsWith("subscription.") && e.eventType !== "checkout.completed") return;
  const userId = await userFor(e);
  const sql = db();

  if (e.eventType.startsWith("subscription.")) {
    const s = o as unknown as Sub;
    await upsertSubscription(userId, s);
    if (e.eventType === "subscription.paid") await recordInvoice(userId, s, planForProduct(idOf(s.product)) ?? "pro-monthly");
    return;
  }

  // checkout.completed: a subscription start is also announced by subscription.* events; a one-time order (Lifetime) only here
  if (o.subscription && typeof o.subscription === "object") await upsertSubscription(userId, o.subscription as Sub);
  const order = o.order as Order | undefined;
  if (!order || order.type !== "onetime") return;
  const plan = planForProduct(idOf(order.product) ?? idOf(o.product as Ref));
  if (plan !== "lifetime") throw new Error(`Unknown one-time product ${idOf(order.product)}`);
  const cents = Number(order.amount_paid ?? order.amount ?? 0);
  const currency = order.currency ?? "USD";
  await sql`
    insert into public.orders (id, user_id, variant_id, plan, status, total_cents, currency, created_at)
    values (${order.id}, ${userId}, ${env.creem.products.lifetime ?? ""}, 'lifetime', ${order.status}, ${cents}, ${currency}, ${ts(order.created_at) ?? new Date()})
    on conflict (id) do update set status = excluded.status`;
  await sql`
    insert into public.invoices (id, user_id, description, total_cents, currency, status, created_at)
    values (${`order-${order.id}`}, ${userId}, ${PLAN_NAME.lifetime}, ${cents}, ${currency}, ${order.status}, ${ts(order.created_at) ?? new Date()})
    on conflict (id) do update set status = excluded.status`;
  // Lifetime replaces Pro: stop future renewals (the credit was applied at checkout)
  if (order.status === "paid") {
    const subs = await sql<{ id: string }[]>`select id from public.subscriptions where user_id = ${userId} and status in ('active', 'on_trial', 'past_due')`;
    for (const s of subs) await cancelSubscription(userId, s.id).catch((err) => console.error("lifetime: cancel pro failed", s.id, err));
  }
}

/** A refund marks its order (Lifetime) or subscription invoice refunded; access follows the subscription events. */
async function refund(o: Record<string, unknown>) {
  const t = o.transaction as { id?: string; order?: string } | undefined;
  const sql = db();
  if (t?.order) {
    await sql`update public.orders set status = 'refunded' where id = ${t.order}`;
    await sql`update public.invoices set status = 'refunded' where id = ${`order-${t.order}`}`;
  }
  if (t?.id) await sql`update public.invoices set status = 'refunded' where id = ${`inv-${t.id}`}`;
}

/**
 * Verify, de-duplicate (by body hash), store and apply one webhook. Throws on failure so the route answers 500 and
 * Creem retries; a replay of an already-processed body is acknowledged without doing anything.
 */
export async function processWebhook(raw: string) {
  const e = JSON.parse(raw) as Event;
  const id = createHash("sha256").update(raw).digest("hex");
  const sql = db();
  const [seen] = await sql<{ processed_at: Date | null }[]>`
    insert into public.webhook_events (id, event_name, payload) values (${id}, ${e.eventType}, ${sql.json(e as never)})
    on conflict (id) do update set event_name = excluded.event_name returning processed_at`;
  if (seen.processed_at) return { duplicate: true };
  try {
    await handle(e);
    await sql`update public.webhook_events set processed_at = now(), error = null where id = ${id}`;
    return { duplicate: false };
  } catch (err) {
    await sql`update public.webhook_events set error = ${String((err as Error).message).slice(0, 500)} where id = ${id}`;
    throw err;
  }
}

// ── Local development: simulated billing (no Creem account needed) ─────────

export async function devCheckout(userId: string, plan: PlanKey) {
  if (billingMode !== "dev") throw new Error("Simulated billing is only available locally.");
  const sql = db();
  const now = new Date();
  if (plan === "lifetime") {
    const id = `dev-order-${Date.now()}`;
    const cents = PLAN_CENTS.lifetime - (await lifetimeCreditCents(userId));
    await sql`insert into public.orders (id, user_id, variant_id, plan, status, total_cents, currency) values (${id}, ${userId}, 'dev', 'lifetime', 'paid', ${cents}, 'USD')`;
    await sql`insert into public.invoices (id, user_id, description, total_cents, currency, status, created_at) values (${`order-${id}`}, ${userId}, ${PLAN_NAME.lifetime}, ${cents}, 'USD', 'paid', ${now})`;
    await sql`update public.subscriptions set status = 'cancelled', ends_at = renews_at where user_id = ${userId} and status in ('active', 'on_trial')`;
    return;
  }
  const renews = new Date(now.getTime() + (plan === "pro-yearly" ? 365 : 30) * 86400000);
  const id = `dev-sub-${Date.now()}`;
  await sql`
    insert into public.subscriptions (id, user_id, customer_id, variant_id, plan, status, renews_at, card_brand, card_last_four)
    values (${id}, ${userId}, 'dev', 'dev', ${plan}, 'active', ${renews}, 'visa', '4242')`;
  await sql`insert into public.invoices (id, user_id, description, total_cents, currency, status, created_at) values (${`inv-${id}`}, ${userId}, ${PLAN_NAME[plan]}, ${PLAN_CENTS[plan]}, 'USD', 'paid', ${now})`;
}

async function devSubscriptionChange(id: string, change: { status?: "cancelled" | "active"; plan?: PlanKey }) {
  const sql = db();
  if (change.status === "cancelled") await sql`update public.subscriptions set status = 'cancelled', ends_at = renews_at, updated_at = now() where id = ${id}`;
  if (change.status === "active") await sql`update public.subscriptions set status = 'active', ends_at = null, updated_at = now() where id = ${id}`;
  if (change.plan) await sql`update public.subscriptions set plan = ${change.plan}, updated_at = now() where id = ${id}`;
}

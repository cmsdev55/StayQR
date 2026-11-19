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
  (Object.entries(env.polar.products).find(([, v]) => v && v === id)?.[0] as PlanKey | undefined) ?? null;

// ── Polar API ───────────────────────────────────────────────────────────────

async function polar<T = Record<string, unknown>>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${env.polar.apiBase}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${env.polar.accessToken ?? ""}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Polar ${init.method ?? "GET"} ${path} failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
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

/**
 * Polar hosted checkout URL for a plan. The user id is the Polar customer's external id and also rides along as
 * metadata (Polar copies it to the order and subscription), so every webhook can be matched to the user.
 */
export async function createCheckout(user: { id: string; email: string; name: string | null }, plan: PlanKey): Promise<string> {
  const product = env.polar.products[plan];
  if (!product) throw new Error(`POLAR_PRODUCT for ${plan} is not set`);
  const credit = plan === "lifetime" ? await lifetimeCreditCents(user.id) : 0;
  const res = await polar<{ url: string }>("/checkouts/", {
    method: "POST",
    body: JSON.stringify({
      products: [product],
      // the Lifetime credit becomes a one-off price for this checkout only
      ...(credit > 0 ? { prices: { [product]: [{ amount_type: "fixed", price_amount: PLAN_CENTS.lifetime - credit, price_currency: "usd" }] } } : {}),
      customer_email: user.email,
      ...(user.name ? { customer_name: user.name } : {}),
      external_customer_id: user.id,
      success_url: `${env.siteUrl}/dashboard/billing?checkout=done`,
      metadata: { user_id: user.id, plan },
    }),
  });
  return res.url;
}

async function ownSubscription(userId: string, id: string) {
  const [s] = await db()<{ id: string; customer_id: string }[]>`select id, customer_id from public.subscriptions where id = ${id} and user_id = ${userId}`;
  if (!s) throw new Error("Subscription not found");
  return s;
}

/** Cancel at the end of the paid period (Polar keeps it active until then, with cancel_at_period_end). */
export async function cancelSubscription(userId: string, id: string) {
  await ownSubscription(userId, id);
  if (billingMode === "dev") return devSubscriptionChange(id, { status: "cancelled" });
  const sub = await polar<Sub>(`/subscriptions/${id}`, { method: "PATCH", body: JSON.stringify({ cancel_at_period_end: true }) });
  await upsertSubscription(userId, sub);
}

/** Undo a scheduled cancellation. */
export async function resumeSubscription(userId: string, id: string) {
  await ownSubscription(userId, id);
  if (billingMode === "dev") return devSubscriptionChange(id, { status: "active" });
  const sub = await polar<Sub>(`/subscriptions/${id}`, { method: "PATCH", body: JSON.stringify({ cancel_at_period_end: false }) });
  await upsertSubscription(userId, sub);
}

/** Monthly ⇄ yearly. Polar invoices the prorated difference straight away. */
export async function switchPlan(userId: string, id: string, plan: "pro-monthly" | "pro-yearly") {
  await ownSubscription(userId, id);
  if (billingMode === "dev") return devSubscriptionChange(id, { plan });
  const sub = await polar<Sub>(`/subscriptions/${id}`, { method: "PATCH", body: JSON.stringify({ product_id: env.polar.products[plan], proration_behavior: "invoice" }) });
  await upsertSubscription(userId, sub);
}

/** Signed-in Polar customer portal link: card, invoices, billing address. */
export async function portalUrl(userId: string, id: string) {
  const s = await ownSubscription(userId, id);
  if (billingMode === "dev") return "/dashboard/billing";
  const res = await polar<{ customer_portal_url?: string }>("/customer-sessions/", {
    method: "POST",
    body: JSON.stringify({ customer_id: s.customer_id, return_url: `${env.siteUrl}/dashboard/billing` }),
  });
  return res.customer_portal_url ?? "/dashboard/billing";
}

// ── Webhooks ────────────────────────────────────────────────────────────────

/**
 * Standard Webhooks signature (Polar): base64 HMAC-SHA256 of "id.timestamp.body" in webhook-signature as "v1,<sig>".
 * Secrets made since Sep 2026 are standard (whsec_ + base64 key); older ones use the whole string's bytes, so try both.
 */
export function verifySignature(raw: string, h: { id: string | null; timestamp: string | null; signature: string | null }) {
  const secret = env.polar.webhookSecret;
  if (!secret || !h.id || !h.timestamp || !h.signature) return false;
  const t = Number(h.timestamp);
  if (!Number.isFinite(t) || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const keys = [Buffer.from(secret.replace(/^whsec_/, ""), "base64"), Buffer.from(secret, "utf8")];
  const given = h.signature.split(" ").map((p) => p.split(",")).filter(([v, sig]) => v === "v1" && sig).map(([, sig]) => Buffer.from(sig));
  return keys.some((key) => {
    const expected = Buffer.from(createHmac("sha256", key).update(`${h.id}.${h.timestamp}.${raw}`).digest("base64"));
    return given.some((g) => g.length === expected.length && timingSafeEqual(g, expected));
  });
}

type Customer = { id?: string; email?: string; external_id?: string | null } | null | undefined;
type Meta = { user_id?: string; plan?: string } | null | undefined;
type Sub = {
  id: string;
  product_id: string;
  customer_id: string;
  customer?: Customer;
  status: string;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  ends_at?: string | null;
  ended_at?: string | null;
  metadata?: Meta;
};
type Order = {
  id: string;
  status: string; // pending | paid | refunded | partially_refunded
  product_id: string | null;
  subscription_id: string | null;
  customer_id: string;
  customer?: Customer;
  total_amount?: number;
  currency?: string;
  created_at?: string;
  metadata?: Meta;
};
type Event = { type: string; timestamp?: string; data: Record<string, unknown> & { customer?: Customer; customer_id?: string; metadata?: Meta } };

const ts = (v: unknown) => (typeof v === "string" && v ? new Date(v) : null);

/** Polar's statuses in the vocabulary public.plan_of and the dashboard use (the Lemon Squeezy one they were written for). */
function localStatus(s: Sub): { status: string; ends: Date | null } {
  if ((s.status === "active" || s.status === "trialing") && s.cancel_at_period_end) return { status: "cancelled", ends: ts(s.ends_at) ?? ts(s.current_period_end) };
  switch (s.status) {
    case "trialing": return { status: "on_trial", ends: null };
    case "canceled": {
      const ends = ts(s.ended_at) ?? ts(s.ends_at) ?? new Date();
      return ends > new Date() ? { status: "cancelled", ends } : { status: "expired", ends };
    }
    case "incomplete": return { status: "unpaid", ends: null }; // first payment not through yet: no access
    case "incomplete_expired":
    case "trial_ended": return { status: "expired", ends: new Date() };
    default: return { status: s.status, ends: null }; // active | past_due | unpaid | paused
  }
}

async function upsertSubscription(userId: string, s: Sub) {
  const plan = planForProduct(s.product_id);
  if (!plan || plan === "lifetime") throw new Error(`Unknown subscription product ${s.product_id}`);
  const { status, ends } = localStatus(s);
  const renews = status === "active" || status === "on_trial" ? ts(s.current_period_end) : null;
  await db()`
    insert into public.subscriptions (id, user_id, customer_id, variant_id, plan, status, renews_at, ends_at, updated_at)
    values (${s.id}, ${userId}, ${s.customer_id ?? s.customer?.id ?? ""}, ${s.product_id}, ${plan}, ${status}, ${renews}, ${ends}, now())
    on conflict (id) do update set customer_id = coalesce(nullif(excluded.customer_id, ''), subscriptions.customer_id), variant_id = excluded.variant_id,
      plan = excluded.plan, status = excluded.status, renews_at = excluded.renews_at, ends_at = excluded.ends_at, updated_at = now()`;
}

/** Find the EndureQR user for an event: the customer's external id (our user id), checkout metadata, then rows we already linked. */
async function userFor(e: Event): Promise<string> {
  const o = e.data;
  const direct = o.customer?.external_id ?? o.metadata?.user_id;
  if (direct) return direct;
  const sql = db();
  const subId = e.type.startsWith("subscription.") ? (o.id as string) : (o.subscription_id as string | null | undefined);
  if (subId) {
    const [s] = await sql<{ user_id: string }[]>`select user_id from public.subscriptions where id = ${subId}`;
    if (s) return s.user_id;
  }
  const customerId = o.customer_id ?? o.customer?.id;
  if (customerId) {
    const [s] = await sql<{ user_id: string }[]>`select user_id from public.subscriptions where customer_id = ${customerId} limit 1`;
    if (s) return s.user_id;
  }
  const email = o.customer?.email;
  if (email) {
    const [p] = await sql<{ id: string }[]>`select id from public.profiles where lower(email) = lower(${email})`;
    if (p) return p.id;
  }
  throw new Error(`No EndureQR user for ${e.type} ${String(o.id)}`);
}

async function handle(e: Event) {
  if (e.type === "order.refunded") return refund(e.data as unknown as Order);
  if (!e.type.startsWith("subscription.") && e.type !== "order.paid") return;
  const userId = await userFor(e);
  const sql = db();

  if (e.type.startsWith("subscription.")) return upsertSubscription(userId, e.data as unknown as Sub);

  // order.paid: a subscription's first payment or a renewal becomes an invoice; a one-time order is Lifetime
  const order = e.data as unknown as Order;
  const cents = Number(order.total_amount ?? 0);
  const currency = (order.currency ?? "usd").toUpperCase();
  const at = ts(order.created_at) ?? new Date();
  const plan = planForProduct(order.product_id);
  if (order.subscription_id) {
    await sql`
      insert into public.invoices (id, user_id, description, total_cents, currency, status, created_at)
      values (${`inv-${order.id}`}, ${userId}, ${PLAN_NAME[plan ?? "pro-monthly"]}, ${cents}, ${currency}, 'paid', ${at})
      on conflict (id) do nothing`;
    return;
  }
  if (plan !== "lifetime") throw new Error(`Unknown one-time product ${order.product_id}`);
  await sql`
    insert into public.orders (id, user_id, variant_id, plan, status, total_cents, currency, created_at)
    values (${order.id}, ${userId}, ${order.product_id ?? ""}, 'lifetime', 'paid', ${cents}, ${currency}, ${at})
    on conflict (id) do update set status = excluded.status`;
  await sql`
    insert into public.invoices (id, user_id, description, total_cents, currency, status, created_at)
    values (${`order-${order.id}`}, ${userId}, ${PLAN_NAME.lifetime}, ${cents}, ${currency}, 'paid', ${at})
    on conflict (id) do update set status = excluded.status`;
  // Lifetime replaces Pro: stop future renewals (the credit was applied at checkout)
  const subs = await sql<{ id: string }[]>`select id from public.subscriptions where user_id = ${userId} and status in ('active', 'on_trial', 'past_due')`;
  for (const s of subs) await cancelSubscription(userId, s.id).catch((err) => console.error("lifetime: cancel pro failed", s.id, err));
}

/** A full refund removes Lifetime and marks the invoice refunded; subscription access follows the subscription events. */
async function refund(o: Order) {
  const sql = db();
  const status = o.status === "refunded" ? "refunded" : "partially_refunded";
  if (status === "refunded") await sql`update public.orders set status = 'refunded' where id = ${o.id}`;
  await sql`update public.invoices set status = ${status} where id in (${`order-${o.id}`}, ${`inv-${o.id}`})`;
}

/**
 * De-duplicate (by body hash), store and apply one verified webhook. Throws on failure so the route answers 500 and
 * Polar retries; a replay of an already-processed body is acknowledged without doing anything.
 */
export async function processWebhook(raw: string) {
  const e = JSON.parse(raw) as Event;
  const id = createHash("sha256").update(raw).digest("hex");
  const sql = db();
  const [seen] = await sql<{ processed_at: Date | null }[]>`
    insert into public.webhook_events (id, event_name, payload) values (${id}, ${e.type}, ${sql.json(e as never)})
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

// ── Local development: simulated billing (no Polar account needed) ─────────

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

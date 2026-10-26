import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { LIFETIME, PRO } from "@/content/plans";
import { db } from "./db";
import { billingMode, env } from "./env";

export type PlanKey = "pro-monthly" | "pro-yearly" | "lifetime";
export const PLAN_KEYS: PlanKey[] = ["pro-monthly", "pro-yearly", "lifetime"];
export const isPlanKey = (v: unknown): v is PlanKey => PLAN_KEYS.includes(v as PlanKey);
export const PLAN_NAME: Record<PlanKey, string> = { "pro-monthly": "StayQR Pro · monthly", "pro-yearly": "StayQR Pro · yearly", lifetime: "StayQR Lifetime" };
const PLAN_CENTS: Record<PlanKey, number> = { "pro-monthly": Math.round(PRO.monthly * 100), "pro-yearly": PRO.yearly * 100, lifetime: LIFETIME * 100 };

const planForVariant = (id: string | number): PlanKey | null =>
  (Object.entries(env.lemon.variants).find(([, v]) => v && String(v) === String(id))?.[0] as PlanKey | undefined) ?? null;

// ── Lemon Squeezy API ───────────────────────────────────────────────────────

async function ls<T = { data: { id: string; attributes: Record<string, unknown> } }>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`https://api.lemonsqueezy.com/v1${path}`, {
    ...init,
    headers: { Accept: "application/vnd.api+json", "Content-Type": "application/vnd.api+json", Authorization: `Bearer ${env.lemon.apiKey}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Lemon Squeezy ${init.method ?? "GET"} ${path} failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
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

/** Hosted checkout URL for a plan. The user id rides along as custom data and comes back on every webhook. */
export async function createCheckout(user: { id: string; email: string; name: string | null }, plan: PlanKey): Promise<string> {
  const variant = env.lemon.variants[plan];
  if (!variant) throw new Error(`LEMONSQUEEZY_VARIANT for ${plan} is not set`);
  const credit = plan === "lifetime" ? await lifetimeCreditCents(user.id) : 0;
  const body = {
    data: {
      type: "checkouts",
      attributes: {
        ...(credit > 0 ? { custom_price: PLAN_CENTS.lifetime - credit } : {}),
        checkout_data: { email: user.email, name: user.name ?? undefined, custom: { user_id: user.id } },
        product_options: { enabled_variants: [Number(variant)], redirect_url: `${env.siteUrl}/dashboard/billing?checkout=done` },
        checkout_options: { embed: false, media: false },
      },
      relationships: { store: { data: { type: "stores", id: String(env.lemon.storeId) } }, variant: { data: { type: "variants", id: String(variant) } } },
    },
  };
  const res = await ls("/checkouts", { method: "POST", body: JSON.stringify(body) });
  return res.data.attributes.url as string;
}

async function ownSubscription(userId: string, id: string) {
  const [s] = await db()<{ id: string }[]>`select id from public.subscriptions where id = ${id} and user_id = ${userId}`;
  if (!s) throw new Error("Subscription not found");
}

/** Cancel at the end of the paid period (Lemon Squeezy keeps it active until ends_at). */
export async function cancelSubscription(userId: string, id: string) {
  await ownSubscription(userId, id);
  if (billingMode === "dev") return devSubscriptionChange(id, { status: "cancelled" });
  const res = await ls(`/subscriptions/${id}`, { method: "DELETE" });
  await upsertSubscription(userId, res.data.id, res.data.attributes);
}

export async function resumeSubscription(userId: string, id: string) {
  await ownSubscription(userId, id);
  if (billingMode === "dev") return devSubscriptionChange(id, { status: "active" });
  const res = await ls(`/subscriptions/${id}`, { method: "PATCH", body: JSON.stringify({ data: { type: "subscriptions", id, attributes: { cancelled: false } } }) });
  await upsertSubscription(userId, res.data.id, res.data.attributes);
}

/** Monthly ⇄ yearly. Lemon Squeezy prorates the change on the next invoice. */
export async function switchPlan(userId: string, id: string, plan: "pro-monthly" | "pro-yearly") {
  await ownSubscription(userId, id);
  if (billingMode === "dev") return devSubscriptionChange(id, { plan });
  const variant = env.lemon.variants[plan];
  const res = await ls(`/subscriptions/${id}`, { method: "PATCH", body: JSON.stringify({ data: { type: "subscriptions", id, attributes: { variant_id: Number(variant) } } }) });
  await upsertSubscription(userId, res.data.id, res.data.attributes);
}

/** Fresh signed customer-portal URL (the stored one expires after 24 hours). */
export async function portalUrl(userId: string, id: string) {
  await ownSubscription(userId, id);
  if (billingMode === "dev") return "/dashboard/billing";
  const res = await ls(`/subscriptions/${id}`);
  const urls = res.data.attributes.urls as { customer_portal?: string; update_payment_method?: string };
  return urls.customer_portal ?? urls.update_payment_method ?? "/dashboard/billing";
}

// ── Webhooks ────────────────────────────────────────────────────────────────

export function verifySignature(raw: string, signature: string | null) {
  if (!env.lemon.webhookSecret || !signature) return false;
  const digest = createHmac("sha256", env.lemon.webhookSecret).update(raw).digest("hex");
  return digest.length === signature.length && timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

type Attrs = Record<string, unknown>;
type Event = { meta: { event_name: string; custom_data?: { user_id?: string } }; data: { type: string; id: string; attributes: Attrs } };

const ts = (v: unknown) => (typeof v === "string" && v ? new Date(v) : null);

async function upsertSubscription(userId: string, id: string, a: Attrs) {
  const plan = planForVariant(a.variant_id as number);
  if (!plan || plan === "lifetime") throw new Error(`Unknown subscription variant ${a.variant_id}`);
  const urls = (a.urls ?? {}) as { customer_portal?: string; update_payment_method?: string };
  await db()`
    insert into public.subscriptions (id, user_id, customer_id, variant_id, plan, status, renews_at, ends_at, card_brand, card_last_four, portal_url, update_payment_url, updated_at)
    values (${id}, ${userId}, ${String(a.customer_id)}, ${String(a.variant_id)}, ${plan}, ${String(a.status)}, ${ts(a.renews_at)}, ${ts(a.ends_at)},
            ${(a.card_brand as string) ?? null}, ${(a.card_last_four as string) ?? null}, ${urls.customer_portal ?? null}, ${urls.update_payment_method ?? null}, now())
    on conflict (id) do update set customer_id = excluded.customer_id, variant_id = excluded.variant_id, plan = excluded.plan, status = excluded.status,
      renews_at = excluded.renews_at, ends_at = excluded.ends_at, card_brand = coalesce(excluded.card_brand, subscriptions.card_brand),
      card_last_four = coalesce(excluded.card_last_four, subscriptions.card_last_four), portal_url = coalesce(excluded.portal_url, subscriptions.portal_url),
      update_payment_url = coalesce(excluded.update_payment_url, subscriptions.update_payment_url), updated_at = now()`;
}

/** Find the StayQR user for an event: custom data first, then any row we already linked. */
async function userFor(e: Event): Promise<string> {
  const fromCustom = e.meta.custom_data?.user_id;
  if (fromCustom) return fromCustom;
  const a = e.data.attributes;
  const subId = e.data.type === "subscriptions" ? e.data.id : a.subscription_id ? String(a.subscription_id) : null;
  if (subId) {
    const [s] = await db()<{ user_id: string }[]>`select user_id from public.subscriptions where id = ${subId}`;
    if (s) return s.user_id;
  }
  if (a.customer_id) {
    const [s] = await db()<{ user_id: string }[]>`select user_id from public.subscriptions where customer_id = ${String(a.customer_id)} limit 1`;
    if (s) return s.user_id;
  }
  if (a.user_email) {
    const [p] = await db()<{ id: string }[]>`select id from public.profiles where lower(email) = lower(${String(a.user_email)})`;
    if (p) return p.id;
  }
  throw new Error(`No StayQR user for ${e.meta.event_name} ${e.data.id}`);
}

async function handle(e: Event) {
  const name = e.meta.event_name;
  const a = e.data.attributes;
  const userId = await userFor(e);
  const sql = db();

  if (e.data.type === "subscriptions") {
    await upsertSubscription(userId, e.data.id, a);
    return;
  }

  if (e.data.type === "orders") {
    const item = (a.first_order_item ?? {}) as { variant_id?: number; product_name?: string };
    const plan = planForVariant(item.variant_id ?? "");
    if (!plan) throw new Error(`Unknown order variant ${item.variant_id}`);
    const status = name === "order_refunded" || a.refunded ? "refunded" : String(a.status);
    await sql`
      insert into public.orders (id, user_id, variant_id, plan, status, total_cents, currency, receipt_url, created_at)
      values (${e.data.id}, ${userId}, ${String(item.variant_id)}, ${plan}, ${status}, ${Number(a.total)}, ${String(a.currency)},
              ${((a.urls ?? {}) as { receipt?: string }).receipt ?? null}, ${ts(a.created_at) ?? new Date()})
      on conflict (id) do update set status = excluded.status`;
    if (plan === "lifetime") {
      await sql`
        insert into public.invoices (id, user_id, description, total_cents, currency, status, invoice_url, created_at)
        values (${`order-${e.data.id}`}, ${userId}, ${PLAN_NAME.lifetime}, ${Number(a.total)}, ${String(a.currency)}, ${status}, ${((a.urls ?? {}) as { receipt?: string }).receipt ?? null}, ${ts(a.created_at) ?? new Date()})
        on conflict (id) do update set status = excluded.status`;
      // Lifetime replaces Pro: stop future renewals (the credit was applied at checkout)
      if (name === "order_created" && status === "paid") {
        const subs = await sql<{ id: string }[]>`select id from public.subscriptions where user_id = ${userId} and status in ('active', 'on_trial', 'past_due')`;
        for (const s of subs) await cancelSubscription(userId, s.id).catch((err) => console.error("lifetime: cancel pro failed", s.id, err));
      }
    }
    return;
  }

  if (e.data.type === "subscription-invoices") {
    const [sub] = await sql<{ plan: PlanKey }[]>`select plan from public.subscriptions where id = ${String(a.subscription_id)}`;
    const urls = (a.urls ?? {}) as { invoice_url?: string };
    const status = name === "subscription_payment_refunded" || a.refunded ? "refunded" : String(a.status);
    await sql`
      insert into public.invoices (id, user_id, description, total_cents, currency, status, invoice_url, created_at)
      values (${`inv-${e.data.id}`}, ${userId}, ${PLAN_NAME[sub?.plan ?? "pro-monthly"]}, ${Number(a.total)}, ${String(a.currency)}, ${status}, ${urls.invoice_url ?? null}, ${ts(a.created_at) ?? new Date()})
      on conflict (id) do update set status = excluded.status, invoice_url = coalesce(excluded.invoice_url, invoices.invoice_url)`;
    return;
  }
}

/**
 * Verify, de-duplicate (by body hash), store and apply one webhook. Throws on failure so the route answers 500 and
 * Lemon Squeezy retries; a replay of an already-processed body is acknowledged without doing anything.
 */
export async function processWebhook(raw: string) {
  const e = JSON.parse(raw) as Event;
  const id = createHash("sha256").update(raw).digest("hex");
  const sql = db();
  const [seen] = await sql<{ processed_at: Date | null }[]>`
    insert into public.webhook_events (id, event_name, payload) values (${id}, ${e.meta.event_name}, ${sql.json(e as never)})
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

// ── Local development: simulated billing (no Lemon Squeezy account needed) ─

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

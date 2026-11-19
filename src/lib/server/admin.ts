import "server-only";
import { notFound } from "next/navigation";
import { PRO } from "@/content/plans";
import { getUser, type SessionUser } from "./auth";
import { db } from "./db";
import { env } from "./env";

/**
 * The admin panel (/admin). Access: a signed-in account with a confirmed email listed in ADMIN_EMAILS. Anyone else
 * gets a plain 404, so the panel's existence isn't revealed. Every write is recorded in public.admin_actions.
 */

export const isAdmin = (u: Pick<SessionUser, "email" | "verified"> | null) => !!u && u.verified && env.adminEmails.includes(u.email.toLowerCase());

export async function requireAdmin() {
  const u = await getUser();
  if (!isAdmin(u)) notFound();
  return u!;
}

export async function logAdmin(admin: SessionUser, action: string, target: { id?: string | null; email?: string | null } = {}, details: Record<string, unknown> = {}) {
  await db()`insert into public.admin_actions (admin_email, action, target_user, target_email, details)
             values (${admin.email}, ${action}, ${target.id ?? null}, ${target.email ?? null}, ${db().json(details as never)})`;
}

// ── Plan and status, in the words the panel shows ───────────────────────────

export type PlanFilter = "all" | "free" | "pro-monthly" | "pro-yearly" | "lifetime";
export type StatusFilter = "all" | "active" | "cancelling" | "past_due" | "ended" | "suspended";
export const PLAN_FILTERS: PlanFilter[] = ["all", "free", "pro-monthly", "pro-yearly", "lifetime"];
export const STATUS_FILTERS: StatusFilter[] = ["all", "active", "cancelling", "past_due", "ended", "suspended"];

export const PLAN_LABEL: Record<string, string> = { free: "Free", "pro-monthly": "Pro monthly", "pro-yearly": "Pro yearly", lifetime: "Lifetime" };
export const STATUS_LABEL: Record<string, string> = {
  active: "Active", cancelling: "Cancelling", past_due: "Payment failed", ended: "Ended", free: "Free", suspended: "Suspended",
};

type PlanCols = { tier: "pro" | "lifetime" | null; plan: string | null; status: string | null; had_sub: boolean; suspended_at: Date | null };

/** One label per account: suspended wins, then the current plan's state, then "ended" for a lapsed subscriber. */
export function accountStatus(r: PlanCols): keyof typeof STATUS_LABEL {
  if (r.suspended_at) return "suspended";
  if (r.tier === "lifetime") return "active";
  if (r.tier === "pro") return r.status === "cancelled" ? "cancelling" : r.status === "past_due" ? "past_due" : "active";
  return r.had_sub ? "ended" : "free";
}
export const accountPlan = (r: PlanCols) => (r.tier === "lifetime" ? "lifetime" : r.tier === "pro" && r.plan ? r.plan : "free");

// ── Queries ──────────────────────────────────────────────────────────────────

export async function overview() {
  const sql = db();
  const [[c], [rev], recentUsers, recentPayments] = await Promise.all([
    sql<{ users: number; new7: number; new30: number; monthly: number; yearly: number; lifetime: number; cancelling: number; past_due: number; suspended: number; codes: number; scans30: number }[]>`
      with x as (select p.id, p.created_at, p.suspended_at, pl.tier, pl.plan, pl.status
                   from public.profiles p left join lateral public.plan_of(p.id) pl on true)
      select count(*)::int as users,
             count(*) filter (where created_at > now() - interval '7 days')::int as new7,
             count(*) filter (where created_at > now() - interval '30 days')::int as new30,
             count(*) filter (where tier = 'pro' and plan = 'pro-monthly' and status <> 'cancelled')::int as monthly,
             count(*) filter (where tier = 'pro' and plan = 'pro-yearly' and status <> 'cancelled')::int as yearly,
             count(*) filter (where tier = 'lifetime')::int as lifetime,
             count(*) filter (where tier = 'pro' and status = 'cancelled')::int as cancelling,
             count(*) filter (where tier = 'pro' and status = 'past_due')::int as past_due,
             count(*) filter (where suspended_at is not null)::int as suspended,
             (select count(*)::int from public.codes) as codes,
             (select count(*)::int from public.scans where scanned_at > now() - interval '30 days') as scans30
        from x`,
    sql<{ all_time: number; last30: number }[]>`
      select coalesce(sum(total_cents), 0)::int as all_time,
             coalesce(sum(total_cents) filter (where created_at > now() - interval '30 days'), 0)::int as last30
        from public.invoices where status = 'paid'`,
    sql<{ id: string; email: string; name: string | null; created_at: Date }[]>`
      select id, email, name, created_at from public.profiles order by created_at desc limit 8`,
    sql<{ user_id: string; email: string | null; description: string; total_cents: number; currency: string; status: string; created_at: Date }[]>`
      select i.user_id, p.email, i.description, i.total_cents, i.currency, i.status, i.created_at
        from public.invoices i left join public.profiles p on p.id = i.user_id
       order by i.created_at desc limit 8`,
  ]);
  // renewing plans only: a cancelling subscription won't bring in another payment
  const mrr = c.monthly * PRO.monthly + c.yearly * (PRO.yearly / 12);
  return { ...c, mrr, revenueAllTime: rev.all_time, revenue30: rev.last30, recentUsers, recentPayments };
}

export type UserFilters = { q?: string; plan?: PlanFilter; status?: StatusFilter; page?: number };
export const PAGE_SIZE = 50;

/** Filters from the query string; anything unknown falls back to "all". */
export function readUserFilters(s: Record<string, string | undefined>) {
  return {
    q: s.q?.slice(0, 100) ?? "",
    plan: (PLAN_FILTERS as string[]).includes(s.plan ?? "") ? (s.plan as PlanFilter) : "all",
    status: (STATUS_FILTERS as string[]).includes(s.status ?? "") ? (s.status as StatusFilter) : "all",
    page: Math.max(1, Number.parseInt(s.page ?? "1", 10) || 1),
  } satisfies UserFilters;
}

export type UserRow = {
  id: string; email: string; name: string | null; created_at: Date; verified: boolean; suspended_at: Date | null;
  tier: "pro" | "lifetime" | null; plan: string | null; status: string | null; renews_at: Date | null; ends_at: Date | null;
  had_sub: boolean; codes: number; last_seen: Date | null;
};

/** Users matching the filters (all of them when `limit` is null, for CSV export). */
export async function listUsers(f: UserFilters, limit: number | null = PAGE_SIZE) {
  const sql = db();
  const q = f.q?.trim().slice(0, 100);
  const like = q ? `%${q.replace(/[\\%_]/g, (m) => `\\${m}`)}%` : null;
  const plan = f.plan ?? "all", status = f.status ?? "all";
  const where = sql`
    where true
    ${like ? sql`and (x.email ilike ${like} or coalesce(x.name, '') ilike ${like} or x.id::text = ${q!})` : sql``}
    ${plan === "free" ? sql`and x.tier is null` : plan === "lifetime" ? sql`and x.tier = 'lifetime'` : plan !== "all" ? sql`and x.tier = 'pro' and x.plan = ${plan}` : sql``}
    ${status === "suspended" ? sql`and x.suspended_at is not null`
      : status === "active" ? sql`and x.suspended_at is null and (x.tier = 'lifetime' or (x.tier = 'pro' and x.status in ('active', 'on_trial')))`
      : status === "cancelling" ? sql`and x.suspended_at is null and x.tier = 'pro' and x.status = 'cancelled'`
      : status === "past_due" ? sql`and x.suspended_at is null and x.tier = 'pro' and x.status = 'past_due'`
      : status === "ended" ? sql`and x.suspended_at is null and x.tier is null and x.had_sub`
      : sql``}`;
  const base = sql`
    with x as (
      select p.id, p.email, p.name, p.created_at, p.email_verified_at is not null as verified, p.suspended_at,
             pl.tier, pl.plan, pl.status, pl.renews_at, pl.ends_at,
             exists (select 1 from public.subscriptions s where s.user_id = p.id) as had_sub,
             (select count(*)::int from public.codes c where c.user_id = p.id) as codes,
             (select max(last_seen_at) from public.sessions s where s.user_id = p.id) as last_seen
        from public.profiles p left join lateral public.plan_of(p.id) pl on true)`;
  const page = Math.max(1, f.page ?? 1);
  const [rows, [{ total }]] = await Promise.all([
    limit === null
      ? sql<UserRow[]>`${base} select * from x ${where} order by x.created_at desc`
      : sql<UserRow[]>`${base} select * from x ${where} order by x.created_at desc limit ${limit} offset ${(page - 1) * limit}`,
    sql<{ total: number }[]>`${base} select count(*)::int as total from x ${where}`,
  ]);
  return { rows, total, page };
}

export async function userDetail(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const sql = db();
  const [[p], subs, orders, invoices, codes, sessions, log] = await Promise.all([
    sql<(UserRow & { timezone: string; google: boolean; has_password: boolean; suspended_reason: string | null })[]>`
      select p.id, p.email, p.name, p.timezone, p.created_at, p.email_verified_at is not null as verified,
             p.suspended_at, p.suspended_reason, p.google_sub is not null as google, p.password_hash is not null as has_password,
             pl.tier, pl.plan, pl.status, pl.renews_at, pl.ends_at,
             exists (select 1 from public.subscriptions s where s.user_id = p.id) as had_sub, 0 as codes, null::timestamptz as last_seen
        from public.profiles p left join lateral public.plan_of(p.id) pl on true where p.id = ${id}`,
    sql<{ id: string; plan: string; status: string; renews_at: Date | null; ends_at: Date | null; card_brand: string | null; card_last_four: string | null; created_at: Date }[]>`
      select id, plan, status, renews_at, ends_at, card_brand, card_last_four, created_at from public.subscriptions where user_id = ${id} order by created_at desc`,
    sql<{ id: string; plan: string; status: string; total_cents: number; currency: string; variant_id: string; created_at: Date }[]>`
      select id, plan, status, total_cents, currency, variant_id, created_at from public.orders where user_id = ${id} order by created_at desc`,
    sql<{ id: string; description: string; total_cents: number; currency: string; status: string; created_at: Date }[]>`
      select id, description, total_cents, currency, status, created_at from public.invoices where user_id = ${id} order by created_at desc limit 50`,
    sql<{ id: string; slug: string; name: string; destination: string; paused: boolean; disabled_at: Date | null; disabled_reason: string | null; created_at: Date; scans30: number }[]>`
      select c.id, c.slug, c.name, c.destination, c.paused, c.disabled_at, c.disabled_reason, c.created_at,
             (select count(*)::int from public.scans s where s.code_id = c.id and s.scanned_at > now() - interval '30 days') as scans30
        from public.codes c where c.user_id = ${id} order by c.created_at desc`,
    sql<{ n: number; last_seen: Date | null }[]>`select count(*)::int as n, max(last_seen_at) as last_seen from public.sessions where user_id = ${id} and expires_at > now()`,
    sql<AdminLogRow[]>`select id, admin_email, action, target_user, target_email, details, created_at from public.admin_actions where target_user = ${id} order by created_at desc limit 50`,
  ]);
  if (!p) return null;
  return { profile: p, subs, orders, invoices, codes, sessions: sessions[0], log };
}

export type AdminLogRow = { id: string; admin_email: string; action: string; target_user: string | null; target_email: string | null; details: Record<string, unknown>; created_at: Date };

export async function adminLog(limit = 200) {
  return db()<AdminLogRow[]>`select id, admin_email, action, target_user, target_email, details, created_at from public.admin_actions order by created_at desc limit ${limit}`;
}

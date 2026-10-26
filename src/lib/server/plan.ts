import "server-only";
import { cache } from "react";
import type { Plan } from "@/lib/dashboard-types";
import { db } from "./db";

type Row = { tier: "pro" | "lifetime"; plan: Plan["plan"]; status: string; renews_at: Date | null; ends_at: Date | null };

/** What this user may do right now (one SQL function decides: public.plan_of). */
export const getPlan = cache(async (userId: string): Promise<Plan> => {
  const sql = db();
  const [p] = await sql<Row[]>`select tier, plan, status, renews_at, ends_at from public.plan_of(${userId})`;
  if (p) return { tier: p.tier, plan: p.plan, status: p.status, renewsAt: p.renews_at?.toISOString() ?? null, endsAt: p.ends_at?.toISOString() ?? null, canEdit: true, lapsed: false };
  // no current plan: did they ever have one?
  const [last] = await sql<{ ends_at: Date | null; plan: Plan["plan"] }[]>`
    select coalesce(ends_at, updated_at) as ends_at, plan from public.subscriptions where user_id = ${userId}
    order by coalesce(ends_at, updated_at) desc limit 1`;
  return { tier: "free", plan: last?.plan ?? null, status: last ? "expired" : null, renewsAt: null, endsAt: last?.ends_at?.toISOString() ?? null, canEdit: false, lapsed: !!last };
});

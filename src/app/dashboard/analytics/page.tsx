import type { Metadata } from "next";
import { AnalyticsView } from "@/components/dashboard/analytics-view";
import type { Range } from "@/lib/dashboard-types";
import { getAnalytics } from "@/lib/server/analytics";
import { requireUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { getPlan } from "@/lib/server/plan";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ code?: string; range?: string }> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const plan = await getPlan(user.id);
  const range = ([7, 30, 90] as const).find((r) => String(r) === sp.range) ?? (30 as Range);
  const [data, codes] = await Promise.all([
    getAnalytics(user.id, { range, code: sp.code ?? "all", tz: user.timezone, until: plan.lapsed ? plan.endsAt : null }),
    db()<{ id: string; name: string }[]>`select id, name from public.codes where user_id = ${user.id} order by created_at desc`,
  ]);
  return <AnalyticsView data={data} codes={codes} />;
}

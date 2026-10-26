import { scansCsv } from "@/lib/server/analytics";
import { getUser } from "@/lib/server/auth";
import { getPlan } from "@/lib/server/plan";

export const dynamic = "force-dynamic";

/** CSV of raw scans for one code or all codes (Pro: last 12 months; Lifetime: everything kept). */
export async function GET(req: Request) {
  const user = await getUser();
  if (!user) return new Response("Sign in first", { status: 401 });
  const plan = await getPlan(user.id);
  const url = new URL(req.url);
  const csv = await scansCsv(user.id, url.searchParams.get("code") ?? "all", plan.tier === "lifetime" ? 36500 : 366);
  return new Response(csv, {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="stayqr-scans-${new Date().toISOString().slice(0, 10)}.csv"`, "cache-control": "no-store" },
  });
}

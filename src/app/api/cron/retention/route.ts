import { db } from "@/lib/server/db";
import { env } from "@/lib/server/env";

export const dynamic = "force-dynamic";

/**
 * Daily (vercel.json): delete scan rows older than 12 months unless the owner has Lifetime (Privacy: "How long we keep it"),
 * and webhook payloads older than 90 days.
 */
export async function GET(req: Request) {
  if (!env.cronSecret || req.headers.get("authorization") !== `Bearer ${env.cronSecret}`) return new Response("Unauthorized", { status: 401 });
  const sql = db();
  const scans = await sql`
    delete from public.scans s using public.codes c
     where c.id = s.code_id and s.scanned_at < now() - interval '12 months'
       and not exists (select 1 from public.orders o where o.user_id = c.user_id and o.plan = 'lifetime' and o.status = 'paid')`;
  const events = await sql`delete from public.webhook_events where received_at < now() - interval '90 days' and processed_at is not null`;
  return Response.json({ scansDeleted: scans.count, eventsDeleted: events.count });
}

import { isAdmin } from "@/lib/server/admin";
import { getUser } from "@/lib/server/auth";
import { getPlan } from "@/lib/server/plan";

export const dynamic = "force-dynamic";

export type SessionInfo = { user: { name: string | null; email: string; plan: "Free" | "Pro" | "Lifetime"; admin: boolean } | null };

/**
 * Who is signed in, for the public site's header. The marketing pages are static, so the header asks here after
 * load instead of the pages reading the session cookie (which would make every page dynamic). Never cached.
 */
export async function GET() {
  const u = await getUser();
  let body: SessionInfo = { user: null };
  if (u) {
    const plan = await getPlan(u.id);
    body = { user: { name: u.name, email: u.email, plan: plan.tier === "lifetime" ? "Lifetime" : plan.pro ? "Pro" : "Free", admin: isAdmin(u) } };
  }
  return Response.json(body, { headers: { "Cache-Control": "private, no-store" } });
}

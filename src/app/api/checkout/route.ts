import { NextResponse } from "next/server";
import { getUser, isLocalRequest } from "@/lib/server/auth";
import { createCheckout, devCheckout, isPlanKey } from "@/lib/server/billing";
import { billingMode } from "@/lib/server/env";
import { getPlan } from "@/lib/server/plan";

export const dynamic = "force-dynamic";

/**
 * GET /api/checkout?plan=pro-yearly → Polar hosted checkout (signs in first if needed).
 * With &format=json it answers { url } instead, for CheckoutButton.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const plan = url.searchParams.get("plan");
  const json = url.searchParams.get("format") === "json";
  const go = (to: string) => (json ? NextResponse.json({ url: new URL(to, url).toString() }) : NextResponse.redirect(new URL(to, url)));
  if (!isPlanKey(plan)) return go("/pricing");
  const user = await getUser();
  if (!user) return go(`/signup?plan=${plan}`);

  const current = await getPlan(user.id);
  if (current.tier === "lifetime" || (current.tier === "pro" && plan !== "lifetime" && current.status !== "cancelled")) {
    return go("/dashboard/billing");
  }
  if (billingMode === "polar") {
    try {
      return go(await createCheckout(user, plan));
    } catch (e) {
      // e.g. a product id not configured yet, or Polar unreachable: never show a raw error page
      console.error("checkout failed", plan, e);
      return go("/dashboard/billing?checkout=unavailable");
    }
  }
  if (billingMode === "dev" && (await isLocalRequest())) {
    await devCheckout(user.id, plan);
    return go("/dashboard/billing?checkout=done");
  }
  return go("/dashboard/billing?checkout=unavailable");
}

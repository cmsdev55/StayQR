import { NextResponse } from "next/server";
import { getUser, isLocalRequest } from "@/lib/server/auth";
import { createCheckout, devCheckout, isPlanKey } from "@/lib/server/billing";
import { billingMode } from "@/lib/server/env";
import { getPlan } from "@/lib/server/plan";

export const dynamic = "force-dynamic";

/** GET /api/checkout?plan=pro-yearly → Lemon Squeezy hosted checkout (signs in first if needed). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const plan = url.searchParams.get("plan");
  if (!isPlanKey(plan)) return NextResponse.redirect(new URL("/pricing", url));
  const user = await getUser();
  if (!user) return NextResponse.redirect(new URL(`/signup?plan=${plan}`, url));

  const current = await getPlan(user.id);
  if (current.tier === "lifetime" || (current.tier === "pro" && plan !== "lifetime" && current.status !== "cancelled")) {
    return NextResponse.redirect(new URL("/dashboard/billing", url));
  }
  if (billingMode === "lemonsqueezy") {
    try {
      return NextResponse.redirect(await createCheckout(user, plan));
    } catch (e) {
      // e.g. a variant id not configured yet, or Lemon Squeezy unreachable: never show a raw error page
      console.error("checkout failed", plan, e);
      return NextResponse.redirect(new URL("/dashboard/billing?checkout=unavailable", url));
    }
  }
  if (billingMode === "dev" && (await isLocalRequest())) {
    await devCheckout(user.id, plan);
    return NextResponse.redirect(new URL("/dashboard/billing?checkout=done", url));
  }
  return NextResponse.redirect(new URL("/dashboard/billing?checkout=unavailable", url));
}

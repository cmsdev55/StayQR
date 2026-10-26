import { NextResponse } from "next/server";
import { consumeToken } from "@/lib/server/auth";
import { db } from "@/lib/server/db";

export const dynamic = "force-dynamic";

/** The link in the confirmation email. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = await consumeToken(url.searchParams.get("token") ?? "", "verify");
  if (!userId) return NextResponse.redirect(new URL("/dashboard?verified=expired", url));
  await db()`update public.profiles set email_verified_at = coalesce(email_verified_at, now()) where id = ${userId}`;
  return NextResponse.redirect(new URL("/dashboard?verified=1", url));
}

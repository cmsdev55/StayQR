import { NextResponse } from "next/server";
import { endSession } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // a cross-site form must not be able to sign people out
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(req.url).host) return new Response("Forbidden", { status: 403 });
  await endSession();
  return NextResponse.redirect(new URL("/", req.url), { status: 303 });
}

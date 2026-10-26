import { NextResponse } from "next/server";
import { devSignOut } from "@/lib/server/auth";
import { authMode } from "@/lib/server/env";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (authMode === "supabase") await (await supabaseServer()).auth.signOut();
  else await devSignOut();
  return NextResponse.redirect(new URL("/", req.url), { status: 303 });
}

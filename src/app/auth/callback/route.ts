import { NextResponse } from "next/server";
import { safeNext } from "@/lib/server/auth";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Email confirmation, magic link, password reset and Google sign-in all return here with ?code=. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  if (code) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url));
  }
  return NextResponse.redirect(new URL(`/login?error=link`, url));
}

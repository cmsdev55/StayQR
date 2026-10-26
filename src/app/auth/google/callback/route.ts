import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { startSession } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { env } from "@/lib/server/env";

export const dynamic = "force-dynamic";

type GoogleUser = { sub: string; email?: string; email_verified?: boolean; name?: string };

/**
 * Google returns here. We exchange the code (with the PKCE verifier) for an access token, read the profile, then
 * sign in the account linked to that Google id, or link it to the account with the same verified email, or create one.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const fail = () => NextResponse.redirect(new URL("/login?error=google", url));
  const store = await cookies();
  const saved = store.get("stayqr_oauth")?.value;
  store.delete({ name: "stayqr_oauth", path: "/auth/google" });
  let flow: { state: string; verifier: string; next: string };
  try {
    flow = JSON.parse(saved ?? "");
  } catch {
    return fail();
  }
  const code = url.searchParams.get("code");
  if (!code || url.searchParams.get("state") !== flow.state) return fail();

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.google.clientId!,
      client_secret: env.google.clientSecret!,
      redirect_uri: `${env.siteUrl}/auth/google/callback`,
      grant_type: "authorization_code",
      code_verifier: flow.verifier,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!tokenRes.ok) return fail();
  const { access_token } = (await tokenRes.json()) as { access_token?: string };
  const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${access_token}` }, signal: AbortSignal.timeout(10000) });
  if (!infoRes.ok) return fail();
  const g = (await infoRes.json()) as GoogleUser;
  if (!g.sub || !g.email || !g.email_verified) return fail();

  const email = g.email.toLowerCase();
  const sql = db();
  const [user] = await sql<{ id: string }[]>`
    with linked as (select id from public.profiles where google_sub = ${g.sub}),
    by_email as (
      update public.profiles set google_sub = ${g.sub}, email_verified_at = coalesce(email_verified_at, now())
       where lower(email) = ${email} and google_sub is null and not exists (select 1 from linked) returning id
    ),
    created as (
      insert into public.profiles (email, name, google_sub, email_verified_at)
      select ${email}, ${g.name ?? null}, ${g.sub}, now()
       where not exists (select 1 from linked) and not exists (select 1 from by_email)
      on conflict do nothing returning id
    )
    select id from linked union all select id from by_email union all select id from created limit 1`;
  if (!user) return fail();
  await startSession(user.id);
  return NextResponse.redirect(new URL(flow.next, url));
}

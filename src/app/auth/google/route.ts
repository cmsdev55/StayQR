import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { safeNext } from "@/lib/server/auth";
import { env, googleEnabled } from "@/lib/server/env";

export const dynamic = "force-dynamic";

/** Start Google sign-in: state + PKCE verifier in a short-lived httpOnly cookie. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!googleEnabled()) return NextResponse.redirect(new URL("/login?error=google", url));
  const state = randomBytes(16).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const next = safeNext(url.searchParams.get("next"));
  (await cookies()).set("endureqr_oauth", JSON.stringify({ state, verifier, next }), {
    httpOnly: true,
    secure: env.siteUrl.startsWith("https://"),
    sameSite: "lax",
    path: "/auth/google",
    maxAge: 600,
  });
  const google = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  google.search = new URLSearchParams({
    client_id: env.google.clientId!,
    redirect_uri: `${env.siteUrl}/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();
  return NextResponse.redirect(google);
}

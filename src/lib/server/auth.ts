import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { supabaseServer } from "@/lib/supabase/server";
import { db } from "./db";
import { authMode } from "./env";

export type SessionUser = { id: string; email: string; name: string | null; timezone: string };

const DEV_COOKIE = "stayqr-dev-session";
const devSecret = () => process.env.DEV_AUTH_SECRET ?? "stayqr-local-dev-only";
const sign = (v: string) => createHmac("sha256", devSecret()).update(v).digest("hex");

/** Keep public.profiles in step with the auth user (first login creates it). */
async function ensureProfile(id: string, email: string, name: string | null): Promise<SessionUser> {
  const [p] = await db()<SessionUser[]>`
    insert into public.profiles (id, email, name) values (${id}, ${email}, ${name})
    on conflict (id) do update set email = excluded.email, name = coalesce(public.profiles.name, excluded.name)
    returning id, email, name, timezone`;
  return p;
}

/** The signed-in user for this request, or null. Cached per request. */
export const getUser = cache(async (): Promise<SessionUser | null> => {
  if (authMode === "supabase") {
    const sb = await supabaseServer();
    const { data } = await sb.auth.getUser();
    if (!data.user?.email) return null;
    const name = (data.user.user_metadata?.name as string | undefined) ?? (data.user.user_metadata?.full_name as string | undefined) ?? null;
    return ensureProfile(data.user.id, data.user.email, name);
  }
  if (authMode === "dev") {
    if (!(await isLocalRequest())) return null;
    const raw = (await cookies()).get(DEV_COOKIE)?.value;
    const [id, mac] = raw?.split(".") ?? [];
    if (!id || !mac || mac.length !== 64 || !timingSafeEqual(Buffer.from(mac), Buffer.from(sign(id)))) return null;
    const [p] = await db()<SessionUser[]>`select id, email, name, timezone from public.profiles where id = ${id}`;
    return p ?? null;
  }
  return null;
});

export async function requireUser(next = "/dashboard") {
  const u = await getUser();
  if (!u) redirect(`/login?next=${encodeURIComponent(next)}`);
  return u;
}

/** Dev login is only honoured on localhost, whatever the environment says. */
export async function isLocalRequest() {
  const host = (await headers()).get("host") ?? "";
  return /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
}

/** Local development: sign in as any email without a password (creates the stub auth user). */
export async function devSignIn(email: string, name: string | null) {
  if (authMode !== "dev" || !(await isLocalRequest())) throw new Error("Dev login is not available here.");
  const sql = db();
  const [u] = await sql<{ id: string }[]>`
    insert into auth.users (id, email) values (${randomUUID()}, ${email})
    on conflict (email) do update set email = excluded.email returning id`;
  await ensureProfile(u.id, email, name);
  (await cookies()).set(DEV_COOKIE, `${u.id}.${sign(u.id)}`, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function devSignOut() {
  (await cookies()).delete(DEV_COOKIE);
}

/** Only same-site relative paths survive as a post-login destination. */
export const safeNext = (next: unknown, fallback = "/dashboard") =>
  typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;

import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "./db";
import { env } from "./env";

export type SessionUser = { id: string; email: string; name: string | null; timezone: string; verified: boolean; hasPassword: boolean };

export const SESSION_COOKIE = "endureqr_session";
const SESSION_DAYS = 30;
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
const newToken = () => randomBytes(32).toString("base64url");

// ── Sessions ─────────────────────────────────────────────────────────────

/** The signed-in user for this request, or null. One indexed lookup; cached per request. */
export const getUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const [row] = await db()<(Omit<SessionUser, "verified" | "hasPassword"> & { verified_at: Date | null; has_password: boolean; last_seen_at: Date; sid: string })[]>`
    select p.id, p.email, p.name, p.timezone, p.email_verified_at as verified_at, p.password_hash is not null as has_password, s.last_seen_at, s.id as sid
      from public.sessions s join public.profiles p on p.id = s.user_id
     where s.id = ${sha256(token)} and s.expires_at > now()`;
  if (!row) return null;
  // sliding expiry, written at most once an hour
  if (Date.now() - row.last_seen_at.getTime() > 3600_000) {
    await db()`update public.sessions set last_seen_at = now(), expires_at = now() + make_interval(days => ${SESSION_DAYS}) where id = ${row.sid}`;
  }
  return { id: row.id, email: row.email, name: row.name, timezone: row.timezone, verified: !!row.verified_at, hasPassword: row.has_password };
});

export async function requireUser(next = "/dashboard") {
  const u = await getUser();
  if (!u) redirect(`/login?next=${encodeURIComponent(next)}`);
  return u;
}

/** Start a session: random token in an httpOnly cookie, its hash in the database. */
export async function startSession(userId: string) {
  const token = newToken();
  const ua = (await headers()).get("user-agent")?.slice(0, 300) ?? null;
  await db()`insert into public.sessions (id, user_id, expires_at, user_agent)
             values (${sha256(token)}, ${userId}, now() + make_interval(days => ${SESSION_DAYS}), ${ua})`;
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.siteUrl.startsWith("https://"),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function endSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await db()`delete from public.sessions where id = ${sha256(token)}`;
  store.delete(SESSION_COOKIE);
}

/** Sign out everywhere else (after a password change or reset). */
export async function endOtherSessions(userId: string) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  await db()`delete from public.sessions where user_id = ${userId} and id <> ${token ? sha256(token) : ""}`;
}

// ── One-time links (verify email, reset password) ────────────────────────

export async function issueToken(userId: string, kind: "verify" | "reset") {
  const token = newToken();
  const hours = kind === "verify" ? 24 : 1;
  await db()`delete from public.auth_tokens where user_id = ${userId} and kind = ${kind} and used_at is null`;
  await db()`insert into public.auth_tokens (id, user_id, kind, expires_at) values (${sha256(token)}, ${userId}, ${kind}, now() + make_interval(hours => ${hours}))`;
  return token;
}

/** Marks the token used and returns its user, or null if it's unknown, used or expired. */
export async function consumeToken(token: string, kind: "verify" | "reset") {
  if (!token || token.length > 100) return null;
  const [row] = await db()<{ user_id: string }[]>`
    update public.auth_tokens set used_at = now()
     where id = ${sha256(token)} and kind = ${kind} and used_at is null and expires_at > now()
     returning user_id`;
  return row?.user_id ?? null;
}

// ── Throttling ───────────────────────────────────────────────────────────

export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();
}

/** Records an attempt for each key and reports whether any key went over its limit in the window. */
export async function tooMany(keys: { key: string; max: number }[], minutes: number) {
  const sql = db();
  const counts = await sql<{ key: string; n: number }[]>`
    select key, count(*)::int as n from public.auth_attempts
     where key = any(${keys.map((k) => k.key)}) and at > now() - make_interval(mins => ${minutes}) group by key`;
  const over = keys.some((k) => (counts.find((c) => c.key === k.key)?.n ?? 0) >= k.max);
  if (!over) await sql`insert into public.auth_attempts ${sql(keys.map((k) => ({ key: k.key })))}`;
  return over;
}

export async function clearAttempts(key: string) {
  await db()`delete from public.auth_attempts where key = ${key}`;
}

// ── Helpers ──────────────────────────────────────────────────────────────

export async function isLocalRequest() {
  const host = (await headers()).get("host") ?? "";
  return /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
}

/** Only same-site relative paths survive as a post-login destination. */
export const safeNext = (next: unknown, fallback = "/dashboard") =>
  typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;

export const normaliseEmail = (e: string) => e.trim().toLowerCase();
export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254;

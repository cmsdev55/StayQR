"use server";

import { redirect } from "next/navigation";
import {
  clearAttempts,
  clientIp,
  consumeToken,
  endOtherSessions,
  getUser,
  issueToken,
  normaliseEmail,
  requireUser,
  safeNext,
  startSession,
  tooMany,
  validEmail,
} from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { resetEmail, verifyEmail } from "@/lib/server/email";
import { env } from "@/lib/server/env";
import { DUMMY_HASH, hashPassword, passwordProblem, verifyPassword } from "@/lib/server/password";

export type AuthState = { error?: string; notice?: string } | undefined;

const str = (f: FormData, k: string) => String(f.get(k) ?? "");
const SLOW_DOWN = "Too many attempts. Wait a few minutes and try again.";

async function sendVerification(userId: string, email: string, name: string | null, next = "/dashboard") {
  const token = await issueToken(userId, "verify");
  const after = next === "/dashboard" ? "" : `&next=${encodeURIComponent(next)}`;
  await verifyEmail(email, `${env.siteUrl}/auth/verify?token=${token}${after}`, name).catch((e) => console.error("verify email failed", e));
}

/** The "check your inbox" page after sign-up, or after logging in before the email is confirmed. */
function toCheckEmail(email: string, next: string, reason?: "login"): never {
  const q = new URLSearchParams({ email });
  if (next !== "/dashboard") q.set("next", next);
  if (reason) q.set("reason", reason);
  redirect(`/auth/check-email?${q}`);
}

export async function signUpAction(_: AuthState, form: FormData): Promise<AuthState> {
  const email = normaliseEmail(str(form, "email"));
  const name = str(form, "name").trim().slice(0, 80) || null;
  const password = str(form, "password");
  const next = safeNext(form.get("next"));
  if (!validEmail(email)) return { error: "Enter a valid email address." };
  const weak = passwordProblem(password);
  if (weak) return { error: weak };
  if (await tooMany([{ key: `signup:ip:${await clientIp()}`, max: 8 }], 60)) return { error: SLOW_DOWN };

  const hash = await hashPassword(password);
  const [user] = await db()<{ id: string }[]>`
    insert into public.profiles (email, name, password_hash) values (${email}, ${name}, ${hash})
    on conflict ((lower(email))) do nothing returning id`;
  if (!user) return { error: "There's already an account with this email. Log in, or reset your password." };
  // no session yet: the account opens once the emailed link is clicked and the user logs in
  await sendVerification(user.id, email, name, next);
  toCheckEmail(email, next);
}

export async function signInAction(_: AuthState, form: FormData): Promise<AuthState> {
  const email = normaliseEmail(str(form, "email"));
  const password = str(form, "password");
  const next = safeNext(form.get("next"));
  if (!validEmail(email) || !password) return { error: "Enter your email and password." };
  const emailKey = `login:email:${email}`;
  if (await tooMany([{ key: emailKey, max: 10 }, { key: `login:ip:${await clientIp()}`, max: 40 }], 15)) return { error: SLOW_DOWN };

  const [user] = await db()<{ id: string; name: string | null; password_hash: string | null; google_sub: string | null; verified: boolean }[]>`
    select id, name, password_hash, google_sub, email_verified_at is not null as verified from public.profiles where lower(email) = ${email}`;
  const ok = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH); // same work whether or not the account exists
  if (!user || !ok) {
    return { error: user && !user.password_hash && user.google_sub ? "This account uses Google sign-in. Use “Continue with Google”." : "That email and password don't match." };
  }
  await clearAttempts(emailKey);
  if (!user.verified) {
    // right password, unconfirmed email: send a fresh link (a few an hour at most) instead of a session
    if (!(await tooMany([{ key: `verify:email:${email}`, max: 3 }], 60))) await sendVerification(user.id, email, user.name, next);
    toCheckEmail(email, next, "login");
  }
  await startSession(user.id);
  redirect(next);
}

/** Always answers the same way, so it can't be used to find out who has an account. */
export async function resetRequestAction(_: AuthState, form: FormData): Promise<AuthState> {
  const email = normaliseEmail(str(form, "email"));
  if (!validEmail(email)) return { error: "Enter your email address first." };
  if (await tooMany([{ key: `reset:email:${email}`, max: 3 }, { key: `reset:ip:${await clientIp()}`, max: 10 }], 60)) return { error: SLOW_DOWN };
  const [user] = await db()<{ id: string; name: string | null }[]>`select id, name from public.profiles where lower(email) = ${email}`;
  if (user) {
    const token = await issueToken(user.id, "reset");
    await resetEmail(email, `${env.siteUrl}/auth/reset?token=${token}`, user.name).catch((e) => console.error("reset email failed", e));
  }
  return { notice: "If that email has an account, a reset link is on its way. It works for one hour." };
}

/** From the emailed link: set a new password, sign in, and sign out every other device. */
export async function resetConfirmAction(_: AuthState, form: FormData): Promise<AuthState> {
  const password = str(form, "password");
  const weak = passwordProblem(password);
  if (weak) return { error: weak };
  const userId = await consumeToken(str(form, "token"), "reset");
  if (!userId) return { error: "This reset link has expired or was already used. Ask for a new one from the login page." };
  // opening the emailed link proves the address too
  await db()`update public.profiles set password_hash = ${await hashPassword(password)}, email_verified_at = coalesce(email_verified_at, now()) where id = ${userId}`;
  await db()`delete from public.sessions where user_id = ${userId}`;
  await startSession(userId);
  redirect("/dashboard?password=reset");
}

export async function resendVerificationAction(): Promise<AuthState> {
  const user = await requireUser();
  if (user.verified) return { notice: "Your email is already confirmed." };
  if (await tooMany([{ key: `verify:user:${user.id}`, max: 3 }], 60)) return { error: SLOW_DOWN };
  await sendVerification(user.id, user.email, user.name);
  return { notice: `Sent. Check ${user.email} for the confirmation link.` };
}

/** From the check-your-inbox page or an expired link, signed out. Answers the same whether or not the account exists. */
export async function resendVerificationByEmailAction(_: AuthState, form: FormData): Promise<AuthState> {
  const email = normaliseEmail(str(form, "email"));
  const next = safeNext(form.get("next"));
  if (!validEmail(email)) return { error: "Enter a valid email address." };
  if (await tooMany([{ key: `verify:email:${email}`, max: 3 }, { key: `verify:ip:${await clientIp()}`, max: 10 }], 60)) return { error: SLOW_DOWN };
  const [user] = await db()<{ id: string; name: string | null }[]>`
    select id, name from public.profiles where lower(email) = ${email} and email_verified_at is null`;
  if (user) await sendVerification(user.id, email, user.name, next);
  return { notice: `If ${email} still needs confirming, a new link is on its way. It works for 24 hours.` };
}

export async function changePasswordAction(_: AuthState, form: FormData): Promise<AuthState> {
  const user = await getUser();
  if (!user) return { error: "Log in again to change your password." };
  const current = str(form, "current");
  const password = str(form, "password");
  const [row] = await db()<{ password_hash: string | null }[]>`select password_hash from public.profiles where id = ${user.id}`;
  if (row.password_hash && !(await verifyPassword(current, row.password_hash))) return { error: "Your current password isn't right." };
  const weak = passwordProblem(password);
  if (weak) return { error: weak };
  await db()`update public.profiles set password_hash = ${await hashPassword(password)} where id = ${user.id}`;
  await endOtherSessions(user.id);
  return { notice: row.password_hash ? "Password changed. Other devices have been signed out." : "Password set. You can now log in with email too." };
}

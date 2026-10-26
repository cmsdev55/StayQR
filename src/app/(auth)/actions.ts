"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { devSignIn, safeNext } from "@/lib/server/auth";
import { authMode, env } from "@/lib/server/env";
import { supabaseServer } from "@/lib/supabase/server";

export type AuthState = { error?: string; notice?: string } | undefined;

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return host ? `${h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")}://${host}` : env.siteUrl;
}

function friendly(message: string) {
  if (/invalid login credentials/i.test(message)) return "That email and password don't match. Try again or reset your password.";
  if (/email not confirmed/i.test(message)) return "Confirm your email first: we sent you a link when you signed up.";
  if (/already registered|already been registered/i.test(message)) return "There's already an account with this email. Log in instead.";
  if (/rate limit|too many/i.test(message)) return "Too many attempts. Wait a minute and try again.";
  if (/password/i.test(message)) return message;
  return "Something went wrong. Please try again.";
}

export async function signInAction(_: AuthState, form: FormData): Promise<AuthState> {
  const email = str(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  const next = safeNext(form.get("next"));
  if (!validEmail(email)) return { error: "Enter a valid email address." };
  if (authMode === "dev") {
    await devSignIn(email, null);
    redirect(next);
  }
  if (authMode !== "supabase") return { error: "Sign-in isn't configured on this server yet." };
  const { error } = await (await supabaseServer()).auth.signInWithPassword({ email, password });
  if (error) return { error: friendly(error.message) };
  redirect(next);
}

export async function signUpAction(_: AuthState, form: FormData): Promise<AuthState> {
  const email = str(form, "email").toLowerCase();
  const name = str(form, "name").slice(0, 80) || null;
  const password = String(form.get("password") ?? "");
  const next = safeNext(form.get("next"));
  if (!validEmail(email)) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Use at least 8 characters for your password." };
  if (authMode === "dev") {
    await devSignIn(email, name);
    redirect(next);
  }
  if (authMode !== "supabase") return { error: "Sign-up isn't configured on this server yet." };
  const { data, error } = await (await supabaseServer()).auth.signUp({
    email,
    password,
    options: { data: { name }, emailRedirectTo: `${await origin()}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error) return { error: friendly(error.message) };
  if (data.session) redirect(next);
  return { notice: `We sent a confirmation link to ${email}. Open it on this device to finish creating your account.` };
}

export async function resetAction(_: AuthState, form: FormData): Promise<AuthState> {
  const email = str(form, "email").toLowerCase();
  if (!validEmail(email)) return { error: "Enter your email address first." };
  if (authMode === "supabase") {
    await (await supabaseServer()).auth.resetPasswordForEmail(email, { redirectTo: `${await origin()}/auth/callback?next=/auth/reset` });
  }
  // same answer whether or not the account exists
  return { notice: "If that email has an account, a reset link is on its way." };
}

export async function updatePasswordAction(_: AuthState, form: FormData): Promise<AuthState> {
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return { error: "Use at least 8 characters." };
  if (authMode !== "supabase") return { error: "Password changes need Supabase auth." };
  const { error } = await (await supabaseServer()).auth.updateUser({ password });
  if (error) return { error: friendly(error.message) };
  redirect("/dashboard");
}

export async function googleAction(form: FormData) {
  const next = safeNext(form.get("next"));
  if (authMode !== "supabase") redirect(`/login?error=google&next=${encodeURIComponent(next)}`);
  const { data, error } = await (await supabaseServer()).auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${await origin()}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) redirect(`/login?error=google`);
  redirect(data.url);
}

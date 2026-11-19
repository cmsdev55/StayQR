"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logAdmin, requireAdmin } from "@/lib/server/admin";
import { cancelSubscription, resumeSubscription, revokeSubscription, switchPlan } from "@/lib/server/billing";
import { db } from "@/lib/server/db";

export type AdminResult = { ok: true; message?: string } | { ok: false; error: string };

class AdminError extends Error {}

/** Admin check on every call, a friendly error instead of a crash, and a fresh page afterwards. */
async function act(userId: string | null, fn: (admin: Awaited<ReturnType<typeof requireAdmin>>) => Promise<string | void>): Promise<AdminResult> {
  const admin = await requireAdmin();
  try {
    const message = await fn(admin);
    revalidatePath("/admin", "layout");
    return { ok: true, message: message ?? undefined };
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e;
    if (e instanceof AdminError) return { ok: false, error: e.message };
    console.error("admin action failed", userId, e);
    return { ok: false, error: e instanceof Error && e.message.startsWith("Polar") ? "Polar refused the change. Check the subscription in the Polar dashboard." : "Something went wrong. Nothing was changed if this message appears straight away; check the activity log." };
  }
}

async function target(id: string) {
  const [u] = await db()<{ id: string; email: string; suspended_at: Date | null }[]>`select id, email, suspended_at from public.profiles where id = ${id}`;
  if (!u) throw new AdminError("That account no longer exists.");
  return u;
}

async function ownSub(userId: string, subId: string) {
  const [s] = await db()<{ id: string; plan: string; status: string }[]>`select id, plan, status from public.subscriptions where id = ${subId} and user_id = ${userId}`;
  if (!s) throw new AdminError("That subscription isn't on this account.");
  return s;
}

const notSelf = (admin: { id: string }, id: string, what: string) => {
  if (admin.id === id) throw new AdminError(`You can't ${what} your own account from the admin panel.`);
};

// ── Profile ───────────────────────────────────────────────────────────────

export async function updateProfileAction(id: string, input: { name: string; email: string }): Promise<AdminResult> {
  return act(id, async (admin) => {
    const u = await target(id);
    const email = input.email.trim().toLowerCase();
    const name = input.name.trim().slice(0, 80) || null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new AdminError("Enter a valid email address.");
    const [taken] = await db()`select 1 from public.profiles where lower(email) = ${email} and id <> ${id}`;
    if (taken) throw new AdminError("Another account already uses that email.");
    await db()`update public.profiles set name = ${name}, email = ${email} where id = ${id}`;
    await logAdmin(admin, "profile.update", { id, email: u.email }, { name, email: email !== u.email.toLowerCase() ? { from: u.email, to: email } : undefined });
    return "Saved.";
  });
}

export async function verifyEmailAction(id: string): Promise<AdminResult> {
  return act(id, async (admin) => {
    const u = await target(id);
    await db()`update public.profiles set email_verified_at = coalesce(email_verified_at, now()) where id = ${id}`;
    await logAdmin(admin, "profile.verify_email", u);
    return "Email marked as confirmed.";
  });
}

// ── Suspension ────────────────────────────────────────────────────────────

export async function suspendAction(id: string, reason: string): Promise<AdminResult> {
  return act(id, async (admin) => {
    notSelf(admin, id, "suspend");
    const u = await target(id);
    const why = reason.trim().slice(0, 300);
    if (!why) throw new AdminError("Add a short reason. It's kept in the activity log.");
    await db()`update public.profiles set suspended_at = now(), suspended_reason = ${why} where id = ${id}`;
    await db()`delete from public.sessions where user_id = ${id}`;
    await logAdmin(admin, "account.suspend", u, { reason: why });
    return "Suspended and signed out everywhere. Their codes keep working.";
  });
}

export async function unsuspendAction(id: string): Promise<AdminResult> {
  return act(id, async (admin) => {
    const u = await target(id);
    await db()`update public.profiles set suspended_at = null, suspended_reason = null where id = ${id}`;
    await logAdmin(admin, "account.unsuspend", u);
    return "Suspension lifted. They can log in again.";
  });
}

export async function signOutEverywhereAction(id: string): Promise<AdminResult> {
  return act(id, async (admin) => {
    const u = await target(id);
    const r = await db()`delete from public.sessions where user_id = ${id}`;
    await logAdmin(admin, "account.sign_out", u, { sessions: r.count });
    return `Signed out of ${r.count} session${r.count === 1 ? "" : "s"}.`;
  });
}

// ── Subscriptions (through Polar, so billing really changes) ──────────────

export async function cancelSubAction(id: string, subId: string): Promise<AdminResult> {
  return act(id, async (admin) => {
    const u = await target(id);
    await ownSub(id, subId);
    await cancelSubscription(id, subId);
    await logAdmin(admin, "subscription.cancel_at_period_end", u, { subscription: subId });
    return "Cancelled at the end of the paid period. No further charges.";
  });
}

export async function resumeSubAction(id: string, subId: string): Promise<AdminResult> {
  return act(id, async (admin) => {
    const u = await target(id);
    await ownSub(id, subId);
    await resumeSubscription(id, subId);
    await logAdmin(admin, "subscription.resume", u, { subscription: subId });
    return "Resumed. It renews as normal.";
  });
}

export async function revokeSubAction(id: string, subId: string): Promise<AdminResult> {
  return act(id, async (admin) => {
    const u = await target(id);
    await ownSub(id, subId);
    await revokeSubscription(id, subId);
    await logAdmin(admin, "subscription.end_now", u, { subscription: subId });
    return "Ended now. Pro features stopped; issue any refund in Polar.";
  });
}

export async function switchSubAction(id: string, subId: string, plan: "pro-monthly" | "pro-yearly"): Promise<AdminResult> {
  return act(id, async (admin) => {
    if (plan !== "pro-monthly" && plan !== "pro-yearly") throw new AdminError("Unknown plan.");
    const u = await target(id);
    const s = await ownSub(id, subId);
    if (s.plan === plan) throw new AdminError("They're already on that plan.");
    await switchPlan(id, subId, plan);
    await logAdmin(admin, "subscription.switch", u, { subscription: subId, from: s.plan, to: plan });
    return plan === "pro-yearly" ? "Switched to yearly. Polar charges the prorated difference." : "Switched to monthly.";
  });
}

// ── Free Lifetime (a zero-value order that plan_of already counts) ────────

export async function grantLifetimeAction(id: string, note: string): Promise<AdminResult> {
  return act(id, async (admin) => {
    const u = await target(id);
    const [has] = await db()`select 1 from public.orders where user_id = ${id} and plan = 'lifetime' and status = 'paid'`;
    if (has) throw new AdminError("They already have Lifetime.");
    const orderId = `manual_${randomUUID()}`;
    await db()`insert into public.orders (id, user_id, variant_id, plan, status, total_cents, currency) values (${orderId}, ${id}, 'manual', 'lifetime', 'paid', 0, 'USD')`;
    await logAdmin(admin, "lifetime.grant", u, { order: orderId, note: note.trim().slice(0, 200) || undefined });
    return "Lifetime given free. If they also pay for Pro, cancel that subscription so they aren't charged twice.";
  });
}

export async function revokeLifetimeAction(id: string, orderId: string): Promise<AdminResult> {
  return act(id, async (admin) => {
    const u = await target(id);
    if (!orderId.startsWith("manual_")) throw new AdminError("Only a free Lifetime given here can be taken back. Refund paid orders in Polar.");
    const r = await db()`update public.orders set status = 'revoked' where id = ${orderId} and user_id = ${id} and status = 'paid'`;
    if (!r.count) throw new AdminError("That free Lifetime isn't active.");
    await logAdmin(admin, "lifetime.revoke", u, { order: orderId });
    return "Free Lifetime taken back.";
  });
}

// ── Codes (abuse) ─────────────────────────────────────────────────────────

export async function disableCodeAction(userId: string, codeId: string, reason: string): Promise<AdminResult> {
  return act(userId, async (admin) => {
    const u = await target(userId);
    const why = reason.trim().slice(0, 200);
    if (!why) throw new AdminError("Add the reason, for example the phishing report it came from.");
    const [c] = await db()<{ slug: string }[]>`update public.codes set disabled_at = now(), disabled_reason = ${why}, updated_at = now() where id = ${codeId} and user_id = ${userId} returning slug`;
    if (!c) throw new AdminError("That code isn't on this account.");
    await logAdmin(admin, "code.disable", u, { code: codeId, slug: c.slug, reason: why });
    return `Code ${c.slug} disabled. Scanners now see a warning page.`;
  });
}

export async function enableCodeAction(userId: string, codeId: string): Promise<AdminResult> {
  return act(userId, async (admin) => {
    const u = await target(userId);
    const [c] = await db()<{ slug: string }[]>`update public.codes set disabled_at = null, disabled_reason = null, updated_at = now() where id = ${codeId} and user_id = ${userId} returning slug`;
    if (!c) throw new AdminError("That code isn't on this account.");
    await logAdmin(admin, "code.enable", u, { code: codeId, slug: c.slug });
    return `Code ${c.slug} works again.`;
  });
}

// ── Delete ────────────────────────────────────────────────────────────────

/**
 * Same as a user deleting their own account: billing is cancelled in Polar first, then the profile goes (sessions,
 * folders and billing mirrors cascade). Codes are detached, not deleted, so printed codes keep redirecting.
 */
export async function deleteUserAction(id: string, confirmEmail: string): Promise<AdminResult> {
  const res = await act(id, async (admin) => {
    notSelf(admin, id, "delete");
    const u = await target(id);
    if (confirmEmail.trim().toLowerCase() !== u.email.toLowerCase()) throw new AdminError("Type the account's email exactly to confirm.");
    const subs = await db()<{ id: string }[]>`select id from public.subscriptions where user_id = ${id} and status in ('active', 'on_trial', 'past_due')`;
    for (const s of subs) await cancelSubscription(id, s.id); // throws (and stops) if Polar refuses
    const [{ n }] = await db()<{ n: number }[]>`select count(*)::int as n from public.codes where user_id = ${id}`;
    await db()`delete from public.profiles where id = ${id}`;
    await logAdmin(admin, "account.delete", u, { cancelled_subscriptions: subs.map((s) => s.id), codes_kept: n });
  });
  if (res.ok) redirect("/admin/users?deleted=1");
  return res;
}

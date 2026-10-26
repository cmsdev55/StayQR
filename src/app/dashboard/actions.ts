"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUser, requireUser } from "@/lib/server/auth";
import { cancelSubscription, portalUrl, resumeSubscription, switchPlan } from "@/lib/server/billing";
import * as codes from "@/lib/server/codes";
import { db } from "@/lib/server/db";
import { authMode, env } from "@/lib/server/env";
import { getPlan } from "@/lib/server/plan";
import { supabaseServer } from "@/lib/supabase/server";

export type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

/** Signed in and on a plan that allows editing; anything else becomes a friendly error. */
async function editor() {
  const user = await requireUser();
  const plan = await getPlan(user.id);
  if (!plan.canEdit) throw new codes.InputError(plan.lapsed ? "Your plan has ended. Your codes keep working; resume a plan to edit them." : "Choose a plan to create and edit dynamic codes.");
  return user;
}

async function attempt<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e instanceof codes.InputError) return { ok: false, error: e.message };
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e;
    console.error(e);
    return { ok: false, error: "Something went wrong on our side. Please try again." };
  }
}

// ── Codes ────────────────────────────────────────────────────────────────

export async function saveCodeAction(id: string | null, input: codes.CodeInput): Promise<Result<string>> {
  return attempt(async () => {
    const user = await editor();
    if (id) await codes.updateCode(user.id, id, input);
    const savedId = id ?? (await codes.createCode(user.id, input));
    revalidatePath("/dashboard", "layout");
    return savedId;
  });
}

export async function deleteCodeAction(id: string): Promise<Result> {
  return attempt(async () => {
    const user = await requireUser();
    await codes.deleteCode(user.id, id);
    revalidatePath("/dashboard", "layout");
    return undefined;
  });
}

export async function createFolderAction(name: string): Promise<Result<string>> {
  return attempt(async () => {
    const id = await codes.createFolder((await editor()).id, name);
    revalidatePath("/dashboard", "layout");
    return id;
  });
}

export async function renameFolderAction(id: string, name: string): Promise<Result> {
  return attempt(async () => {
    await codes.renameFolder((await editor()).id, id, name);
    revalidatePath("/dashboard", "layout");
    return undefined;
  });
}

export async function deleteFolderAction(id: string): Promise<Result> {
  return attempt(async () => {
    await codes.deleteFolder((await requireUser()).id, id);
    revalidatePath("/dashboard", "layout");
    return undefined;
  });
}

export async function bulkCreateAction(rows: { name: string; destination: string; folder?: string }[]): Promise<Result<{ slug: string; name: string; shortUrl: string }[]>> {
  return attempt(async () => {
    const created = await codes.bulkCreate((await editor()).id, rows);
    revalidatePath("/dashboard", "layout");
    return created;
  });
}

// ── Billing ──────────────────────────────────────────────────────────────

async function ownSub() {
  const user = await requireUser();
  const [s] = await db()<{ id: string }[]>`
    select id from public.subscriptions where user_id = ${user.id} and status not in ('expired') order by updated_at desc limit 1`;
  if (!s) throw new codes.InputError("You don't have a subscription to change.");
  return { user, id: s.id };
}

export async function cancelPlanAction(): Promise<Result> {
  return attempt(async () => {
    const { user, id } = await ownSub();
    await cancelSubscription(user.id, id);
    revalidatePath("/dashboard", "layout");
    return undefined;
  });
}

export async function resumePlanAction(): Promise<Result> {
  return attempt(async () => {
    const { user, id } = await ownSub();
    await resumeSubscription(user.id, id);
    revalidatePath("/dashboard", "layout");
    return undefined;
  });
}

export async function switchPlanAction(plan: "pro-monthly" | "pro-yearly"): Promise<Result> {
  return attempt(async () => {
    const { user, id } = await ownSub();
    await switchPlan(user.id, id, plan);
    revalidatePath("/dashboard", "layout");
    return undefined;
  });
}

/** Lemon Squeezy's customer portal: card, invoices, billing address. */
export async function portalAction() {
  const { user, id } = await ownSub();
  redirect(await portalUrl(user.id, id));
}

// ── Account ──────────────────────────────────────────────────────────────

export async function setTimezoneAction(tz: string) {
  const user = await getUser();
  if (!user || user.timezone === tz) return;
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz }); // throws on an unknown zone
  } catch {
    return;
  }
  await db()`update public.profiles set timezone = ${tz} where id = ${user.id}`;
  revalidatePath("/dashboard", "layout");
}

export async function updateNameAction(name: string): Promise<Result> {
  return attempt(async () => {
    const user = await requireUser();
    await db()`update public.profiles set name = ${name.trim().slice(0, 80) || null} where id = ${user.id}`;
    revalidatePath("/dashboard", "layout");
    return undefined;
  });
}

/**
 * Delete the account (Privacy: "How long we keep it"). Subscriptions are cancelled first. Codes are detached, not
 * deleted, so printed codes keep redirecting; folders, billing mirrors and the profile go with the account.
 */
export async function deleteAccountAction(confirm: string): Promise<Result> {
  return attempt(async () => {
    if (confirm !== "DELETE") throw new codes.InputError('Type DELETE to confirm.');
    const user = await requireUser();
    const subs = await db()<{ id: string }[]>`select id from public.subscriptions where user_id = ${user.id} and status in ('active', 'on_trial', 'past_due')`;
    for (const s of subs) await cancelSubscription(user.id, s.id);
    await db()`delete from public.profiles where id = ${user.id}`;
    if (authMode === "supabase") {
      const sb = await supabaseServer();
      await sb.auth.signOut();
      if (env.supabaseServiceKey) {
        await fetch(`${env.supabaseUrl}/auth/v1/admin/users/${user.id}`, {
          method: "DELETE",
          headers: { apikey: env.supabaseServiceKey, Authorization: `Bearer ${env.supabaseServiceKey}` },
        }).catch((e) => console.error("auth user delete failed", e));
      }
    } else {
      await db()`delete from auth.users where id = ${user.id}`;
    }
    redirect("/?account=deleted");
  });
}

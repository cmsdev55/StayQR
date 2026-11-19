import { Badge } from "@/components/ui/badge";
import { PLAN_LABEL, STATUS_LABEL } from "@/lib/server/admin";

export const day = (d: Date | null | undefined) => (d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");
export const when = (d: Date | null | undefined) =>
  d ? d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC" : "—";
export const money = (cents: number, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);

const STATUS_VARIANT: Record<string, "accent" | "neutral" | "warning" | "danger"> = {
  active: "accent", cancelling: "warning", past_due: "danger", ended: "neutral", free: "neutral", suspended: "danger",
};

export const StatusBadge = ({ status }: { status: string }) => <Badge variant={STATUS_VARIANT[status] ?? "neutral"}>{STATUS_LABEL[status] ?? status}</Badge>;
export const PlanBadge = ({ plan }: { plan: string }) => <Badge variant={plan === "free" ? "neutral" : "accent"}>{PLAN_LABEL[plan] ?? plan}</Badge>;

export const ACTION_LABEL: Record<string, string> = {
  "profile.update": "Edited profile",
  "profile.verify_email": "Confirmed email",
  "account.suspend": "Suspended account",
  "account.unsuspend": "Lifted suspension",
  "account.sign_out": "Signed out everywhere",
  "account.delete": "Deleted account",
  "subscription.cancel_at_period_end": "Cancelled at period end",
  "subscription.resume": "Resumed subscription",
  "subscription.end_now": "Ended subscription now",
  "subscription.switch": "Switched plan",
  "lifetime.grant": "Gave free Lifetime",
  "lifetime.revoke": "Took back free Lifetime",
  "code.disable": "Disabled a code",
  "code.enable": "Re-enabled a code",
  "users.export": "Exported users (CSV)",
};

/** A short, readable line from an action's details. */
export function detailText(details: Record<string, unknown>) {
  const parts: string[] = [];
  if (typeof details.reason === "string") parts.push(`“${details.reason}”`);
  if (typeof details.note === "string") parts.push(`“${details.note}”`);
  if (typeof details.slug === "string") parts.push(`code ${details.slug}`);
  if (details.from && details.to && typeof details.from === "string") parts.push(`${PLAN_LABEL[details.from] ?? details.from} → ${PLAN_LABEL[details.to as string] ?? details.to}`);
  const em = details.email as { from?: string; to?: string } | undefined;
  if (em?.from) parts.push(`email ${em.from} → ${em.to}`);
  if (typeof details.codes_kept === "number") parts.push(`${details.codes_kept} code${details.codes_kept === 1 ? "" : "s"} kept redirecting`);
  return parts.join(" · ");
}

export const th = "px-4 py-3 font-normal";
export const td = "px-4 py-3 align-top";
export const tableWrap = "overflow-x-auto rounded-md border border-line";
export const thead = "bg-bg-overlay font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle";

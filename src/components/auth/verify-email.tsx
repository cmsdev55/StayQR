"use client";

import { useActionState } from "react";
import { resendVerificationByEmailAction, type AuthState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ICONS = {
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></>,
  done: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  expired: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
};

/** The badge at the top of the check-your-inbox and email-verified pages. */
export function StatusMark({ kind }: { kind: keyof typeof ICONS }) {
  return (
    <div
      aria-hidden
      className={cn(
        "mb-8 grid size-14 place-items-center rounded-md",
        kind === "done" ? "bg-accent text-accent-ink shadow-glow-accent" : "border border-line bg-bg-raised",
        kind === "mail" && "text-accent-text",
        kind === "expired" && "text-fg-muted",
      )}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={kind === "done" ? 2.4 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        {ICONS[kind]}
      </svg>
    </div>
  );
}

/** Sends a new confirmation link. With a known address it's one button; otherwise it asks for the address. */
export function ResendVerificationForm({ email, next }: { email?: string; next?: string }) {
  const [state, action, busy] = useActionState<AuthState, FormData>(resendVerificationByEmailAction, undefined);
  if (state?.notice) return <p role="status" className="rounded-sm bg-accent/[0.1] px-4 py-3 text-body-sm text-fg">{state.notice}</p>;
  return (
    <form action={action} className="grid gap-4">
      {next && <input type="hidden" name="next" value={next} />}
      {email ? (
        <>
          <input type="hidden" name="email" value={email} />
          <Button type="submit" variant="secondary" size="md" disabled={busy} className="w-full">
            {busy ? "Sending" : "Resend confirmation email"}
          </Button>
          {state?.error && <p role="alert" className="text-body-sm text-danger">{state.error}</p>}
        </>
      ) : (
        <>
          <Input label="Email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" error={state?.error} />
          <Button type="submit" size="lg" disabled={busy} className="w-full">{busy ? "Sending" : "Send a new link"}</Button>
        </>
      )}
    </form>
  );
}

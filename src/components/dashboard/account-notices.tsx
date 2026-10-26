"use client";

import { useActionState, useEffect, useState } from "react";
import { resendVerificationAction, type AuthState } from "@/app/(auth)/actions";
import { Toast } from "@/components/dashboard/toast";

const FLASH: Record<string, string> = {
  "verified=1": "Email confirmed. Thank you!",
  "verified=expired": "That confirmation link has expired. Send a new one below.",
  "password=reset": "Password changed. Other devices are signed out.",
};

/** Unconfirmed-email banner with a resend button, plus one-off toasts after email links. */
export function AccountNotices({ email, verified }: { email: string; verified: boolean }) {
  const [state, resend, busy] = useActionState<AuthState, FormData>(async () => resendVerificationAction(), undefined);
  const [flash, setFlash] = useState<string | null>(null);
  useEffect(() => {
    const q = window.location.search.slice(1);
    const hit = Object.keys(FLASH).find((k) => q.split("&").includes(k));
    if (!hit) return;
    setFlash(FLASH[hit]);
    const params = new URLSearchParams(window.location.search);
    params.delete(hit.split("=")[0]);
    window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}`);
    const t = setTimeout(() => setFlash(null), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {!verified && (
        <form action={resend} className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-bg-raised px-4 py-3">
          <p className="text-fg">
            Confirm your email: we sent a link to <span className="font-medium">{email}</span>.{" "}
            <span className="text-fg-muted">{state?.notice ?? state?.error ?? "It keeps your account recoverable."}</span>
          </p>
          <button type="submit" disabled={busy} className="h-9 rounded-sm border border-line px-3 font-medium text-fg transition-colors hover:bg-glass-strong">
            {busy ? "Sending" : "Resend link"}
          </button>
        </form>
      )}
      <Toast message={flash} />
    </>
  );
}

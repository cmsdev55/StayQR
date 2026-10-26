"use client";

import { COMPANY } from "@/content/company";
import { useActionState, useState, useTransition } from "react";
import { changePasswordAction, type AuthState } from "@/app/(auth)/actions";
import { deleteAccountAction, updateNameAction } from "@/app/dashboard/actions";
import { Toast } from "@/components/dashboard/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SettingsView({ name: initialName, email, timezone, hasPassword }: { name: string; email: string; timezone: string; hasPassword: boolean }) {
  const [name, setName] = useState(initialName);
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [busy, start] = useTransition();
  const [pw, pwAction, pwBusy] = useActionState<AuthState, FormData>(changePasswordAction, undefined);

  return (
    <div className="max-w-[720px]">
      <h1 className="font-display text-h4 font-semibold text-fg sm:text-[26px]">Settings</h1>
      <p className="mt-1 text-fg-muted">Your account details.</p>

      <section className="mt-6 rounded-md border border-line bg-bg-raised p-5 sm:p-6" aria-labelledby="profile-title">
        <h2 id="profile-title" className="font-semibold text-fg">Profile</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input size="sm" label="Name" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} hint="Shown on your paused-code page." />
          <Input size="sm" label="Email" value={email} readOnly hint={`Email ${COMPANY.email.hello} to change it.`} />
        </div>
        <p className="mt-4 text-fg-muted">Time zone: <span className="text-fg">{timezone}</span> <span className="text-fg-subtle">(set from your browser; used for analytics)</span></p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button size="sm" disabled={busy || name === initialName} onClick={() => start(async () => {
            const r = await updateNameAction(name);
            setToast(r.ok ? "Saved" : r.error);
            setTimeout(() => setToast(null), 2400);
          })}>Save</Button>
        </div>
      </section>

      <section className="mt-4 rounded-md border border-line bg-bg-raised p-5 sm:p-6" aria-labelledby="pw-title">
        <h2 id="pw-title" className="font-semibold text-fg">{hasPassword ? "Change password" : "Set a password"}</h2>
        <p className="mt-1 text-fg-muted">{hasPassword ? "Other devices are signed out when you change it." : "You sign in with Google. Add a password to log in with email as well."}</p>
        <form action={pwAction} className="mt-5 grid gap-4 sm:grid-cols-2">
          {hasPassword && <Input size="sm" label="Current password" name="current" type="password" autoComplete="current-password" required />}
          <Input size="sm" label="New password" name="password" type="password" autoComplete="new-password" required minLength={8} hint="At least 8 characters." error={pw?.error} />
          <div className="sm:col-span-2">
            <Button type="submit" size="sm" variant="secondary" disabled={pwBusy}>{pwBusy ? "Saving" : hasPassword ? "Change password" : "Set password"}</Button>
            {pw?.notice && <span role="status" className="ml-3 text-fg-muted">{pw.notice}</span>}
          </div>
        </form>
      </section>

      <section className="mt-4 rounded-md border border-line bg-bg-raised p-5 sm:p-6" aria-labelledby="data-title">
        <h2 id="data-title" className="font-semibold text-fg">Your data</h2>
        <p className="mt-1 text-fg-muted">Download everything you&apos;ve made. Scan data contains no personal information about the people who scanned.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="/api/export/codes" className="inline-flex h-10 items-center rounded-sm border border-line px-4 font-medium text-fg hover:bg-glass-strong">Export codes (CSV)</a>
          <a href="/api/export/scans" className="inline-flex h-10 items-center rounded-sm border border-line px-4 font-medium text-fg hover:bg-glass-strong">Export scans (CSV)</a>
        </div>
      </section>

      <section className="mt-4 rounded-md border border-danger/30 bg-bg-raised p-5 sm:p-6" aria-labelledby="delete-title">
        <h2 id="delete-title" className="font-semibold text-fg">Delete account</h2>
        <p className="mt-1 max-w-[62ch] text-fg-muted">
          We cancel any subscription and delete your account, folders and billing details. Your printed codes keep redirecting to their last destination, but nobody can edit them again. This can&apos;t be undone.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <Input size="sm" label="Type DELETE to confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={error ?? undefined} className="w-[220px]" />
          <button
            type="button"
            disabled={busy || confirm !== "DELETE"}
            onClick={() => start(async () => {
              const r = await deleteAccountAction(confirm);
              if (!r.ok) setError(r.error);
            })}
            className="inline-flex h-10 items-center rounded-sm border border-danger/40 px-4 font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
          >
            Delete my account
          </button>
        </div>
      </section>
      <Toast message={toast} />
    </div>
  );
}

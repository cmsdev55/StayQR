"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetConfirmAction, type AuthState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewPasswordForm({ token }: { token: string }) {
  const [state, action, busy] = useActionState<AuthState, FormData>(resetConfirmAction, undefined);
  if (!token)
    return (
      <div>
        <h1 className="font-display text-display-md font-semibold text-fg">This link is incomplete</h1>
        <p className="mt-3 text-body text-fg-muted">Open the link from the email again, or <Link href="/login" className="text-fg underline underline-offset-4">ask for a new one</Link>.</p>
      </div>
    );
  return (
    <div>
      <h1 className="font-display text-display-md font-semibold text-fg">Choose a new password</h1>
      <p className="mt-3 text-body text-fg-muted">You&apos;ll be signed in here and signed out everywhere else.</p>
      <form action={action} className="mt-8 grid gap-5">
        <input type="hidden" name="token" value={token} />
        <Input label="New password" name="password" type="password" autoComplete="new-password" required minLength={8} error={state?.error} hint="At least 8 characters." />
        <Button type="submit" size="lg" disabled={busy} className="w-full">{busy ? "Saving" : "Save password"}</Button>
      </form>
    </div>
  );
}

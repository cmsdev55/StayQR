"use client";

import { useActionState } from "react";
import { updatePasswordAction, type AuthState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewPasswordForm() {
  const [state, action, busy] = useActionState<AuthState, FormData>(updatePasswordAction, undefined);
  return (
    <div>
      <h1 className="font-display text-display-md font-semibold text-fg">Choose a new password</h1>
      <p className="mt-3 text-body text-fg-muted">You&apos;ll stay signed in on this device.</p>
      <form action={action} className="mt-8 grid gap-5">
        <Input label="New password" name="password" type="password" autoComplete="new-password" required minLength={8} error={state?.error} hint="At least 8 characters." />
        <Button type="submit" size="lg" disabled={busy} className="w-full">{busy ? "Saving" : "Save password"}</Button>
      </form>
    </div>
  );
}

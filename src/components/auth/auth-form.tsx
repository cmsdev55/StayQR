"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PLAN_LABEL: Record<string, string> = {
  "pro-yearly": "Pro · $29 a year",
  "pro-monthly": "Pro · $3.99 a month",
  pro: "Pro · $29 a year",
  lifetime: "Lifetime · $79 once",
};

/** Mock auth: validates, shows a pending state, then lands in the dashboard. */
export function AuthForm({ mode, plan }: { mode: "login" | "signup"; plan?: string }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reset, setReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signup = mode === "signup";
  const planLabel = plan ? PLAN_LABEL[plan] : undefined;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const pw = String(data.get("password") ?? "");
    if (pw.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    setError(null);
    setBusy(true);
    setTimeout(() => router.push("/dashboard"), 700);
  };

  return (
    <div>
      <h1 className="font-display text-display-md font-semibold text-fg">{signup ? "Create your account" : "Welcome back"}</h1>
      <p className="mt-3 text-body text-fg-muted">
        {signup ? "Free to start. Your codes keep working, even if you leave." : "Log in to edit your codes and see your scans."}
      </p>

      {planLabel && (
        <p className="mt-6 flex items-center justify-between rounded-sm border border-line bg-glass-strong px-4 py-3 text-body-sm">
          <span className="text-fg-muted">You&apos;re starting</span>
          <span className="font-medium text-fg">{planLabel}</span>
        </p>
      )}

      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="glass mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-sm text-body font-medium text-fg transition-colors duration-fast ease-stay hover:bg-glass-strong"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2z" />
          <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 10l3.7-2.9z" />
          <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4z" />
        </svg>
        Continue with Google
      </button>

      <div className="my-8 flex items-center gap-4 font-mono text-[12px] text-fg-subtle" aria-hidden>
        <span className="h-px flex-1 bg-line" /> or with email <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="grid gap-5" noValidate={false}>
        {signup && <Input label="Name" name="name" autoComplete="name" required placeholder="Maria Lopez" />}
        <Input label="Work email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
        <Input
          label="Password"
          name="password"
          type={show ? "text" : "password"}
          autoComplete={signup ? "new-password" : "current-password"}
          required
          minLength={8}
          error={error}
          hint={signup ? "At least 8 characters." : undefined}
          trailing={
            <button type="button" onClick={() => setShow((s) => !s)} className="h-9 rounded-xs px-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-subtle transition-colors hover:text-fg">
              {show ? "Hide" : "Show"}
            </button>
          }
        />
        {!signup && (
          <div className="-mt-2 flex justify-end">
            <button type="button" onClick={() => setReset(true)} className="text-body-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline">
              Forgot password?
            </button>
          </div>
        )}
        {reset && (
          <p role="status" className="rounded-sm bg-accent/[0.1] px-3 py-2.5 text-body-sm text-fg">
            If that email has an account, a reset link is on its way.
          </p>
        )}
        <Button type="submit" size="lg" disabled={busy} className="mt-1 w-full">
          {busy ? (
            <>
              <span className="spinner size-4 rounded-full border-2 border-accent-ink/30 border-t-accent-ink" aria-hidden />
              {signup ? "Creating account" : "Logging in"}
            </>
          ) : signup ? "Create account" : "Log in"}
        </Button>
      </form>

      <p className="mt-8 text-body-sm text-fg-muted">
        {signup ? "Already have an account? " : "New to StayQR? "}
        <Link href={signup ? "/login" : "/signup"} className="font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
          {signup ? "Log in" : "Create an account"}
        </Link>
      </p>
      {signup && (
        <p className="mt-4 text-[12px] text-fg-subtle">
          By creating an account you agree to the{" "}
          <Link href="/terms" className="text-fg-muted underline decoration-line-strong underline-offset-2 hover:text-fg">Terms of Service</Link> and{" "}
          <Link href="/privacy" className="text-fg-muted underline decoration-line-strong underline-offset-2 hover:text-fg">Privacy Policy</Link>.
        </p>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ResendVerificationForm, StatusMark } from "@/components/auth/verify-email";
import { safeNext, validEmail } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Check your inbox", robots: { index: false, follow: false } };

/** After sign-up, or after logging in before confirming: the account opens from the emailed link. */
export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<{ email?: string; next?: string; reason?: string }> }) {
  const { email: raw, next, reason } = await searchParams;
  const email = raw && validEmail(raw) ? raw : undefined;
  const after = next ? safeNext(next) : undefined;
  return (
    <div>
      <StatusMark kind="mail" />
      <h1 className="font-display text-display-md font-semibold text-fg">{reason === "login" ? "Confirm your email to log in" : "Check your inbox"}</h1>
      <p className="mt-3 text-body text-fg-muted">
        {reason === "login" ? "Your account isn't confirmed yet. We've sent a new link to " : "We've sent a confirmation link to "}
        {email ? <span className="font-medium text-fg">{email}</span> : "your email address"}. Click it to activate your account, then log in.
      </p>

      <ol className="mt-8 grid gap-3 rounded-md border border-line bg-bg-raised p-5 text-body-sm text-fg-muted">
        {["Open the email from EndureQR", "Click “Confirm email address”", "Log in and start creating codes"].map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full border border-line font-mono text-[11px] text-fg">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      <p className="mt-8 text-body-sm text-fg-muted">The link works for 24 hours. Can&apos;t find it? Check your spam or promotions folder, or send it again.</p>
      <div className="mt-4">
        <ResendVerificationForm email={email} next={after} />
      </div>

      <p className="mt-8 text-body-sm text-fg-muted">
        Wrong address?{" "}
        <Link href="/signup" className="font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">Sign up again</Link>
        {" · "}
        <Link href={`/login${after ? `?next=${encodeURIComponent(after)}` : ""}`} className="font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">Back to log in</Link>
      </p>
    </div>
  );
}

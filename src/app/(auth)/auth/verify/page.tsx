import type { Metadata } from "next";
import Link from "next/link";
import { ResendVerificationForm, StatusMark } from "@/components/auth/verify-email";
import { ButtonLink } from "@/components/ui/button";
import { confirmEmailToken, getUser, safeNext } from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Confirm your email", robots: { index: false, follow: false } };

/** The link in the confirmation email: confirms the address, then sends the person on to log in. */
export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string; next?: string }> }) {
  const { token, next: rawNext } = await searchParams;
  const next = safeNext(rawNext);
  const confirmed = await confirmEmailToken(token ?? "");

  if (!confirmed)
    return (
      <div>
        <StatusMark kind="expired" />
        <h1 className="font-display text-display-md font-semibold text-fg">This link has expired</h1>
        <p className="mt-3 text-body text-fg-muted">
          Confirmation links work for 24 hours, and only the newest one works. Enter your email and we&apos;ll send a fresh link.
        </p>
        <div className="mt-8">
          <ResendVerificationForm next={next === "/dashboard" ? undefined : next} />
        </div>
        <p className="mt-8 text-body-sm text-fg-muted">
          Already confirmed?{" "}
          <Link href="/login" className="font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">Log in</Link>
        </p>
      </div>
    );

  const signedIn = (await getUser())?.id === confirmed.id;
  const login = new URLSearchParams({ verified: "1", email: confirmed.email });
  if (next !== "/dashboard") login.set("next", next);
  return (
    <div>
      <StatusMark kind="done" />
      <h1 className="font-display text-display-md font-semibold text-fg">Email verified</h1>
      <p className="mt-3 text-body text-fg-muted">
        Thanks for confirming <span className="font-medium text-fg">{confirmed.email}</span>. Your EndureQR account is active and ready to use.
      </p>
      <ButtonLink href={signedIn ? next : `/login?${login}`} size="lg" className="mt-8 w-full">
        {signedIn ? "Continue to your dashboard" : "Log in to your account"}
      </ButtonLink>
      <p className="mt-6 text-body-sm text-fg-subtle">Your dynamic codes stay editable after printing, and keep working even if you leave.</p>
    </div>
  );
}

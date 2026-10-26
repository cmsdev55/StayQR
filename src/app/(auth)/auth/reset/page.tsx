import type { Metadata } from "next";
import { NewPasswordForm } from "@/components/auth/new-password-form";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false, follow: false } };

/** From the password-reset email: the token travels with the form and is checked when it's submitted. */
export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <NewPasswordForm token={token ?? ""} />;
}

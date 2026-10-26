import type { Metadata } from "next";
import { NewPasswordForm } from "@/components/auth/new-password-form";
import { requireUser } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } };

/** Reached from the reset email (via /auth/callback, which signs the user in first). */
export default async function ResetPage() {
  await requireUser("/auth/reset");
  return <NewPasswordForm />;
}

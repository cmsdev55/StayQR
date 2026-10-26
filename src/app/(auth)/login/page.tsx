import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { getUser, safeNext } from "@/lib/server/auth";
import { googleEnabled } from "@/lib/server/env";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to EndureQR to edit your dynamic QR codes, see scans and manage billing.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ plan?: string; next?: string; error?: string }> }) {
  const { plan, next, error } = await searchParams;
  if (await getUser()) redirect(safeNext(next));
  return <AuthForm mode="login" plan={plan} next={next ? safeNext(next) : undefined} error={error} google={googleEnabled()} />;
}

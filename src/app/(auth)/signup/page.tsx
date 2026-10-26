import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { getUser, safeNext } from "@/lib/server/auth";
import { authMode } from "@/lib/server/env";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a StayQR account for dynamic QR codes you can edit after printing. They keep working if you cancel.",
  alternates: { canonical: "/signup" },
};

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ plan?: string; next?: string; error?: string }> }) {
  const { plan, next, error } = await searchParams;
  if (await getUser()) redirect(plan ? `/api/checkout?plan=${plan === "pro" ? "pro-yearly" : plan}` : safeNext(next));
  return <AuthForm mode="signup" plan={plan} next={next ? safeNext(next) : undefined} error={error} devLogin={authMode === "dev"} google={process.env.NEXT_PUBLIC_AUTH_GOOGLE === "1"} />;
}

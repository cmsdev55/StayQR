import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { getUser, safeNext } from "@/lib/server/auth";
import { authMode } from "@/lib/server/env";

export const metadata: Metadata = { title: "Log in", alternates: { canonical: "/login" } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ plan?: string; next?: string; error?: string }> }) {
  const { plan, next, error } = await searchParams;
  if (await getUser()) redirect(safeNext(next));
  return <AuthForm mode="login" plan={plan} next={next ? safeNext(next) : undefined} error={error} devLogin={authMode === "dev"} google={process.env.NEXT_PUBLIC_AUTH_GOOGLE === "1"} />;
}

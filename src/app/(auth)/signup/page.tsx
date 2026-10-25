import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Start free with StayQR. Dynamic QR codes you can edit after printing, and they keep working if you cancel.",
  alternates: { canonical: "/signup" },
};

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  return <AuthForm mode="signup" plan={plan} />;
}

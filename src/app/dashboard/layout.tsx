import type { Metadata } from "next";
import { AccountNotices } from "@/components/dashboard/account-notices";
import { AppShell } from "@/components/dashboard/app-shell";
import { requireUser } from "@/lib/server/auth";
import { getPlan } from "@/lib/server/plan";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · EndureQR" },
  description: "Manage your EndureQR codes, scans and billing.",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const plan = await getPlan(user.id);
  return (
    <AppShell user={{ name: user.name, email: user.email, timezone: user.timezone }} plan={plan}>
      <AccountNotices email={user.email} verified={user.verified} />
      {children}
    </AppShell>
  );
}

import type { Metadata } from "next";
import { SettingsView } from "@/components/dashboard/settings-view";
import { requireUser } from "@/lib/server/auth";
import { authMode } from "@/lib/server/env";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  return <SettingsView name={user.name ?? ""} email={user.email} timezone={user.timezone} canChangePassword={authMode === "supabase"} />;
}

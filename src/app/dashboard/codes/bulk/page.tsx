import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BulkCreate } from "@/components/dashboard/bulk-create";
import { requireUser } from "@/lib/server/auth";
import { BULK_LIMIT } from "@/lib/server/codes";
import { getPlan } from "@/lib/server/plan";

export const metadata: Metadata = { title: "Bulk create" };

export default async function BulkPage() {
  const user = await requireUser();
  if (!(await getPlan(user.id)).canEdit) redirect("/dashboard/billing");
  return <BulkCreate limit={BULK_LIMIT} />;
}

import type { Metadata } from "next";
import { CodesList } from "@/components/dashboard/codes-list";
import { requireUser } from "@/lib/server/auth";
import { listCodes, listFolders } from "@/lib/server/codes";
import { getPlan } from "@/lib/server/plan";

export const metadata: Metadata = { title: "QR codes" };

export default async function CodesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const user = await requireUser();
  const [codes, folders, plan] = await Promise.all([listCodes(user.id, user.timezone), listFolders(user.id), getPlan(user.id)]);
  return <CodesList key={q ?? ""} codes={codes} folders={folders} plan={plan} initialQuery={q ?? ""} />;
}

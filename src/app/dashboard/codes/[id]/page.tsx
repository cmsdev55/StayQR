import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CodeEditor } from "@/components/dashboard/code-editor";
import { CreatedToast } from "@/components/dashboard/created-toast";
import { requireUser } from "@/lib/server/auth";
import { getCode, listFolders } from "@/lib/server/codes";
import { shortHost } from "@/lib/server/env";
import { getPlan } from "@/lib/server/plan";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export const metadata: Metadata = { title: "Code" };

export default async function CodePage({ params, searchParams }: Props) {
  const { id } = await params;
  const user = await requireUser();
  const [plan, folders] = await Promise.all([getPlan(user.id), listFolders(user.id)]);
  if (id === "new") {
    if (!plan.canEdit) redirect("/dashboard/billing");
    return <CodeEditor code={null} folders={folders} plan={plan} shortHost={shortHost()} />;
  }
  const code = await getCode(user.id, id, user.timezone);
  if (!code) notFound();
  const { created } = await searchParams;
  return (
    <>
      <CodeEditor key={code.id} code={code} folders={folders} plan={plan} shortHost={shortHost()} />
      {created && <CreatedToast message="Code created · download it and print" />}
    </>
  );
}

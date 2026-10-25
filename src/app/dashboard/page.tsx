import type { Metadata } from "next";
import { CodesList } from "@/components/dashboard/codes-list";

export const metadata: Metadata = { title: "QR codes" };

export default async function CodesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return <CodesList key={q ?? ""} initialQuery={q ?? ""} />;
}

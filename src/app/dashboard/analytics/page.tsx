import type { Metadata } from "next";
import { AnalyticsView } from "@/components/dashboard/analytics-view";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  return <AnalyticsView key={code ?? "all"} initialCode={code ?? "all"} />;
}

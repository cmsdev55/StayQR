import type { Metadata } from "next";
import { PausedView } from "@/components/paused-view";

export const metadata: Metadata = {
  title: "This code is paused",
  robots: { index: false, follow: false },
};

/** Sample of the paused page (real codes render it at /p/[slug]). */
export default function PausedSamplePage() {
  return <PausedView owner="Osteria Rossa" site="osteria.co" reason="while we print the winter menu" back="Monday 3 November" />;
}

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PausedView } from "@/components/paused-view";
import { db } from "@/lib/server/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "This code is paused", robots: { index: false, follow: false } };

/** What a scanner sees while the owner has paused a dynamic code. */
export default async function PausedCodePage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug.toLowerCase();
  if (!/^[a-z0-9]{4,12}$/.test(slug)) notFound();
  const [c] = await db()<{ paused: boolean; pause_message: string | null; pause_until: Date | null; destination: string; owner: string | null }[]>`
    select c.paused, c.pause_message, c.pause_until, c.destination, p.name as owner
      from public.codes c left join public.profiles p on p.id = c.user_id where c.slug = ${slug}`;
  if (!c) notFound();
  if (!c.paused) redirect(`/r/${slug}`);
  const site = (() => {
    try {
      return new URL(c.destination).hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  })();
  return (
    <PausedView
      owner={c.owner}
      site={site}
      reason={c.pause_message}
      back={c.pause_until ? c.pause_until.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }) : null}
    />
  );
}

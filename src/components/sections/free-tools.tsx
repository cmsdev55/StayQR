import Link from "next/link";
import { GuideCards } from "@/components/content/guide-cards";
import { TypeGrid } from "@/components/content/type-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { GUIDES } from "@/content/guides";

/** Every free generator type and the newest guides, linked from the home page. */
export function FreeTools() {
  return (
    <section id="free-tools" aria-labelledby="free-tools-title" className="relative border-t border-line py-24 lg:py-40">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <SectionHeading
          id="free-tools-title"
          eyebrow="Free tools"
          title="A free generator for *every code.*"
          intro="Links, WiFi, contact cards, WhatsApp, social profiles and more. Each one is free, needs no account, and never expires."
        />
        <TypeGrid className="mt-12" />
        <div className="mt-20 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-h3 font-semibold text-fg">Guides before you print</h3>
          <Link href="/guides" className="text-body-sm font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">All guides</Link>
        </div>
        <div className="mt-8"><GuideCards guides={GUIDES.slice(0, 3)} /></div>
      </div>
    </section>
  );
}

import { LegalTabs } from "@/components/legal/legal-tabs";

/** Shared frame for /terms and /privacy: tab switch on top, document below. */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-container px-4 pb-24 pt-28 sm:px-6 sm:pt-36 lg:pb-32">
      <div className="fade-up flex flex-wrap items-center justify-between gap-4" style={{ ["--d" as string]: "0ms" }}>
        <p className="eyebrow">Legal</p>
        <LegalTabs />
      </div>
      <div className="mt-10 sm:mt-14">{children}</div>
    </main>
  );
}

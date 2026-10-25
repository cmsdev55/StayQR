/** Shared frame for /terms and /privacy. */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-container px-4 pb-24 pt-28 sm:px-6 sm:pt-36 lg:pb-32">
      <p className="eyebrow fade-up" style={{ ["--d" as string]: "0ms" }}>Legal</p>
      <div className="mt-6">{children}</div>
    </main>
  );
}

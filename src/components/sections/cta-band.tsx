import { ButtonLink } from "@/components/ui/button";

/** Closing call to action for inner pages: no 3D, just the grid and one lime button. */
export function CtaBand({
  title = "Print it once. Keep it forever.",
  body = "Make your first dynamic code in a minute. If you ever leave, it keeps working.",
  href = "/signup",
  cta = "Start free",
}: {
  title?: string;
  body?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <section aria-label="Get started" className="border-t border-line py-24 lg:py-32">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <div className="noise bg-grid relative isolate overflow-hidden rounded-xl border border-line px-6 py-16 text-center sm:px-12 sm:py-20" data-reveal="">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-full -z-10 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(closest-side,rgb(var(--depth)/0.22),transparent)]" />
          <h2 className="mx-auto max-w-[18ch] font-display text-display-lg font-semibold text-fg [text-wrap:balance]">{title}</h2>
          <p className="mx-auto mt-5 max-w-[48ch] text-body-lg text-fg-muted">{body}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={href} size="lg">{cta}</ButtonLink>
            <ButtonLink href="/pricing" size="lg" variant="secondary">See pricing</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

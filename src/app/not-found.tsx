import Link from "next/link";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="noise bg-grid relative isolate flex min-h-[100svh] flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="absolute left-4 top-5 flex items-center gap-2.5 text-fg sm:left-6" aria-label="StayQR home">
        <Logo />
        <span className="font-display text-[20px] font-semibold tracking-[-0.02em]">StayQR</span>
      </Link>
      <p className="eyebrow">404</p>
      <h1 className="mt-4 max-w-[16ch] font-display text-display-lg font-semibold text-fg [text-wrap:balance]">This page doesn&apos;t exist. Your codes still do.</h1>
      <p className="mt-5 max-w-[44ch] text-body-lg text-fg-muted">The link may be old or mistyped. Everything else is where you left it.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">Back to home</ButtonLink>
        <ButtonLink href="/dashboard" size="lg" variant="secondary">Open dashboard</ButtonLink>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { USER } from "@/content/dashboard";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "QR codes", icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
  { href: "/dashboard/billing", label: "Billing", icon: "M3 6h18v12H3zM3 10h18M7 15h4" },
];

function active(path: string, href: string) {
  return href === "/dashboard" ? path === "/dashboard" || path.startsWith("/dashboard/codes") : path.startsWith(href);
}

/** Dashboard frame (DESIGN.md §8): calm, solid surfaces, no 3D, no pinning, 150ms route fades. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const onList = path === "/dashboard";

  return (
    <div className="min-h-[100svh] text-body-sm lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-bg-overlay focus:px-4 focus:py-2">
        Skip to content
      </a>

      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-[100svh] flex-col border-r border-line bg-bg-raised px-3 py-5 lg:flex" aria-label="Dashboard">
        <Link href="/" className="flex items-center gap-2.5 px-3 text-fg" aria-label="StayQR home">
          <Logo />
          <span className="font-display text-[19px] font-semibold tracking-[-0.02em]">StayQR</span>
        </Link>
        <nav className="mt-8 flex flex-col gap-0.5" aria-label="Sections">
          {NAV.map((n) => {
            const on = active(path, n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-sm px-3 font-medium transition-colors duration-fast ease-stay",
                  on ? "bg-bg-overlay text-fg shadow-inner-glow" : "text-fg-muted hover:bg-glass-strong hover:text-fg",
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={n.icon} />
                </svg>
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <div className="rounded-md border border-line bg-bg p-4">
            <p className="flex items-center justify-between font-medium text-fg">
              Pro · yearly
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-subtle"><span className="size-1.5 rounded-full bg-accent" /> active</span>
            </p>
            <p className="mt-1 text-[13px] text-fg-muted">Renews 14 Mar 2027</p>
            <Link href="/dashboard/billing" className="mt-3 inline-block text-[13px] font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
              Switch to lifetime
            </Link>
          </div>
          <div className="flex items-center gap-3 px-1">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-fg text-[12px] font-semibold text-bg">{USER.initials}</span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-medium text-fg">{USER.name}</span>
              <span className="truncate text-[12px] text-fg-subtle">{USER.email}</span>
            </span>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 lg:px-8">
            <Link href="/" className="text-fg lg:hidden" aria-label="StayQR home"><Logo /></Link>
            <form
              role="search"
              className="relative ml-1 min-w-0 flex-1 lg:ml-0 lg:max-w-[420px]"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/dashboard${q ? `?q=${encodeURIComponent(q)}` : ""}`);
              }}
            >
              <label htmlFor="global-search" className="sr-only">Search codes</label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" aria-hidden><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              <input
                id="global-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search codes, links, folders"
                className="h-10 w-full rounded-sm border border-line bg-bg-raised pl-9 pr-12 text-body-sm text-fg placeholder:text-fg-subtle transition-colors duration-fast ease-stay hover:border-line-strong focus:border-accent focus:outline-none [[data-theme=light]_&]:focus:border-accent-text"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-[6px] border border-line px-1.5 font-mono text-[11px] text-fg-subtle sm:block">↵</kbd>
            </form>
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <ButtonLink href="/dashboard/codes/new" aria-label="New code" size="sm" variant={onList ? "primary" : "secondary"} className="h-10 px-3 sm:px-4">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M7 2v10M2 7h10" /></svg>
                <span className="hidden sm:inline">New code</span>
              </ButtonLink>
            </div>
          </div>
          {/* phones: section tabs */}
          <nav className="flex gap-1 overflow-x-auto px-3 pb-2 lg:hidden" aria-label="Sections">
            {NAV.map((n) => {
              const on = active(path, n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={on ? "page" : undefined}
                  className={cn("flex h-9 shrink-0 items-center rounded-full px-3.5 font-medium", on ? "bg-bg-overlay text-fg shadow-inner-glow" : "text-fg-muted")}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main id="main" className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

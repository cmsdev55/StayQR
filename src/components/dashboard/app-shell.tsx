"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setTimezoneAction } from "@/app/dashboard/actions";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import type { Plan } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "QR codes", icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
  { href: "/dashboard/billing", label: "Billing", icon: "M3 6h18v12H3zM3 10h18M7 15h4" },
  { href: "/dashboard/settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" },
];

const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");

/** Sidebar plan card: what you have, and the one next step that matters. */
function PlanCard({ plan }: { plan: Plan }) {
  const [title, sub, dot, link]: [string, string, boolean, { href: string; label: string } | null] =
    plan.tier === "lifetime"
      ? ["Lifetime", "Paid once. No renewals.", true, null]
      : plan.tier === "pro" && plan.status === "cancelled"
        ? [`Pro · ${plan.plan === "pro-monthly" ? "monthly" : "yearly"}`, `Ends ${fmtDate(plan.endsAt)}`, false, { href: "/dashboard/billing", label: "Resume plan" }]
        : plan.tier === "pro"
          ? [`Pro · ${plan.plan === "pro-monthly" ? "monthly" : "yearly"}`, plan.renewsAt ? `Renews ${fmtDate(plan.renewsAt)}` : "Active", true, { href: "/dashboard/billing", label: "Switch to lifetime" }]
          : plan.lapsed
            ? ["Plan ended", "Your codes still work.", false, { href: "/dashboard/billing", label: "Resume to edit" }]
            : ["No plan yet", "Pick a plan to make dynamic codes.", false, { href: "/dashboard/billing", label: "See plans" }];
  return (
    <div className="rounded-md border border-line bg-bg p-4">
      <p className="flex items-center justify-between font-medium text-fg">
        {title}
        {dot && <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-subtle"><span className="size-1.5 rounded-full bg-accent" /> active</span>}
      </p>
      <p className="mt-1 text-[13px] text-fg-muted">{sub}</p>
      {link && (
        <Link href={link.href} className="mt-3 inline-block text-[13px] font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
          {link.label}
        </Link>
      )}
    </div>
  );
}

function active(path: string, href: string) {
  return href === "/dashboard" ? path === "/dashboard" || path.startsWith("/dashboard/codes") : path.startsWith(href);
}

/** Dashboard frame (DESIGN.md §8): calm, solid surfaces, no 3D, no pinning, 150ms route fades. */
export function AppShell({ children, user, plan }: { children: React.ReactNode; user: { name: string | null; email: string; timezone: string }; plan: Plan }) {
  const path = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const onList = path === "/dashboard";
  const display = user.name || user.email.split("@")[0];
  const initials = display.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");

  // analytics use the browser's time zone: store it once, quietly
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz !== user.timezone) setTimezoneAction(tz).catch(() => {});
  }, [user.timezone]);

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
          <PlanCard plan={plan} />
          <div className="flex items-center gap-3 px-1">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-fg text-[12px] font-semibold text-bg">{initials}</span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-medium text-fg">{display}</span>
              <span className="truncate text-[12px] text-fg-subtle">{user.email}</span>
            </span>
            <form action="/auth/signout" method="post">
              <button type="submit" aria-label="Log out" title="Log out" className="grid size-9 place-items-center rounded-sm text-fg-subtle transition-colors hover:bg-glass-strong hover:text-fg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" /></svg>
              </button>
            </form>
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
              {plan.canEdit && <ButtonLink href="/dashboard/codes/new" aria-label="New code" size="sm" variant={onList ? "primary" : "secondary"} className="h-10 px-3 sm:px-4">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M7 2v10M2 7h10" /></svg>
                <span className="hidden sm:inline">New code</span>
              </ButtonLink>}
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

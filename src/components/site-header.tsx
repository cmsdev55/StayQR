"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#generator", label: "Free generator" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#industries", label: "Industries" },
  { href: "/#compare", label: "Compare" },
];

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark"), []);
  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("stayqr-theme", next); } catch {}
    setTheme(next);
  };
  return (
    <button
      type="button"
      onClick={flip}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="grid size-10 place-items-center rounded-sm text-fg-muted transition-colors duration-fast ease-stay hover:bg-glass-strong hover:text-fg"
    >
      {theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
      )}
    </button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-base ease-stay",
        scrolled || open ? "border-line bg-bg/75 backdrop-blur-xl" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-wide items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-12">
        <Link href="/" aria-label="StayQR home" className="flex items-center gap-2.5 text-fg">
          <Logo />
          <span className="font-display text-[20px] font-semibold tracking-[-0.02em]">StayQR</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-body-sm font-medium text-fg-muted transition-colors duration-fast ease-stay hover:text-fg">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden h-10 items-center px-3.5 text-body-sm font-medium text-fg-muted transition-colors hover:text-fg sm:inline-flex">
            Log in
          </Link>
          <ButtonLink href="/#generator" size="sm" className="hidden sm:inline-flex">
            Create free QR
          </ButtonLink>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-sm text-fg lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line px-4 pb-6 pt-2 lg:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex h-12 items-center border-b border-line text-body font-medium text-fg">
              {n.label}
            </Link>
          ))}
          <Link href="/login" className="flex h-12 items-center text-body font-medium text-fg-muted">Log in</Link>
          <ButtonLink href="/#generator" className="mt-3 w-full">Create free QR</ButtonLink>
        </nav>
      </div>
    </header>
  );
}

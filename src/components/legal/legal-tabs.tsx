"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

/** Terms / Privacy switch: a segmented pill of real links (each page is its own URL). */
export function LegalTabs() {
  const path = usePathname();
  return (
    <nav aria-label="Legal documents" className="glass inline-flex rounded-full p-1">
      {TABS.map((t) => {
        const on = path === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={on ? "page" : undefined}
            className={cn(
              "inline-flex h-10 items-center rounded-full px-5 text-body-sm font-medium transition-colors duration-fast ease-stay",
              on ? "bg-fg text-bg" : "text-fg-muted hover:text-fg",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

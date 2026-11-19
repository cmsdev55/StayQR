import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/site-header";
import { requireAdmin } from "@/lib/server/admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · EndureQR admin" },
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/activity", label: "Activity log" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5 font-semibold">
            <Logo size={22} />
            <span>EndureQR</span>
            <span className="rounded-full bg-danger/[0.12] px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-danger">Admin</span>
          </Link>
          <nav aria-label="Admin" className="flex items-center gap-1 overflow-x-auto">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-sm px-3 py-2 text-body-sm text-fg-muted transition-colors hover:bg-glass-strong hover:text-fg">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-mono text-[12px] text-fg-subtle md:inline">{admin.email}</span>
            <Link href="/dashboard" className="text-body-sm text-fg-muted hover:text-fg">Dashboard</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}

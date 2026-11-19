"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SessionInfo } from "@/app/api/session/route";
import { cn } from "@/lib/utils";

export type SessionUser = NonNullable<SessionInfo["user"]>;

/** The signed-in user for the public header: undefined while checking, null when signed out. */
export function useSession() {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    fetch("/api/session", { cache: "no-store", credentials: "same-origin" })
      .then((r) => (r.ok ? (r.json() as Promise<SessionInfo>) : { user: null }))
      .then((s) => live && setUser(s.user))
      .catch(() => live && setUser(null));
    return () => { live = false; };
  }, []);
  return user;
}

export const initialsOf = (u: Pick<SessionUser, "name" | "email">) =>
  (u.name || u.email.split("@")[0]).split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "?";

export const accountLinks = (u: SessionUser) => [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/settings", label: "Settings" },
  ...(u.admin ? [{ href: "/admin", label: "Admin" }] : []),
];

export function Avatar({ user, className }: { user: SessionUser; className?: string }) {
  return (
    <span aria-hidden className={cn("grid size-9 shrink-0 place-items-center rounded-full bg-fg text-[12px] font-semibold text-bg", className)}>
      {initialsOf(user)}
    </span>
  );
}

export function LogoutButton({ className, menuItem }: { className?: string; menuItem?: boolean }) {
  return (
    <form action="/auth/signout" method="post">
      <button type="submit" role={menuItem ? "menuitem" : undefined} className={className}>Log out</button>
    </form>
  );
}

/** Avatar button with a dropdown: who you are, your plan, account links and log out. Escape or a click outside closes it. */
export function AccountMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); button.current?.focus(); } };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  const item = "flex h-10 w-full items-center rounded-sm px-3 text-left text-body-sm text-fg-muted transition-colors hover:bg-glass-strong hover:text-fg focus-visible:bg-glass-strong focus-visible:text-fg focus-visible:outline-none";
  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.name || user.email}`}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full p-0.5 pr-2 transition-colors hover:bg-glass-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <Avatar user={user} />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("text-fg-subtle transition-transform duration-fast", open && "rotate-180")}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div role="menu" aria-label="Account" className="absolute right-0 top-full z-50 mt-2 w-64 rounded-md border border-line bg-bg-overlay p-1.5 shadow-lg">
          <div className="flex items-center gap-3 px-3 pb-3 pt-2">
            <Avatar user={user} />
            <div className="min-w-0">
              {user.name && <p className="truncate text-body-sm font-medium text-fg">{user.name}</p>}
              <p className="truncate text-[13px] text-fg-subtle">{user.email}</p>
            </div>
          </div>
          <p className="mx-3 mb-2 inline-flex h-6 items-center rounded-full bg-accent/[0.14] px-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-text">{user.plan} plan</p>
          <div className="border-t border-line pt-1.5">
            {accountLinks(user).map((l) => (
              <Link key={l.href} href={l.href} role="menuitem" onClick={() => setOpen(false)} className={item}>{l.label}</Link>
            ))}
          </div>
          <div className="mt-1.5 border-t border-line pt-1.5">
            <LogoutButton className={item} menuItem />
          </div>
        </div>
      )}
    </div>
  );
}

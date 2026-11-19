"use client";

import { useState, useTransition } from "react";
import type { AdminResult } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function Feedback({ result }: { result: AdminResult | null }) {
  if (!result) return null;
  return (
    <p role="status" className={cn("mt-2 text-body-sm", result.ok ? "text-accent-text" : "text-danger")}>
      {result.ok ? result.message ?? "Done." : result.error}
    </p>
  );
}

/** One button for one admin action; `confirm` asks first. */
export function ActionButton({ run, label, confirm, variant = "secondary", danger }: { run: () => Promise<AdminResult>; label: string; confirm?: string; variant?: "primary" | "secondary" | "ghost"; danger?: boolean }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<AdminResult | null>(null);
  return (
    <div>
      <Button
        type="button"
        size="sm"
        variant={variant}
        disabled={pending}
        className={cn(danger && "text-danger [box-shadow:inset_0_0_0_1px_rgb(var(--danger)/0.45)]")}
        onClick={() => {
          if (confirm && !window.confirm(confirm)) return;
          start(async () => setResult(await run()));
        }}
      >
        {pending ? "Working…" : label}
      </Button>
      <Feedback result={result} />
    </div>
  );
}

/** A text box plus a button, for actions that need a reason or a note. */
export function ReasonForm({ run, label, placeholder, submit, required = true, danger, confirm }: { run: (text: string) => Promise<AdminResult>; label: string; placeholder: string; submit: string; required?: boolean; danger?: boolean; confirm?: string }) {
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const [result, setResult] = useState<AdminResult | null>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (confirm && !window.confirm(confirm)) return;
        start(async () => {
          const r = await run(text);
          setResult(r);
          if (r.ok) setText("");
        });
      }}
    >
      <label className="block text-body-sm text-fg-muted">
        {label}
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} maxLength={300} required={required} className={cn(fieldClass, "h-10 px-3 text-body-sm")} />
          <Button type="submit" size="sm" variant="secondary" disabled={pending} className={cn("shrink-0", danger && "text-danger [box-shadow:inset_0_0_0_1px_rgb(var(--danger)/0.45)]")}>
            {pending ? "Working…" : submit}
          </Button>
        </div>
      </label>
      <Feedback result={result} />
    </form>
  );
}

export function ProfileForm({ run, name, email }: { run: (input: { name: string; email: string }) => Promise<AdminResult>; name: string; email: string }) {
  const [v, setV] = useState({ name, email });
  const [pending, start] = useTransition();
  const [result, setResult] = useState<AdminResult | null>(null);
  return (
    <form onSubmit={(e) => { e.preventDefault(); start(async () => setResult(await run(v))); }} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <label className="text-body-sm text-fg-muted">
        Name
        <input value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} maxLength={80} className={cn(fieldClass, "mt-1.5 h-10 px-3 text-body-sm")} />
      </label>
      <label className="text-body-sm text-fg-muted">
        Email
        <input type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} required maxLength={254} className={cn(fieldClass, "mt-1.5 h-10 px-3 text-body-sm")} />
      </label>
      <Button type="submit" size="sm" disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
      <div className="sm:col-span-3"><Feedback result={result} /></div>
    </form>
  );
}

/** Deleting needs the account's email typed out, so it can't happen by a stray click. */
export function DeleteForm({ run, email }: { run: (confirm: string) => Promise<AdminResult>; email: string }) {
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const [result, setResult] = useState<AdminResult | null>(null);
  const match = text.trim().toLowerCase() === email.toLowerCase();
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (match) start(async () => setResult(await run(text))); }}>
      <label className="block text-body-sm text-fg-muted">
        Type <span className="font-mono text-fg">{email}</span> to confirm
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input value={text} onChange={(e) => setText(e.target.value)} autoComplete="off" className={cn(fieldClass, "h-10 px-3 text-body-sm")} />
          <Button type="submit" size="sm" variant="secondary" disabled={!match || pending} className="shrink-0 text-danger [box-shadow:inset_0_0_0_1px_rgb(var(--danger)/0.45)]">
            {pending ? "Deleting…" : "Delete account"}
          </Button>
        </div>
      </label>
      <Feedback result={result} />
    </form>
  );
}

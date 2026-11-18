"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Sends the user to Creem's secure hosted checkout; Creem returns them to /dashboard/billing?checkout=done. */
export function CheckoutButton({ plan, children, variant, size = "sm", className }: { plan: "pro-monthly" | "pro-yearly" | "lifetime"; children: React.ReactNode; variant?: "primary" | "secondary"; size?: "sm" | "md" | "lg"; className?: string }) {
  const [busy, setBusy] = useState(false);

  const open = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/checkout?plan=${plan}&format=json`, { cache: "no-store" });
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch {
      window.location.href = `/api/checkout?plan=${plan}`;
      setBusy(false);
    }
  };

  return (
    <Button type="button" variant={variant} size={size} className={className} onClick={open} disabled={busy}>
      {busy ? "Opening secure checkout…" : children}
    </Button>
  );
}

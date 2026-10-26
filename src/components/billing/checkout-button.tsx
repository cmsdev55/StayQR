"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type LemonWindow = Window & {
  createLemonSqueezy?: () => void;
  LemonSqueezy?: { Setup: (o: { eventHandler: (e: { event: string }) => void }) => void; Url: { Open: (url: string) => void } };
};

let lemonJs: Promise<void> | null = null;
/** Lemon Squeezy's overlay script, loaded on the first click only. */
function loadLemon() {
  return (lemonJs ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://app.lemonsqueezy.com/js/lemon.js";
    s.defer = true;
    s.onload = () => {
      (window as LemonWindow).createLemonSqueezy?.();
      resolve();
    };
    s.onerror = () => {
      lemonJs = null;
      reject(new Error("lemon.js failed to load"));
    };
    document.head.appendChild(s);
  }));
}

/**
 * Opens the card checkout as an overlay on top of StayQR. If the overlay can't load (blocked script, old browser),
 * it falls back to Lemon Squeezy's full checkout page, which accepts the same cards.
 */
export function CheckoutButton({ plan, children, variant, size = "sm", className }: { plan: "pro-monthly" | "pro-yearly" | "lifetime"; children: React.ReactNode; variant?: "primary" | "secondary"; size?: "sm" | "md" | "lg"; className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const open = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/checkout?plan=${plan}&format=json`, { cache: "no-store" });
      const data = (await res.json()) as { url: string; overlay?: boolean };
      if (!data.overlay) return void (window.location.href = data.url);
      try {
        await loadLemon();
        const w = window as LemonWindow;
        w.LemonSqueezy!.Setup({
          eventHandler: (e) => {
            if (e.event === "Checkout.Success") router.push("/dashboard/billing?checkout=done");
          },
        });
        w.LemonSqueezy!.Url.Open(data.url);
      } catch {
        window.location.href = data.url;
      }
    } catch {
      window.location.href = `/api/checkout?plan=${plan}`;
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button type="button" variant={variant} size={size} className={className} onClick={open} disabled={busy}>
      {busy ? "Opening secure checkout…" : children}
    </Button>
  );
}

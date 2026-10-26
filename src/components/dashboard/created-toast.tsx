"use client";

import { useEffect, useState } from "react";
import { Toast } from "@/components/dashboard/toast";

/** One-off confirmation after a redirect (e.g. a new code was just created). */
export function CreatedToast({ message }: { message: string }) {
  const [shown, setShown] = useState<string | null>(message);
  useEffect(() => {
    const t = setTimeout(() => setShown(null), 2800);
    window.history.replaceState(null, "", window.location.pathname);
    return () => clearTimeout(t);
  }, []);
  return <Toast message={shown} raised />;
}

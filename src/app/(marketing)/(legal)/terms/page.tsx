import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { TERMS } from "@/content/legal";

export const metadata: Metadata = { title: { absolute: "EndureQR Terms of Service: Refunds, Cancelling, Your Codes" }, description: TERMS.description, alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <LegalDocument doc={TERMS} />;
}

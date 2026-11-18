import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { PRIVACY } from "@/content/legal";

export const metadata: Metadata = { title: { absolute: "EndureQR Privacy Policy: What We Collect and Why" }, description: PRIVACY.description, alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <LegalDocument doc={PRIVACY} />;
}

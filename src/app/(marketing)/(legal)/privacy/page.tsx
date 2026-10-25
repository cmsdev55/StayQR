import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { PRIVACY } from "@/content/legal";

export const metadata: Metadata = { title: PRIVACY.title, description: PRIVACY.description, alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <LegalDocument doc={PRIVACY} />;
}

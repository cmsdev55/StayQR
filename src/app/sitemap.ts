import type { MetadataRoute } from "next";
import { COMPETITORS } from "@/content/competitors";
import { GUIDES } from "@/content/guides";
import { INDUSTRIES } from "@/content/industries";
import { QR_TYPES } from "@/lib/qr-types";

import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

/** When the marketing pages' copy last changed. Bump it with the content, not on every deploy (guides carry their own date). */
const PAGES_UPDATED = "2026-11-03";
/** Terms and Privacy follow their effective date. */
const LEGAL_UPDATED = "2026-11-03";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, lastModified = PAGES_UPDATED) => ({ url: `${BASE}${path}`, lastModified });
  return [
    page(""),
    page("/pricing"),
    page("/qr-code-generator"),
    ...["qr-code-with-logo", "dynamic-qr-code-generator", "app-download-qr-code", "bulk-qr-code-generator"].map((s) => page(`/${s}`)),
    ...QR_TYPES.map((t) => page(`/qr-code-generator/${t.slug}`)),
    page("/guides", GUIDES.reduce((a, g) => (g.updated > a ? g.updated : a), "")),
    ...GUIDES.map((g) => page(`/guides/${g.slug}`, g.updated)),
    page("/about"),
    page("/contact"),
    page("/terms", LEGAL_UPDATED),
    page("/privacy", LEGAL_UPDATED),
    ...INDUSTRIES.map((i) => page(`/industries/${i.slug}`)),
    ...COMPETITORS.map((c) => page(`/alternatives/${c.slug}`)),
  ];
}

import type { MetadataRoute } from "next";
import { COMPETITORS } from "@/content/competitors";
import { GUIDES } from "@/content/guides";
import { INDUSTRIES } from "@/content/industries";
import { QR_TYPES } from "@/lib/qr-types";

const BASE = "https://stayqr.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, priority: 1 },
    { url: `${BASE}/pricing`, priority: 0.9 },
    { url: `${BASE}/qr-code-generator`, priority: 0.9 },
    ...QR_TYPES.map((t) => ({ url: `${BASE}/qr-code-generator/${t.slug}`, priority: 0.8 })),
    { url: `${BASE}/guides`, priority: 0.7 },
    ...GUIDES.map((g) => ({ url: `${BASE}/guides/${g.slug}`, lastModified: g.updated, priority: 0.7 })),
    { url: `${BASE}/signup`, priority: 0.5 },
    { url: `${BASE}/login`, priority: 0.3 },
    { url: `${BASE}/about`, priority: 0.4 },
    { url: `${BASE}/contact`, priority: 0.4 },
    { url: `${BASE}/terms`, priority: 0.2 },
    { url: `${BASE}/privacy`, priority: 0.2 },
    ...INDUSTRIES.map((i) => ({ url: `${BASE}/industries/${i.slug}`, priority: 0.7 })),
    ...COMPETITORS.map((c) => ({ url: `${BASE}/alternatives/${c.slug}`, priority: 0.7 })),
  ];
}

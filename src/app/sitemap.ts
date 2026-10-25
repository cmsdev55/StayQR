import type { MetadataRoute } from "next";
import { COMPETITORS } from "@/content/competitors";
import { INDUSTRIES } from "@/content/industries";

const BASE = "https://stayqr.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, priority: 1 },
    { url: `${BASE}/pricing`, priority: 0.9 },
    { url: `${BASE}/signup`, priority: 0.5 },
    { url: `${BASE}/login`, priority: 0.3 },
    ...INDUSTRIES.map((i) => ({ url: `${BASE}/industries/${i.slug}`, priority: 0.7 })),
    ...COMPETITORS.map((c) => ({ url: `${BASE}/alternatives/${c.slug}`, priority: 0.7 })),
  ];
}

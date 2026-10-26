/**
 * The public site address, from NEXT_PUBLIC_SITE_URL (inlined at build, so it works on server and client).
 * Every canonical, sitemap entry, Open Graph URL and JSON-LD id is built from this, never hard-coded.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://stayqr-six.vercel.app").replace(/\/$/, "");
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
export const siteUrl = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`;

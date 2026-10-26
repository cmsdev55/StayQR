import { after } from "next/server";
import { db } from "@/lib/server/db";
import { parseUa } from "@/lib/ua";

export const dynamic = "force-dynamic";

type Row = { id: string; destination: string; ios_url: string | null; android_url: string | null; paused: boolean; disabled_at: Date | null };

const page = (status: number, title: string, body: string) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} · StayQR</title>
<style>body{margin:0;min-height:100svh;display:grid;place-items:center;background:#07080B;color:#F2F4F7;font:16px/1.55 system-ui,-apple-system,Segoe UI,sans-serif;padding:24px}main{max-width:420px;text-align:center}h1{font-size:24px;line-height:1.2;margin:0 0 12px}p{color:#A3A9B6;margin:0 0 24px}a{color:#F2F4F7}</style></head>
<body><main><h1>${title}</h1><p>${body}</p><a href="/">StayQR</a></main></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } },
  );

/**
 * A printed dynamic code lands here. It never checks billing: codes keep redirecting after a plan ends (Terms §6).
 * The scan is recorded after the response is sent, so it never slows the redirect down.
 */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug.toLowerCase();
  if (!/^[a-z0-9]{4,12}$/.test(slug)) return page(404, "This code doesn't exist", "Check that the whole code is in view and scan it again.");

  const [code] = await db()<Row[]>`select id, destination, ios_url, android_url, paused, disabled_at from public.codes where slug = ${slug}`;
  if (!code) return page(404, "This code doesn't exist", "Check that the whole code is in view and scan it again.");
  if (code.disabled_at) return page(410, "This code has been disabled", "StayQR switched off this code because its link was reported as harmful. For your safety, it no longer opens.");

  const ua = parseUa(req.headers.get("user-agent"));
  const h = req.headers;
  if (!ua.bot && req.method === "GET") {
    const city = h.get("x-vercel-ip-city");
    const country = h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry");
    after(async () => {
      try {
        await db()`insert into public.scans (code_id, country, city, device, os, browser)
                   values (${code.id}, ${country && country !== "XX" ? country : null}, ${city ? decodeURIComponent(city) : null}, ${ua.device}, ${ua.os}, ${ua.browser})`;
      } catch (e) {
        console.error("scan insert failed", slug, e);
      }
    });
  }

  const target = code.paused ? `/p/${slug}` : (ua.os === "ios" && code.ios_url) || (ua.os === "android" && code.android_url) || code.destination;
  return new Response(null, { status: 302, headers: { location: target, "cache-control": "private, no-store", "x-robots-tag": "noindex" } });
}

export const HEAD = GET;

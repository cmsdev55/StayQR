/** ads.txt for AdSense, generated from NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-…). 404 until it is set. */
export const dynamic = "force-static";

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return new Response("Not found", { status: 404 });
  const pub = client.replace(/^ca-/, "");
  return new Response(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, { headers: { "content-type": "text/plain; charset=utf-8" } });
}

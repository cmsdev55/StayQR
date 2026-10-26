import { processWebhook, verifySignature } from "@/lib/server/billing";

export const dynamic = "force-dynamic";

/** Lemon Squeezy → StayQR. Signed with LEMONSQUEEZY_WEBHOOK_SECRET; 500 makes Lemon Squeezy retry. */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("x-signature"))) return new Response("Invalid signature", { status: 401 });
  try {
    const r = await processWebhook(raw);
    return Response.json({ ok: true, ...r });
  } catch (e) {
    console.error("lemonsqueezy webhook failed", e);
    return new Response("Webhook processing failed", { status: 500 });
  }
}

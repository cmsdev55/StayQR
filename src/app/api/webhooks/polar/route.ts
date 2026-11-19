import { processWebhook, verifySignature } from "@/lib/server/billing";

export const dynamic = "force-dynamic";

/** Polar → EndureQR. Standard Webhooks signature with POLAR_WEBHOOK_SECRET; 500 makes Polar retry. */
export async function POST(req: Request) {
  const raw = await req.text();
  const h = { id: req.headers.get("webhook-id"), timestamp: req.headers.get("webhook-timestamp"), signature: req.headers.get("webhook-signature") };
  if (!verifySignature(raw, h)) return new Response("Invalid signature", { status: 403 });
  try {
    const r = await processWebhook(raw);
    return Response.json({ ok: true, ...r });
  } catch (e) {
    console.error("polar webhook failed", e);
    return new Response("Webhook processing failed", { status: 500 });
  }
}

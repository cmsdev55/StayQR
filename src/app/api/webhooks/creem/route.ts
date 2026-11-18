import { processWebhook, verifySignature } from "@/lib/server/billing";

export const dynamic = "force-dynamic";

/** Creem → EndureQR. Signed with CREEM_WEBHOOK_SECRET (header creem-signature); 500 makes Creem retry. */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("creem-signature"))) return new Response("Invalid signature", { status: 401 });
  try {
    const r = await processWebhook(raw);
    return Response.json({ ok: true, ...r });
  } catch (e) {
    console.error("creem webhook failed", e);
    return new Response("Webhook processing failed", { status: 500 });
  }
}

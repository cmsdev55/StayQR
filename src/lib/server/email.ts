import "server-only";
import { env } from "./env";

/**
 * Transactional email through Resend (RESEND_API_KEY + EMAIL_FROM). Without a key (local development) the message
 * is printed to the server log so the links can still be followed.
 */
export async function sendEmail(to: string, subject: string, text: string, html: string) {
  if (!env.resendKey) {
    console.log(`\n✉️  [email not sent: RESEND_API_KEY unset] to=${to}\n   ${subject}\n${text.replace(/^/gm, "   ")}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.emailFrom, to: [to], subject, text, html, reply_to: "hello@stayqr.com" }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** One plain, accessible layout for every StayQR email. */
function layout(heading: string, body: string, cta: { label: string; url: string }, footer: string) {
  return `<!doctype html><html><body style="margin:0;background:#F5F6F2;font:16px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0B0D12">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:480px;background:#fff;border-radius:16px;padding:32px" cellpadding="0" cellspacing="0"><tr><td>
<p style="margin:0 0 24px;font-weight:700;font-size:18px">StayQR</p>
<h1 style="margin:0 0 12px;font-size:22px;line-height:1.25">${esc(heading)}</h1>
<p style="margin:0 0 24px;color:#4A5160">${esc(body)}</p>
<p style="margin:0 0 24px"><a href="${esc(cta.url)}" style="display:inline-block;background:#C6FF3D;color:#0B0D12;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:12px">${esc(cta.label)}</a></p>
<p style="margin:0 0 8px;color:#6B7280;font-size:13px">Or paste this link into your browser:<br><a href="${esc(cta.url)}" style="color:#0B0D12;word-break:break-all">${esc(cta.url)}</a></p>
<p style="margin:24px 0 0;color:#6B7280;font-size:13px">${esc(footer)}</p>
</td></tr></table></td></tr></table></body></html>`;
}

export function verifyEmail(to: string, url: string) {
  const footer = "If you didn't create a StayQR account, ignore this email and nothing will happen.";
  return sendEmail(
    to,
    "Confirm your email for StayQR",
    `Confirm your email to finish setting up StayQR:\n${url}\n\nThe link works for 24 hours. ${footer}`,
    layout("Confirm your email", "One click and your StayQR account is ready. The link works for 24 hours.", { label: "Confirm email", url }, footer),
  );
}

export function resetEmail(to: string, url: string) {
  const footer = "If you didn't ask to reset your password, ignore this email: your password stays the same.";
  return sendEmail(
    to,
    "Reset your StayQR password",
    `Choose a new StayQR password:\n${url}\n\nThe link works for 1 hour and only once. ${footer}`,
    layout("Reset your password", "Choose a new password for your StayQR account. The link works for 1 hour and only once.", { label: "Choose a new password", url }, footer),
  );
}

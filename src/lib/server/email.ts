import { COMPANY } from "@/content/company";
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
    body: JSON.stringify({ from: env.emailFrom, to: [to], subject, text, html, reply_to: COMPANY.email.hello }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

// Brand colours from globals.css (light theme), written out because email clients don't read CSS variables.
const C = { page: "#F5F6F2", card: "#FFFFFF", ink: "#0B0D12", muted: "#4A5160", subtle: "#6B7280", line: "#E4E6E0", lime: "#B6FF3B", limeInk: "#0A0D02", soft: "#F7F8F4" };
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

type Mail = {
  /** Inbox preview line, hidden in the body. */
  preview: string;
  heading: string;
  greeting?: string | null;
  paragraphs: string[];
  cta: { label: string; url: string };
  /** Small print under the button: how long the link works and so on. */
  note: string;
  /** Why they got this email, and what to do if it wasn't them. */
  reason: string;
};

/**
 * One table-based layout for every EndureQR email: logo header, white card, lime button, fallback link, footer.
 * Inline styles and tables only, so it holds up in Gmail, Outlook and Apple Mail.
 */
function layout(m: Mail) {
  const site = env.siteUrl;
  const p = (t: string) => `<p style="margin:0 0 16px;font:16px/1.6 ${FONT};color:${C.muted}">${t}</p>`;
  const link = (href: string, label: string) => `<a href="${esc(href)}" style="color:${C.subtle};text-decoration:underline">${label}</a>`;
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(m.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${esc(m.preview)}${"&#8199;&#65279;&#847; ".repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page}">
<tr><td align="center" style="padding:40px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px">
    <tr><td style="padding:0 4px 24px">
      <a href="${esc(site)}" style="text-decoration:none;color:${C.ink}">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="vertical-align:middle"><img src="${esc(site)}/logo-512.png" width="36" height="36" alt="EndureQR" style="display:block;border:0;border-radius:9px"></td>
          <td style="vertical-align:middle;padding-left:10px;font:600 19px/1 ${FONT};letter-spacing:-0.02em;color:${C.ink}">EndureQR</td>
        </tr></table>
      </a>
    </td></tr>
    <tr><td style="background:${C.card};border:1px solid ${C.line};border-radius:16px;padding:40px 36px">
      <h1 style="margin:0 0 20px;font:700 24px/1.3 ${FONT};letter-spacing:-0.01em;color:${C.ink}">${esc(m.heading)}</h1>
      ${m.greeting ? p(`Hi ${esc(m.greeting)},`) : ""}
      ${m.paragraphs.map((t) => p(esc(t))).join("\n      ")}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 24px"><tr>
        <td align="center" bgcolor="${C.lime}" style="border-radius:12px">
          <a href="${esc(m.cta.url)}" style="display:inline-block;padding:15px 28px;font:600 16px/1 ${FONT};color:${C.limeInk};text-decoration:none;border-radius:12px">${esc(m.cta.label)}&nbsp;&rarr;</a>
        </td>
      </tr></table>
      <p style="margin:0 0 24px;font:14px/1.6 ${FONT};color:${C.subtle}">${esc(m.note)}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="background:${C.soft};border:1px solid ${C.line};border-radius:10px;padding:14px 16px;font:13px/1.55 ${FONT};color:${C.subtle}">
          Button not working? Paste this link into your browser:<br>
          <a href="${esc(m.cta.url)}" style="color:${C.ink};word-break:break-all">${esc(m.cta.url)}</a>
        </td>
      </tr></table>
      <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid ${C.line};font:13px/1.6 ${FONT};color:${C.subtle}">${esc(m.reason)}</p>
    </td></tr>
    <tr><td align="center" style="padding:28px 16px 0;font:12px/1.7 ${FONT};color:${C.subtle}">
      <strong style="color:${C.muted}">EndureQR</strong> &middot; QR codes that keep working, even if you leave.<br>
      ${link(site, esc(COMPANY.site))} &nbsp;&middot;&nbsp; ${link(`${site}/contact`, "Help")} &nbsp;&middot;&nbsp; ${link(`${site}/privacy`, "Privacy")}<br>
      Questions? Just reply to this email.
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

/** Plain-text twin of the HTML, for clients that prefer it and for spam filters. */
const plain = (m: Mail) =>
  [m.greeting ? `Hi ${m.greeting},` : "", ...m.paragraphs, `${m.cta.label}:\n${m.cta.url}`, m.note, "—", m.reason, `EndureQR · ${env.siteUrl}`]
    .filter(Boolean)
    .join("\n\n");

const send = (to: string, subject: string, m: Mail) => sendEmail(to, subject, plain(m), layout(m));

export function verifyEmail(to: string, url: string, name?: string | null) {
  return send(to, "Confirm your email for EndureQR", {
    preview: "One click to activate your EndureQR account.",
    heading: "Confirm your email address",
    greeting: name,
    paragraphs: [
      "Thanks for signing up for EndureQR. Confirm that this is your email address to activate your account.",
      "Once it's confirmed, you can log in and start creating dynamic QR codes you can edit after they're printed.",
    ],
    cta: { label: "Confirm email address", url },
    note: "This link works for 24 hours. After that, log in and we'll send you a fresh one.",
    reason: `You're receiving this because someone signed up for EndureQR with ${to}. If that wasn't you, ignore this email and no account will be activated.`,
  });
}

export function resetEmail(to: string, url: string, name?: string | null) {
  return send(to, "Reset your EndureQR password", {
    preview: "Choose a new password for your EndureQR account.",
    heading: "Reset your password",
    greeting: name,
    paragraphs: [
      "We got a request to reset the password for your EndureQR account. Click the button below to choose a new one.",
      "For your security, every other device signed in to your account will be signed out.",
    ],
    cta: { label: "Choose a new password", url },
    note: "This link works for 1 hour and can only be used once.",
    reason: "If you didn't ask to reset your password, you can safely ignore this email. Your password stays the same.",
  });
}

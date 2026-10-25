/**
 * The free generator's QR content types. Each type declares its form fields, defaults,
 * validation and encoding. Everything here is static (encoded into the pattern itself), so it
 * works without an account or a backend; dynamic codes are the paid upgrade.
 */

export type QrTypeSlug =
  | "url" | "text" | "wifi" | "vcard" | "email" | "sms" | "phone" | "whatsapp" | "location" | "event"
  | "instagram" | "facebook" | "youtube" | "linkedin" | "x" | "tiktok" | "paypal";

export type FieldKind = "text" | "textarea" | "url" | "email" | "tel" | "number" | "select" | "datetime-local" | "toggle";

export type FieldDef = {
  name: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  options?: { value: string; label: string }[];
  /** Half-width on wide screens. */
  half?: boolean;
};

export type Values = Record<string, string>;

export type QrTypeDef = {
  slug: QrTypeSlug;
  /** Short name used in pickers ("Wi-Fi"). */
  name: string;
  /** Group in the picker. */
  group: "Popular" | "Contact" | "Social" | "More";
  /** Line-icon path (24px grid). */
  icon: string;
  fields: FieldDef[];
  defaults: Values;
  encode: (v: Values) => string;
  /** Human summary under the preview. */
  describe: (v: Values) => string;
  /** First problem found, or null. */
  validate: (v: Values) => string | null;
};

// ── helpers ────────────────────────────────────────────────────────────
const withScheme = (u: string) => (/^[a-z][a-z0-9+.-]*:/i.test(u.trim()) ? u.trim() : u.trim() ? `https://${u.trim()}` : "");
const looksLikeUrl = (u: string) => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(u.trim());
const digits = (s: string) => s.replace(/[^\d+]/g, "");
const wifiEscape = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");
const vEscape = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
const req = (v: Values, k: string, msg: string) => (v[k]?.trim() ? null : msg);
/** "2026-11-03T19:30" → "20261103T193000" (floating local time, as calendars expect from a QR). */
const icsTime = (s: string) => (s ? s.replace(/[-:]/g, "").replace(/(T\d{4})$/, "$100").slice(0, 15) : "");

/**
 * Accepts a username (with or without @) or a full profile URL. Only input that names the
 * platform's own domain (or starts with http) counts as a link, so "osteria.rossa" stays a username.
 */
function social(base: string, at = false) {
  const domain = new URL(base).hostname.replace(/^www\./, "");
  return (handle: string) => {
    const h = handle.trim();
    if (!h) return "";
    if (/^https?:\/\//i.test(h) || h.toLowerCase().includes(domain) || /^youtu\.be\//i.test(h)) return withScheme(h);
    return `${base}${at ? "@" : ""}${h.replace(/^@/, "")}`;
  };
}
const socialField = (label: string, placeholder: string): FieldDef => ({
  name: "handle",
  label,
  kind: "text",
  placeholder,
  hint: "A username or a full profile link both work.",
  required: true,
});

const ICON = {
  link: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
  text: "M5 6h14M5 12h14M5 18h9",
  wifi: "M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01",
  card: "M3 5h18v14H3zM7 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0M6 16c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4M14 9h4M14 13h4",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  sms: "M4 5h16v11H8l-4 4zM8 9h8M8 12h5",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  chat: "M3 21l1.6-4.8A8 8 0 1 1 8 19.6zM9 10h.01M12 10h.01M15 10h.01",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  camera: "M4 4h16v16H4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7M16.5 7.5h.01",
  page: "M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  play: "M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM10 9l5 3-5 3z",
  briefcase: "M4 8h16v12H4zM9 8V5h6v3M4 13h16",
  x: "M4 4l16 16M20 4L4 20",
  note: "M9 18V6l10-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM19 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z",
  pay: "M7 20l2-14h6a4 4 0 0 1 0 8h-5M5 17h4",
};

export const QR_TYPES: QrTypeDef[] = [
  {
    slug: "url",
    name: "Link",
    group: "Popular",
    icon: ICON.link,
    fields: [{ name: "url", label: "Website address", kind: "url", placeholder: "yourwebsite.com/menu", required: true }],
    defaults: { url: "https://stayqr.com" },
    encode: (v) => withScheme(v.url ?? ""),
    describe: (v) => withScheme(v.url ?? "").replace(/^https?:\/\//, "") || "Add a link",
    validate: (v) => req(v, "url", "Add a link") ?? (looksLikeUrl(v.url) || /^[a-z]+:/i.test(v.url.trim()) ? null : "That doesn't look like a link yet."),
  },
  {
    slug: "text",
    name: "Text",
    group: "Popular",
    icon: ICON.text,
    fields: [{ name: "text", label: "Text", kind: "textarea", maxLength: 300, required: true, hint: "Shown on the phone as plain text. Up to 300 characters." }],
    defaults: { text: "Table 12 · Ask us about today's specials" },
    encode: (v) => v.text ?? "",
    describe: (v) => (v.text ? `${v.text.length} characters of text` : "Add some text"),
    validate: (v) => req(v, "text", "Add some text"),
  },
  {
    slug: "wifi",
    name: "WiFi",
    group: "Popular",
    icon: ICON.wifi,
    fields: [
      { name: "ssid", label: "Network name (SSID)", kind: "text", required: true, half: true },
      { name: "password", label: "Password", kind: "text", half: true },
      { name: "security", label: "Security", kind: "select", options: [{ value: "WPA", label: "WPA / WPA2 / WPA3" }, { value: "WEP", label: "WEP" }, { value: "nopass", label: "None (open network)" }] },
      { name: "hidden", label: "Hidden network", kind: "toggle" },
    ],
    defaults: { ssid: "Cafe Guest", password: "coffee2026", security: "WPA", hidden: "" },
    encode: (v) =>
      v.ssid
        ? `WIFI:T:${v.security || "WPA"};S:${wifiEscape(v.ssid)};${v.security === "nopass" ? "" : `P:${wifiEscape(v.password ?? "")};`}${v.hidden ? "H:true;" : ""};`
        : "",
    describe: (v) => (v.ssid ? `Wi-Fi · ${v.ssid}` : "Add a network name"),
    validate: (v) => req(v, "ssid", "Add the network name") ?? (v.security !== "nopass" && !v.password ? "Add the password, or choose an open network." : null),
  },
  {
    slug: "vcard",
    name: "Contact card",
    group: "Contact",
    icon: ICON.card,
    fields: [
      { name: "first", label: "First name", kind: "text", required: true, half: true },
      { name: "last", label: "Last name", kind: "text", half: true },
      { name: "phone", label: "Phone", kind: "tel", half: true },
      { name: "email", label: "Email", kind: "email", half: true },
      { name: "company", label: "Company", kind: "text", half: true },
      { name: "title", label: "Job title", kind: "text", half: true },
      { name: "website", label: "Website", kind: "url" },
      { name: "street", label: "Street", kind: "text" },
      { name: "city", label: "City", kind: "text", half: true },
      { name: "zip", label: "Postcode", kind: "text", half: true },
      { name: "country", label: "Country", kind: "text" },
    ],
    defaults: { first: "Maria", last: "Lopez", phone: "+44 20 7946 0321", email: "maria@osteria.co", company: "Osteria Rossa", title: "Owner", website: "osteria.co", street: "", city: "London", zip: "", country: "United Kingdom" },
    encode: (v) => {
      if (!v.first && !v.last) return "";
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${vEscape(v.last ?? "")};${vEscape(v.first ?? "")};;;`,
        `FN:${vEscape([v.first, v.last].filter(Boolean).join(" "))}`,
        v.company && `ORG:${vEscape(v.company)}`,
        v.title && `TITLE:${vEscape(v.title)}`,
        v.phone && `TEL;TYPE=CELL:${digits(v.phone)}`,
        v.email && `EMAIL:${v.email.trim()}`,
        v.website && `URL:${withScheme(v.website)}`,
        (v.street || v.city || v.zip || v.country) && `ADR;TYPE=WORK:;;${vEscape(v.street ?? "")};${vEscape(v.city ?? "")};;${vEscape(v.zip ?? "")};${vEscape(v.country ?? "")}`,
        "END:VCARD",
      ];
      return lines.filter(Boolean).join("\n");
    },
    describe: (v) => ([v.first, v.last].filter(Boolean).join(" ") ? `Contact · ${[v.first, v.last].filter(Boolean).join(" ")}` : "Add a name"),
    validate: (v) => (v.first?.trim() || v.last?.trim() ? null : "Add a name"),
  },
  {
    slug: "email",
    name: "Email",
    group: "Contact",
    icon: ICON.mail,
    fields: [
      { name: "to", label: "Email address", kind: "email", required: true },
      { name: "subject", label: "Subject", kind: "text" },
      { name: "body", label: "Message", kind: "textarea", maxLength: 400 },
    ],
    defaults: { to: "hello@stayqr.com", subject: "Hello from your QR code", body: "" },
    encode: (v) => {
      if (!v.to) return "";
      const q = new URLSearchParams();
      if (v.subject) q.set("subject", v.subject);
      if (v.body) q.set("body", v.body);
      const qs = q.toString().replace(/\+/g, "%20");
      return `mailto:${v.to.trim()}${qs ? `?${qs}` : ""}`;
    },
    describe: (v) => (v.to ? `Email · ${v.to}` : "Add an email address"),
    validate: (v) => req(v, "to", "Add an email address") ?? (/^\S+@\S+\.\S+$/.test(v.to.trim()) ? null : "That email address looks incomplete."),
  },
  {
    slug: "sms",
    name: "SMS",
    group: "Contact",
    icon: ICON.sms,
    fields: [
      { name: "number", label: "Phone number", kind: "tel", required: true, hint: "Include the country code, e.g. +44." },
      { name: "message", label: "Message", kind: "textarea", maxLength: 300 },
    ],
    defaults: { number: "+44 20 7946 0321", message: "Book a table for 2 at 8pm" },
    encode: (v) => (v.number ? `SMSTO:${digits(v.number)}:${v.message ?? ""}` : ""),
    describe: (v) => (v.number ? `SMS · ${v.number}` : "Add a phone number"),
    validate: (v) => req(v, "number", "Add a phone number"),
  },
  {
    slug: "phone",
    name: "Phone call",
    group: "Contact",
    icon: ICON.phone,
    fields: [{ name: "number", label: "Phone number", kind: "tel", required: true, hint: "Include the country code, e.g. +44." }],
    defaults: { number: "+44 20 7946 0321" },
    encode: (v) => (v.number ? `tel:${digits(v.number)}` : ""),
    describe: (v) => (v.number ? `Call · ${v.number}` : "Add a phone number"),
    validate: (v) => req(v, "number", "Add a phone number"),
  },
  {
    slug: "whatsapp",
    name: "WhatsApp",
    group: "Contact",
    icon: ICON.chat,
    fields: [
      { name: "number", label: "WhatsApp number", kind: "tel", required: true, hint: "With country code, e.g. +44 7700 900123." },
      { name: "message", label: "Prefilled message", kind: "textarea", maxLength: 300 },
    ],
    defaults: { number: "+44 7700 900123", message: "Hi! I scanned your QR code." },
    encode: (v) => {
      const n = digits(v.number ?? "").replace(/^\+/, "");
      if (!n) return "";
      return `https://wa.me/${n}${v.message ? `?text=${encodeURIComponent(v.message)}` : ""}`;
    },
    describe: (v) => (v.number ? `WhatsApp · ${v.number}` : "Add a number"),
    validate: (v) => req(v, "number", "Add a WhatsApp number") ?? (digits(v.number).replace(/^\+/, "").length < 7 ? "That number looks too short." : null),
  },
  {
    slug: "location",
    name: "Location",
    group: "More",
    icon: ICON.pin,
    fields: [
      { name: "query", label: "Address or place", kind: "text", placeholder: "Osteria Rossa, Soho, London", hint: "Or leave empty and use coordinates below." },
      { name: "lat", label: "Latitude", kind: "number", placeholder: "51.5136", half: true },
      { name: "lng", label: "Longitude", kind: "number", placeholder: "-0.1365", half: true },
    ],
    defaults: { query: "Soho Square, London", lat: "", lng: "" },
    // A maps link opens on every phone; geo: URIs are ignored by the iPhone camera.
    encode: (v) => {
      const q = v.lat && v.lng ? `${v.lat.trim()},${v.lng.trim()}` : v.query?.trim();
      return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : "";
    },
    describe: (v) => (v.lat && v.lng ? `Map · ${v.lat}, ${v.lng}` : v.query ? `Map · ${v.query}` : "Add a place"),
    validate: (v) => (v.query?.trim() || (v.lat?.trim() && v.lng?.trim()) ? null : "Add an address or both coordinates."),
  },
  {
    slug: "event",
    name: "Calendar event",
    group: "More",
    icon: ICON.calendar,
    fields: [
      { name: "title", label: "Event title", kind: "text", required: true },
      { name: "start", label: "Starts", kind: "datetime-local", required: true, half: true },
      { name: "end", label: "Ends", kind: "datetime-local", half: true },
      { name: "location", label: "Location", kind: "text" },
      { name: "description", label: "Details", kind: "textarea", maxLength: 300 },
    ],
    defaults: { title: "Spring tasting night", start: "2027-04-15T19:00", end: "2027-04-15T22:00", location: "Osteria Rossa, London", description: "" },
    encode: (v) => {
      if (!v.title || !v.start) return "";
      const lines = [
        "BEGIN:VEVENT",
        `SUMMARY:${vEscape(v.title)}`,
        `DTSTART:${icsTime(v.start)}`,
        v.end && `DTEND:${icsTime(v.end)}`,
        v.location && `LOCATION:${vEscape(v.location)}`,
        v.description && `DESCRIPTION:${vEscape(v.description)}`,
        "END:VEVENT",
      ];
      return lines.filter(Boolean).join("\n");
    },
    describe: (v) => (v.title ? `Event · ${v.title}` : "Add an event title"),
    validate: (v) =>
      req(v, "title", "Add an event title") ?? req(v, "start", "Add a start time") ?? (v.end && v.end < v.start ? "The end is before the start." : null),
  },
  {
    slug: "instagram",
    name: "Instagram",
    group: "Social",
    icon: ICON.camera,
    fields: [socialField("Instagram username", "osteria.rossa")],
    defaults: { handle: "osteria.rossa" },
    encode: (v) => social("https://www.instagram.com/")(v.handle ?? ""),
    describe: (v) => (v.handle ? `Instagram · @${v.handle.replace(/^@/, "").replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, "")}` : "Add a username"),
    validate: (v) => req(v, "handle", "Add a username or link"),
  },
  {
    slug: "facebook",
    name: "Facebook",
    group: "Social",
    icon: ICON.page,
    fields: [socialField("Facebook page or username", "osteriarossa")],
    defaults: { handle: "osteriarossa" },
    encode: (v) => social("https://www.facebook.com/")(v.handle ?? ""),
    describe: (v) => (v.handle ? `Facebook · ${v.handle}` : "Add a page"),
    validate: (v) => req(v, "handle", "Add a page name or link"),
  },
  {
    slug: "youtube",
    name: "YouTube",
    group: "Social",
    icon: ICON.play,
    fields: [socialField("Channel handle or video link", "@osteriarossa")],
    defaults: { handle: "@osteriarossa" },
    encode: (v) => social("https://www.youtube.com/", true)(v.handle ?? ""),
    describe: (v) => (v.handle ? `YouTube · ${v.handle}` : "Add a channel or video"),
    validate: (v) => req(v, "handle", "Add a channel handle or video link"),
  },
  {
    slug: "linkedin",
    name: "LinkedIn",
    group: "Social",
    icon: ICON.briefcase,
    fields: [
      socialField("Profile username or link", "maria-lopez"),
      { name: "kind", label: "Profile type", kind: "select", options: [{ value: "in", label: "Personal profile" }, { value: "company", label: "Company page" }] },
    ],
    defaults: { handle: "maria-lopez", kind: "in" },
    encode: (v) => social(`https://www.linkedin.com/${v.kind === "company" ? "company" : "in"}/`)(v.handle ?? ""),
    describe: (v) => (v.handle ? `LinkedIn · ${v.handle}` : "Add a profile"),
    validate: (v) => req(v, "handle", "Add a username or link"),
  },
  {
    slug: "x",
    name: "X (Twitter)",
    group: "Social",
    icon: ICON.x,
    fields: [socialField("X username", "osteriarossa")],
    defaults: { handle: "osteriarossa" },
    encode: (v) => social("https://x.com/")(v.handle ?? ""),
    describe: (v) => (v.handle ? `X · @${v.handle.replace(/^@/, "")}` : "Add a username"),
    validate: (v) => req(v, "handle", "Add a username or link"),
  },
  {
    slug: "tiktok",
    name: "TikTok",
    group: "Social",
    icon: ICON.note,
    fields: [socialField("TikTok username", "osteriarossa")],
    defaults: { handle: "osteriarossa" },
    encode: (v) => social("https://www.tiktok.com/", true)(v.handle ?? ""),
    describe: (v) => (v.handle ? `TikTok · @${v.handle.replace(/^@/, "")}` : "Add a username"),
    validate: (v) => req(v, "handle", "Add a username or link"),
  },
  {
    slug: "paypal",
    name: "PayPal",
    group: "More",
    icon: ICON.pay,
    fields: [
      { name: "user", label: "PayPal.Me username", kind: "text", required: true, placeholder: "osteriarossa", half: true },
      { name: "amount", label: "Amount (optional)", kind: "number", placeholder: "25", half: true },
      { name: "currency", label: "Currency", kind: "select", options: ["USD", "EUR", "GBP", "AUD", "CAD"].map((c) => ({ value: c, label: c })) },
    ],
    defaults: { user: "osteriarossa", amount: "", currency: "USD" },
    encode: (v) => {
      const u = (v.user ?? "").trim().replace(/^https?:\/\/(www\.)?paypal\.me\//, "").replace(/^@/, "");
      if (!u) return "";
      return `https://paypal.me/${u}${v.amount ? `/${v.amount}${v.currency || ""}` : ""}`;
    },
    describe: (v) => (v.user ? `PayPal · ${v.user}${v.amount ? ` · ${v.amount} ${v.currency}` : ""}` : "Add a username"),
    validate: (v) => req(v, "user", "Add your PayPal.Me username") ?? (v.amount && Number(v.amount) <= 0 ? "The amount must be more than 0." : null),
  },
];

export const qrType = (slug: string) => QR_TYPES.find((t) => t.slug === slug);
export const QR_TYPE_SLUGS = QR_TYPES.map((t) => t.slug);

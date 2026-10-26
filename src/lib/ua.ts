/** Just enough user-agent parsing for scan analytics and smart redirects. No identifiers are kept. */
export type ParsedUa = { os: "ios" | "android" | "windows" | "macos" | "linux" | "other"; device: "mobile" | "tablet" | "desktop" | "other"; browser: string | null; bot: boolean };

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|slack|skype|embedly|vkshare|linkexpander|headless|lighthouse|curl|wget|python-requests|go-http|okhttp|java\//i;

export function parseUa(ua: string | null | undefined): ParsedUa {
  const s = ua ?? "";
  const ipad = /iPad/.test(s) || (/Macintosh/.test(s) && /Mobile\//.test(s));
  const os: ParsedUa["os"] = /iPhone|iPod/.test(s) || ipad ? "ios" : /Android/.test(s) ? "android" : /Windows/.test(s) ? "windows" : /Mac OS X|Macintosh/.test(s) ? "macos" : /Linux|CrOS/.test(s) ? "linux" : "other";
  const device: ParsedUa["device"] = ipad || (/Android/.test(s) && !/Mobile/.test(s)) || /Tablet/.test(s) ? "tablet" : /Mobi|iPhone|iPod|Android/.test(s) ? "mobile" : os === "other" ? "other" : "desktop";
  const browser = /SamsungBrowser/.test(s) ? "Samsung Internet" : /Edg\//.test(s) ? "Edge" : /OPR\/|Opera/.test(s) ? "Opera" : /CriOS|Chrome\//.test(s) ? "Chrome" : /FxiOS|Firefox\//.test(s) ? "Firefox" : /Safari\//.test(s) ? "Safari" : null;
  return { os, device, browser, bot: !s || BOT.test(s) };
}

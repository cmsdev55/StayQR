/** Small RFC 4180 CSV parser: quoted fields, escaped quotes, CRLF, and a leading BOM. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", quoted = false;
  const s = text.replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"' && s[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f.trim())) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim())) rows.push(row);
  return rows;
}

/** Map a CSV to {name, destination, folder}, finding the columns by header (or by position when there's no header). */
export function csvToCodes(text: string) {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const find = (...names: string[]) => head.findIndex((h) => names.includes(h));
  let di = find("destination", "url", "link", "website", "target");
  const hasHeader = di !== -1;
  const ni = hasHeader ? find("name", "title", "label") : 0;
  const fi = hasHeader ? find("folder", "group", "category") : 2;
  if (!hasHeader) di = rows[0].length > 1 ? 1 : 0;
  return rows.slice(hasHeader ? 1 : 0).map((r) => ({
    name: ni >= 0 && ni !== di ? (r[ni] ?? "").trim() : "",
    destination: (r[di] ?? "").trim(),
    folder: fi >= 0 ? (r[fi] ?? "").trim() : "",
  }));
}

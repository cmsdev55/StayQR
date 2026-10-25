import qrcode from "qrcode-generator";

/** Real QR module matrix, so the 3D hero code actually scans. */
export function qrMatrix(text: string, typeNumber: TypeNumber = 4): boolean[][] {
  const qr = qrcode(typeNumber, "M");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  const rows: boolean[][] = [];
  for (let r = 0; r < n; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < n; c++) row.push(qr.isDark(r, c));
    rows.push(row);
  }
  return rows;
}

/** One SVG path for every dark module (viewBox = 0 0 n n). Server-side, so mini codes cost no JS. */
export function qrPath(m: boolean[][], shape: "square" | "rounded" | "dots" = "square", inset = 0.06): string {
  const s = 1 - inset * 2;
  const r = shape === "dots" ? s / 2 : shape === "rounded" ? s * 0.32 : 0;
  const f = (v: number) => +v.toFixed(3);
  let d = "";
  m.forEach((row, y) =>
    row.forEach((on, x) => {
      if (!on) return;
      const x0 = x + inset, y0 = y + inset;
      if (!r) d += `M${f(x0)} ${f(y0)}h${f(s)}v${f(s)}h${f(-s)}z`;
      else {
        const e = f(s - 2 * r);
        d += `M${f(x0 + r)} ${f(y0)}h${e}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(r)}v${e}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(r)}h${f(-e)}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(-r)}v${f(-e)}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(-r)}z`;
      }
    }),
  );
  return d;
}

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

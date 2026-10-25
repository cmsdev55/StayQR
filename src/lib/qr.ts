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

/**
 * Compact SVG path: one centre-line segment per horizontal run of dark modules (viewBox -0.5 -0.5 n+1 n+1).
 * The stroke draws the style (see components/qr/qr-svg.tsx): square caps for solid modules, round caps
 * for pills, a 0/1 dash for dots. About 20x smaller than a subpath per module, which matters because
 * server-rendered SVG ships twice (HTML + RSC payload).
 */
export function qrRuns(m: boolean[][]): string {
  let d = "";
  m.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x++;
        continue;
      }
      let len = 1;
      while (row[x + len]) len++;
      // +0.001: a dashed stroke drops zero-length runs and the dash at a run's exact end
      d += `M${x + 0.5} ${y + 0.5}h${len - 0.999}`;
      x += len;
    }
  });
  return d;
}

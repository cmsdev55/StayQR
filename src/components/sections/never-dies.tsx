import { qrMatrix } from "@/lib/qr";
import { NeverDiesStage } from "./never-dies-stage";

const rows = (m: boolean[][]) => m.map((r) => r.map((on) => (on ? "1" : "0")).join(""));

/** Section 2. The matrices are computed here on the server, so the QR encoder never ships to the page. */
export function NeverDies() {
  return (
    <section aria-labelledby="story-title" className="relative border-t border-line">
      <NeverDiesStage theirs={rows(qrMatrix("https://stayqr.com/#compare", 3))} ours={rows(qrMatrix("https://stayqr.com", 3))} />
    </section>
  );
}

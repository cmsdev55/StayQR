import { qrMatrix } from "@/lib/qr";
import { NeverDiesStage } from "./never-dies-stage";
import { SITE_URL, siteUrl } from "@/lib/site";

const rows = (m: boolean[][]) => m.map((r) => r.map((on) => (on ? "1" : "0")).join(""));

/** Section 2. The matrices are computed here on the server, so the QR encoder never ships to the page. */
export function NeverDies() {
  return (
    <section aria-labelledby="story-title" className="relative border-t border-line">
      <NeverDiesStage theirs={rows(qrMatrix(siteUrl("/#compare"), 3))} ours={rows(qrMatrix(SITE_URL, 3))} />
    </section>
  );
}

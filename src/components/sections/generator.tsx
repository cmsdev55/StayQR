import { SectionHeading } from "@/components/ui/section-heading";
import { DEFAULT_FIELDS } from "@/lib/qr-design";
import { qrMatrix } from "@/lib/qr";
import { GeneratorApp } from "./generator-app";

/** Section 3. The first frame of the preview is drawn from a server-computed matrix (no layout shift). */
export function Generator() {
  const placeholder = qrMatrix(DEFAULT_FIELDS.url, 0).map((r) => r.map((on) => (on ? "1" : "0")).join(""));
  return (
    <section id="generator" aria-labelledby="generator-title" className="relative border-t border-line py-24 lg:py-40">
      <div className="mx-auto max-w-container px-4 sm:px-6">
        <SectionHeading
          id="generator-title"
          eyebrow="Free QR code generator"
          title="Make a QR code in *seconds.*"
          intro="Free forever: no sign-up, no watermark, and static codes never expire. Style it, then download SVG or PNG."
        />
        <GeneratorApp placeholder={placeholder} />
      </div>
    </section>
  );
}

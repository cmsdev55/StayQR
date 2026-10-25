import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodeEditor } from "@/components/dashboard/code-editor";
import { CODES, codeById, type QrCode } from "@/content/dashboard";
import { DEFAULT_DESIGN } from "@/lib/qr-design";

type Props = { params: Promise<{ id: string }> };

const NEW_CODE: QrCode = {
  id: "new",
  name: "",
  folder: "osteria",
  destination: "",
  shortUrl: "stayqr.com/r/n8vq4",
  status: "active",
  scans30: 0,
  delta: 0,
  spark: [],
  updated: "just now",
  created: "today",
  design: DEFAULT_DESIGN,
};

export function generateStaticParams() {
  return [...CODES.map((c) => ({ id: c.id })), { id: "new" }];
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: id === "new" ? "New code" : (codeById(id)?.name ?? "Code") };
}

export default async function CodePage({ params }: Props) {
  const { id } = await params;
  if (id === "new") return <CodeEditor code={NEW_CODE} isNew />;
  const code = codeById(id);
  if (!code) notFound();
  return <CodeEditor code={code} />;
}

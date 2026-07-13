import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const OcrPdfTool = dynamic(() => import("./OcrPdfTool"));

const tool = getTool("pdf", "ocr-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);
export default function OcrPdfPage() {
  return <OcrPdfTool relatedTools={relatedTools} schema={schema} />;
}

import type { Metadata } from "next";
import OcrPdfTool from "./OcrPdfTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

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

import type { Metadata } from "next";
import ComingSoonTool from "./ComingSoonTool";
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
  return (
    <ComingSoonTool
      toolName="OCR PDF"
      description="Extract text from scanned PDFs using Optical Character Recognition (OCR). Powered by tesseract.js — coming soon."
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

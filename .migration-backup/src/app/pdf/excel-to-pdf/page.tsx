import type { Metadata } from "next";
import ComingSoonTool from "./ComingSoonTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "excel-to-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function ExcelToPdfPage() {
  return (
    <ComingSoonTool
      toolName="Excel to PDF"
      description="Convert Excel spreadsheets (.xlsx, .xls) to PDF format. This tool requires server-side processing and is coming soon."
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

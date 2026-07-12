import type { Metadata } from "next";
import RotatePdfTool from "./RotatePdfTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "rotate-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function RotatePdfPage() {
  return (
    <RotatePdfTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

import type { Metadata } from "next";
import CaseConverterTool from "./CaseConverterTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("text", "case-converter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function CaseConverterPage() {
  return (
    <CaseConverterTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

import type { Metadata } from "next";
import FaqGeneratorTool from "./FaqGeneratorTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("ai-writing", "faq-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);
export default function FaqGeneratorPage() {
  return (
    <FaqGeneratorTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

import type { Metadata } from "next";
import LinkedinPostGeneratorTool from "./LinkedinPostGeneratorTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("ai-writing", "linkedin-post-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);
export default function LinkedinPostGeneratorPage() {
  return (
    <LinkedinPostGeneratorTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

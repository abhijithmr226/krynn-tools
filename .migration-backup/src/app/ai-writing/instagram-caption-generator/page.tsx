import type { Metadata } from "next";
import InstagramCaptionGeneratorTool from "./InstagramCaptionGeneratorTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("ai-writing", "instagram-caption-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);
export default function InstagramCaptionGeneratorPage() {
  return (
    <InstagramCaptionGeneratorTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

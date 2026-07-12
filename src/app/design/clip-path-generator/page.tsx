import type { Metadata } from "next";
import ClipPathGeneratorTool from "./ClipPathGeneratorTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("design", "clip-path-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function ClipPathGeneratorPage() {
  return (
    <ClipPathGeneratorTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

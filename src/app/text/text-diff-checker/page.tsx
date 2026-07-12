import type { Metadata } from "next";
import TextDiffCheckerTool from "./TextDiffCheckerTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("text", "text-diff-checker")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function TextDiffCheckerPage() {
  return (
    <TextDiffCheckerTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

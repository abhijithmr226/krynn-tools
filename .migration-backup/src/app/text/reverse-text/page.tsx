import type { Metadata } from "next";
import ReverseTextTool from "./ReverseTextTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("text", "reverse-text")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function ReverseTextPage() {
  return (
    <ReverseTextTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

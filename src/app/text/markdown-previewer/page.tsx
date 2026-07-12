import type { Metadata } from "next";
import MarkdownPreviewerTool from "./MarkdownPreviewerTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("text", "markdown-previewer")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function MarkdownPreviewerPage() {
  return (
    <MarkdownPreviewerTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

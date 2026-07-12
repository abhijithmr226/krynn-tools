import type { Metadata } from "next";
import HtmlEncoderTool from "./HtmlEncoderTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("text", "html-encoder")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function HtmlEncoderPage() {
  return (
    <HtmlEncoderTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

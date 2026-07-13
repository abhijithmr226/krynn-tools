import type { Metadata } from "next";
import ResizeImageTool from "./ResizeImageTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "resize-image")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function ResizeImagePage() {
  return (
    <ResizeImageTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

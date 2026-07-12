import type { Metadata } from "next";
import CompressImageTool from "./CompressImageTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "compress-image")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function CompressImagePage() {
  return (
    <CompressImageTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

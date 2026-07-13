import type { Metadata } from "next";
import SharpenImageTool from "./SharpenImageTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "sharpen-image")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function SharpenImagePage() {
  return (
    <SharpenImageTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

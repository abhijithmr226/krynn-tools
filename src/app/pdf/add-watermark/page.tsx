import type { Metadata } from "next";
import AddWatermarkTool from "./AddWatermarkTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "add-watermark")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);

const schema = generateToolSchema(tool);
export default function AddWatermarkPage() {
  return (
    <AddWatermarkTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

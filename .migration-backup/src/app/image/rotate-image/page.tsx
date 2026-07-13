import type { Metadata } from "next";
import RotateImageTool from "./RotateImageTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "rotate-image")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function RotateImagePage() {
  return (
    <RotateImageTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

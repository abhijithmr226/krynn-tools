import type { Metadata } from "next";
import JpgToPngTool from "./JpgToPngTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "jpg-to-png")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function JpgToPngPage() {
  return (
    <JpgToPngTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

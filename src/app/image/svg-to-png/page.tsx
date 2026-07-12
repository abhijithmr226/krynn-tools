import type { Metadata } from "next";
import SvgToPngTool from "./SvgToPngTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "svg-to-png")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function SvgToPngPage() {
  return (
    <SvgToPngTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

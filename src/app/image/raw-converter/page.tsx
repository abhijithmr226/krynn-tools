import type { Metadata } from "next";
import RawConverterTool from "./RawConverterTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "raw-converter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function RawConverterPage() {
  return (
    <RawConverterTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

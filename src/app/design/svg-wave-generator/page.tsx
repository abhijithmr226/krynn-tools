import type { Metadata } from "next";
import SvgWaveGeneratorTool from "./SvgWaveGeneratorTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("design", "svg-wave-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function SvgWaveGeneratorPage() {
  return (
    <SvgWaveGeneratorTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

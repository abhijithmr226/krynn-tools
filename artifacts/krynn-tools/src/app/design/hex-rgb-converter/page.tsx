import HexRgbConverterTool from "./HexRgbConverterTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("design", "hex-rgb-converter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function HexRgbConverterPage() {
  return (
    <HexRgbConverterTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

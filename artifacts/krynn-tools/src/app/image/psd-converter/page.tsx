import PsdConverterTool from "./PsdConverterTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "psd-converter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function PsdConverterPage() {
  return (
    <PsdConverterTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

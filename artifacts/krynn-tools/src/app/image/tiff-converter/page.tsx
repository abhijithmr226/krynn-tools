import TiffConverterTool from "./TiffConverterTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "tiff-converter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function TiffConverterPage() {
  return (
    <TiffConverterTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

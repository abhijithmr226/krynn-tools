import WebpConverterTool from "./WebpConverterTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "webp-converter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function WebpConverterPage() {
  return (
    <WebpConverterTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

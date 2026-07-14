import WatermarkImageTool from "./WatermarkImageTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "watermark-image")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function WatermarkImagePage() {
  return (
    <WatermarkImageTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

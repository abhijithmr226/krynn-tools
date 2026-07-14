import FlipImageTool from "./FlipImageTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "flip-image")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function FlipImagePage() {
  return (
    <FlipImageTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

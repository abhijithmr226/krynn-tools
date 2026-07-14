import BlurImageTool from "./BlurImageTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "blur-image")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function BlurImagePage() {
  return (
    <BlurImageTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

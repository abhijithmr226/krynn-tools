import { getRelatedTools, getTool } from "@/lib/tools";
import SocialImageResizerTool from "./SocialImageResizerTool";
import { generateToolSchema } from "@/lib/seo";

const tool = getTool("social-media", "social-image-resizer")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name, slug: t.slug, categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function SocialImageResizerPage() {
  return <SocialImageResizerTool relatedTools={relatedTools} schema={schema} />;
}

import HtmlToImageTool from "./HtmlToImageTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "html-to-image")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function HtmlToImagePage() {
  return (
    <HtmlToImageTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

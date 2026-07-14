import HtmlDecoderTool from "./HtmlDecoderTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("text", "html-decoder")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function HtmlDecoderPage() {
  return (
    <HtmlDecoderTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

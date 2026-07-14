import LoremIpsumTool from "./LoremIpsumTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("text", "lorem-ipsum-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function LoremIpsumPage() {
  return (
    <LoremIpsumTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

import BusinessNameGeneratorTool from "./BusinessNameGeneratorTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("ai-writing", "business-name-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);
export default function BusinessNameGeneratorPage() {
  return (
    <BusinessNameGeneratorTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

import StoryGeneratorTool from "./StoryGeneratorTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("ai-writing", "story-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);
export default function StoryGeneratorPage() {
  return (
    <StoryGeneratorTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

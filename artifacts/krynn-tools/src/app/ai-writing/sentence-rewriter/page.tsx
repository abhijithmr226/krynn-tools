import SentenceRewriterTool from "./SentenceRewriterTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("ai-writing", "sentence-rewriter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);
export default function SentenceRewriterPage() {
  return (
    <SentenceRewriterTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

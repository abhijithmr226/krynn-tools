import WordCounterTool from "./WordCounterTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("text", "word-counter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function WordCounterPage() {
  return (
    <WordCounterTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

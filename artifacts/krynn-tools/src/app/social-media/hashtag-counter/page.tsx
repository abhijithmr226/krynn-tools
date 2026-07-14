import { getRelatedTools, getTool } from "@/lib/tools";
import HashtagCounterTool from "./HashtagCounterTool";
import { generateToolSchema } from "@/lib/seo";

const tool = getTool("social-media", "hashtag-counter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name, slug: t.slug, categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function HashtagCounterPage() {
  return <HashtagCounterTool relatedTools={relatedTools} schema={schema} />;
}

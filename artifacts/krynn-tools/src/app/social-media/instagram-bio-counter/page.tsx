import { getRelatedTools, getTool } from "@/lib/tools";
import InstagramBioCounterTool from "./InstagramBioCounterTool";
import { generateToolSchema } from "@/lib/seo";

const tool = getTool("social-media", "instagram-bio-counter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name, slug: t.slug, categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);

export default function InstagramBioCounterPage() {
  return <InstagramBioCounterTool relatedTools={relatedTools} schema={schema} />;
}

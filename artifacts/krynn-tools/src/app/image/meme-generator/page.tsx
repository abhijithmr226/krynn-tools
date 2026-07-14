import MemeGeneratorTool from "./MemeGeneratorTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "meme-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function MemeGeneratorPage() {
  return (
    <MemeGeneratorTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

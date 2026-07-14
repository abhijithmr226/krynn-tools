import TextSorterTool from "./TextSorterTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("text", "text-sorter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function TextSorterPage() {
  return (
    <TextSorterTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

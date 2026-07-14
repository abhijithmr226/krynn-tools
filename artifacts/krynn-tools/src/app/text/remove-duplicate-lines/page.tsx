import RemoveDuplicatesTool from "./RemoveDuplicatesTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("text", "remove-duplicate-lines")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function RemoveDuplicatesPage() {
  return (
    <RemoveDuplicatesTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

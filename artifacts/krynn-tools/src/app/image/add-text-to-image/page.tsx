import AddTextToImageTool from "./AddTextToImageTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "add-text-to-image")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function AddTextToImagePage() {
  return (
    <AddTextToImageTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

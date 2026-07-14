import GifToJpgTool from "./GifToJpgTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "gif-to-jpg")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function GifToJpgPage() {
  return (
    <GifToJpgTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

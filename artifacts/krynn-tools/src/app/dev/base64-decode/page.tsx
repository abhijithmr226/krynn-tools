import Base64DecodeTool from "./Base64DecodeTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("dev", "base64-decode")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function Base64DecodePage() {
  return (
    <Base64DecodeTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

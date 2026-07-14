import JwtDecoderTool from "./JwtDecoderTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("dev", "jwt-decoder")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function JwtDecoderPage() {
  return (
    <JwtDecoderTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

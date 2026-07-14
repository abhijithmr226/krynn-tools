import FontPairingToolTool from "./FontPairingToolTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("design", "font-pairing-tool")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function FontPairingPage() {
  return (
    <FontPairingToolTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

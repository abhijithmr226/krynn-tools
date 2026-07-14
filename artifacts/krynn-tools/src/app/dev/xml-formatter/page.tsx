import XmlFormatterTool from "./XmlFormatterTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("dev", "xml-formatter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function XmlFormatterPage() {
  return (
    <XmlFormatterTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

import SqlFormatterTool from "./SqlFormatterTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("dev", "sql-formatter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function SqlFormatterPage() {
  return (
    <SqlFormatterTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

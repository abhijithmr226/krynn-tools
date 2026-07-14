import HtmlToPdfTool from "./HtmlToPdfTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "html-to-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);
export default function HtmlToPdfPage() {
  return (
    <HtmlToPdfTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

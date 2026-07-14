import ComingSoonTool from "./ComingSoonTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "ppt-to-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function PptToPdfPage() {
  return (
    <ComingSoonTool
      toolName="PPT to PDF"
      description="Convert PowerPoint presentations (.pptx, .ppt) to PDF format. This tool requires server-side processing and is coming soon."
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

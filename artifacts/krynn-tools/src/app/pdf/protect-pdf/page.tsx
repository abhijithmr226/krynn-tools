import { lazy } from "react";
const ProtectPdfTool = lazy(() => import("./ProtectPdfTool"));
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "protect-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function ProtectPdfPage() {
  return (
    <ProtectPdfTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

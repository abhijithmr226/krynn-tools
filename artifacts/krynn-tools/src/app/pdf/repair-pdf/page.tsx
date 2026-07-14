import { lazy } from "react";
const RepairPdfTool = lazy(() => import("./RepairPdfTool"));
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "repair-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);
export default function RepairPdfPage() {
  return (
    <RepairPdfTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

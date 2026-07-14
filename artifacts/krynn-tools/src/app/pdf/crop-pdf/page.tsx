import { lazy } from "react";
const CropPdfTool = lazy(() => import("./CropPdfTool"));
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "crop-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);
export default function CropPdfPage() {
  return (
    <CropPdfTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

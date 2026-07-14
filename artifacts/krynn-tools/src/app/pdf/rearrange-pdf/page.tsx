import { lazy } from "react";
const RearrangePdfTool = lazy(() => import("./RearrangePdfTool"));
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "rearrange-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);
export default function RearrangePdfPage() {
  return (
    <RearrangePdfTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

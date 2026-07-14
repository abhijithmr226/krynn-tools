import { lazy } from "react";
const AddPageNumbersTool = lazy(() => import("./AddPageNumbersTool"));
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "add-page-numbers")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);
export default function AddPageNumbersPage() {
  return (
    <AddPageNumbersTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

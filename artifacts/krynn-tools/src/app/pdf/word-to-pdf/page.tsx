import { lazy } from "react";
const WordToPdfTool = lazy(() => import("./WordToPdfTool"));
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "word-to-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));



const schema = generateToolSchema(tool);
export default function WordToPdfPage() {
  return (
    <WordToPdfTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

import { lazy } from "react";
const SignPdfTool = lazy(() => import("./SignPdfTool"));
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "sign-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));


const schema = generateToolSchema(tool);
export default function SignPdfPage() {
  return (
    <SignPdfTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

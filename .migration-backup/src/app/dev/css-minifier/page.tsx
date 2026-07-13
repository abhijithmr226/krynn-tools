import type { Metadata } from "next";
import CssMinifierTool from "./CssMinifierTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("dev", "css-minifier")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function CssMinifierPage() {
  return (
    <CssMinifierTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

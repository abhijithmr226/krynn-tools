import type { Metadata } from "next";
import UrlDecodeTool from "./UrlDecodeTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("dev", "url-decode")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function UrlDecodePage() {
  return (
    <UrlDecodeTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

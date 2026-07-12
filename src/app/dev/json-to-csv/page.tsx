import type { Metadata } from "next";
import JsonToCsvTool from "./JsonToCsvTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("dev", "json-to-csv")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function JsonToCsvPage() {
  return (
    <JsonToCsvTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

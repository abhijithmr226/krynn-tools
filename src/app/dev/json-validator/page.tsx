import type { Metadata } from "next";
import JsonValidatorTool from "./JsonValidatorTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("dev", "json-validator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function JsonValidatorPage() {
  return (
    <JsonValidatorTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

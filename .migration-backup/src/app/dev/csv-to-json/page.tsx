import type { Metadata } from "next";
import CsvToJsonTool from "./CsvToJsonTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("dev", "csv-to-json")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function CsvToJsonPage() {
  return (
    <CsvToJsonTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

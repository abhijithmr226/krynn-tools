import type { Metadata } from "next";
import TailwindColorGeneratorTool from "./TailwindColorGeneratorTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("design", "tailwind-color-generator")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function TailwindColorGeneratorPage() {
  return (
    <TailwindColorGeneratorTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

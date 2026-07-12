import type { Metadata } from "next";
import CharacterCounterTool from "./CharacterCounterTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("text", "character-counter")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function CharacterCounterPage() {
  return (
    <CharacterCounterTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

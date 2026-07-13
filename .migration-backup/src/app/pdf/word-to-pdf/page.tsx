import type { Metadata } from "next";
import dynamic from "next/dynamic";

const WordToPdfTool = dynamic(() => import("./WordToPdfTool"));
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "word-to-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function WordToPdfPage() {
  return (
    <WordToPdfTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

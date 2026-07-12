import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ExtractImagesFromPdfTool = dynamic(() => import("./ExtractImagesFromPdfTool"));
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "extract-images-from-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function ExtractImagesFromPdfPage() {
  return (
    <ExtractImagesFromPdfTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

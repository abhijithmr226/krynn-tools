import type { Metadata } from "next";
import dynamic from "next/dynamic";

const DeletePdfPagesTool = dynamic(() => import("./DeletePdfPagesTool"));
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "delete-pdf-pages")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function DeletePdfPagesPage() {
  return (
    <DeletePdfPagesTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

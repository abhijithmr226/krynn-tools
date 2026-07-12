import type { Metadata } from "next";
import dynamic from "next/dynamic";

const UnlockPdfTool = dynamic(() => import("./UnlockPdfTool"));
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("pdf", "unlock-pdf")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function UnlockPdfPage() {
  return (
    <UnlockPdfTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

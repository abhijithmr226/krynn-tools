import type { Metadata } from "next";
import RemoveExtraSpacesTool from "./RemoveExtraSpacesTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("text", "remove-extra-spaces")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function RemoveExtraSpacesPage() {
  return (
    <RemoveExtraSpacesTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

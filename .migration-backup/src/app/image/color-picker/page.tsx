import type { Metadata } from "next";
import ColorPickerTool from "./ColorPickerTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("image", "color-picker")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function ColorPickerPage() {
  return (
    <ColorPickerTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}

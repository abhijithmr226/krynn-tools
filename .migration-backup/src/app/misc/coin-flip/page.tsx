import type { Metadata } from "next";
import CoinFlipTool from "./CoinFlipTool";
import { getTool, getRelatedTools } from "@/lib/tools";
import { generateToolMetadata, generateToolSchema } from "@/lib/seo";

const tool = getTool("misc", "coin-flip")!;
const relatedTools = getRelatedTools(tool, 4).map((t) => ({
  name: t.name,
  slug: t.slug,
  categorySlug: t.categorySlug,
}));

export const metadata = generateToolMetadata(tool);


const schema = generateToolSchema(tool);
export default function CoinFlipPage() {
  return (
    <CoinFlipTool
      relatedTools={relatedTools}
      schema={schema}
    />
  );
}
